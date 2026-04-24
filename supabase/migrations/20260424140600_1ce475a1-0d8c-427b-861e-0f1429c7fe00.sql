
-- =========== guides ===========
CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text,
  read_time text,
  body text NOT NULL DEFAULT '',
  hero_image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  author text DEFAULT 'TownCenter Team',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides publicly readable" ON public.guides FOR SELECT USING (true);
CREATE POLICY "Admins manage guides" ON public.guides FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER guides_set_updated_at BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========== glossary_terms ===========
CREATE TABLE public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL UNIQUE,
  definition text NOT NULL,
  related text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Glossary publicly readable" ON public.glossary_terms FOR SELECT USING (true);
CREATE POLICY "Admins manage glossary" ON public.glossary_terms FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER glossary_set_updated_at BEFORE UPDATE ON public.glossary_terms
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========== town_sources ===========
CREATE TABLE public.town_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  town_slug text NOT NULL,
  ingestion_type text NOT NULL CHECK (ingestion_type IN ('zones','permits','ordinances','contacts')),
  source_url text NOT NULL,
  source_doc text,
  source_label text,
  notes text,
  discovered_by uuid,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (town_slug, ingestion_type, source_url)
);

ALTER TABLE public.town_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Town sources publicly readable" ON public.town_sources FOR SELECT USING (true);
CREATE POLICY "Admins manage town sources" ON public.town_sources FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER town_sources_set_updated_at BEFORE UPDATE ON public.town_sources
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX idx_town_sources_town_type ON public.town_sources (town_slug, ingestion_type);

-- =========== seed guides ===========
INSERT INTO public.guides (slug, title, description, category, read_time, body) VALUES
('understanding-nj-zoning', 'Understanding NJ Zoning for First-Time Homeowners',
 'A beginner''s guide to zoning districts, setbacks, lot coverage, and why they matter for your home project.',
 'Zoning Basics', '8 min read',
 E'## What Is Zoning and Why Does It Matter?\n\nZoning is the system by which municipalities divide land into different categories — residential, commercial, industrial — and set rules for how property in each zone can be used. In New Jersey, every municipality has its own zoning ordinance, which means the rules can vary significantly from one town to the next, even within the same county.\n\nFor homeowners, zoning matters because it determines what you can and cannot do with your property. Want to build a deck? Your zone''s setback requirements will determine how close it can be to your property line. Thinking about an addition? Lot coverage limits may restrict how much of your lot can be covered by structures.\n\n## Key Zoning Terms You Should Know\n\n**Setback:** The minimum distance a structure must be from a property line. There are typically three types: front, side, and rear. In Bergen County, front setbacks commonly range from 25 to 50 feet for residential zones.\n\n**Lot Coverage:** The percentage of your lot that can be covered by structures. Most residential zones in Bergen County cap lot coverage between 20% and 35%.\n\n**FAR (Floor Area Ratio):** The ratio of a building''s total floor area to the lot size. A FAR of 0.30 on a 10,000 sq ft lot means you can build up to 3,000 sq ft of total floor area.\n\n## How Zoning Works in Bergen County\n\nBergen County has 70 municipalities, each with its own zoning code. This means a project that''s perfectly legal in Paramus might require a variance in Ridgewood, or vice versa. Common residential zone designations include R-1, R-2, and R-3.\n\n## What to Do If Your Project Doesn''t Comply\n\nIf your project doesn''t meet the zoning requirements, you may need to apply for a variance. There are two main types in NJ: a **"c" variance (bulk variance)** for dimensional deviations, and a **"d" variance (use variance)** for using property in a way not permitted in the zone.'),
('setback-rules-bergen-county', 'How Setback Rules Work in Bergen County',
 'Learn what setbacks are, how they''re measured, and what to do if your project doesn''t comply.',
 'Zoning Basics', '6 min read',
 '## What is a setback?\n\nA setback is the minimum required distance between a structure and a property line. Bergen County towns typically define front, side, and rear setbacks separately by zone.\n\n## How they''re measured\n\nSetbacks are measured perpendicularly from the property line to the nearest part of the structure (including overhangs in some towns).\n\n## Common values\n\n- Front: 25–50 ft\n- Side: 8–15 ft\n- Rear: 20–40 ft\n\nCheck your specific zone on TownCenter for the exact numbers.\n\n## When you don''t comply\n\nApply for a "C" variance with the Zoning Board of Adjustment.'),
('adu-rules-nj', 'ADU Rules in New Jersey: A Town-by-Town Guide',
 'Accessory dwelling units are now permitted in many NJ towns. Here''s what you need to know.',
 'ADUs', '10 min read',
 '## What is an ADU?\n\nAn accessory dwelling unit (ADU) is a secondary residential unit on a single-family lot. Examples include basement apartments, garage conversions, and detached cottages.\n\n## NJ landscape\n\nADU rules vary dramatically. Some towns now permit ADUs as of right in residential zones; others still require a use variance.\n\nUse the town profile pages on TownCenter to see ADU status for your municipality.'),
('building-a-deck-nj', 'What to Know Before Building a Deck in NJ',
 'Permits, setbacks, coverage limits, and the step-by-step process for deck construction in Bergen County.',
 'Projects', '7 min read',
 '## Before you build\n\n1. Confirm your zone and setback requirements\n2. Calculate impact on lot coverage\n3. Check height limits (usually 4 ft above grade without variance)\n\n## Permits\n\nMost NJ towns require a zoning permit for any deck and a building permit for decks over 200 sq ft or over 30 inches above grade.\n\n## Inspections\n\nPlan for foundation, framing, and final inspections.'),
