CREATE TABLE IF NOT EXISTS public.app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- No policies = no one can read/write via PostgREST. Only SECURITY DEFINER functions can.

CREATE OR REPLACE FUNCTION public.get_cron_secret()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT value FROM public.app_config WHERE key = 'cron_secret' LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_cron_secret() FROM public, anon, authenticated;