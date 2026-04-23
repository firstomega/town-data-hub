

# The Data Problem — and the Plan to Fix It

## What we have today

- 7 town **shells** in the DB (slug, name, county, fake population/home values)
- 0 rows in `zones`, `permits`, `ordinances`, `contacts`
- Pages still read from hardcoded `src/data/townData.ts` — placeholder fiction (e.g., "Paramus §250-45 fence rule") that *looks* real but isn't sourced from any actual ordinance
- No provenance, no `source_url`, no verification timestamp tied to a real document

This is fatal for a product whose entire pitch is "trustworthy municipal data." A homeowner who builds a fence based on our data and gets fined will sue. We have to fix it before launch.

## The honest data hierarchy (best → worst)

```text
1. Official municipal code on eCode360/Municode/General Code (machine-readable, citable)
2. Official town PDFs (zoning ordinance, fee schedule, application forms)
3. Town clerk / building dept confirmation (email or phone)
4. Reputable secondary sources (NJ DCA, county planning office)
5. AI-summarized from #1–4 with citation back to source
6. Hand-typed placeholder ← WHERE WE ARE NOW
```

Bergen County towns mostly use **eCode360** (General Code) or **Municode** — both have public URLs per chapter. That's our anchor.

## The plan: 5 phases, ship phase 1 now

### Phase 1 — Provenance & honesty (build now)

Make the data model honest about where every fact came from. Even before we ingest real data, the schema should track it.

**Schema additions (one migration):**
- Add `source_url`, `source_doc`, `last_verified_at`, `verified_by`, `confidence` (`verified` | `ai_extracted` | `placeholder`) to `zones`, `permits`, `ordinances`, `contacts`
- Add `data_status` to `towns`: `verified` | `partial` | `placeholder`
- New table `data_corrections` (already planned) — wired to the existing `SuggestCorrectionDialog`
- New table `ingestion_runs` — audit log of every scrape/extraction job (when, source, rows added, who approved)

**UI changes:**
- Every data block on a Town Profile shows a small **provenance footer**: "Source: Borough of Paramus Code §250-45 · Verified Jan 15, 2026 · [View source]"
- A `placeholder` confidence renders an amber badge: **"Placeholder — not yet verified"**
- The 5 generic towns (Hackensack, Fort Lee, Teaneck, Englewood, Glen Rock) flip to a **"Data pending verification"** state (we already have the stub page pattern)
- `last_verified_at` older than 12 months renders a yellow **"May be outdated"** chip

**Migrate existing `townData.ts` into the DB** — but flagged `confidence='placeholder'` for everything. No more hardcoded reads; pages query Supabase. This makes the dishonesty *visible* instead of hidden.

### Phase 2 — Real ingestion pipeline (next slice)

An admin tool that takes a municipal code URL and produces draft DB rows for review.

**Architecture:**
```text
Admin pastes eCode360 URL
    ↓
Edge function: ingest-ordinance
    ├─ Firecrawl scrape (markdown of the chapter)
    ├─ Lovable AI (Gemini) — extract structured rows:
    │     { zone_code, min_lot, setback_front, ... } per zone
    │     { permit_name, fee, timeline, requirements[] } per permit
    │     { ordinance_code, title, summary } per ordinance
    └─ Insert as confidence='ai_extracted', status='pending_review'
    ↓
Admin review queue (/admin/data-review)
    Side-by-side: extracted row | source markdown excerpt | edit form
    Approve → confidence='verified', verified_by=admin_id, last_verified_at=now()
    Reject → archived with reason
```

Connectors needed: **Firecrawl** (already documented as available). Lovable AI Gateway is already enabled. No third-party API keys required.

**Coverage target for Phase 2 launch:** Ridgewood + Paramus fully verified end-to-end (every zone, permit, ordinance has a real `source_url` and a human approval). Other 5 towns stay in `placeholder` with the amber banner.

### Phase 3 — Continuous freshness

- **Weekly cron** (edge function) re-scrapes each town's source URLs, diffs against current rows, flags changes for re-review
- When a row's content changes upstream, push notifications to users with that town saved (the notification engine we already planned)
- Public `/data-status` page showing per-town: % verified, last refresh, next refresh — radical transparency

### Phase 4 — Community-sourced corrections

The `SuggestCorrectionDialog` already exists in the UI. Wire it to:
- Insert into `data_corrections` with `row_id`, `field`, `proposed_value`, `evidence_url`
- Admin queue at `/admin/corrections` (UI shape already exists in AdminDashboard)
- On approval → updates the row + bumps `last_verified_at` + credits the submitter

### Phase 5 — Verified contractor signal

Verified contractors can vouch for ordinance entries ("I pulled this exact permit in March 2025, fee was correct"). A vouch increments a `confidence_signals` count. Three independent vouches in 90 days → row gets a **"Confirmed by contractors"** badge. This is the moat the PRD describes.

---

## What I'd build in this slice (Phase 1)

A focused, shippable chunk:

1. **Migration** — add provenance columns to `zones`/`permits`/`ordinances`/`contacts`, add `data_status` to `towns`, create `data_corrections` and `ingestion_runs` tables
2. **Seed** — port `src/data/townData.ts` into the DB, all flagged `confidence='placeholder'`. Set Hackensack/Fort Lee/Teaneck/Englewood/Glen Rock to `data_status='placeholder'`; Ridgewood/Paramus to `partial`
3. **Refactor pages** to read from Supabase via TanStack Query (replaces the `getFullTownData` import everywhere). Loading states already exist.
4. **Provenance UI** — small footer component on every data block; amber "Placeholder" badge; "May be outdated" chip when `last_verified_at` > 12 months
5. **Honest empty states** — generic town profiles render "Data pending verification" with a "Be notified when this town is verified" CTA (writes to `saved_towns`)
6. **Wire `SuggestCorrectionDialog`** to actually insert into `data_corrections` (not just toast)

Phase 2 (real ingestion with Firecrawl + AI extraction + admin review queue) is a separate slice — bigger, and worth doing once Phase 1 makes the honesty visible.

## Files to create / modify

**New migrations:**
- Add provenance columns + `data_corrections` + `ingestion_runs`

**New files:**
- `src/components/DataProvenance.tsx` — source/verified-on/link footer
- `src/components/PlaceholderBanner.tsx` — amber "not yet verified" banner
- `src/hooks/useTown.ts`, `useTownZones.ts`, `useTownPermits.ts`, etc. — TanStack Query wrappers
- `supabase/functions/seed-town-data/index.ts` — one-time seed from `townData.ts`

**Modify:**
- All `Generic*` and `Paramus*` and `Town*` pages — read from DB, render provenance
- `SuggestCorrectionDialog.tsx` — real insert
- `TownProfileLayout.tsx` — show `data_status` badge in header

**Out of scope for this slice (deliberately):** Firecrawl ingestion, AI extraction, admin review queue, cron refresh. Those are Phase 2.

## Trade-off to be honest about

This slice doesn't *get* real data — it makes the absence of real data **visible and trackable**, and gives us the rails to add real data row-by-row in Phase 2. That's the right order: don't claim verified data we don't have, build the verification pipeline next.

---

**Approve to build Phase 1, or tell me to jump straight to Phase 2 (Firecrawl ingestion of one town's eCode360 chapter as a real demo) — that's also a valid first move and arguably more exciting.**

