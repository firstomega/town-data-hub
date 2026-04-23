// Edge function: ingest-town-data
// Scrapes a municipal code URL via Firecrawl, then uses Lovable AI (Gemini) to extract
// structured zone / permit / ordinance / contact rows. Inserts as confidence='ai_extracted'
// for admin review. Records every run in ingestion_runs.

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
            code: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            min_lot: { type: "string" },
            setback_front: { type: "string" },
            setback_side: { type: "string" },
            setback_rear: { type: "string" },
            max_height: { type: "string" },
            max_coverage: { type: "string" },
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
            name: { type: "string" },
            description: { type: "string" },
            timeline: { type: "string" },
            fee: { type: "string" },
            fee_note: { type: "string" },
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
            code: { type: "string" },
            title: { type: "string" },
            category: { type: "string" },
            summary: { type: "string" },
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
            dept: { type: "string" },
            description: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            hours: { type: "string" },
            address: { type: "string" },
            website: { type: "string" },
            meetings: { type: "string" },
          },
          required: ["dept"],
        },
      },
    },
    required: ["rows"],
  },
};

const SYSTEM_PROMPTS: Record<IngestType, string> = {
  zones:
    "You extract zoning district records from municipal code documents. Return one row per zoning district found. Use the EXACT values from the document — never invent. If a field isn't present, omit it. Setbacks should be raw numbers with units (e.g., '25 ft').",
  permits:
    "You extract building permit types from municipal code or town fee schedule documents. Return one row per distinct permit. Fees should include units (e.g., '$50 + $5/$1000 of cost'). Never invent values.",
  ordinances:
    "You extract notable local ordinances from municipal code documents. Group by sensible category (e.g., 'Fences', 'Pools', 'Noise', 'Trees', 'Signs', 'Stormwater'). Code should be the §section reference. Summary should be 1–2 sentences in plain English citing the actual rule.",
  contacts:
    "You extract municipal department / board contact info from town websites. One row per department (Building, Planning, Zoning Board of Adjustment, Construction, etc.). Only include fields that appear in the source.",
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
  if (!resp.ok) throw new Error(`Firecrawl ${resp.status}: ${JSON.stringify(data)}`);
  const md = data.data?.markdown ?? data.markdown;
  if (!md) throw new Error("Firecrawl returned no markdown");
  return md as string;
}

async function aiExtract(type: IngestType, sourceMarkdown: string, sourceUrl: string) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  // Cap to keep within context window
  const truncated = sourceMarkdown.slice(0, 80_000);
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[type] },
        {
          role: "user",
          content: `Source URL: ${sourceUrl}\n\nExtract structured ${type} rows from the following municipal document. Only use information explicitly stated.\n\n---\n${truncated}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: `extract_${type}`,
            description: `Return structured ${type} rows`,
            parameters: TOOL_SCHEMAS[type],
          },
        },
      ],
      tool_choice: { type: "function", function: { name: `extract_${type}` } },
    }),
  });
  if (resp.status === 429) throw new Error("Lovable AI rate limit (429). Try again shortly.");
  if (resp.status === 402) throw new Error("Lovable AI credits exhausted (402). Top up in Settings → Workspace → Usage.");
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Lovable AI ${resp.status}: ${JSON.stringify(data)}`);
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error("AI returned no tool call");
  const parsed = JSON.parse(call.function.arguments);
  return parsed.rows ?? [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { town_slug, source_url, ingestion_type, source_doc } = await req.json();

    if (!town_slug || !source_url || !ingestion_type) {
      return new Response(JSON.stringify({ error: "town_slug, source_url, ingestion_type are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["zones", "permits", "ordinances", "contacts"].includes(ingestion_type)) {
      return new Response(JSON.stringify({ error: "ingestion_type must be one of zones|permits|ordinances|contacts" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth: only admins can trigger ingestion
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin role required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Open run record
    const { data: run, error: runErr } = await admin
      .from("ingestion_runs")
      .insert({
        town_slug,
        source_url,
        source_doc: source_doc ?? null,
        ingestion_type,
        status: "running",
        triggered_by: user.id,
      })
      .select("id")
      .single();
    if (runErr) throw runErr;

    try {
      const markdown = await firecrawlScrape(source_url);
      const rows = await aiExtract(ingestion_type as IngestType, markdown, source_url);

      const provenance = {
        town_slug,
        source_url,
        source_doc: source_doc ?? null,
        confidence: "ai_extracted" as const,
        last_verified_at: null,
      };

      let inserted = 0;
      if (ingestion_type === "zones" && rows.length) {
        const payload = rows.map((r: Record<string, unknown>) => ({ ...provenance, ...r }));
        const { error, count } = await admin.from("zones").insert(payload, { count: "exact" });
        if (error) throw error;
        inserted = count ?? payload.length;
      } else if (ingestion_type === "permits" && rows.length) {
        const payload = rows.map((r: Record<string, unknown>) => ({ ...provenance, ...r }));
        const { error, count } = await admin.from("permits").insert(payload, { count: "exact" });
        if (error) throw error;
        inserted = count ?? payload.length;
      } else if (ingestion_type === "ordinances" && rows.length) {
        const payload = rows.map((r: Record<string, unknown>) => ({ ...provenance, ...r }));
        const { error, count } = await admin.from("ordinances").insert(payload, { count: "exact" });
        if (error) throw error;
        inserted = count ?? payload.length;
      } else if (ingestion_type === "contacts" && rows.length) {
        const payload = rows.map((r: Record<string, unknown>) => ({ ...provenance, ...r }));
        const { error, count } = await admin.from("contacts").insert(payload, { count: "exact" });
        if (error) throw error;
        inserted = count ?? payload.length;
      }

      await admin
        .from("ingestion_runs")
        .update({
          status: "completed",
          finished_at: new Date().toISOString(),
          rows_added: inserted,
          raw_response: { row_count: rows.length },
        })
        .eq("id", run.id);

      return new Response(JSON.stringify({ ok: true, run_id: run.id, rows_added: inserted, preview: rows.slice(0, 3) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (innerErr) {
      const msg = innerErr instanceof Error ? innerErr.message : String(innerErr);
      await admin
        .from("ingestion_runs")
        .update({ status: "failed", finished_at: new Date().toISOString(), error_message: msg })
        .eq("id", run.id);
      throw innerErr;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("ingest-town-data error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});