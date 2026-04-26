-- =========================================================
-- 2a-2-fix: County disambiguation + bare-name lookup
-- =========================================================
-- The first index-code-platform run hit a silent data-loss bug: NJ has
-- multiple "Township of Washington" (different counties), and the unique
-- constraint on (state, platform, town_name_normalized) collapsed them
-- to a single row. ~55 NJ towns lost.
--
-- This migration:
--   1. Adds county, bare_name, designator columns so name collisions
--      across counties can coexist AND so discover-town-sources can
--      look up by (state, county, bare_name) — matching the towns table
--      which has both town slug and county.
--   2. Switches the unique constraint to (state, platform, customer_id),
--      the natural key per platform.
--   3. Wipes the existing NJ/ecode360 rows so the next index-code-platform
--      run repopulates them with full county info. Cheap to redo — the
--      indexer is deterministic (no Firecrawl/AI cost) for eCode360.
-- =========================================================

-- ---------- 1) Add lookup columns ----------
ALTER TABLE public.code_platform_index
  ADD COLUMN IF NOT EXISTS county text,
  ADD COLUMN IF NOT EXISTS bare_name text,
  ADD COLUMN IF NOT EXISTS designator text
    CHECK (designator IS NULL OR designator IN ('borough', 'township', 'city', 'village', 'town'));

-- ---------- 2) Switch unique constraint ----------
-- Drop the old constraint by name. Postgres auto-named it from column list.
ALTER TABLE public.code_platform_index
  DROP CONSTRAINT IF EXISTS code_platform_index_state_platform_town_name_normalized_key;

-- Add the new one. customer_id is the natural unique key per platform —
-- every eCode360 town has a unique 6-char code, every Municode town has
-- a unique slug. Same town across platforms is allowed (and expected).
ALTER TABLE public.code_platform_index
  ADD CONSTRAINT code_platform_index_state_platform_customer_id_key
    UNIQUE (state, platform, customer_id);

-- ---------- 3) Lookup index for the discover hot path ----------
-- discover-town-sources will query: WHERE state=? AND county=? AND bare_name=?
CREATE INDEX IF NOT EXISTS idx_code_platform_index_lookup_by_county_name
  ON public.code_platform_index (state, county, bare_name);

-- ---------- 4) Wipe existing NJ ecode360 rows ----------
-- They lack county/bare_name/designator and the indexer (which is
-- deterministic and free for eCode360) will repopulate them in seconds.
-- Also wiping any town_sources rows that reference these — they'd be
-- re-discovered on the next discover-town-sources run anyway, and
-- 2a-3 will repopulate them WITH confidence + method.
DELETE FROM public.code_platform_index WHERE state = 'NJ' AND platform = 'ecode360';

COMMENT ON COLUMN public.code_platform_index.county IS
  'County name (e.g. ''Bergen''), parsed from the publisher directory page. Disambiguates same-named towns across counties (NJ has multiple Washington Townships).';
COMMENT ON COLUMN public.code_platform_index.bare_name IS
  'Town name minus its designator. e.g. ''washington'' for both Washington Borough and Washington Township. Matches towns.slug for towns whose slug omits the designator.';
COMMENT ON COLUMN public.code_platform_index.designator IS
  'Municipal type: borough, township, city, village, town. NULL if not derivable from the publisher page.';
