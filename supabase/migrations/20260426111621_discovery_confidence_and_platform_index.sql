-- =========================================================
-- 2a-1: Discovery confidence + platform index
-- =========================================================
-- Goal: make source discovery scalable to 70 → 70k municipalities by
--   (a) recording how confident the system is about each discovered URL
--   (b) caching publisher-side directories (eCode360, Municode, etc.)
--       so most discoveries become deterministic lookups instead of
--       Firecrawl Search + AI ranking.
--
-- Human review then becomes "process the low-confidence queue" instead
-- of "look at every URL ever discovered".
-- =========================================================

-- ---------- 1) Wipe Lovable's earlier discovery rows ----------
-- Those rows had no confidence/method/reasoning so they'd skew the queue.
-- Re-discovery on the new pipeline will repopulate them with proper metadata.
DELETE FROM public.town_sources
WHERE town_slug IN ('paramus', 'hackensack', 'teaneck');

-- ---------- 2) Confidence + provenance columns on town_sources ----------
ALTER TABLE public.town_sources
  ADD COLUMN IF NOT EXISTS discovery_confidence numeric
    CHECK (discovery_confidence IS NULL OR (discovery_confidence >= 0 AND discovery_confidence <= 1)),
  ADD COLUMN IF NOT EXISTS discovery_method text
    CHECK (discovery_method IS NULL OR discovery_method IN ('platform_directory', 'ai_ranked', 'manual')),
  ADD COLUMN IF NOT EXISTS discovery_reasoning text,
  ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- Index for the review queue: scan low-confidence + unverified rows fast.
CREATE INDEX IF NOT EXISTS idx_town_sources_review_queue
  ON public.town_sources (discovery_confidence ASC NULLS FIRST)
  WHERE verified_at IS NULL;

COMMENT ON COLUMN public.town_sources.discovery_confidence IS
  '0.0–1.0 score from discovery. 1.0 = pulled from publisher directory or set by admin. < 0.85 should be human-reviewed before ingestion.';
COMMENT ON COLUMN public.town_sources.discovery_method IS
  'How this URL was discovered. platform_directory = deterministic lookup against a code publisher index. ai_ranked = Firecrawl Search + AI rank fallback. manual = admin set it.';
COMMENT ON COLUMN public.town_sources.discovery_reasoning IS
  'For ai_ranked entries: the model''s short explanation of why this URL was picked. Empty for platform_directory and manual.';

-- ---------- 3) New table: code_platform_index ----------
-- A cache of (state, platform) → list of (town, customer_id, base_url).
-- Populated by the index-code-platform edge function. Refreshed every
-- ~6 months (platforms occasionally onboard new towns).
CREATE TABLE IF NOT EXISTS public.code_platform_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,                    -- 'NJ', 'NY', 'PA', etc. (USPS code)
  platform text NOT NULL                  -- 'ecode360' | 'municode' | 'generalcode'
    CHECK (platform IN ('ecode360', 'municode', 'generalcode')),
  town_name text NOT NULL,                -- as it appears on the publisher's directory
  town_name_normalized text NOT NULL,     -- lowercase, hyphenated — matches towns.slug pattern
  customer_id text,                       -- e.g. 'RO0104' for Ridgewood on eCode360 (NULL if platform doesn't expose one)
  base_url text NOT NULL,                 -- root URL for the town's code on the platform
  last_indexed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state, platform, town_name_normalized)
);

ALTER TABLE public.code_platform_index ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform index publicly readable"
  ON public.code_platform_index FOR SELECT USING (true);

CREATE POLICY "Admins manage platform index"
  ON public.code_platform_index FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Lookup index for the discover function's hot path:
-- "given town_name_normalized + state, do we have a hit on any platform?"
CREATE INDEX IF NOT EXISTS idx_code_platform_index_lookup
  ON public.code_platform_index (state, town_name_normalized);

CREATE INDEX IF NOT EXISTS idx_code_platform_index_freshness
  ON public.code_platform_index (state, platform, last_indexed_at);

COMMENT ON TABLE public.code_platform_index IS
  'Cache of which towns each code publisher hosts in each state. Lets discover-town-sources skip Firecrawl Search for towns covered by a known platform — gives 100%-confidence URLs deterministically.';
