-- =========================================================
-- 2a-1: Discovery confidence + platform index
-- =========================================================

-- ---------- 1) Wipe Lovable's earlier discovery rows ----------
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
CREATE TABLE IF NOT EXISTS public.code_platform_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  platform text NOT NULL
    CHECK (platform IN ('ecode360', 'municode', 'generalcode')),
  town_name text NOT NULL,
  town_name_normalized text NOT NULL,
  customer_id text,
  base_url text NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_code_platform_index_lookup
  ON public.code_platform_index (state, town_name_normalized);

CREATE INDEX IF NOT EXISTS idx_code_platform_index_freshness
  ON public.code_platform_index (state, platform, last_indexed_at);

COMMENT ON TABLE public.code_platform_index IS
  'Cache of which towns each code publisher hosts in each state. Lets discover-town-sources skip Firecrawl Search for towns covered by a known platform — gives 100%-confidence URLs deterministically.';