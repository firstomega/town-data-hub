

# Missing Features from the PRD

After cross-referencing the full PRD against the current prototype, here are the gaps — organized from most impactful to nice-to-have.

---

## High-Impact Missing Features

### 1. Project Feasibility Quick-Check
**PRD reference:** "Before a homeowner even calls a contractor, they describe what they want to do ('I want to add a second-story addition') and the app tells them whether it's likely permissible in their zone."

Currently missing entirely. This should be a dedicated page or modal (e.g., `/feasibility`) where a user selects a project type + address/zone and gets a pass/fail result against the zone's rules, with specific constraints listed.

### 2. In-App Notification Center
**PRD reference:** "In-app notification center for ordinance updates, new community notes on their saved towns, and permit timeline reminders."

The sidebar has badge counts, but there's no notification dropdown/panel where users can see and dismiss individual notifications. Should be a bell icon in the NavBar with a dropdown showing recent alerts.

### 3. Saved Projects Feature
**PRD reference:** "Let users save a specific address + project type combination and track everything related to it: applicable rules, permit status, ordinance changes that might affect it."

The Dashboard shows "Active Projects" but there's no `/projects` detail view or a way to create/manage a saved project. A simple project detail page showing the address, zone, applicable rules, and checklist status would complete this.

### 4. Community Notes on Town Profiles
**PRD reference:** "Allow verified contractors to leave notes on specific town profiles."

Community Notes exist on the Contractor Dashboard, but they don't appear on the actual Town Profile pages where homeowners would see them. Each town profile should have a "Community Notes" section (perhaps on the Overview or a new tab) showing contractor tips with upvote counts and verified badges.

### 5. Glossary Page
**PRD reference:** "A persistent, linkable glossary that contextually appears when these terms show up in the data."

Inline tooltips exist on the Zoning tab, but there's no standalone `/glossary` page users can browse. Should list all zoning terms (setback, FAR, variance, nonconforming use, etc.) with definitions.

### 6. "Compare with Another Town" Button on Town Profiles
**PRD reference:** "This should be accessible from any town profile with a single click."

Town profiles have no link to the comparison page pre-filled with that town. Add a "Compare with another town" button on each Town Profile header.

---

## Medium-Impact Missing Features

### 7. Seasonal Prompts / Contextual Tips
**PRD reference:** "Surface timely content based on the season."

A small banner or card on the homepage/dashboard: "Spring: Planning a pool? Here's what you need to know about pool permits." Simple to add, makes the app feel alive.

### 8. "Data Pending" State for Incomplete Towns
**PRD reference:** "When a municipality's data is unavailable or incomplete, the town profile should still exist but display a clear 'data pending' state."

The featured towns grid shows 6 towns but only 2 have actual profiles. The other 4 (Hackensack, Fort Lee, Teaneck, Englewood) should link to stub pages with a "Data coming soon" state rather than dead links.

### 9. User-Submitted Corrections
**PRD reference:** "Let users flag outdated information ('This setback rule changed in 2024') and route it to you for verification."

A small "Report an issue" or "Suggest a correction" link on town profile data sections. Can be a simple modal with a text field — no backend needed for the prototype.

### 10. Town Meeting Calendar
**PRD reference:** "If a town has an upcoming zoning board meeting, surface that in the town profile."

Add an "Upcoming Meetings" card on the Town Overview or Contacts tab showing next ZBA and Planning Board meeting dates.

### 11. Project Cost Estimator Hints
**PRD reference:** "Give users a rough ballpark of what common projects cost in their area."

Add estimated project costs (not just permit fees) to the Checklist page or Permits tab: "Average deck cost in Bergen County: $8,000–$15,000."

### 12. Shareable Town Profile Links
**PRD reference:** "A shareable link feature — contractors who send a town profile link to a client are doing your marketing."

Add a "Share" button on town profiles that copies the URL with a toast confirmation.

---

## Implementation Plan

### Files to create:
- `src/pages/FeasibilityCheck.tsx` — Project feasibility quick-check wizard
- `src/pages/GlossaryPage.tsx` — Full glossary of zoning terms
- `src/pages/TownStubPage.tsx` — "Data pending" placeholder for towns without full data
- `src/components/NotificationCenter.tsx` — Bell icon dropdown with notification items

### Files to modify:
- `src/App.tsx` — Add routes for `/feasibility`, `/glossary`, `/town/:slug` (stub)
- `src/components/NavBar.tsx` — Add notification bell with dropdown
- `src/pages/TownOverview.tsx` & `src/pages/ParamusOverview.tsx` — Add Community Notes section, "Compare" button, upcoming meetings card, "Suggest correction" link, "Share" button
- `src/pages/TownContacts.tsx` & `src/pages/ParamusContacts.tsx` — Add upcoming meeting dates
- `src/pages/ChecklistPage.tsx` — Add estimated project cost section
- `src/pages/HomePage.tsx` — Add seasonal prompt card, link stub towns to stub pages
- `src/pages/Dashboard.tsx` — Add seasonal tip banner

### Estimated scope: ~8 files to create/modify. All mock data, no backend changes.

