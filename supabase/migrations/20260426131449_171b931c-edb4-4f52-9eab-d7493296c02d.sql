ALTER TABLE public.code_platform_index
  ADD COLUMN IF NOT EXISTS county text,
  ADD COLUMN IF NOT EXISTS bare_name text,
  ADD COLUMN IF NOT EXISTS designator text
    CHECK (designator IS NULL OR designator IN ('borough', 'township', 'city', 'village', 'town'));

ALTER TABLE public.code_platform_index
  DROP CONSTRAINT IF EXISTS code_platform_index_state_platform_town_name_normalized_key;

ALTER TABLE public.code_platform_index
  ADD CONSTRAINT code_platform_index_state_platform_customer_id_key
    UNIQUE (state, platform, customer_id);

CREATE INDEX IF NOT EXISTS idx_code_platform_index_lookup_by_county_name
  ON public.code_platform_index (state, county, bare_name);

DELETE FROM public.code_platform_index WHERE state = 'NJ' AND platform = 'ecode360';

COMMENT ON COLUMN public.code_platform_index.county IS
  'County name (e.g. ''Bergen''), parsed from the publisher directory page. Disambiguates same-named towns across counties (NJ has multiple Washington Townships).';
COMMENT ON COLUMN public.code_platform_index.bare_name IS
  'Town name minus its designator. e.g. ''washington'' for both Washington Borough and Washington Township. Matches towns.slug for towns whose slug omits the designator.';
COMMENT ON COLUMN public.code_platform_index.designator IS
  'Municipal type: borough, township, city, village, town. NULL if not derivable from the publisher page.';