# Mobile Session Handoff — 2026-04-26

> **Read this first if you're picking up after the phone session.** Captures what shipped, what got deferred, and what to consider next. Branch: `claude/select-mobile-priority-SjSfM` (2 commits ahead of `main`, not yet merged).

---

## What shipped (on this branch)

### Commit `d91b7b2` — Pricing page modernization

Closes backlog items **#25, #26, #27, #28, #29** from CLAUDE.md.

- Replaced the old `Homeowner $3/$29 + Contractor $15/$144` tier model with the decided model: **Free / Project Pack $19 one-time / Contractor $29/seat/mo + $15/seat/mo per additional state**.
- Added a `kind: "free" | "one-time" | "subscription"` discriminator on each tier — price-rendering branches on it instead of brittle name/price checks.
- Live state-add-on stepper on the Contractor card (`MapPin` icon, mirrors the existing Seats stepper). Total-line arithmetic: `(base + (states-1) × addOn) × seats`.
- "Most Popular" badge moved from the deleted Homeowner tier to Contractor.
- Added a **Feature × Tier comparison matrix** (`comparisonMatrix` const) below the cards, mobile-scrollable via `overflow-x-auto`.
- Updated FAQ copy: dropped 14-day trial item, added Project Pack / multi-state / upgrade-credit answers.
- CTAs updated: `"Buy Project Pack"`, `"Start Contractor"`.
- File touched: **only** `src/pages/PricingPage.tsx` (+176 / -51).

### Commit `a2790ae` — Title Case sweep across all buttons

Closes backlog item **#33**.

- Audited all 80 `<Button>` instances in `src/pages/` and `src/components/` (skipped `src/components/ui/` primitives).
- Found 66 already Title Case, 11 sentence case, 13 single-word, 15 dynamic. Picked **Title Case as the universal convention** (lowest-risk, matches existing majority).
- Fixed 12 button labels across 5 files:
  - `Dashboard.tsx`: "Add your first town" → "Add Your First Town"; "Create a checklist" → "Create a Checklist"
  - `ContractorDashboard.tsx`: "Sign in" → "Sign In"; "Add towns" → "Add Towns"
  - `HomeownerDashboard.tsx`: "Set my home", "Edit home", "Town profile", "Check a project", "View all", "All ordinances" → all retitled
  - `HomePage.tsx`: "Learn more" → "Learn More"
  - `NotificationCenter.tsx`: "Mark all read" → "Mark All Read"
- Convention to enforce going forward: **Title Case for every button label**, regardless of variant. Articles (a/an/the) stay lowercase per AP rules — see "Create a Checklist".

### Verification (both commits)

- `npm run build`: clean. Main chunk **619.83 KB** = unchanged from the `0dd9e53` baseline noted in CLAUDE.md.
- `npm run lint`: **11 errors / 9 warnings = baseline**. No new errors introduced; all 11 pre-existing in unrelated files (`Dashboard.tsx`, `textarea.tsx`, supabase functions).

---

## Decisions discussed (no code yet)

### SEO bundle (backlog #1–#6)

**Decision: defer most of it until the domain is purchased.** SEO splits cleanly into:

| Item | Domain-dependent? | Status |
|---|---|---|
| #2 Sitemap | yes | wait |
| #5 Canonical tags | yes | wait |
| #1 JSON-LD | yes (embeds domain in `Organization` schema) | wait |
| #6 OG image generator | yes + needs Lovable | wait |
| #3 Per-page `<title>` + `<meta description>` | **no** | shippable anytime |
| #4 `robots.txt` cleanup (block `/admin/`) | **no** | shippable anytime |

**The reason for waiting**: indexing on a `*.vercel.app` URL gets discarded when a real domain comes online. Buying the domain first lets all six items ship as one compounding push — sitemap entries get indexed against the real URL on day one.

**Plumbing note for whenever this lands**: #1, #3, #5 all share the same prerequisite — install `react-helmet-async` and wrap `App` with `<HelmetProvider>` in `main.tsx`. Once that's in, each item is ~10 lines per route. Per-town titles/descriptions can pull from `town.name` and `town.character` (already exists in the `towns` schema).

**Sitemap source-of-truth question (decide later)**: towns live only in the DB, so the build-time sitemap needs either (a) a hardcoded slug list mirrored in `src/lib/townSlugs.ts` (simplest, needs manual sync), or (b) a build-time Supabase fetch from a Node script. Recommend (a) for now — the 72 Bergen slugs are stable until you expand counties.

### Permit Difficulty Score (#38) — deferred, blocked on data

**Decision: don't ship until first ~10 towns are ingested.** The score depends on per-town permit fees + permit counts + zoning complexity. Audit confirmed:

- 0 real `permits` rows in the DB today (only schema exists)
- 0 real `zones` rows
- All 72 towns at `data_status = 'placeholder'`

