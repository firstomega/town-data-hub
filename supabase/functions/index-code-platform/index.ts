// Edge function: index-code-platform
//
// One-shot per (state, platform): Firecrawl-scrapes the publisher's
// state directory page, then asks Lovable AI (Gemini Flash) to extract
// the (town_name, customer_id, base_url) tuples. Upserts into
// public.code_platform_index.
//
// This makes per-town discovery deterministic for ~90% of municipalities
// — discover-town-sources can do a DB lookup instead of burning Firecrawl
// Search credits + AI ranking.
//
// Inputs (POST JSON):
//   { state: 'NJ', platform: 'ecode360' | 'municode' | 'generalcode' }
//
// Output:
//   { ok: true, state, platform, indexed: <number>, sample: [...] }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Platform = "ecode360" | "municode" | "generalcode";

// State-level directory URL per platform. The full state name is needed
// for some platforms; the USPS code for others. We pass both to the URL
// builder so each platform can pick.
//
// NOTE: For eCode360, the canonical public directory of every town is
// General Code's text-library page (General Code is the company that
// operates eCode360). It's a single static HTML page listing every state,
// with each town linking to its `https://ecode360.com/<CUSTOMER_ID>` root.
// We deterministically parse the NJ (or any state) section instead of
// trying to scrape ecode360.com directly (which has no state index).
const PLATFORM_DIRECTORY_URL: Record<Platform, (stateCode: string, stateName: string) => string> = {
  ecode360: () => `https://www.generalcode.com/text-library/`,
  // Municode's library is organized by state name (lowercase, hyphenated).
  municode: (_stateCode, stateName) =>
    `https://library.municode.com/${stateName.toLowerCase().replace(/\s+/g, "-")}`,
  // General Code (the company that runs eCode360) also publishes
  // legacy "eCode" sites under generalcode.com. Most NJ towns have
  // moved to eCode360 — kept here for completeness.
  generalcode: (stateCode) =>
    `https://www.generalcode.com/library/?state=${stateCode}`,
};

const STATE_NAMES: Record<string, string> = {
  NJ: "New Jersey",
  NY: "New York",
  PA: "Pennsylvania",
  CT: "Connecticut",
  // Extend as we expand. Anything not listed will still work for
  // platforms that only need the USPS code.
};

const PLATFORM_GUIDANCE: Record<Platform, string> = {
  ecode360:
    "eCode360 customer codes are 2 letters followed by 4 digits (e.g. 'RO0104' for Ridgewood). The base_url is typically 'https://ecode360.com/<CUSTOMER_ID>' or 'https://ecode360.com/laws/<CUSTOMER_ID>'. Extract the customer_id from each town's link.",
  municode:
    "Municode URLs look like 'https://library.municode.com/<state>/<town-slug>'. There is no separate numeric customer ID — use the trailing slug as customer_id.",
  generalcode:
    "General Code legacy 'eCode' links point to subdomain pages like 'https://ecode.generalcode.com/<town>'. Use the trailing path segment as customer_id.",
};

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function firecrawlScrape(url: string): Promise<string> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");
  const resp = await withTimeout(
    fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: false,    // directory pages are mostly nav, not "main content"
        includeTags: ["a", "ul", "li", "div"],
      }),
    }),
    30_000,
    `Firecrawl scrape ${url}`,
  );
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Firecrawl ${resp.status}: ${JSON.stringify(data)}`);
  const md = data.data?.markdown ?? data.markdown;
  if (!md) throw new Error("Firecrawl returned no markdown");
  return md as string;
}

// Direct fetch (no Firecrawl) for static HTML pages we can parse ourselves.
async function rawFetchHtml(url: string): Promise<string> {
  const resp = await withTimeout(
    fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TownCenterIndexer/1.0; +https://towncenter.lovable.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    }),
    30_000,
    `raw fetch ${url}`,
  );
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`raw fetch ${url} -> ${resp.status}: ${body.slice(0, 200)}`);
  }
  return await resp.text();
}

// Deterministically parse General Code's text-library HTML for a single state.
// Structure (verified 2026-04): a `<div class="state XX">` block per state,
// followed by `<div class="listItem">` entries each containing
//   <a class="codeLink" href="https://ecode360.com/<CUSTOMER_ID>" ...>
//     <town name with prefix>
//   </a>
//   <div class="codeCounty">(<county> County)</div>
function parseGeneralCodeTextLibrary(html: string, stateCode: string): ExtractedTown[] {
  // Slice out just the requested state's block. We avoid a giant lazy
  // regex (catastrophic backtracking on 2MB input) by doing string
  // index math: find the state's opening marker, then find the next
  // state-block opener and slice between them.
  const startMarker = `<div class="state ${stateCode}">`;
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return [];

  // Look for the next "<div class=\"state XX\">" after our start.
  const nextStateRe = /<div class="state [A-Z]{2}">/g;
  nextStateRe.lastIndex = startIdx + startMarker.length;
  const nextMatch = nextStateRe.exec(html);
  const endIdx = nextMatch ? nextMatch.index : html.length;
  const block = html.slice(startIdx, endIdx);

  const itemRe =
    /<a class="codeLink"\s+href="(https?:\/\/ecode360\.com\/[^"]+)"[^>]*>\s*([^<]+?)\s*<\/a>/g;
  const out: ExtractedTown[] = [];
  for (const m of block.matchAll(itemRe)) {
    const baseUrl = m[1].trim();
    const townName = m[2].replace(/\s+/g, " ").trim();
    if (!townName || !baseUrl) continue;
    // Customer ID is the last path segment of the eCode360 URL.
    const customerId = baseUrl.split("/").filter(Boolean).pop() ?? null;
    out.push({ town_name: townName, customer_id: customerId, base_url: baseUrl });
  }
  return out;
}

type ExtractedTown = {
  town_name: string;
  customer_id: string | null;
  base_url: string;
};

async function aiExtractDirectory(
  platform: Platform,
  state: string,
  directoryUrl: string,
  markdown: string,
): Promise<ExtractedTown[]> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  // Cap markdown size to keep within context window. Most directory
  // pages are mostly link lists so 60k chars is plenty.
  const truncated = markdown.length > 60_000 ? markdown.slice(0, 60_000) : markdown;

  const resp = await withTimeout(
    fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              `You extract a directory listing of municipalities from a publisher's state index page. Return one entry per municipality with: town_name (as displayed), customer_id (publisher's identifier — see platform guidance), and base_url (the absolute URL to that town's code root page). ${PLATFORM_GUIDANCE[platform]} Only include entries that are clearly municipalities in ${state}. Skip non-municipality links (search forms, footer links, ads).`,
          },
          {
            role: "user",
            content:
              `Platform: ${platform}\nState: ${state}\nDirectory URL: ${directoryUrl}\n\nPage markdown:\n\n${truncated}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_directory",
              description: "Submit the parsed directory of municipalities.",
              parameters: {
                type: "object",
                properties: {
                  towns: {
                    type: "array",
                    description: "One entry per municipality found on the page.",
                    items: {
                      type: "object",
                      properties: {
                        town_name: { type: "string" },
                        customer_id: { type: "string", nullable: true },
                        base_url: { type: "string" },
                      },
                      required: ["town_name", "base_url"],
                    },
                  },
                },
                required: ["towns"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_directory" } },
      }),
    }),
    60_000,
    `AI extract directory (${platform})`,
  );

  if (resp.status === 429) throw new Error("Lovable AI rate limit (429)");
  if (resp.status === 402) throw new Error("Lovable AI credits exhausted (402)");
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Lovable AI ${resp.status}: ${JSON.stringify(data)}`);

  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) return [];
  const args = JSON.parse(call.function.arguments) as { towns: ExtractedTown[] };
  return args.towns ?? [];
}

