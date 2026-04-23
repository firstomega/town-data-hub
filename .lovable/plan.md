

# TownCenter — Prototype → Real Platform

A grounded assessment of where the app stands today and the highest-leverage moves to make it real. **No code changes in this turn** — this is a roadmap. We can pick any slice and execute.

---

## Where the prototype stands

**Strong:** 18 routes, full visual system, 7 town profiles (2 deep + 5 generic), feasibility wizard, glossary, admin dashboard, command palette, notification UI, project detail pages.

**Hollow:** Everything is hardcoded. No auth, no database, no real search, no real AI answers, no real notifications, no real share/save. The Login page has a Google button that does nothing and routes to `/onboarding` regardless of input.

To go from prototype → platform, the work splits into four tracks: **Backend foundation**, **Real data & intelligence**, **UX depth**, and **Trust & security**.

---

## Track 1 — Backend foundation (unblocks everything else)

Enable **Lovable Cloud** (Supabase under the hood). This single move unlocks auth, persistence, search, file storage, edge functions, and AI.

**Schema (initial tables):**
```text
profiles          → id, full_name, user_type (homeowner|contractor), avatar_url
user_roles        → user_id, role (admin|contractor|user)   ← separate table, RLS-safe
towns             → slug, name, county, character, source, last_verified
zones             → town_slug, code, name, setbacks, far, coverage, height, uses[]
permits           → town_slug, name, fee_min, fee_max, timeline, requirements[]
ordinances        → town_slug, category, code, title, summary, updated_at
contacts          → town_slug, dept, phone, email, hours, address, meetings
projects          → user_id, town_slug, address, project_type, zone, status, checklist
saved_towns       → user_id, town_slug
community_notes   → contractor_id, town_slug, body, upvotes, status (pending|approved)
notifications     → user_id, type, title, body, read_at, link
corrections       → user_id, town_slug, section, body, status
contractor_apps   → user_id, business_name, license_no, status
```
RLS on every table. Roles in `user_roles` (never on profiles) — guards against privilege escalation.

---

## Track 2 — Auth & social login (the question you asked)

**Status today:** Not built in. The Login page is a styled shell.

**What Lovable Cloud supports natively:** Email/password, Phone (SMS), **Google**, **Apple**, SSO/SAML.
**Not native:** Facebook, GitHub, Discord (would require connecting external Supabase).

**Recommended default for TownCenter:** Email/password + Google. Apple is a nice-to-have for the iOS audience.

**Required pieces:**
- Wire `LoginPage` to `supabase.auth.signInWithPassword` / `signInWithOAuth({provider: 'google'})`
- Auth state listener in a top-level provider; protected routes for `/dashboard`, `/settings`, `/contractor`, `/admin`, `/project/:id`
- `/reset-password` page (currently missing — without it, password resets silently log users in)
- Profile auto-creation trigger on signup; user_type captured at onboarding
- Enable **HIBP leaked-password check** (one toggle, blocks compromised passwords)
- Session persistence + sign-out in the NavBar dropdown (currently a dead Link)

---

## Track 3 — Real data & intelligence (the moat)

The PRD's whole premise is *trustworthy, current municipal data*. That means:

1. **Migrate hardcoded town data → DB.** `townData.ts` becomes a seed script.
2. **Admin CRUD.** The `/admin` dashboard already has the UI shape — wire it to actually edit zones, permits, ordinances, with audit log + `last_verified` stamps.
3. **Real search.** Replace the fake `/search` page with Postgres full-text search across zones/ordinances/notes; rank by town match first.
4. **Real Natural Language Query.** Replace the hardcoded fence answer with **Lovable AI** (Gemini via the AI Gateway — no key needed). RAG pattern: embed all ordinance text, retrieve top-k chunks per town, ground the answer with citations. Confidence score from retrieval similarity. Log every Q&A for the admin to review low-confidence ones.
5. **Real Feasibility Check.** Today it's a switch on `projectType`. Make it a rules engine that reads the actual zone row + project parameters (sq ft, height) from the form and computes pass/fail per rule.
6. **Notification engine.** Edge function on a cron: when an ordinance row's `updated_at` changes for a town a user has saved → insert a notification + email.
7. **Geocoding.** The address input on onboarding is text-only. Add Mapbox/Google geocoding to resolve address → town slug → zone (zone requires GIS shapefiles per town; start with town-level, add parcel-level later as a premium feature).

---

## Track 4 — UX depth

- **Saved projects actually save** (currently the "Save Project" button is decorative).
- **Share buttons actually copy** real shareable URLs with OG meta tags for link previews.
- **Notification bell** opens a real list, marks read, deep-links to the change.
- **Comparison page** lets you pick towns from the DB instead of hardcoded Ridgewood vs Paramus.
- **Mobile responsiveness** — sidebar collapses, NavBar gets a hamburger drawer (currently desktop-only).
- **Empty/loading/error states** wired to real query states (TanStack Query is already installed but unused).
- **PDF export** for checklists and zone summaries via an edge function (jsPDF or Puppeteer).
- **Contractor verification flow** — license number lookup, manual admin review queue (UI exists, needs DB).

---

## Track 5 — Trust, security & payments

**Security baseline:**
- RLS policies on every table (users see only their projects/notifications; community notes public-read after admin approval)
- Roles in `user_roles` table with a `has_role()` SECURITY DEFINER function (the standard pattern — prevents recursive RLS bugs and privilege escalation)
- Zod validation on every form (address, corrections, notes, profile) — client + edge function
- Rate limiting on the NL Query endpoint (AI cost control + abuse prevention)
- HIBP password check, email verification required before write access
- Sanitize community note content (DOMPurify) — they render contractor-submitted text
- Audit log for admin actions (who edited which ordinance, when)
- HTTPS-only, secure cookies, CSP headers via meta tags

**Payments (Pro plan required):**
The pricing page promises Free / $3 Homeowner / $15 Contractor. To collect real money, enable **Stripe** (recommended over Paddle here — utility/data product, fits Stripe's profile, lets you choose tax handling per session). Webhook → updates a `subscriptions` table → gates premium features (NL Query quota, comparison limits, multi-seat contractor accounts).

---

## Recommended sequence (4 phases)

```text
Phase 1 — Foundation (the unlock)
  Enable Lovable Cloud
  Auth: email + Google + reset-password page + protected routes
  Schema + RLS + user_roles
  Migrate townData.ts → DB seed

Phase 2 — Make the prototype real
  Wire saved towns, projects, community notes, corrections to DB
  Real search (Postgres FTS)
  Real notification center
  Admin CRUD on towns/zones/ordinances

Phase 3 — Intelligence
  Lovable AI for Natural Language Query (RAG with citations)
  Feasibility Check rules engine on real data
  Geocoding on onboarding
  PDF export for checklists

Phase 4 — Revenue & scale
  Stripe payments + subscription gating
  Contractor verification + multi-seat billing
  Notification cron + email digests
  Mobile responsive pass
  Security audit + scan
```

---

## Pick your next move

You don't have to do all four phases at once — and you shouldn't. Tell me which slice to start with and I'll switch to default mode and build it. Good first slices:

- **"Phase 1, all of it"** — the biggest single unlock; everything else compounds on it
- **"Just auth + Google login + reset password"** — smallest real step, immediate user value
- **"Real Natural Language Query with Lovable AI"** — most impressive demo, needs Cloud first
- **"Stripe + paywall the premium tiers"** — if you want to test willingness to pay before more building

