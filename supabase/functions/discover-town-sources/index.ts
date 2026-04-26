// Edge function: discover-town-sources
// For a given town, uses Firecrawl Search to find candidate official URLs
// for each ingestion type (zones / permits / ordinances / contacts), then asks
// Lovable AI (Gemini Flash) to pick the single best URL per type.
// Saves picks into town_sources for one-click re-ingestion later.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type IngestType = "zones" | "permits" | "ordinances" | "contacts";

const QUERIES: Record<IngestType, (town: string, county: string) => string[]> = {
  zones: (t) => [
    `"${t}" NJ zoning ordinance ecode360 OR municode`,
    `"${t}" New Jersey zoning code chapter`,
    `"${t}" borough OR township NJ Article zoning districts`,
  ],
  permits: (t) => [
    `"${t}" NJ building permit fee schedule`,
    `"${t}" New Jersey construction official permit application`,
    `"${t}" borough OR township construction department fees`,
  ],
  ordinances: (t) => [
    `"${t}" NJ municipal code chapter ordinances`,
    `"${t}" New Jersey ordinances ecode360 OR municode`,
  ],
  contacts: (t) => [
    `"${t}" NJ building department contact phone`,
    `"${t}" New Jersey planning zoning board contact`,
  ],
};

type SearchResult = { url: string; title?: string; description?: string };

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)),
  ]);
}

async function firecrawlSearch(query: string, limit = 4): Promise<SearchResult[]> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");
  const resp = await withTimeout(fetch("https://api.firecrawl.dev/v2/search", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit, country: "us", lang: "en" }),
  }), 20_000, `Firecrawl search "${query}"`);
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Firecrawl search ${resp.status}: ${JSON.stringify(data)}`);
  // v2 response shape: { success, data: { web: [...] } } or { data: [...] }
  const web = data?.data?.web ?? data?.data ?? [];
  return (web as Array<Record<string, unknown>>).map((r) => ({
    url: String(r.url ?? ""),
    title: r.title ? String(r.title) : undefined,
    description: r.description ? String(r.description) : undefined,
  })).filter((r) => r.url.startsWith("http"));
}

async function aiPickBest(type: IngestType, town: string, candidates: SearchResult[]) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!candidates.length) return null;

  const trimmed = candidates.slice(0, 8);
  const numbered = trimmed.map((c, i) =>
    `[${i + 1}] ${c.url}\n    title: ${c.title ?? "(none)"}\n    snippet: ${(c.description ?? "").slice(0, 160)}`
  ).join("\n\n");

  const guidance: Record<IngestType, string> = {
    zones: "an official municipal zoning ordinance / land development chapter (eCode360, Municode, or town-hosted PDF). Avoid blogs, news, real estate listings, or third-party summaries.",
    permits: "an official town construction/building department page that lists permit types and fees, OR an official fee schedule PDF. Avoid contractor sites or generic NJ DCA pages.",
    ordinances: "the official municipal code (eCode360 / Municode / town-hosted) — preferably the chapter index, not a single subsection.",
    contacts: "the official town government contact page for the Building / Planning / Zoning departments.",
  };

  const resp = await withTimeout(fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        { role: "system", content: `You pick the single best official municipal source URL. You are looking for ${guidance[type]}. Score your confidence honestly: 0.95+ means the URL is unambiguously the right official source for the right town. 0.7–0.95 means probable but not certain. Below 0.7 means uncertain and a human should review.` },
        { role: "user", content: `Town: ${town}, NJ\nData type: ${type}\n\nCandidates:\n\n${numbered}\n\nPick the single best candidate (or 0 if none qualify) AND give a 0.0–1.0 confidence score plus a one-sentence reason.` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "pick",
          description: "Pick the best candidate with a confidence score.",
          parameters: {
            type: "object",
            properties: {
              index: { type: "number", description: "1-based index of the best candidate, or 0 if none qualify" },
              confidence: { type: "number", description: "0.0–1.0 honest confidence that this URL is the right official source for the right town and the right data type" },
              reason: { type: "string", description: "One short sentence explaining the choice" },
            },
            required: ["index", "confidence", "reason"],
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "pick" } },
    }),
  }), 25_000, `AI pick (${type})`);
  if (resp.status === 429) throw new Error("Lovable AI rate limit (429)");
  if (resp.status === 402) throw new Error("Lovable AI credits exhausted (402)");
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Lovable AI ${resp.status}: ${JSON.stringify(data)}`);
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) return null;
  const args = JSON.parse(call.function.arguments) as { index: number; confidence?: number; reason: string };
  if (!args.index || args.index < 1 || args.index > trimmed.length) return null;
  const conf = typeof args.confidence === "number" ? Math.max(0, Math.min(1, args.confidence)) : 0.5;
  return { ...trimmed[args.index - 1], reason: args.reason, confidence: conf };
}

// =========================================================
// Platform-index lookup — the "deterministic" path
// =========================================================
// For zones and ordinances (both served from a town's eCode360 root URL),
// we first look up the town in code_platform_index. On hit, no Firecrawl
// or AI needed — we know with 100% confidence what the URL is.
//
// Lookup logic mirrors how towns are seeded:
//   towns.slug = "paramus" (no designator)        → bare='paramus', designator=null
//   towns.slug = "washington-township"             → bare='washington', designator='township'
//   towns.slug = "ridgefield-park"                 → bare='ridgefield-park', designator=null
// We try (state, county, bare_name [+ designator if known]). If multiple
// rows match (e.g. bare='washington' across township and borough in same
// county), we abstain and let the AI path handle it.