If we ship #38 now, every town shows "Insufficient data" — looks broken. Plus CLAUDE.md flags this one as PR-controversial; needs defensible data behind every grade before launch. Re-evaluate after Paramus + a few more towns complete the ingestion pipeline.

### Stock images / visual warmth — recon offered, not done

**Observation**: `HomePage.tsx`, `AboutPage.tsx`, `PricingPage.tsx` contain **zero `<img>` tags**. The marketing surface is text-only.

**Recommended candidate spots** (based on a structural read of `HomePage.tsx`):

1. Hero section (line 51, currently a wall of text on bg-primary)
2. Each value-prop card (lines 158-174, 4 cards, currently icon-only)
3. About page founder photo (huge trust lift for a solo SaaS)
4. Town profile pages (small photo of town hall or streetview)
5. Empty states (currently friendly text, visually flat)
6. The deleted Homeowner tier card area on Pricing — now that the layout breathes more, hero imagery on Pricing is an option

**Still to decide before wiring images in**:
- Source: Unsplash/Pexels (free, generic), hired designer (~$200-500, custom illustrations, best long-term), or AI-generated (Midjourney/Ideogram, $10-30/mo, consistent illustrated style)
- Tone: photographic (NJ town halls, construction sites, contractors) vs illustrated mascot
- Recommendation from this session: **photographic** — for a regulatory-data SaaS, photos make the data feel real and local. Compare Niche.com's town pages.

A real recon doc identifying every image hole with dimensions + `alt` text was offered as the next mobile task but wasn't started. Easy ~15-min phone task whenever you want it.

### Blog hosting — decided: self-host

**Decision: self-host on `/blog` subpath. Don't use Medium/Substack/LinkedIn Articles.**

The single right answer for Town Center specifically:

- The whole moat thesis is "structured municipal data nobody else has" — that compounds via SEO authority on `towncenter.com`
- Authority on the blog subpath directly lifts the ranking of `towncenter.com/town/paramus/zoning` (Google treats authority as domain-wide)
- Medium/Substack would actively transfer that authority to *their* domain — opposite of what's wanted
- This matches CLAUDE.md backlog #19-24 ("New `/blog` route + `blog_posts` table" + auto-generated drift articles + anti-AI-detection rules + editorial byline + social syndication)

**Distribution play to do later**: publish primary on `/blog`, then syndicate select posts to Medium/LinkedIn 1-2 weeks later with a `<link rel="canonical">` pointing back to your post. SEO juice stays with you; their audience pulls in readers.

---

## Backlog items still mobile-friendly + worth picking next

Ordered by impact-per-mobile-effort. All pure frontend, no Lovable needed.

1. **#7 Recently-viewed towns widget** — localStorage, self-contained component on HomePage. Visible new feature (retention lever).
2. **#10 Pre-filled Twitter/LinkedIn share** — extend the existing copy-link Share2 button on town pages with `twitter.com/intent/tweet?text=...` and `linkedin.com/sharing/share-offsite?url=...`. Tiny.
3. **#31 + #32 Loading/Empty primitive audit** — 13 raw `<Loader2>` files + 3 hand-rolled empty states confirmed. Mechanical.
4. **#3 + #4 SEO partials** — see above, can ship even without a domain.
5. **Image recon doc** — see above, ~15 min phone task.

## Items that need *desktop + Lovable* coordination (not mobile)

- #6 OG image generator (edge function deploy)
- #19-24 Blog system (DB migration + edge function)
- #39 Property tax rates (DB migration + edge function)
- #40 School ratings (likely external API + DB)
- #8 Email capture for town updates (DB table + RLS)

## Items that should wait on data

- #38 Permit Difficulty Score (waits on ingestion of 10+ towns)
- #11 "Helpful?" thumbs widget (DB table; less urgent)
- #45 Dispute-this-data button (depends on real public data being live)

---

## Open questions for the next desktop session

1. **Buy a domain.** Triggers the SEO bundle (#1, #2, #5, #6) and lets per-page titles/descriptions ship with full effect.
2. **Pick an image source** (Unsplash / designer / AI). Then commission/source ~6-10 images for the spots called out above.
3. **When's Paramus going through end-to-end ingestion?** That unblocks #38 + the per-town JSON-LD + makes the "Permit Difficulty Score" methodology page worth writing.
4. **Pricing CTAs** currently route to nothing — they're visual-only. Wiring `Buy Project Pack` and `Start Contractor` to checkout flows is the real next pricing milestone, but that's the start of Stripe wiring (CLAUDE.md flags this as gated on the now-complete pricing page update).
5. **Merge this branch.** Two clean commits, build passes, lint at baseline. Either merge to `main` (Vercel auto-deploys) or open a PR for review first.

---

## Quick reference — branch state

```
$ git log --oneline main..claude/select-mobile-priority-SjSfM
a2790ae Title Case sweep across all button labels
d91b7b2 Modernize PricingPage to Free / Project Pack $19 / Contractor $29 model
```

Both commits are pushed to `origin`. No PR opened. No `main` merge.
