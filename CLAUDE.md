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

## Phone-friendly backlog (50 ideas, with full rationale)

Pre-vetted for cross-device sessions: small-to-medium scope, mostly frontend, no Lovable coordination needed unless flagged.

**How to pick one:** prompt with "do #N" or describe the task. Each item has:
- **What** — the concrete change
- **Why** — the rationale
- **Risk** — what happens if you skip it
- **💰** — revenue impact tier (🟢 direct / 🟡 strong indirect / 🔵 weak indirect / ⚪ none)

**Verify before pushing:** `npm run build` clean + lint count ≤ baseline (11 errors / 9 warnings as of `0dd9e53`).

### SEO

**1. JSON-LD structured data on town pages**
- What: Schema.org markup (`Organization`, `Place`) on town profile pages
- Why: Google shows rich snippets — bigger SERP footprint
- Risk: Compete on plain blue links against rivals with enhanced listings
- 💰 🟡 Indirect SEO lift, feeds organic → Free → Project Pack funnel

**2. Dynamic `sitemap.xml`**
- What: Auto-generated XML listing all 70 town slugs + each section page
- Why: Google can't index pages it doesn't know exist
- Risk: Most of your 70 town pages stay invisible to Google indefinitely
- 💰 🟡 Foundational for SEO; potentially the biggest organic-traffic unlock

**3. Per-town `<title>` and `<meta description>`**
- What: Unique titles/descriptions per town pulled from `town.character` or zoning summary
- Why: Identical/generic meta = Google deduplicates and ranks only one
- Risk: 70 town pages compete with each other for the same search rank
- 💰 🟡 Each town then ranks for "<town> zoning"/"permits" long-tail queries

**4. `robots.txt` with crawl directives**
- What: Allow `/town/*`, `/guides/*`; block `/admin/*`
- Why: Stops Google from indexing admin pages (security + crawl budget)
- Risk: Admin URLs leak into search results
- 💰 🔵 Hygiene more than revenue

**5. Canonical URL tags**
- What: `<link rel="canonical">` on every public page
- Why: Trailing-slash and `?utm=` variants don't dilute ranking
- Risk: SEO ranking diluted across URL variants
- 💰 🔵 Hygiene

**6. OpenGraph image generator edge function** *(Lovable for deploy)*
- What: Dynamic share-card image per town (logo + name + key stats)
- Why: Social shares look professional vs broken/generic
- Risk: Twitter/LinkedIn shares get unstyled fallback → fewer clicks
- 💰 🟡 Each shared link's CTR ~3× higher with proper OG image

### Engagement & retention

**7. "Recently viewed towns" widget on homepage**
- What: localStorage-based history shown on `/`
- Why: Brings repeat visitors back to where they left
- Risk: Users forget the URL of a town they were researching, never return
- 💰 🟡 Retention lever — every return visit increases conversion probability

**8. Email-capture for town updates (pre-auth)**
- What: "Email me when this changes" form on every town page
- Why: Captures interested users before signup friction
- Risk: Hot leads bounce with no way to re-engage them
- 💰 🟢 Owned email list = direct future revenue (industry avg $36 per $1)

**9. Sticky table-of-contents on town profile pages**
- What: In-page nav that follows the scroll
- Why: Long pages otherwise feel daunting
- Risk: Users bounce before reaching the section they need
- 💰 🔵 Reduces bounce, modest engagement lift

**10. Share buttons (copy-link + Twitter/LinkedIn pre-fill)**
- What: One-click share with pre-written text per town
- Why: Removes friction from organic distribution
- Risk: Zero shares; pure paid acquisition only
- 💰 🟡 Each share averages ~3-5 new visitors

**11. "Helpful?" thumbs widget on every data row**
- What: 👍/👎 + optional comment, stored for admin review
- Why: User feedback signal beats no signal
- Risk: Bad data persists because nobody knows it's bad
- 💰 🔵 Long-term data quality moat

**12. "What's New" changelog page**
- What: `/about/whats-new` showing recent ordinance changes detected
- Why: Shows the system is alive + SEO content
- Risk: Product feels static; nothing for content marketers to link to
- 💰 🔵 Trust signal

### Profile & settings

**13. Avatar upload**
- What: Supabase storage bucket + upload UI in `/settings`
- Why: Personalization
- Risk: Generic
- 💰 ⚪

**14. Granular email notification preferences**
- What: Separate toggles for drift alerts, weekly digest, comments
- Why: Users get the emails they want, opt out of the ones they don't
- Risk: One-bad-email triggers full unsubscribe → lose channel forever
- 💰 🟡 Protects email deliverability and the entire channel's value

