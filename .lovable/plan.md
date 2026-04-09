
# TownCenter — Visual Prototype (10 Screens)

## Design System
- **Palette**: Dark navy (`#0F1A2E`), white, light gray (`#F5F7FA`), accent blue (`#2563EB`), green for positive indicators, amber for warnings, red for negative
- **Typography**: Inter for body, system font stack. Large bold headings, tight line heights for data density
- **Aesthetic**: Bloomberg Terminal meets Zillow — authoritative, data-forward, professional. No rounded playful elements. Sharp cards, subtle borders, high information density with good whitespace
- **Iconography**: Consistent project-type icons (deck, fence, pool, ADU, addition) using Lucide icons throughout
- **Light mode only**

## Screens (each as a separate route/page)

### Screen 1 — Homepage (Logged Out)
- Top nav: TownCenter logo, "How It Works", "Pricing", Login button, "Get Started" CTA
- Hero: Large heading "Know Your Zoning Before You Build", prominent search bar (address, town, or question), placeholder suggestions beneath
- Featured Towns grid: 6-8 Bergen County town cards with town name, population, # of zones, median home value
- "Did You Know?" trivia card with an interesting zoning fact
- Footer with legal disclaimer

### Screen 2 — Homepage (Logged In / Dashboard)
- Persistent left sidebar: saved towns list, saved projects, quick links
- Top: global search bar remains prominent
- Main content: "Your Dashboard" with sections for saved towns (cards), active projects (list with status), recent ordinance changes (timeline/feed with affected town + summary)
- Welcome back greeting with user name

### Screen 3 — Town Profile: Overview Tab
- Breadcrumb: NJ > Bergen County > Ridgewood
- Town header: "Village of Ridgewood" with last updated timestamp and source attribution
- Tab bar: Overview (active), Zoning, Permits, Ordinances, Contacts
- Overview content: Key stats row (population, median home value, # zones, total area), embedded zoning map placeholder (gray box with map icon), general town character description
- Nearby Municipalities module: 3-4 bordering towns as small cards with key stats and links

### Screen 4 — Town Profile: Zoning Tab
- Same header/tabs, Zoning tab active
- Zone cards or table rows for each district (R-1, R-2, R-3, C-1, C-2, etc.) showing: zone name, description, min lot size, setbacks (front/side/rear), max height, max lot coverage, FAR, permitted uses summary
- Glossary tooltips on terms like "setback", "FAR", "lot coverage" — shown as dotted underlines with tooltip on hover
- Clean table layout with alternating row backgrounds for scannability

### Screen 5 — Town Profile: Permits Tab
- Same header/tabs, Permits tab active
- Permit types listed as structured cards: Building Permit, Zoning Permit, Demolition Permit, etc. Each showing requirements, typical timeline, fees, application link
- Prominent "Permit Checklist Generator" CTA card: "Select your project type to generate a custom checklist" with project type icons (deck, fence, pool, etc.)

### Screen 6 — Town Comparison View
- Header with two town selectors: Ridgewood vs Paramus
- Side-by-side comparison table with rows for: population, median home value, # of zones, R-1 setbacks (front/side/rear), max lot coverage, max height, permit turnaround time, building permit fee
- Color-coded difference indicators (green = more permissive, red = more restrictive, neutral for informational)
- Icons and visual bars where applicable

### Screen 7 — Natural Language Query Results
- Search bar at top showing the query: "Can I build a fence over 6 feet in Ridgewood R-1 zone?"
- AI answer card with blue "AI-Generated Summary" badge and confidence indicator (e.g., "High Confidence" with green dot)
- Clear answer text with the ruling
- Source section below showing the actual ordinance text excerpt with citation
- Disclaimer banner: "Always verify with your municipality before proceeding"
- Related questions suggestions

### Screen 8 — Permit Checklist Output
- Header: "Before You Call" Cheat Sheet — Deck at 123 Oak St, Ridgewood NJ
- Property context: Zone R-2, lot size, current coverage
- Checklist with checkboxes: required permits, documents to prepare, each with details
- Municipal contact card: building dept phone, hours, address
- Estimated timeline and total fees summary
- Action buttons: "Export as PDF", "Print", "Save to My Projects"

### Screen 9 — Contractor Dashboard
- Sidebar with contractor org name and team members
- Top: global search bar
- Main: Service area section with multi-town coverage map placeholder, list of covered towns
- "Rule Variations Across Your Towns" comparison table (key rules across all service area towns)
- Saved projects across municipalities (list with town, project type, status)
- Recent ordinance changes feed filtered to service area towns

### Screen 10 — Pricing Page
- Header: "Simple, Transparent Pricing"
- Toggle: Monthly / Annual (with "Save 20%" badge on annual)
- Three tier cards: Free ($0), Homeowner ($3/mo), Contractor ($15/mo per seat)
- Feature comparison matrix below the cards
- Contractor card includes visual of seat management (add/remove team members)
- Free trial CTA: "Start your 14-day free trial"
- FAQ section at bottom

## Implementation Approach
- Each screen as a separate route (`/`, `/dashboard`, `/town/ridgewood`, `/town/ridgewood/zoning`, `/town/ridgewood/permits`, `/compare`, `/query`, `/checklist`, `/contractor`, `/pricing`)
- All data is hardcoded/mock — this is a visual prototype only
- Shared layout components: NavBar, Sidebar, TownProfileLayout with tabs
- Responsive design shown at desktop width