('variance-process-explained', 'The Variance Process Explained: "C" vs "D" Variances',
 'When you need a variance, what type to apply for, and how to navigate the Board of Adjustment process.',
 'Variances', '9 min read',
 '## C variance (bulk)\n\nFor dimensional deviations: setbacks, height, lot coverage. Easier to obtain.\n\n## D variance (use)\n\nFor using property in a way not permitted in the zone. Higher burden of proof.\n\n## Board of Adjustment\n\nApplications are heard at public hearings. You''ll need to notice neighbors and present evidence.'),
('permit-timelines-bergen-county', 'Permit Timelines: What to Expect in Bergen County',
 'Average turnaround times for building, zoning, and demolition permits across Bergen County towns.',
 'Permits', '5 min read',
 '## Typical timelines\n\n- Zoning permit: 1–3 weeks\n- Building permit: 3–6 weeks\n- Demolition permit: 2–4 weeks\n\nTimelines vary by town and project complexity. Check the per-town permits page on TownCenter for current estimates.');

-- =========== seed glossary_terms ===========
INSERT INTO public.glossary_terms (term, definition, related) VALUES
('Setback', 'The minimum required distance between a structure and a property line (front, side, or rear). Setbacks vary by zone and are designed to ensure adequate light, air, and open space between buildings.', ARRAY['Yard','Lot Coverage']),
('Floor Area Ratio (FAR)', 'The ratio of a building''s total floor area to the size of the lot on which it is built. A FAR of 0.35 on a 10,000 sq ft lot means the maximum floor area is 3,500 sq ft.', ARRAY['Lot Coverage','Bulk Requirements']),
('Lot Coverage', 'The percentage of a lot that is covered by buildings and impervious surfaces. Maximum lot coverage limits are set by the zoning ordinance for each zone district.', ARRAY['FAR','Impervious Coverage']),
('Impervious Coverage', 'The total area of surfaces that do not absorb water, including buildings, driveways, patios, and walkways. Many towns set a maximum impervious coverage percentage to manage stormwater runoff.', ARRAY['Lot Coverage','Stormwater Management']),
('Variance', 'Permission to depart from the literal requirements of a zoning ordinance. There are two main types: ''C'' variances (bulk/area) and ''D'' variances (use). Variances are granted by the Zoning Board of Adjustment.', ARRAY['C Variance','D Variance','Board of Adjustment']),
('C Variance (Bulk Variance)', 'A variance that allows deviation from dimensional or physical requirements like setbacks, height limits, lot coverage, or lot size. Requires showing that strict compliance would cause undue hardship.', ARRAY['Variance','Setback','Bulk Requirements']),
('D Variance (Use Variance)', 'A variance that allows a use not otherwise permitted in a particular zone. Requires a higher burden of proof than a C variance, including showing special reasons and that the variance can be granted without substantial detriment to the public good.', ARRAY['Variance','Permitted Use']),
('Permitted Use', 'A land use that is allowed as of right in a particular zoning district without need for special approval. Examples include single-family homes in residential zones.', ARRAY['Conditional Use','D Variance']),
('Conditional Use', 'A use that is allowed in a zone only if specific conditions are met, such as site plan approval, buffering, or parking requirements. Requires Planning Board approval.', ARRAY['Permitted Use','Site Plan']),
('Nonconforming Use', 'A land use that was legal when established but no longer conforms to current zoning regulations. Nonconforming uses are generally allowed to continue but cannot be expanded.', ARRAY['Variance','Grandfathered']),
('Accessory Dwelling Unit (ADU)', 'A secondary residential unit on a single-family lot, such as a basement apartment, garage conversion, or detached cottage. ADU regulations vary significantly by municipality in New Jersey.', ARRAY['Permitted Use','Conditional Use']),
('Site Plan', 'A detailed plan showing the proposed development of a property, including buildings, parking, landscaping, drainage, and utilities. Required for most commercial and multi-family development.', ARRAY['Planning Board','Conditional Use']),
('Board of Adjustment', 'A municipal board that hears and decides applications for variances and certain appeals of zoning determinations. Also known as the Zoning Board of Adjustment (ZBA).', ARRAY['Variance','C Variance','D Variance']),
('Planning Board', 'A municipal board responsible for reviewing site plans, subdivisions, and conditional use applications. Also maintains and updates the municipal Master Plan.', ARRAY['Site Plan','Subdivision','Master Plan']),
('Master Plan', 'A comprehensive long-range plan for the physical development of a municipality. The zoning ordinance must be substantially consistent with the Master Plan.', ARRAY['Planning Board','Zoning Ordinance']),
('Bulk Requirements', 'The set of dimensional standards in a zoning ordinance including lot size, lot width, setbacks, building height, FAR, and lot coverage. Also called ''area'' or ''dimensional'' requirements.', ARRAY['Setback','FAR','Lot Coverage','C Variance']),
('Certificate of Occupancy (CO)', 'An official document issued after final inspection confirming that a building complies with all applicable codes and is safe for occupancy. Required before moving into a new or renovated structure.', ARRAY['Building Permit','Inspection']),
('Subdivision', 'The division of a lot or parcel into two or more lots. Requires Planning Board approval and must comply with lot size and frontage requirements of the zone.', ARRAY['Planning Board','Lot Size']);