**15. Pinned towns (separate from saved)**
- What: Up to 5 towns featured prominently on dashboard
- Why: Contractors operate in 2-5 active markets; needs fast access
- Risk: Contractors can't manage portfolio in the tool
- 💰 🟡 Contractor stickiness — directly affects retention of paid users

**16. "Reset onboarding" link in settings**
- What: Re-trigger the welcome flow
- Why: Useful for users who skipped or want to redo
- Risk: Minor
- 💰 ⚪

**17. Typed-confirm account deletion**
- What: User must type their email to delete (currently single-click)
- Why: Prevents accidental destruction
- Risk: One angry support ticket from accidental deletion → reputation damage
- 💰 🔵 Churn defense

**18. "Member since" date on profile**
- What: Badge showing account age
- Why: Trust + slight gamification
- Risk: Minor
- 💰 ⚪

### Automated content / blog

**19. New `/blog` route + `blog_posts` table** *(Lovable for migration)*
- What: Public blog with admin-write/public-read schema
- Why: Foundation for #20-24
- Risk: No platform for content marketing
- 💰 🟡 Foundation for the SEO-content engine

**20. Edge function: every 3 days, draft a new article** *(Lovable for deploy)*
- What: Cron-driven generation from recent drift in `data_drifts`
- Why: Cheapest possible content marketing
- Risk: Stagnant content → search traffic decays
- 💰 🟢 Content-driven SEO is the lowest-CAC channel

**21. Anti-AI-detection prompt rules**
- What: Prompt rules to avoid em-dashes, "delve/leverage/comprehensive", vary sentence length, first-person opinions, specific numbers
- Why: Google's helpful-content updates penalize obvious AI content
- Risk: All generated articles get de-ranked or de-indexed
- 💰 🟢 Preserves the value of #20

**22. Article topic templates**
- What: Pre-defined formats — "What changed", "5 towns adding X", "Why Y just changed"
- Why: Variety + on-topic relevance
- Risk: Random off-topic articles
- 💰 🟢 Multiplies the SEO value of #20

**23. "The Town Center editorial team" byline**
- What: Human-attributed author, never reveal AI
- Why: Google's E-E-A-T evaluation
- Risk: Disclosed AI authorship triggers de-ranking
- 💰 🟢 Required to make #20 actually work

**24. Auto-post new articles to social**
- What: Webhook to Buffer / X / LinkedIn on publish
- Why: Distribution multiplies content value
- Risk: Articles publish to nobody
- 💰 🟡 Supports #20-23 reach

### Pricing page & conversion

**25. ⚠️ Update PricingPage to new tier model**
- What: Replace current $3/$15 with Free / Project Pack $19 / Contractor $29 / +$15 per state
- Why: Page currently misrepresents your business
- Risk: Users sign up at expected old price → churn / refund / bad reviews
- 💰 🟢 **CRITICAL** — must precede any Stripe wiring

**26. Feature × tier comparison matrix**
- What: Table showing which features are in which tier
- Why: Decision aid for fence-sitters
- Risk: Confused prospects don't pick a tier
- 💰 🟢 Direct conversion aid

**27. FAQ section on PricingPage**
- What: Pre-empt "Can I cancel?" / "What's a Project Pack?" / "How fresh is data?"
- Why: Each unanswered objection = lost conversion
- Risk: Fence-sitters churn at the page
- 💰 🟡 Conversion lift on paid signup

**28. Interactive state picker on Contractor tier**
- What: Toggle states; price updates live
- Why: Shows multi-state value visually
- Risk: Contractors don't realize multi-state is even possible
- 💰 🟢 Drives state add-ons (highest-margin upsell)

**29. "Most Popular" text badge on Contractor tier**
- What: Prominent visual nudge
- Why: Anchor effect — most users default to "most popular"
- Risk: Even split across tiers; lower ARPU
- 💰 🟡 Steers users to the right tier for them

### Consistency & polish

**30. Page-title audit (`Town Center | <Page>` format)**
- What: Enforce one consistent title format across all pages
- Why: Browser tabs, bookmarks, SEO
- Risk: Looks unprofessional
- 💰 🔵

**31. Empty-state primitive audit**
- What: Find any bespoke "no results" divs and migrate to `<EmptyState>`
- Why: Visual consistency = perceived quality
- Risk: Some pages feel broken
- 💰 🔵

**32. Loading-spinner primitive audit**
- What: Find standalone `<Loader2>` and migrate to `<LoadingState>`
- Why: Same as #31
- Risk: Same
- 💰 🔵