const PLATFORM_TYPES: ReadonlySet<IngestType> = new Set(["zones", "ordinances"]);

type PlatformHit = {
  platform: "ecode360" | "municode" | "generalcode";
  customer_id: string | null;
  base_url: string;
  county: string | null;
};

function splitTownSlug(slug: string): { bare: string; designator: string | null } {
  const m = slug.match(/^(.+)-(borough|township|city|village|town)$/);
  if (m) return { bare: m[1], designator: m[2] };
  return { bare: slug, designator: null };
}

async function platformIndexLookup(
  admin: ReturnType<typeof createClient>,
  type: IngestType,
  state: string,
  county: string,
  townSlug: string,
): Promise<PlatformHit | null> {
  if (!PLATFORM_TYPES.has(type)) return null;
  if (!state || !county) return null;

  const { bare, designator } = splitTownSlug(townSlug);

  let q = admin
    .from("code_platform_index")
    .select("platform, customer_id, base_url, county, designator")
    .eq("state", state)
    .eq("county", county)
    .eq("bare_name", bare);
  if (designator) q = q.eq("designator", designator);

  const { data, error } = await q.limit(2);
  if (error) {
    console.error(`platformIndexLookup error for ${state}/${county}/${townSlug}:`, error.message);
    return null;
  }
  // Ambiguous (multiple matches with no way to disambiguate) — let the AI path try.
  if (!data || data.length !== 1) return null;
  return data[0] as PlatformHit;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { town_slug, types: requestedTypes, save = false } = await req.json();
    if (!town_slug) {
      return new Response(JSON.stringify({ error: "town_slug is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth: only admins can run discovery (Firecrawl + AI cost real money)
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: u } = await userClient.auth.getUser();
    const user = u?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin role required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: townRow } = await admin.from("towns").select("name, full_name, county").eq("slug", town_slug).maybeSingle();
    if (!townRow) {
      return new Response(JSON.stringify({ error: "Town not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const town = (townRow as { full_name?: string; name: string }).full_name ?? (townRow as { name: string }).name;
    const county = (townRow as { county?: string }).county ?? "Bergen";

    const types: IngestType[] = (requestedTypes && Array.isArray(requestedTypes) && requestedTypes.length)
      ? requestedTypes.filter((t: string): t is IngestType => ["zones", "permits", "ordinances", "contacts"].includes(t))
      : ["zones", "permits", "ordinances", "contacts"];

    // For NJ-only seed today; future migration may add `state` to towns.
    const state = "NJ";

    type ResultEntry = {
      picked: {
        url: string;
        title?: string;
        description?: string;
        reason?: string;
        confidence: number;
        method: "platform_directory" | "ai_ranked";
      } | null;
      candidates: SearchResult[];
    };
    const results: Record<string, ResultEntry> = {};

    await Promise.all(types.map(async (t) => {
      // Step 1 — try the deterministic platform-index lookup first
      // (only meaningful for zones/ordinances). On hit, skip Firecrawl
      // and AI entirely — we know what the URL is with 100% confidence.
      const platformHit = await platformIndexLookup(admin, t, state, county, town_slug);
      if (platformHit) {
        const picked = {
          url: platformHit.base_url,
          title: `eCode360 ${platformHit.customer_id ?? ""}`.trim(),
          reason: `Matched ${platformHit.platform} directory (${platformHit.county ?? "unknown county"}, customer ID ${platformHit.customer_id ?? "n/a"})`,
          confidence: 1.0,
          method: "platform_directory" as const,
        };
        results[t] = { picked, candidates: [] };

        if (save) {
          await admin.from("town_sources").upsert({
            town_slug,
            ingestion_type: t,
            source_url: picked.url,
            source_doc: picked.title,
            source_label: `Auto-discovered (platform directory)`,
            discovered_by: user.id,
            discovery_confidence: picked.confidence,
            discovery_method: picked.method,
            discovery_reasoning: picked.reason,
          }, { onConflict: "town_slug,ingestion_type,source_url" });
        }
        return;
      }

      // Step 2 — fall through to Firecrawl Search + AI rank.
      // Use only the first 2 query variants per type to cap Firecrawl calls.
      const queries = QUERIES[t](town, county).slice(0, 2);
      const searchResults = await Promise.all(
        queries.map((q) =>
          firecrawlSearch(q, 4).catch((e) => {
            console.error(`Search "${q}" failed:`, e instanceof Error ? e.message : e);
            return [] as SearchResult[];
          })
        )
      );
      const seen = new Set<string>();
      const all: SearchResult[] = [];
      for (const arr of searchResults) {
        for (const item of arr) {
          if (!seen.has(item.url)) {
            seen.add(item.url);
            all.push(item);
          }
        }
      }
      const aiPick = await aiPickBest(t, town, all).catch((e) => {
        console.error(`AI pick (${t}) failed:`, e instanceof Error ? e.message : e);
        return null;
      });
      const picked = aiPick
        ? { ...aiPick, method: "ai_ranked" as const }
        : null;
      results[t] = { picked, candidates: all.slice(0, 8) };

      if (save && picked) {
        await admin.from("town_sources").upsert({
          town_slug,
          ingestion_type: t,
          source_url: picked.url,
          source_doc: picked.title ?? null,
          source_label: `Auto-discovered (AI ranked)`,
          discovered_by: user.id,
          discovery_confidence: picked.confidence,
          discovery_method: picked.method,
          discovery_reasoning: picked.reason ?? null,
        }, { onConflict: "town_slug,ingestion_type,source_url" });
      }
    }));

    return new Response(JSON.stringify({ ok: true, town: town, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("discover-town-sources error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});