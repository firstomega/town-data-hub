// Edge function: refresh-town-data
// For every distinct (town_slug, source_url, ingestion_type) we've previously ingested,
// re-scrape via Firecrawl, re-run AI extraction, and diff against current verified/ai_extracted rows.
// Any modified, added, or removed rows are queued in `data_drifts` for admin review.
// Triggered manually from /admin/data-review OR by the weekly pg_cron job.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type IngestType = "zones" | "permits" | "ordinances" | "contacts";

const TOOL_SCHEMAS: Record<IngestType, unknown> = {
  zones: {
    type: "object",
    properties: {
      rows: {
        type: "array",
        items: {
          type: "object",
          properties: {
            code: { type: "string" }, name: { type: "string" }, description: { type: "string" },
            min_lot: { type: "string" }, setback_front: { type: "string" }, setback_side: { type: "string" },
            setback_rear: { type: "string" }, max_height: { type: "string" }, max_coverage: { type: "string" },
            far: { type: "string" },
            permitted: { type: "array", items: { type: "string" } },
            conditional: { type: "array", items: { type: "string" } },
            prohibited: { type: "array", items: { type: "string" } },
          },
          required: ["code", "name"],
        },
      },
    },
    required: ["rows"],
  },
  permits: {
    type: "object",
    properties: {
      rows: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" }, description: { type: "string" }, timeline: { type: "string" },
            fee: { type: "string" }, fee_note: { type: "string" },
            requirements: { type: "array", items: { type: "string" } },
          },
          required: ["name"],
        },
      },
    },
    required: ["rows"],
  },
  ordinances: {
    type: "object",
    properties: {
      rows: {
        type: "array",
        items: {
          type: "object",
          properties: {
            code: { type: "string" }, title: { type: "string" }, category: { type: "string" }, summary: { type: "string" },
          },
          required: ["title", "category"],
        },
      },
    },
    required: ["rows"],
  },
  contacts: {
    type: "object",
    properties: {
      rows: {
        type: "array",
        items: {
          type: "object",
          properties: {
            dept: { type: "string" }, description: { type: "string" }, phone: { type: "string" },
            email: { type: "string" }, hours: { type: "string" }, address: { type: "string" },
            website: { type: "string" }, meetings: { type: "string" },
          },
          required: ["dept"],
        },
      },
    },
    required: ["rows"],
  },
};

const SYSTEM_PROMPTS: Record<IngestType, string> = {
  zones: "You extract zoning district records from municipal code documents. Return one row per zoning district found. Use the EXACT values from the document — never invent.",
  permits: "You extract building permit types from municipal code or town fee schedule documents. Return one row per distinct permit. Never invent values.",
  ordinances: "You extract notable local ordinances. Group by sensible category (Fences, Pools, Noise, Trees, Signs, Stormwater).",
  contacts: "You extract municipal department / board contact info. One row per department.",
};

// Fields we compare for drift (skip provenance + timestamps)
const COMPARE_FIELDS: Record<IngestType, string[]> = {
  zones: ["name", "description", "min_lot", "setback_front", "setback_side", "setback_rear", "max_height", "max_coverage", "far", "permitted", "conditional", "prohibited"],
  permits: ["description", "timeline", "fee", "fee_note", "requirements"],
  ordinances: ["title", "category", "summary"],
  contacts: ["description", "phone", "email", "hours", "address", "website", "meetings"],
};

const KEY_FIELD: Record<IngestType, string> = {
  zones: "code",
  permits: "name",
  ordinances: "title",
  contacts: "dept",
};

async function firecrawlScrape(url: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");
  const resp = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Firecrawl ${resp.status}`);
  const md = data.data?.markdown ?? data.markdown;
  if (!md) throw new Error("Firecrawl returned no markdown");
  return md as string;
}

async function aiExtract(type: IngestType, sourceMarkdown: string, sourceUrl: string) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  const truncated = sourceMarkdown.slice(0, 80_000);
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[type] },
        { role: "user", content: `Source URL: ${sourceUrl}\n\nExtract structured ${type} rows.\n\n---\n${truncated}` },
      ],
      tools: [{ type: "function", function: { name: `extract_${type}`, parameters: TOOL_SCHEMAS[type] } }],
      tool_choice: { type: "function", function: { name: `extract_${type}` } },
    }),
  });
  if (resp.status === 429) throw new Error("Lovable AI rate limit");
  if (resp.status === 402) throw new Error("Lovable AI credits exhausted");
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Lovable AI ${resp.status}`);
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) return [];
  const parsed = JSON.parse(call.function.arguments);
  return (parsed.rows ?? []) as Record<string, unknown>[];
}

function normalize(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).sort().join("|");
  return String(v).trim();
}

function diffRow(type: IngestType, oldRow: Record<string, unknown>, newRow: Record<string, unknown>) {
  const changes: string[] = [];
  for (const f of COMPARE_FIELDS[type]) {
    const a = normalize(oldRow[f]);
    const b = normalize(newRow[f]);
    if (a !== b) changes.push(`${f}: "${a.slice(0, 60)}" → "${b.slice(0, 60)}"`);
  }
  return changes;
}

