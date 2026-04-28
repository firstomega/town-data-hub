# Add Privacy Policy + Friendly 404 Page

Two straightforward additions to fix the broken `/privacy` link in the footer and replace the bare-bones 404 page with something on-brand.

## 1. Privacy Policy (`/privacy`)

Create `src/pages/PrivacyPage.tsx` mirroring the structure and styling of `src/pages/TermsPage.tsx` (same `AppLayout contained={false}`, same heading sizes, same `space-y-6` body, same "Last updated" line).

Wire it up in `src/App.tsx` as a lazy route at `/privacy` so the existing footer link resolves.

**Sections** (industry-standard SaaS privacy policy, tailored to TownCenter's actual data practices — auth via Supabase, contractor community notes, subscription billing, public municipal data):

1. Introduction & scope
2. Information we collect
   - Account info (email, name, role — homeowner/contractor)
   - Profile & project data (saved towns, checklists, project addresses)
   - Community Notes content (for verified contractors)
   - Payment info (handled by payment processor — we don't store card data)
   - Usage data (pages viewed, searches, device/browser metadata)
   - Cookies & local storage
3. How we use information (provide service, personalize, billing, transactional email, product improvement, fraud prevention)
4. Legal bases (contract, legitimate interest, consent, legal obligation)
5. Sharing & disclosure (service providers — hosting, auth, analytics, payments; legal requests; business transfers; aggregated/anonymized data). Explicit "we do not sell personal information."
6. Data retention
7. Your rights (access, correction, deletion, export, opt-out, marketing unsubscribe — including a CCPA/GDPR-style summary)
8. Security (encryption in transit/at rest, access controls, breach notification commitment)
9. Children's privacy (not directed to under-13)
10. Third-party links (municipal sites, ordinance publishers — not covered by this policy)
11. International users (US-based service, data processed in the US)
12. Changes to this policy
13. Contact — `support@towncenter.io`

Keep tone consistent with Terms (plain English, second person, brand name "TownCenter"). Match the date format on Terms (`Last updated: March 1, 2026` → use `April 28, 2026` for Privacy since it's new).

## 2. Friendly 404 Page

Replace `src/pages/NotFound.tsx` with a warmer, on-brand version wrapped in `<AppLayout>` so users keep the navbar/footer and can navigate back into the app instead of hitting a dead end.

**Design:**
- Centered card layout (use `mainClassName="items-center justify-center"` per project conventions)
- Big "404" display with a light, apologetic line: e.g. *"We looked everywhere — even checked the zoning map. This page isn't on file."*
- Short paragraph acknowledging the page may have moved, been renamed, or never existed, with a sincere apology
- Two CTAs:
  - Primary `<Button>` → "Back to Home" (`/`)
  - Secondary `<Button variant="outline">` → "Browse Towns" (`/dashboard` if signed in is fine since `ProtectedRoute` handles redirect; safer target is `/` or `/about`) → use `/` and `/about` as the two destinations, OR `/` and `/guides`
- Keep the existing `console.error` log for the unknown path (useful for debugging)
- Subtle muted footer line: "If you think this is a bug, email support@towncenter.io"

**Tone:** lightly self-deprecating but professional — matches the Bloomberg-meets-Zillow vibe (no cartoon graphics, no excessive emoji). One small lucide icon (`MapPinOff` or `Compass`) above the 404 number for visual interest.

**No router changes needed** — `<Route path="*" element={<NotFound />} />` already catches everything.

## Files

- **Create:** `src/pages/PrivacyPage.tsx`
- **Edit:** `src/App.tsx` (add lazy import + `/privacy` route)
- **Rewrite:** `src/pages/NotFound.tsx`

No migrations, no edge functions, no backend changes.
