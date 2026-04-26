# Town Data Hub — Project Context

> Auto-loaded by Claude Code on every session. Read this first; it has the workflow + decisions + conventions you'll need to stay consistent.

## What this is

A SaaS for **zoning, permit, ordinance, and contact data** for Bergen County, NJ — scaling to all NJ → tri-state → eventually national. Users: homeowners (one-off project lookups) and construction contractors (recurring multi-town).

Solo-operated. No employees planned. Long-term ambition is a moat built on structured municipal data nobody else has.

## Tech stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + React Query + React Router
- **Backend:** Supabase (Postgres + Deno edge functions). Project ID `htditztshmpzuazyobli` is **owned by Lovable's account**, not the user's — user has no direct dashboard access.
- **Scrape pipeline:** Firecrawl (search + scrape) + Lovable AI Gateway (Gemini Flash) for extraction
- **Hosting:** Vercel (frontend, auto-deploy on push to `main`)

## Deploy workflow — read this carefully

| What | How |
|---|---|
| **Frontend changes** | Edit code → commit → push to `main` → Vercel auto-deploys. **Always confirm before pushing** since push = production. |
| **Supabase migrations** | Write `.sql` file in `supabase/migrations/`, commit, push, then **prompt Lovable** to apply. Lovable's tooling will create a *duplicate migration file with a UUID suffix* — that's normal. After it applies, delete the duplicate from your authored file (keep Lovable's). |
| **Edge functions** | Write/edit in `supabase/functions/<name>/index.ts`, commit, push, then **prompt Lovable** to redeploy. |

**Do NOT suggest:**
- `supabase login` / `supabase db push` / `supabase functions deploy` — the user can't link the project (it's on Lovable's org). The Supabase MCP scoped to the user's RankList org also can't reach this project. CLI flow is dead-end.
- Manual SQL in the Supabase dashboard — user doesn't have access.
- `git push --force` to main without explicit user request.

## Current state (Phase 2a complete, scale-to-Bergen in progress)

✅ **Shipped:**
- `AppLayout` + spacing/text design tokens
- Card/Badge variants + LoadingState/EmptyState primitives
- Color/typography tokens + ESLint rule banning `text-[Npx]` / `p-[Npx]` literals
- Tech debt: typing pass (28→11 `any` errors), lazy routes (914→619 KB main chunk), Tailwind ESM
- All 70 Bergen County NJ municipalities seeded into `towns` (data_status='placeholder')
- `code_platform_index` table + `index-code-platform` edge function — deterministic eCode360 lookup. **527 NJ muni indexed**.
- `discover-town-sources` upgraded: tries platform-index first (1.0 confidence, 0 cost), falls back to Firecrawl Search + AI rank with confidence/reasoning persisted
- `ConfidenceBadge` UI primitive
- **Unified `/admin`** dashboard: KPIs + bulk-discover button + inline review queue with informational checklist + searchable/sortable coverage table

🔜 **Next up (when user is ready):**
1. User runs **"Discover sources for all placeholder towns"** on `/admin` (bulk button) for the 69 remaining Bergen muni
2. User reviews ~28 low-confidence sources in the inline queue (mostly permits/contacts on town websites)
3. First end-to-end ingestion: scrape Paramus's eCode360 → AI extracts zoning rules → user approves in `/admin/data-review` → publishes to public `/town/paramus/zoning`

⏸ **Deferred / planned:**
- Phase 2b: cron-driven auto-pipeline (auto-promote high-confidence)
- Phase 3: monthly `pg_cron` refresh schedule with content-hash diffing
- **Two-pass confidence scoring** — add a "data depth" check post-scrape (right URL ≠ rich data; landing pages can score high-confidence on URL match while having no extractable data)
- **Multi-page crawl** for permits/contacts (Firecrawl `crawl` endpoint vs. single-page `scrape`) — needed because PDFs often live 1-2 clicks deep
- Stripe + tier enforcement
- "Strategic Gap B" audit: verify NLQ, alerts, comparisons, PDF exports, Community Notes actually work end-to-end

## Pricing model (decided, not yet built)

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | Unlimited browsing + basic data + community notes (read) |
| Project Pack | $19 one-time | Custom permit checklist + applicable zoning + PDF export for one project at one address |
| Contractor | $29/seat/mo | All towns in one state + multi-town compare + community notes write |
| + State | +$15/seat/mo | Each additional state |
| Enterprise | $500–2k/mo | API + white-label |

**Don't ship a Homeowner Pro subscription** — homeowners are one-shot users; subscription doesn't fit. Project Pack is their tier.

## Coding conventions

- All pages wrap in `<AppLayout>` (NavBar + main + Footer). Centered cards use `mainClassName="items-center justify-center"`.
- `<CardContent padding="none|xs|sm|md|lg|xl">` — never raw `p-X`.
- `<Badge variant="success|warning|accent|*Solid">` — never inline `bg-success/10 text-success border-0`.
- `<LoadingState>` and `<EmptyState>` — never hand-roll spinners or empty panels.
- `<ConfidenceBadge>` for any source-confidence indicator in admin UI.
- Text: `text-micro` (10px) / `text-caption` (11px) / `text-xs` / `text-sm` / `text-base` / `text-lg` / `text-xl` / `text-2xl` / `text-3xl`. **Never** `text-[Npx]` — ESLint blocks it.
- Color: `text-foreground` / `text-muted-foreground` / `text-foreground-subtle` (the very-faint shade for decorative icons, disabled labels). Color tokens are HSL CSS vars in `src/index.css`. No raw hex in JSX except logo SVGs.
- See `docs/typography.md` for the type-scale role mapping.

## Don't (project-specific gotchas)

- Don't reintroduce `PLAN.md` in the repo. The active plan lives in the Plan view (`~/.claude/plans/...` — local-only). When updating that file, **re-enter plan mode and ExitPlanMode to refresh the side-panel view**, but warn the user first since it can overwrite their inline UI comments.
- Don't run bulk discover/ingest from a phone — browser must stay open the whole time (~12 min for 70 towns).
- Don't add Stripe wiring until pricing-model implementation is on the active plan.
- Don't bulk-approve AI-extracted rows without per-row review yet — confidence-based auto-promotion is Phase 2b.

## Where to find more

- **Active plan (local only):** `C:\Users\balad\.claude\plans\nifty-napping-hejlsberg.md`
- **Memory files (local only):** `C:\Users\balad\.claude\projects\C--Users-balad-Projects-town-data-hub\memory\`
- **GitHub repo:** github.com/firstomega/town-data-hub
- **Recent commits** are the best source of "what shipped recently" — `git log --oneline -20` tells the story.

---

## Phone-friendly backlog (50 ideas)

These are pre-vetted as appropriate for cross-device sessions: small-to-medium scope, mostly frontend, no Lovable coordination needed unless noted. The user can pick any and prompt with just "do #N from the backlog" or describe the task.

### SEO
1. JSON-LD structured data (`Organization`, `Place`) on town profile pages
2. Dynamic `sitemap.xml` covering all 70 town slugs + subpages
3. Per-town `<title>` / `<meta description>` pulled from `town.character` / zoning summary
4. `robots.txt` with sitemap reference; allow `/town/*`, `/guides/*`; block `/admin/*`
5. Canonical URL tags on every public page
6. OpenGraph image generator edge function — town summary share card (NOTE: needs Lovable to deploy edge function)

### Engagement & retention
7. "Recently viewed towns" widget on homepage (localStorage)
8. "Email me when this town updates" capture (works pre-auth)
9. Sticky table-of-contents on long town profile pages
10. "Share this page" button with copy-link + Twitter/LinkedIn pre-fill
11. "Helpful?" thumbs widget on every data row → stores feedback
12. "What's New" changelog page in `/about` showing recent ordinance changes

### Profile & settings
13. Avatar upload to `/settings` (Supabase storage bucket)
14. Granular email notification toggles (drift, weekly digest, comments)
15. Pinned towns (up to 5, separate from saved)
16. "Reset onboarding" link in settings
17. Typed-confirm account deletion flow (type your email)
18. "Member since" badge on profile

### Automated content / blog
19. New `/blog` route + `blog_posts` table (admin write, public read) (NOTE: schema = Lovable migration)
20. Edge function every 3 days drafts an article from recent drift (NOTE: needs Lovable to deploy)
21. Anti-AI prompt rules: no em-dashes, no "delve/leverage/comprehensive", varied sentence length, specific numbers, occasional first-person opinions
22. Article templates: "What changed in Bergen zoning this week", "5 towns adding ADUs", etc.
23. Byline = "The Town Center editorial team" — never reveal AI authorship
24. Auto-post new articles via webhook (Buffer / Twitter / LinkedIn)

### Pricing page & conversion
25. **Update PricingPage to new tier model** (Free / Project Pack $19 / Contractor $29/seat / +$15 per state). Current page still has $3 homeowner. **High priority.**
26. Feature × tier comparison matrix at bottom of PricingPage
27. FAQ section on PricingPage
28. State picker on Contractor tier (shows price as user adds states)
29. "Most Popular" text badge on Contractor tier

### Consistency & polish
30. Page-title audit — enforce `Town Center | <Page>` format everywhere
31. Empty-state audit — grep for bespoke "no results" divs; migrate to `<EmptyState>`
32. Loading-spinner audit — migrate standalone `<Loader2>` instances to `<LoadingState>`
33. Button text capitalization sweep — pick one convention, enforce
34. Heading hierarchy audit — one `<h1>` per page, semantic `<h2>`/`<h3>`

### Competitor-inspired features
35. Free permit-cost-estimator widget on homepage
36. "Find a contractor" directory (start with empty state + waitlist)
37. "Compare us to BuildZoom / Procore / Zonda" comparison page
38. "Permit difficulty score" A/B/C/D rating per town with methodology link

### Data scope expansion (beyond zoning/ordinances)
39. Property tax rates per town (NJ Treasury data) (NOTE: needs Lovable for new edge fn + table)
40. School ratings per town (NJ DOE / GreatSchools)
41. Recent home sales per town (Zillow/Realtor scrape)
42. Crime statistics per town (FBI UCR annual data)
43. Town events calendar (iCal aggregation)

### Trust & social proof
44. "Last verified by admin" timestamp publicly on every data row
45. "Dispute this data" button on every public row → admin review queue
46. "Powered by official sources" footer with publisher logos
47. Testimonials section on homepage (placeholder copy initially)

### Mobile & accessibility
48. Admin mobile audit — `/admin` was desktop-first; tables overflow on small screens
49. Keyboard navigation pass — tab order, focus traps in modals, `:focus-visible` styles
50. Screen reader labels — audit icon-only buttons in admin for missing `aria-label`s

**Notes for picking up an item:**
- Items marked `(NOTE: …Lovable…)` need backend deploy through Lovable — write the code, commit, then the user prompts Lovable to apply.
- All others are pure-frontend and ship via the standard `git push origin main` → Vercel pipeline.
- Verify before pushing: `npm run build` clean + lint count ≤ baseline (11 errors / 9 warnings as of `0dd9e53`).
