

# Fake-Data Audit + Prioritized Cleanup Plan

## Volatility scale (1 = never changes, 5 = changes constantly)

```text
1 — Static reference (legal definitions, "About" copy)
2 — Curated content (guide articles, glossary entries, pricing tiers)
3 — Per-town official data (zoning, permits, ordinances, contacts)
4 — User-generated state (saved towns, projects, checklists, profile)
5 — Live signals (search queries, ordinance change feed, analytics, activity logs)
```

## The full audit, ranked by user-impact priority

| # | Page / Route | Status today | Volatility | Real source of truth | Fix approach |
|---|---|---|---|---|---|
| 1 | **Town Profile** — `/town/:slug` (Overview + Zoning + Permits + Ordinances + Contacts) | All 7 towns flagged `placeholder`. Pages already read from DB but DB is empty for 6 towns and partial for 1. Old hardcoded `Paramus*.tsx` / `Town*.tsx` files still exist as dead routes. | **3** | Ingestion pipeline (already built) | Use `/admin/data-review` to scrape + approve. Delete the 11 dead `Paramus*` / `Town*` page files. |
| 2 | **Homepage** — `/` | "Bergen County, NJ — Now Live" badge implies coverage we don't have. Quick-pill testimonials and "Always Current — within 30 days" are unverified marketing claims. | **2** | DB `towns` table for counts; testimonials need real users | Replace town count + "ready" badges with live counts from `towns` table filtered by `data_status='verified'`. Mark testimonials as "Sample" or remove until we have real ones. Soften "30 days" claim to "Refreshed weekly + on-demand." |
| 3 | **Dashboard** — `/dashboard` | Hardcoded "Welcome back, John", fake savedTowns, fake activeProjects, fake "Recent Ordinance Changes." | **4** (user state) / **5** (changes feed) | `auth.user`, `saved_towns`, `projects`, `data_drifts` tables | Wire to real auth user name. Read `saved_towns` + `projects` for current user. Replace hardcoded "Recent Changes" with live `data_drifts` rows where `status='applied'`. Empty states for new users. |
| 4 | **Search Results** — `/search` | `townResults`, `zoningResults`, `noteResults` all hardcoded — search box doesn't actually search. | **5** | Postgres full-text on `towns`, `zones`, `ordinances` | Build real search: `ilike` across `towns.name`, `zones.name/code/description`, `ordinances.title/summary`, scoped to `confidence != 'placeholder'`. Empty state when no matches. |
| 5 | **Query / Ask** — `/query` | Pre-filled question with hardcoded AI answer about Ridgewood R-1 fences. Looks authoritative — dangerous. | **5** | Lovable AI + RAG over `zones`/`ordinances` | Wire to a real edge function: take user question, embed-search the relevant town's rows, send to Gemini with strict "only answer from provided context" prompt. Show source citations. Until built, gate behind "Coming soon." |
| 6 | **Comparison** — `/compare` | Hardcoded Ridgewood vs Paramus rule values. Town selectors don't change anything. | **3** | `zones` + `permits` tables | Make selectors driven by `useAllTowns()`. Pull rows from `zones` for chosen towns and render side-by-side. Hide rows where either side is `placeholder`. |
| 7 | **Project Detail** — `/project/:id` | Hardcoded `projects` array of 3 fake projects — ignores route id. | **4** | `projects` table | Fetch project by id from DB scoped to `auth.uid()`. Pull rules from `zones` matching the project's town+zone. 404 on miss. |
| 8 | **Checklist** — `/checklist` | Hardcoded "Deck at 123 Oak St, Ridgewood" with fixed permits + documents list. | **3** (permits/town) / **4** (saved instance) | `permits` table per town + project type taxonomy | Accept `?town=&type=` params; fetch matching permits from DB; allow "Save This Project" → insert into `projects`. |
| 9 | **Feasibility Check** — `/feasibility` | `mockResults` keyed by project type — pretends to evaluate against real lot/zone data. | **3** | `zones` rows for chosen town | Make form actually read the chosen town's zone rules from DB and run real comparisons (setback, coverage, height). Until that logic is built, label results "Illustrative — not a binding decision." |
| 10 | **Contractor Dashboard** — `/contractor` | Fake serviceTowns, ruleVariations, projects, team members, community notes. | **4** (own data) / **3** (rules) | `saved_towns` (multi), `projects` filtered by user, `zones` for rule grid | Wire serviceTowns to user's `saved_towns`. Pull real projects. Replace ruleVariations with live `zones` query across saved towns. Hide team/community-notes blocks until those features are real. |
| 11 | **Admin Dashboard** — `/admin` | Fake user counts (1,247 users, MRR, churn), fake moderationQueue, fake verificationQueue, fake activityLog, fake signup chart, hardcoded "Data Completeness" town list. | **5** | `auth.users`, `data_corrections`, `towns.data_status`, `ingestion_runs` | Replace stats with live counts (`auth.users`, role counts, drift queue size). Wire moderationQueue to `data_corrections WHERE status='pending'`. Wire Data Completeness to live `towns` + COUNT of verified rows. Hide MRR/churn/contractor verification until billing + a contractor-application table exist. Drop the fake bar chart for now. |
| 12 | **Onboarding** — `/onboarding` | Hardcoded list of 20 Bergen towns; selections aren't saved. | **2** (town list) / **4** (selection) | `towns` table; `saved_towns` insert | Pull town list from `towns`. On finish, insert chosen towns into `saved_towns` for current user, then redirect to `/dashboard`. |
| 13 | **Settings** — `/settings` | "John Doe / john@example.com" hardcoded; saved towns hardcoded; toggles do nothing. | **4** | `auth.user`, `profiles`, `saved_towns` | Read+write profile from DB. Render saved towns from `saved_towns`. Wire delete + notification toggles. |
| 14 | **Guides Index** — `/guides` | 6 hardcoded guide cards. | **2** | `guides` table (new) | Create lightweight `guides` table (slug, title, category, read_time, body, published_at). List from DB. |
| 15 | **Guide Detail** — `/guides/:slug` | Ignores `:slug` — always shows the same hardcoded "Understanding NJ Zoning" article. | **1** per article / **2** for the set | `guides.body` | Fetch by slug, render markdown body, 404 on miss. |
| 16 | **Glossary** — `/glossary` | 18 hardcoded terms. Definitions are mostly correct but unverified. | **1** | `glossary_terms` table (new) | Move to DB so admins can edit without a deploy. Low urgency. |
| 17 | **Pricing** — `/pricing` | Hardcoded tiers + features. | **2** | Code is fine until billing is wired | Leave as-is. Revisit when Stripe/Paddle is added. |
| 18 | **About / Terms** — `/about`, `/terms` | Static marketing/legal copy. | **1** | N/A | Leave as-is. |
| 19 | **Login / Reset / NotFound / Index** | No fake data. | — | — | No action. |
| 20 | **Dead duplicate town pages** — `ParamusOverview`, `ParamusZoning`, `ParamusPermits`, `ParamusOrdinances`, `ParamusContacts`, `TownOverview`, `TownZoning`, `TownPermits`, `TownOrdinances`, `TownContacts`, `TownStubPage` | Not routed in `App.tsx` but still in repo, full of hardcoded fiction. | — | **Delete all 11 files** + remove `src/data/townData.ts` and `src/data/towns.ts` if unused. |

## Recommended execution order (4 slices)

**Slice A — Stop the bleeding (highest user-trust impact)**
- Items 1, 4, 5, 6 — anything a logged-out visitor sees that *looks* authoritative but isn't.
- Delete dead duplicate town pages (#20).
- Soften homepage marketing claims (#2).

**Slice B — Make the logged-in experience real**
- Items 3, 7, 8, 12, 13 — Dashboard, Project Detail, Checklist, Onboarding, Settings all read/write real per-user data.

**Slice C — Make admin real**
- Item 11 — Admin Dashboard wired to live counts + queues. Pairs naturally with the Phase 3 work just shipped.

**Slice D — Content polish**
- Items 9, 10, 14, 15, 16 — Feasibility, Contractor, Guides, Glossary moved to DB-backed content.

## Key trade-off

Slices A + B together are ~70% of perceived trust improvement. Slice C is mostly for you. Slice D can wait — those pages are low-traffic and the fake content there is least misleading.

## Suggested next move

Approve **Slice A** as a single build. I'll delete the 11 dead duplicate town pages, wire real search, kill the hardcoded AI answer on `/query` (gate it behind "Coming soon"), make `/compare` driven by real DB selectors, and replace homepage marketing fiction with live counts.

