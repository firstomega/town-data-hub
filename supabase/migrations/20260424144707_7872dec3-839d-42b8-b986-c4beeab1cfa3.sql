-- 1. Profiles: pin one home address
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS primary_address text,
  ADD COLUMN IF NOT EXISTS primary_town_slug text,
  ADD COLUMN IF NOT EXISTS primary_zone_code text;

-- 2. Civic events table
CREATE TABLE IF NOT EXISTS public.civic_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  town_slug text NOT NULL,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'council', -- council | planning | zoning | election | other
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text,
  source_url text,
  source_doc text,
  confidence public.data_confidence NOT NULL DEFAULT 'placeholder',
  last_verified_at timestamptz,
  verified_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_civic_events_town_starts ON public.civic_events (town_slug, starts_at);
CREATE INDEX IF NOT EXISTS idx_civic_events_starts ON public.civic_events (starts_at);

ALTER TABLE public.civic_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Civic events publicly readable"
  ON public.civic_events FOR SELECT
  USING (true);

CREATE POLICY "Admins manage civic events"
  ON public.civic_events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_civic_events_updated_at
  BEFORE UPDATE ON public.civic_events
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3. Homeowner alerts (read-state for drifts/events tied to a user's home)
CREATE TABLE IF NOT EXISTS public.homeowner_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alert_type text NOT NULL, -- 'drift' | 'event' | 'ordinance'
  ref_id uuid,              -- points to data_drifts.id, civic_events.id, or ordinances.id
  town_slug text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, alert_type, ref_id)
);

CREATE INDEX IF NOT EXISTS idx_homeowner_alerts_user ON public.homeowner_alerts (user_id, read_at);

ALTER TABLE public.homeowner_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own alerts"
  ON public.homeowner_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own alerts"
  ON public.homeowner_alerts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Faster category lookups on ordinances
CREATE INDEX IF NOT EXISTS idx_ordinances_town_category ON public.ordinances (town_slug, category);