**33. Button text capitalization sweep**
- What: Pick one convention (Title for primary / sentence for secondary), enforce
- Why: Polish
- Risk: Looks amateur
- 💰 🔵

**34. Heading hierarchy audit (h1 → h2 → h3)**
- What: One `<h1>` per page; semantic nesting
- Why: SEO + screen readers
- Risk: SEO penalty + a11y violation
- 💰 🟡 SEO bonus + a11y compliance

### Competitor-inspired features

**35. Free permit cost estimator on homepage**
- What: Interactive widget — pick town + project type → estimated fees
- Why: BuildZoom built businesses on this single tool
- Risk: Lose top-of-funnel traffic to competitors
- 💰 🟢 Top-of-funnel lead magnet

**36. "Find a contractor" directory (start with empty state)**
- What: Marketplace stub — "Be among the first listed" for contractors
- Why: Two-sided value
- Risk: Lose the transactional revenue layer
- 💰 🟢 Potential transaction revenue (referral fees, premium listings)

**37. "Town Center vs BuildZoom / Procore" comparison pages**
- What: Honest side-by-side feature/price comparisons
- Why: Captures "X vs Y" search intent
- Risk: Lose comparison searches to competitor-authored content
- 💰 🟡 High-intent SEO traffic

**38. "Permit Difficulty Score" (A/B/C/D) per town**
- What: Heuristic rating based on avg fees + # permits + zoning complexity
- Why: Engagement bait + media-quotable
- Risk: Controversial = either huge PR win or local-paper attack
- 💰 🟡 PR + virality lift

### Data scope expansion

**39. Property tax rates per town** *(Lovable for table + edge fn)*
- What: Pull NJ Treasury data, display on town overview
- Why: Homeowners researching where to buy = different + larger audience
- Risk: Competitor with broader homeowner data wins discovery
- 💰 🟢 Expands TAM beyond builders

**40. School ratings per town**
- What: NJ DOE + GreatSchools API integration
- Why: Parents = primary homeowner buyers
- Risk: Lose this huge segment to Niche / GreatSchools
- 💰 🟢 Major TAM expansion

**41. Recent home sales per town**
- What: Comp data from public records / Zillow scrape
- Why: Contextualizes the value of zoning decisions
- Risk: Zillow has it natively
- 💰 🟡 Differentiation play

**42. Crime statistics per town**
- What: FBI UCR open data, refreshed annually
- Why: Safety-conscious buyers
- Risk: Lose safety-segment users
- 💰 🔵 Segment play

**43. Town events calendar**
- What: Aggregate iCal feeds from town websites
- Why: Engagement, repeat visits
- Risk: Town pages feel one-dimensional (just regulations)
- 💰 🔵 Engagement lift

### Trust & social proof

**44. "Last verified by admin" timestamp on every public data row**
- What: Show users when the data was last verified
- Why: Without this, users assume data is stale
- Risk: Trust is the #1 reason a user converts on regulatory data
- 💰 🟢 Conversion blocker — trust is the gating factor

**45. "Dispute this data" button on every public row**
- What: Crowd-sourced correction flagging
- Why: Data quality improves silently as user base grows
- Risk: Quality degrades silently; competitors with corrections beat you
- 💰 🟡 Long-term data-quality moat

**46. "Powered by official sources" footer with publisher logos**
- What: eCode360 / Municode / town gov logos linked to actual source
- Why: Borrowed trust from authoritative publishers
- Risk: Look like just another aggregator
- 💰 🔵 Trust signal

**47. Testimonials section on homepage**
- What: Placeholder copy now → real testimonials when you have them
- Why: Social proof is the highest-converting hero element
- Risk: Conversion 30-50% lower without trust signals on landing
- 💰 🟢 Direct conversion impact (when real)

### Mobile & accessibility

**48. Admin mobile responsive audit**
- What: Fix `/admin` for small screens (tables overflow, cards stack badly)
- Why: You need to manage content from anywhere
- Risk: Admin work is desktop-only → ops bottleneck
- 💰 🔵 Ops capacity (your time = revenue indirectly)

**49. Keyboard navigation pass**
- What: Tab order, focus traps in modals, `:focus-visible` styles
- Why: ADA compliance + power-user segment
- Risk: ADA lawsuits (real risk for SaaS in 2026); lose power users
- 💰 🟡 Compliance + segment

**50. Screen reader labels (`aria-label` on icon-only buttons)**
- What: Audit all icon-only buttons (especially admin) for missing labels
- Why: Same as #49
- Risk: Same
- 💰 🟡 Compliance + segment
