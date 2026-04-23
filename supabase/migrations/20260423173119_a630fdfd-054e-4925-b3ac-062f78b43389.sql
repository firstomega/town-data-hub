-- Phase 3: drift detection + auto town-status promotion

-- 1) Drift detection table: queues upstream changes detected by the weekly cron
CREATE TABLE public.data_drifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  town_slug text NOT NULL,
  table_name text NOT NULL,
  row_id uuid,
  source_url text NOT NULL,
  ingestion_type text NOT NULL,
  change_type text NOT NULL DEFAULT 'modified', -- 'modified' | 'added' | 'removed'
  diff_summary text,
  old_snapshot jsonb,
  new_snapshot jsonb,
  status text NOT NULL DEFAULT 'pending', -- 'pending' | 'applied' | 'dismissed'
  detected_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  review_notes text
);

ALTER TABLE public.data_drifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage drifts"
ON public.data_drifts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_data_drifts_status ON public.data_drifts (status, detected_at DESC);
CREATE INDEX idx_data_drifts_town ON public.data_drifts (town_slug);

-- 2) Add a refresh schedule column to ingestion_runs source tracking via towns
-- We'll track the next refresh per town separately (weekly cadence)
ALTER TABLE public.towns
  ADD COLUMN IF NOT EXISTS next_refresh_at timestamptz,
  ADD COLUMN IF NOT EXISTS auto_refresh_enabled boolean NOT NULL DEFAULT true;

-- 3) Function to recompute a town's data_status based on its rows
CREATE OR REPLACE FUNCTION public.recompute_town_data_status(_town_slug text)
RETURNS public.town_data_status
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total int;
  v_verified int;
  v_placeholder int;
  v_status public.town_data_status;
BEGIN
  SELECT
    (SELECT count(*) FROM public.zones WHERE town_slug = _town_slug)
    + (SELECT count(*) FROM public.permits WHERE town_slug = _town_slug)
    + (SELECT count(*) FROM public.ordinances WHERE town_slug = _town_slug)
    + (SELECT count(*) FROM public.contacts WHERE town_slug = _town_slug)
  INTO v_total;

  SELECT
    (SELECT count(*) FROM public.zones WHERE town_slug = _town_slug AND confidence = 'verified')
    + (SELECT count(*) FROM public.permits WHERE town_slug = _town_slug AND confidence = 'verified')
    + (SELECT count(*) FROM public.ordinances WHERE town_slug = _town_slug AND confidence = 'verified')
    + (SELECT count(*) FROM public.contacts WHERE town_slug = _town_slug AND confidence = 'verified')
  INTO v_verified;

  SELECT
    (SELECT count(*) FROM public.zones WHERE town_slug = _town_slug AND confidence = 'placeholder')
    + (SELECT count(*) FROM public.permits WHERE town_slug = _town_slug AND confidence = 'placeholder')
    + (SELECT count(*) FROM public.ordinances WHERE town_slug = _town_slug AND confidence = 'placeholder')
    + (SELECT count(*) FROM public.contacts WHERE town_slug = _town_slug AND confidence = 'placeholder')
  INTO v_placeholder;

  IF v_total = 0 THEN
    v_status := 'placeholder';
  ELSIF v_placeholder = 0 AND v_verified = v_total THEN
    v_status := 'verified';
  ELSIF v_verified > 0 THEN
    v_status := 'partial';
  ELSE
    v_status := 'placeholder';
  END IF;

  UPDATE public.towns
     SET data_status = v_status,
         last_verified = CASE WHEN v_status = 'verified' THEN now() ELSE last_verified END,
         updated_at = now()
   WHERE slug = _town_slug;

  RETURN v_status;
END;
$$;

-- 4) Trigger function: when any row's confidence changes, recompute parent town status
CREATE OR REPLACE FUNCTION public.tg_recompute_town_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_slug := OLD.town_slug;
  ELSE
    v_slug := NEW.town_slug;
  END IF;

  PERFORM public.recompute_town_data_status(v_slug);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- 5) Attach trigger to all four data tables
DROP TRIGGER IF EXISTS trg_recompute_status_zones ON public.zones;
CREATE TRIGGER trg_recompute_status_zones
AFTER INSERT OR UPDATE OF confidence OR DELETE ON public.zones
FOR EACH ROW EXECUTE FUNCTION public.tg_recompute_town_status();

DROP TRIGGER IF EXISTS trg_recompute_status_permits ON public.permits;
CREATE TRIGGER trg_recompute_status_permits
AFTER INSERT OR UPDATE OF confidence OR DELETE ON public.permits
FOR EACH ROW EXECUTE FUNCTION public.tg_recompute_town_status();

DROP TRIGGER IF EXISTS trg_recompute_status_ordinances ON public.ordinances;
CREATE TRIGGER trg_recompute_status_ordinances
AFTER INSERT OR UPDATE OF confidence OR DELETE ON public.ordinances
FOR EACH ROW EXECUTE FUNCTION public.tg_recompute_town_status();

DROP TRIGGER IF EXISTS trg_recompute_status_contacts ON public.contacts;
CREATE TRIGGER trg_recompute_status_contacts
AFTER INSERT OR UPDATE OF confidence OR DELETE ON public.contacts
FOR EACH ROW EXECUTE FUNCTION public.tg_recompute_town_status();

-- 6) Enable extensions for the weekly cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