function normalizeTownName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Strip common prefixes/suffixes the publisher may include
    .replace(/^(the\s+)?(borough|township|city|village|town)\s+of\s+/i, "")
    .replace(/\s+(borough|township|city|village|town)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const state = String(body.state ?? "").toUpperCase().trim();
    const platform = String(body.platform ?? "").toLowerCase().trim() as Platform;

    if (!state || state.length !== 2) {
      return new Response(JSON.stringify({ error: "state must be a 2-letter USPS code (e.g. 'NJ')" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["ecode360", "municode", "generalcode"].includes(platform)) {
      return new Response(JSON.stringify({ error: "platform must be one of: ecode360, municode, generalcode" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth: admin only — Firecrawl + AI cost real money
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: u } = await userClient.auth.getUser();
    const user = u?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stateName = STATE_NAMES[state] ?? state;
    const directoryUrl = PLATFORM_DIRECTORY_URL[platform](state, stateName);

    let towns: ExtractedTown[];
    let extractionMethod: "deterministic" | "ai" = "ai";

    if (platform === "ecode360") {
      // Deterministic path: General Code's text-library page lists every
      // eCode360 town in stable HTML. No Firecrawl, no AI, no cost.
      console.log(`[index-code-platform] deterministic fetch ${directoryUrl}`);
      const html = await rawFetchHtml(directoryUrl);
      console.log(`[index-code-platform] parsing ${html.length} chars for state ${state}`);
      towns = parseGeneralCodeTextLibrary(html, state);
      extractionMethod = "deterministic";
    } else {
      console.log(`[index-code-platform] scraping ${directoryUrl}`);
      const markdown = await firecrawlScrape(directoryUrl);
      console.log(`[index-code-platform] AI extract from ${markdown.length} chars`);
      towns = await aiExtractDirectory(platform, state, directoryUrl, markdown);
    }

    if (!towns.length) {
      return new Response(
        JSON.stringify({
          ok: true,
          state,
          platform,
          indexed: 0,
          method: extractionMethod,
          directory_url: directoryUrl,
          message: "No towns extracted. Page may have changed structure or returned no usable content.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Upsert into code_platform_index
    const rows = towns
      .filter((t) => t.town_name && t.base_url)
      .map((t) => ({
        state,
        platform,
        town_name: t.town_name.trim(),
        town_name_normalized: normalizeTownName(t.town_name),
        customer_id: t.customer_id?.trim() || null,
        base_url: t.base_url.trim(),
        last_indexed_at: new Date().toISOString(),
      }))
      .filter((r) => r.town_name_normalized.length > 0);

    if (!rows.length) {
      return new Response(
        JSON.stringify({ ok: true, state, platform, indexed: 0, message: "All extracted rows failed normalization." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: upsertError } = await admin
      .from("code_platform_index")
      .upsert(rows, { onConflict: "state,platform,town_name_normalized" });

    if (upsertError) throw upsertError;

    console.log(`[index-code-platform] indexed ${rows.length} towns for ${state}/${platform}`);

    return new Response(
      JSON.stringify({
        ok: true,
        state,
        platform,
        indexed: rows.length,
        method: extractionMethod,
        directory_url: directoryUrl,
        sample: rows.slice(0, 5).map((r) => ({
          town_name: r.town_name,
          town_name_normalized: r.town_name_normalized,
          customer_id: r.customer_id,
          base_url: r.base_url,
        })),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? `${e.message}\n${e.stack ?? ""}` : `Non-Error thrown: ${JSON.stringify(e)}`;
    console.error("[index-code-platform] error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
