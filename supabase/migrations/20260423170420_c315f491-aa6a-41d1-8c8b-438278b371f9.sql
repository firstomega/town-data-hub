-- Provenance enum types
CREATE TYPE public.data_confidence AS ENUM ('verified', 'ai_extracted', 'placeholder');
CREATE TYPE public.town_data_status AS ENUM ('verified', 'partial', 'placeholder');
CREATE TYPE public.correction_status AS ENUM ('pending', 'approved', 'rejected');

-- Add data_status to towns
ALTER TABLE public.towns
  ADD COLUMN data_status public.town_data_status NOT NULL DEFAULT 'placeholder';

-- Add provenance columns to zones
ALTER TABLE public.zones
  ADD COLUMN source_url text,
  ADD COLUMN source_doc text,
  ADD COLUMN last_verified_at timestamptz,
  ADD COLUMN verified_by uuid,
  ADD COLUMN confidence public.data_confidence NOT NULL DEFAULT 'placeholder';

-- Add provenance columns to permits
ALTER TABLE public.permits
  ADD COLUMN source_url text,
  ADD COLUMN source_doc text,
  ADD COLUMN last_verified_at timestamptz,
  ADD COLUMN verified_by uuid,
  ADD COLUMN confidence public.data_confidence NOT NULL DEFAULT 'placeholder';

-- Add provenance columns to ordinances
ALTER TABLE public.ordinances
  ADD COLUMN source_url text,
  ADD COLUMN source_doc text,
  ADD COLUMN last_verified_at timestamptz,
  ADD COLUMN verified_by uuid,
  ADD COLUMN confidence public.data_confidence NOT NULL DEFAULT 'placeholder';

-- Add provenance columns to contacts
ALTER TABLE public.contacts
  ADD COLUMN source_url text,
  ADD COLUMN source_doc text,
  ADD COLUMN last_verified_at timestamptz,
  ADD COLUMN verified_by uuid,
  ADD COLUMN confidence public.data_confidence NOT NULL DEFAULT 'placeholder';

-- data_corrections table
CREATE TABLE public.data_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  row_id uuid,
  town_slug text,
  section text,
  field text,
  current_value text,
  proposed_value text,
  evidence_url text,
  description text NOT NULL,
  submitter_email text,
  submitter_user_id uuid,
  status public.correction_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.data_corrections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit corrections"
  ON public.data_corrections FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view corrections"
  ON public.data_corrections FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view their own corrections"
  ON public.data_corrections FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = submitter_user_id);

CREATE POLICY "Admins update corrections"
  ON public.data_corrections FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete corrections"
  ON public.data_corrections FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_data_corrections_updated_at
  BEFORE UPDATE ON public.data_corrections
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX idx_data_corrections_status ON public.data_corrections(status);
CREATE INDEX idx_data_corrections_town ON public.data_corrections(town_slug);

-- ingestion_runs table
CREATE TABLE public.ingestion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  town_slug text,
  source_url text NOT NULL,
  source_doc text,
  ingestion_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  rows_added integer DEFAULT 0,
  rows_updated integer DEFAULT 0,
  error_message text,
  raw_response jsonb,
  triggered_by uuid,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

ALTER TABLE public.ingestion_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage ingestion runs"
  ON public.ingestion_runs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_ingestion_runs_town ON public.ingestion_runs(town_slug);
CREATE INDEX idx_ingestion_runs_started ON public.ingestion_runs(started_at DESC);