async function refreshSource(
  admin: ReturnType<typeof createClient>,
  town_slug: string,
  source_url: string,
  ingestion_type: IngestType,
  triggered_by: string | null,
) {
  // Open run record
  const { data: run, error: runErr } = await admin
    .from("ingestion_runs")
    .insert({ town_slug, source_url, ingestion_type, status: "running", triggered_by })
    .select("id")
    .single();
  if (runErr) throw runErr;

  try {
    const markdown = await firecrawlScrape(source_url);
    const newRows = await aiExtract(ingestion_type, markdown, source_url);

    const { data: existing } = await admin
      .from(ingestion_type)
      .select("*")
      .eq("town_slug", town_slug)
      .eq("source_url", source_url);

    const existingByKey = new Map<string, Record<string, unknown>>();
    for (const r of (existing ?? []) as Record<string, unknown>[]) {
      const k = normalize(r[KEY_FIELD[ingestion_type]]).toLowerCase();
      if (k) existingByKey.set(k, r);
    }

    let drifts = 0;
    const seen = new Set<string>();

    for (const row of newRows) {
      const k = normalize(row[KEY_FIELD[ingestion_type]]).toLowerCase();
      if (!k) continue;
      seen.add(k);
      const old = existingByKey.get(k);
      if (!old) {
        await admin.from("data_drifts").insert({
          town_slug, table_name: ingestion_type, ingestion_type, source_url,
          change_type: "added",
          diff_summary: `New ${ingestion_type.slice(0, -1)} found upstream: ${row[KEY_FIELD[ingestion_type]]}`,
          new_snapshot: row,
        });
        drifts++;
      } else {
        const changes = diffRow(ingestion_type, old, row);
        if (changes.length) {
          await admin.from("data_drifts").insert({
            town_slug, table_name: ingestion_type, ingestion_type, source_url,
            row_id: old.id as string,
            change_type: "modified",
            diff_summary: changes.join("; "),
            old_snapshot: old, new_snapshot: row,
          });
          drifts++;
        }
      }
    }

    // Detect removals
    for (const [k, old] of existingByKey.entries()) {
      if (!seen.has(k)) {
        await admin.from("data_drifts").insert({
          town_slug, table_name: ingestion_type, ingestion_type, source_url,
          row_id: old.id as string,
          change_type: "removed",
          diff_summary: `Row no longer present at source: ${old[KEY_FIELD[ingestion_type]]}`,
          old_snapshot: old,
        });
        drifts++;
      }
    }

    await admin.from("ingestion_runs").update({
      status: "completed",
      finished_at: new Date().toISOString(),
      rows_added: drifts,
      raw_response: { drifts_detected: drifts, scanned_rows: newRows.length },
    }).eq("id", run.id);

    return { drifts, scanned: newRows.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await admin.from("ingestion_runs").update({
      status: "failed", finished_at: new Date().toISOString(), error_message: msg,
    }).eq("id", run.id);
    throw err;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const cronSecret = req.headers.get("x-cron-secret");
    const isCron = !!body.cron && cronSecret === Deno.env.get("CRON_SECRET");

    let userId: string | null = null;
    if (!isCron) {
      // Manual trigger requires admin auth
      const authHeader = req.headers.get("Authorization") ?? "";
      const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
      const { data: u } = await userClient.auth.getUser();
      if (!u?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Admin role required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      userId = u.user.id;
    }

    // Decide which sources to refresh:
    //  - cron mode: every distinct (town, source_url, type) ever ingested for towns with auto_refresh_enabled
    //  - manual mode: explicit { town_slug, source_url, ingestion_type } OR { town_slug } for all that town's sources
    const { data: townsList } = await admin
      .from("towns")
      .select("slug, auto_refresh_enabled");
    const autoEnabledSet = new Set(((townsList ?? []) as { slug: string; auto_refresh_enabled: boolean }[])
      .filter((t) => t.auto_refresh_enabled).map((t) => t.slug));

    let sourcesQuery = admin
      .from("ingestion_runs")
      .select("town_slug, source_url, ingestion_type")
      .eq("status", "completed");

    if (body.town_slug) sourcesQuery = sourcesQuery.eq("town_slug", body.town_slug);
    if (body.source_url) sourcesQuery = sourcesQuery.eq("source_url", body.source_url);
    if (body.ingestion_type) sourcesQuery = sourcesQuery.eq("ingestion_type", body.ingestion_type);

    const { data: sourcesRaw } = await sourcesQuery;
    const dedup = new Map<string, { town_slug: string; source_url: string; ingestion_type: IngestType }>();
    for (const r of (sourcesRaw ?? []) as { town_slug: string; source_url: string; ingestion_type: string }[]) {
      if (isCron && !autoEnabledSet.has(r.town_slug)) continue;
      const k = `${r.town_slug}::${r.source_url}::${r.ingestion_type}`;
      if (!dedup.has(k)) dedup.set(k, { town_slug: r.town_slug, source_url: r.source_url, ingestion_type: r.ingestion_type as IngestType });
    }

    const sources = Array.from(dedup.values());
    const results: Array<{ source_url: string; town_slug: string; type: string; drifts?: number; error?: string }> = [];

    for (const s of sources) {
      try {
        const r = await refreshSource(admin, s.town_slug, s.source_url, s.ingestion_type, userId);
        results.push({ source_url: s.source_url, town_slug: s.town_slug, type: s.ingestion_type, drifts: r.drifts });
      } catch (e) {
        results.push({ source_url: s.source_url, town_slug: s.town_slug, type: s.ingestion_type, error: e instanceof Error ? e.message : String(e) });
      }
    }

    // Bump next_refresh_at on all touched towns
    const touchedTowns = Array.from(new Set(sources.map((s) => s.town_slug)));
    if (touchedTowns.length) {
      const next = new Date();
      next.setDate(next.getDate() + 7);
      await admin.from("towns").update({ next_refresh_at: next.toISOString() }).in("slug", touchedTowns);
    }

    return new Response(JSON.stringify({ ok: true, refreshed: sources.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("refresh-town-data error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});