UPDATE public.town_sources ts
SET last_used_at = ir.finished_at
FROM public.ingestion_runs ir
WHERE ts.town_slug = ir.town_slug
  AND ts.ingestion_type = ir.ingestion_type
  AND ts.source_url = ir.source_url
  AND ir.status = 'completed'
  AND ts.last_used_at IS NULL;