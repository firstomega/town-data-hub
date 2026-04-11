// Comprehensive town data for all Bergen County towns with full profiles

export interface TownStat {
  label: string;
  value: string;
}

export interface ZoneData {
  code: string;
  name: string;
  description: string;
  minLot: string;
  setbacks: { front: string; side: string; rear: string };
  maxHeight: string;
  maxCoverage: string;
  far: string;
  variance: "c" | "d";
  permitted: string[];
  conditional: string[];
  prohibited: string[];
}

export interface PermitData {
  name: string;
  description: string;
  requirements: string[];
  timeline: string;
  fee: string;
  feeNote: string;
}

export interface OrdinanceData {
  category: string;
  title: string;
  code: string;
  summary: string;
  updated: string;
}

export interface DeptData {
  name: string;
  description: string;
  phone: string;
  email: string;
  hours: string;
  address: string;
  website?: string;
  portalLabel?: string;
  portalUrl?: string;
  meetings?: string;
  deadlines?: string;
  contact?: string;
}

export interface MeetingData {
  board: string;
  date: string;
  time: string;
  location: string;
}

export interface CommunityNote {
  author: string;
  badge: string;
  note: string;
  upvotes: number;
  date: string;
}

export interface NearbyTown {
  name: string;
  medianHome: string;
  zones: number;
  slug?: string;
}

export interface FullTownData {
  slug: string;
  name: string;
  fullName: string;
  county: string;
  updated: string;
  source: string;
  population: string;
  medianHome: string;
  totalArea: string;
  numZones: number;
  character: string;
  zbaSchedule: string;
  zbaTimeline: string;
  zbaFee: string;
  zones: ZoneData[];
  permits: PermitData[];
  ordinanceCategories: string[];
  ordinances: OrdinanceData[];
  departments: DeptData[];
  upcomingMeetings: MeetingData[];
  communityNotes: CommunityNote[];
  nearbyTowns: NearbyTown[];
  officialLinks: { label: string; url: string }[];
}

export const fullTownData: Record<string, FullTownData> = {
  hackensack: {
    slug: "hackensack",
    name: "Hackensack",
    fullName: "City of Hackensack",
    county: "Bergen",
    updated: "Feb 5, 2026",
    source: "Hackensack City Code",
    population: "44,113",
    medianHome: "$420,000",
    totalArea: "4.2 sq mi",
    numZones: 12,
    character: "The City of Hackensack serves as the county seat of Bergen County and is the commercial and governmental hub of the region. The city has undergone significant redevelopment in recent years, with new mixed-use projects along Main Street and the Hackensack River waterfront. Hackensack is home to Hackensack University Medical Center, one of the largest hospitals in New Jersey, which anchors a growing healthcare corridor. The city features a mix of older residential neighborhoods, mid-rise apartment buildings, and a revitalized downtown with restaurants, shops, and cultural venues. With 12 zoning districts, Hackensack balances dense urban development with established residential neighborhoods, and has been proactive in adopting transit-oriented development policies near the Hackensack Bus Terminal.",
    zbaSchedule: "The Hackensack Board of Adjustment meets on the 1st and 3rd Wednesday of each month.",
    zbaTimeline: "4–8 weeks",
    zbaFee: "$300–$600",
    zones: [
      { code: "R-1", name: "Single Family Residential", description: "Low-density single-family homes", minLot: "7,500 sf", setbacks: { front: "25 ft", side: "8 ft", rear: "20 ft" }, maxHeight: "35 ft", maxCoverage: "35%", far: "0.40", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Accessory structures", "Parks"], conditional: ["Two-family conversions", "ADUs", "Home businesses"], prohibited: ["Multi-family (3+)", "Commercial", "Industrial"] },
      { code: "R-2", name: "Two-Family Residential", description: "Two-family and single-family homes", minLot: "6,000 sf", setbacks: { front: "20 ft", side: "6 ft", rear: "15 ft" }, maxHeight: "35 ft", maxCoverage: "40%", far: "0.50", variance: "c", permitted: ["Single-family dwellings", "Two-family dwellings", "Home occupations"], conditional: ["Multi-family (3-4 units)", "ADUs", "Group homes"], prohibited: ["Commercial", "Industrial", "Warehousing"] },
      { code: "R-3", name: "Multi-Family Residential", description: "Apartments and townhomes", minLot: "5,000 sf", setbacks: { front: "15 ft", side: "5 ft", rear: "12 ft" }, maxHeight: "50 ft", maxCoverage: "50%", far: "1.00", variance: "d", permitted: ["Multi-family dwellings", "Townhouses", "Senior housing", "Mixed-use residential"], conditional: ["Assisted living", "Hotels", "Student housing"], prohibited: ["Heavy industrial", "Warehousing", "Auto repair"] },
      { code: "R-4", name: "High-Density Residential", description: "High-rise residential", minLot: "10,000 sf", setbacks: { front: "20 ft", side: "10 ft", rear: "20 ft" }, maxHeight: "80 ft", maxCoverage: "55%", far: "2.50", variance: "d", permitted: ["High-rise apartments", "Luxury condominiums", "Senior housing"], conditional: ["Mixed-use towers", "Hotels", "Parking structures"], prohibited: ["Industrial", "Heavy commercial", "Single-family only developments"] },
      { code: "C-1", name: "Central Business", description: "Downtown core commercial", minLot: "3,000 sf", setbacks: { front: "0 ft", side: "0 ft", rear: "10 ft" }, maxHeight: "60 ft", maxCoverage: "90%", far: "3.00", variance: "c", permitted: ["Retail", "Restaurants", "Offices", "Banks", "Mixed-use"], conditional: ["Nightclubs", "Hotels", "Theaters"], prohibited: ["Industrial", "Auto repair", "Gas stations"] },
      { code: "C-2", name: "General Commercial", description: "Highway commercial and services", minLot: "8,000 sf", setbacks: { front: "20 ft", side: "8 ft", rear: "15 ft" }, maxHeight: "45 ft", maxCoverage: "65%", far: "1.50", variance: "c", permitted: ["Retail", "Auto dealerships", "Medical offices", "Shopping centers"], conditional: ["Drive-throughs", "Gas stations", "Car washes"], prohibited: ["Heavy industrial", "Junkyards", "Residential-only"] },
      { code: "C-3", name: "Waterfront Commercial", description: "River-adjacent mixed-use", minLot: "15,000 sf", setbacks: { front: "15 ft", side: "10 ft", rear: "25 ft" }, maxHeight: "70 ft", maxCoverage: "60%", far: "2.00", variance: "d", permitted: ["Mixed-use developments", "Restaurants", "Offices", "Marina-related"], conditional: ["Residential towers", "Hotels", "Event venues"], prohibited: ["Heavy industrial", "Manufacturing", "Auto services"] },
      { code: "I-1", name: "Light Industrial", description: "Light manufacturing and distribution", minLot: "15,000 sf", setbacks: { front: "25 ft", side: "10 ft", rear: "20 ft" }, maxHeight: "45 ft", maxCoverage: "55%", far: "0.80", variance: "d", permitted: ["Light manufacturing", "Warehousing", "Distribution centers", "Research labs"], conditional: ["Heavy manufacturing", "Outdoor storage", "Truck depots"], prohibited: ["Residential", "Schools", "Daycare centers"] },
    ],
    permits: [
      { name: "Building Permit", description: "Required for new construction, additions, and major renovations.", requirements: ["Completed application", "Construction plans (3 sets)", "Property survey", "Contractor license", "Workers comp certificate"], timeline: "4-6 weeks", fee: "$175 - $3,000", feeNote: "based on construction value" },
      { name: "Zoning Permit", description: "Required before building permit to confirm compliance.", requirements: ["Zoning application", "Property survey", "Plot plan with setbacks"], timeline: "1-3 weeks", fee: "$75 - $200", feeNote: "flat fee" },
      { name: "Demolition Permit", description: "Required for full or partial demolition.", requirements: ["Demolition plan", "Asbestos inspection", "Lead paint survey", "Utility disconnect confirmation"], timeline: "3-4 weeks", fee: "$250 - $600", feeNote: "plus inspection fees" },
      { name: "Plumbing Permit", description: "Required for new plumbing, water heaters, and sewer connections.", requirements: ["Licensed plumber info", "Scope of work", "Plumbing plans"], timeline: "1-2 weeks", fee: "$80 - $350", feeNote: "based on fixtures" },
    ],
    ordinanceCategories: ["All", "Noise", "Fencing", "Signage", "Parking", "Redevelopment", "Tree Removal", "Demolition"],
    ordinances: [
      { category: "Noise", title: "Construction Hours", code: "§135-4", summary: "Construction permitted Mon–Fri 7:00 AM to 7:00 PM, Saturday 8:00 AM to 5:00 PM. No construction on Sundays or federal holidays.", updated: "May 2025" },
      { category: "Fencing", title: "Fence Height Regulations", code: "§175-22", summary: "Fences in residential zones may not exceed 6 ft in side/rear yards and 4 ft in front yards. Chain-link fencing prohibited in front yards.", updated: "March 2025" },
      { category: "Parking", title: "Off-Street Parking Requirements", code: "§175-40", summary: "Single-family: 2 spaces. Multi-family: 1.5 per unit plus 0.25 guest spaces. Commercial: 1 per 300 sf of gross floor area.", updated: "January 2026" },
      { category: "Redevelopment", title: "Main Street Redevelopment Zone", code: "§175-90", summary: "Properties within the Main Street Redevelopment Area are subject to the adopted redevelopment plan. Mixed-use encouraged with ground-floor retail requirements.", updated: "November 2025" },
      { category: "Tree Removal", title: "Tree Preservation", code: "§220-8", summary: "Permit required for removing any tree with trunk diameter of 10 inches or more on private property. Replacement planting required.", updated: "July 2025" },
      { category: "Signage", title: "Sign Regulations", code: "§175-55", summary: "All commercial signs require permits. Maximum sign area: 2 sq ft per linear foot of building frontage. Animated and flashing signs prohibited.", updated: "August 2025" },
      { category: "Demolition", title: "Demolition Controls", code: "§175-88", summary: "Full demolition requires 45-day notice period, historical review if building is over 75 years old, asbestos survey, and approved site plan for replacement structure.", updated: "April 2025" },
    ],
    departments: [
      { name: "Building Department", description: "Handles building permits, inspections, and code enforcement.", phone: "(201) 646-3930", email: "building@hackensack.org", hours: "Mon–Fri 8:00 AM – 4:00 PM", address: "65 Central Ave, Hackensack, NJ 07601", website: "https://www.hackensack.org/building", portalLabel: "Online Permit Portal", portalUrl: "#" },
      { name: "Zoning Board of Adjustment", description: "Reviews variance applications and use interpretations.", phone: "(201) 646-3932", email: "zoning@hackensack.org", hours: "By appointment", address: "65 Central Ave, Hackensack, NJ 07601", meetings: "1st & 3rd Wednesday of each month, 7:00 PM", deadlines: "Applications due 35 days before meeting", contact: "Patricia Williams, Board Secretary" },
      { name: "Planning Board", description: "Reviews site plans, subdivisions, and master plan amendments.", phone: "(201) 646-3934", email: "planning@hackensack.org", hours: "By appointment", address: "65 Central Ave, Hackensack, NJ 07601", meetings: "2nd & 4th Monday of each month, 7:00 PM", contact: "James Liu, Board Secretary" },
    ],
    upcomingMeetings: [
      { board: "Zoning Board of Adjustment", date: "April 16, 2026", time: "7:00 PM", location: "City Hall, 65 Central Ave" },
      { board: "Planning Board", date: "April 27, 2026", time: "7:00 PM", location: "City Hall, 65 Central Ave" },
    ],
    communityNotes: [
      { author: "Tony M.", badge: "Licensed Contractor", note: "Hackensack is very focused on redevelopment right now — permits in the Main Street zone can take longer due to design review requirements.", upvotes: 15, date: "Jan 2026" },
      { author: "Ana G.", badge: "Licensed Contractor", note: "The Building Department is efficient but strict on plan submissions. Make sure elevations are included or they'll send you back.", upvotes: 9, date: "Dec 2025" },
      { author: "Robert K.", badge: "Licensed Contractor", note: "Parking requirements are tighter here than most Bergen County towns — factor that into multi-family project planning.", upvotes: 7, date: "Jan 2026" },
    ],
    nearbyTowns: [
      { name: "Teaneck", medianHome: "$475,000", zones: 9, slug: "teaneck" },
      { name: "Englewood", medianHome: "$510,000", zones: 11, slug: "englewood" },
      { name: "Paramus", medianHome: "$580,000", zones: 11, slug: "paramus" },
      { name: "River Edge", medianHome: "$455,000", zones: 9 },
    ],
    officialLinks: [
      { label: "City of Hackensack Official Website", url: "https://www.hackensack.org" },
      { label: "Online Permit Portal", url: "#" },
      { label: "Meeting Agendas & Minutes", url: "#" },
      { label: "Municipal Code", url: "#" },
    ],
  },

  "fort-lee": {
    slug: "fort-lee",
    name: "Fort Lee",
    fullName: "Borough of Fort Lee",
    county: "Bergen",
    updated: "Feb 1, 2026",
    source: "Fort Lee Borough Code",
    population: "37,907",
    medianHome: "$490,000",
    totalArea: "2.8 sq mi",
    numZones: 10,
    character: "The Borough of Fort Lee is a densely developed community perched atop the Palisades cliffs overlooking the Hudson River and George Washington Bridge. Known for its dramatic skyline of high-rise residential towers, Fort Lee has one of the highest population densities in Bergen County. The borough's history includes being an early center of the American film industry, and it remains culturally diverse with a significant Korean-American community along Lemoine Avenue. Fort Lee features strict height restrictions in certain zones to preserve views and light, while allowing high-density development along the main corridors. The borough's 10 zoning districts reflect its compact geography, with a focus on managing density, parking, and traffic flow in a land-constrained environment.",
    zbaSchedule: "The Fort Lee Board of Adjustment meets on the 2nd and 4th Thursday of each month.",
    zbaTimeline: "5–8 weeks",
    zbaFee: "$350–$700",
    zones: [
      { code: "R-A", name: "Single Family Residential", description: "Low-density single-family", minLot: "7,500 sf", setbacks: { front: "25 ft", side: "8 ft", rear: "25 ft" }, maxHeight: "32 ft", maxCoverage: "30%", far: "0.35", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Accessory structures"], conditional: ["Two-family conversions", "ADUs", "Home businesses"], prohibited: ["Multi-family", "Commercial", "Industrial"] },
      { code: "R-B", name: "Two-Family Residential", description: "Two-family and townhomes", minLot: "5,000 sf", setbacks: { front: "20 ft", side: "6 ft", rear: "20 ft" }, maxHeight: "35 ft", maxCoverage: "40%", far: "0.50", variance: "c", permitted: ["Single-family", "Two-family dwellings", "Townhomes"], conditional: ["Multi-family (3-4 units)", "Group homes"], prohibited: ["Commercial", "Industrial"] },
      { code: "R-C", name: "Multi-Family Residential", description: "Mid-rise apartments", minLot: "10,000 sf", setbacks: { front: "20 ft", side: "10 ft", rear: "20 ft" }, maxHeight: "55 ft", maxCoverage: "50%", far: "1.50", variance: "d", permitted: ["Multi-family dwellings", "Senior housing", "Residential condos"], conditional: ["Mixed-use", "Hotels", "Assisted living"], prohibited: ["Industrial", "Heavy commercial", "Auto services"] },
      { code: "R-D", name: "High-Rise Residential", description: "High-rise towers", minLot: "20,000 sf", setbacks: { front: "25 ft", side: "15 ft", rear: "25 ft" }, maxHeight: "200 ft", maxCoverage: "45%", far: "4.00", variance: "d", permitted: ["High-rise apartments", "Luxury condominiums", "Parking structures"], conditional: ["Mixed-use towers", "Hotels"], prohibited: ["Industrial", "Low-density residential", "Warehousing"] },
      { code: "C-1", name: "Neighborhood Commercial", description: "Local retail and services", minLot: "3,000 sf", setbacks: { front: "0 ft", side: "0 ft", rear: "10 ft" }, maxHeight: "40 ft", maxCoverage: "80%", far: "2.00", variance: "c", permitted: ["Retail", "Restaurants", "Professional offices", "Banks"], conditional: ["Drive-throughs", "Bars", "Mixed-use residential"], prohibited: ["Industrial", "Gas stations", "Auto repair"] },
      { code: "C-2", name: "General Commercial", description: "Major commercial corridor", minLot: "5,000 sf", setbacks: { front: "10 ft", side: "5 ft", rear: "15 ft" }, maxHeight: "50 ft", maxCoverage: "70%", far: "2.50", variance: "c", permitted: ["Shopping centers", "Medical offices", "Hotels", "Auto dealerships"], conditional: ["Gas stations", "Self-storage", "Car washes"], prohibited: ["Heavy industrial", "Junkyards"] },
    ],
    permits: [
      { name: "Building Permit", description: "Required for all construction, additions, and renovations.", requirements: ["Completed application", "Three sets of construction plans", "Property survey", "Contractor license", "FEMA elevation certificate (if applicable)"], timeline: "5-8 weeks", fee: "$200 - $3,500", feeNote: "based on construction value" },
      { name: "Zoning Permit", description: "Required before building permit.", requirements: ["Zoning application", "Survey showing setbacks", "Plot plan"], timeline: "2-3 weeks", fee: "$100 - $250", feeNote: "flat fee" },
      { name: "Demolition Permit", description: "Required for any demolition work.", requirements: ["Demolition plan", "Asbestos inspection", "Historical review (if applicable)", "Utility disconnects"], timeline: "3-5 weeks", fee: "$300 - $750", feeNote: "plus inspection fees" },
      { name: "Plumbing Permit", description: "Required for plumbing modifications.", requirements: ["Licensed plumber info", "Scope of work", "Plans"], timeline: "1-2 weeks", fee: "$100 - $400", feeNote: "based on fixtures" },
    ],
    ordinanceCategories: ["All", "Noise", "Fencing", "Signage", "Parking", "High-Rise", "Tree Removal", "Demolition"],
    ordinances: [
      { category: "Noise", title: "Construction Hours", code: "§215-5", summary: "Construction Mon–Fri 7:30 AM to 6:00 PM, Saturday 9:00 AM to 5:00 PM. No construction on Sundays. Additional restrictions within 100 ft of residential buildings.", updated: "June 2025" },
      { category: "Fencing", title: "Fence Regulations", code: "§315-18", summary: "Fences may not exceed 6 ft in rear yards, 4 ft in front yards. Solid masonry walls limited to 4 ft. Razor wire and barbed wire prohibited in all zones.", updated: "April 2025" },
      { category: "High-Rise", title: "High-Rise Safety Requirements", code: "§315-45", summary: "Buildings over 75 ft must include fire command stations, emergency generators, and compliant standpipe systems. Annual fire safety inspections required.", updated: "January 2026" },
      { category: "Parking", title: "Parking Requirements", code: "§315-30", summary: "Residential: 1.5 spaces per unit (1-BR), 2 per unit (2+ BR). Guest parking: 0.25 per unit. Commercial: 1 per 250 sf.", updated: "September 2025" },
      { category: "Signage", title: "Sign Regulations", code: "§315-38", summary: "Illuminated signs restricted to commercial zones. No sign may project more than 12 inches from building face. Korean/multilingual signage must include English.", updated: "March 2025" },
      { category: "Tree Removal", title: "Tree Protection", code: "§400-3", summary: "No tree with diameter of 8 inches or more may be removed without permit. Protected trees on Palisades escarpment require additional environmental review.", updated: "July 2025" },
    ],
    departments: [
      { name: "Building Department", description: "Handles building permits, inspections, and code enforcement.", phone: "(201) 592-3514", email: "building@fortleenj.org", hours: "Mon–Fri 8:30 AM – 4:30 PM", address: "309 Main St, Fort Lee, NJ 07024", website: "https://www.fortleenj.org/building", portalLabel: "Online Permit Portal", portalUrl: "#" },
      { name: "Zoning Board of Adjustment", description: "Reviews variance applications.", phone: "(201) 592-3516", email: "zoning@fortleenj.org", hours: "By appointment", address: "309 Main St, Fort Lee, NJ 07024", meetings: "2nd & 4th Thursday of each month, 7:30 PM", deadlines: "Applications due 28 days before meeting", contact: "Susan Chang, Board Secretary" },
      { name: "Planning Board", description: "Reviews site plans and subdivisions.", phone: "(201) 592-3518", email: "planning@fortleenj.org", hours: "By appointment", address: "309 Main St, Fort Lee, NJ 07024", meetings: "1st & 3rd Monday of each month, 7:30 PM", contact: "Daniel Kim, Board Secretary" },
    ],
    upcomingMeetings: [
      { board: "Zoning Board of Adjustment", date: "April 23, 2026", time: "7:30 PM", location: "Borough Hall, 309 Main St" },
      { board: "Planning Board", date: "April 20, 2026", time: "7:30 PM", location: "Borough Hall, 309 Main St" },
    ],
    communityNotes: [
      { author: "Kevin L.", badge: "Licensed Contractor", note: "Fort Lee has strict parking requirements for multi-family — double-check guest parking ratios before submitting.", upvotes: 16, date: "Jan 2026" },
      { author: "Jin P.", badge: "Licensed Contractor", note: "High-rise projects need a pre-application meeting with the Building Dept. Don't skip it — saves weeks.", upvotes: 12, date: "Dec 2025" },
      { author: "Maria S.", badge: "Licensed Contractor", note: "Construction noise near residential towers is monitored closely. Saturday work starts at 9 AM, not 8.", upvotes: 8, date: "Jan 2026" },
    ],
    nearbyTowns: [
      { name: "Englewood", medianHome: "$510,000", zones: 11, slug: "englewood" },
      { name: "Edgewater", medianHome: "$440,000", zones: 7 },
      { name: "Palisades Park", medianHome: "$420,000", zones: 8 },
      { name: "Hackensack", medianHome: "$420,000", zones: 12, slug: "hackensack" },
    ],
    officialLinks: [
      { label: "Borough of Fort Lee Official Website", url: "https://www.fortleenj.org" },
      { label: "Online Permit Portal", url: "#" },
      { label: "Meeting Agendas & Minutes", url: "#" },
      { label: "Municipal Code", url: "#" },
    ],
  },

  teaneck: {
    slug: "teaneck",
    name: "Teaneck",
    fullName: "Township of Teaneck",
    county: "Bergen",
    updated: "Jan 28, 2026",
    source: "Teaneck Township Code",
    population: "40,356",
    medianHome: "$475,000",
    totalArea: "6.2 sq mi",
    numZones: 9,
    character: "The Township of Teaneck is one of Bergen County's most diverse communities, known for its strong civic engagement and tree-lined residential streets. Teaneck features a mix of single-family homes, garden apartments, and some commercial corridors along Cedar Lane and Teaneck Road. The township has a significant Orthodox Jewish community, and its neighborhoods vary from the leafy streets of the West Englewood section to the more urban character near Route 4. With 9 zoning districts, Teaneck maintains a predominantly residential character while supporting local retail and professional services. The township has been progressive on environmental ordinances including stormwater management and tree preservation, and recently updated its accessory structure regulations.",
    zbaSchedule: "The Teaneck Board of Adjustment meets on the 2nd Thursday of each month.",
    zbaTimeline: "4–6 weeks",
    zbaFee: "$200–$450",
    zones: [
      { code: "R-A", name: "Single Family Residential A", description: "Large-lot single-family", minLot: "10,000 sf", setbacks: { front: "35 ft", side: "10 ft", rear: "25 ft" }, maxHeight: "35 ft", maxCoverage: "28%", far: "0.32", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Accessory structures", "Houses of worship"], conditional: ["ADUs", "Home businesses", "Bed & breakfast"], prohibited: ["Multi-family", "Commercial", "Industrial"] },
      { code: "R-B", name: "Single Family Residential B", description: "Medium-lot single-family", minLot: "7,500 sf", setbacks: { front: "30 ft", side: "8 ft", rear: "20 ft" }, maxHeight: "35 ft", maxCoverage: "32%", far: "0.38", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Parks", "Schools"], conditional: ["Two-family dwellings", "ADUs", "Day care centers"], prohibited: ["Multi-family (3+)", "Commercial", "Industrial"] },
      { code: "R-C", name: "Two-Family Residential", description: "Two-family and single-family", minLot: "6,000 sf", setbacks: { front: "25 ft", side: "6 ft", rear: "15 ft" }, maxHeight: "35 ft", maxCoverage: "38%", far: "0.45", variance: "c", permitted: ["Single-family", "Two-family dwellings", "Home occupations"], conditional: ["Multi-family (3-4)", "Group homes"], prohibited: ["Commercial", "Industrial"] },
      { code: "R-D", name: "Multi-Family Residential", description: "Garden apartments and townhomes", minLot: "15,000 sf", setbacks: { front: "25 ft", side: "12 ft", rear: "20 ft" }, maxHeight: "40 ft", maxCoverage: "40%", far: "0.65", variance: "d", permitted: ["Multi-family dwellings", "Townhomes", "Senior housing"], conditional: ["Mixed-use", "Assisted living"], prohibited: ["Heavy commercial", "Industrial", "Auto services"] },
      { code: "C-1", name: "Neighborhood Commercial", description: "Cedar Lane and local retail", minLot: "4,000 sf", setbacks: { front: "5 ft", side: "0 ft", rear: "10 ft" }, maxHeight: "40 ft", maxCoverage: "75%", far: "1.75", variance: "c", permitted: ["Retail", "Restaurants", "Offices", "Banks"], conditional: ["Drive-throughs", "Mixed-use residential above", "Bars"], prohibited: ["Industrial", "Gas stations", "Auto repair"] },
      { code: "C-2", name: "General Commercial", description: "Route 4 corridor commercial", minLot: "10,000 sf", setbacks: { front: "25 ft", side: "10 ft", rear: "20 ft" }, maxHeight: "45 ft", maxCoverage: "60%", far: "1.20", variance: "c", permitted: ["Retail", "Medical offices", "Auto dealerships", "Shopping plazas"], conditional: ["Gas stations", "Self-storage", "Hotels"], prohibited: ["Heavy industrial", "Junkyards", "Residential-only"] },
    ],
    permits: [
      { name: "Building Permit", description: "Required for construction, additions, and renovations.", requirements: ["Completed application", "Two sets of construction plans", "Property survey", "Contractor license"], timeline: "3-5 weeks", fee: "$125 - $2,200", feeNote: "based on project value" },
      { name: "Zoning Permit", description: "Required before building permit.", requirements: ["Zoning application", "Survey with setbacks", "Plot plan"], timeline: "1-2 weeks", fee: "$50 - $125", feeNote: "flat fee" },
      { name: "Electrical Permit", description: "Required for electrical work.", requirements: ["Licensed electrician info", "Scope of work", "Electrical plans"], timeline: "1-2 weeks", fee: "$65 - $275", feeNote: "based on circuits" },
      { name: "Fire Prevention Permit", description: "Required for fire alarm and sprinkler installations.", requirements: ["Fire alarm plans", "Sprinkler specifications", "Contractor license"], timeline: "2-3 weeks", fee: "$100 - $400", feeNote: "based on system type" },
    ],
    ordinanceCategories: ["All", "Noise", "Fencing", "Parking", "Stormwater", "Tree Removal", "Accessory Structures"],
    ordinances: [
      { category: "Noise", title: "Construction Hours", code: "§22-1", summary: "Construction Mon–Fri 7:00 AM to 6:00 PM, Saturday 8:00 AM to 5:00 PM. No Sunday or holiday construction. Leaf blowers prohibited before 8 AM and after 6 PM.", updated: "June 2025" },
      { category: "Fencing", title: "Fence Regulations", code: "§36-10", summary: "Maximum fence height: 6 ft in rear, 4 ft in front. Fences on corner lots may not exceed 3 ft within sight triangle. All fences require a zoning permit.", updated: "April 2025" },
      { category: "Stormwater", title: "Stormwater Management", code: "§36-45", summary: "New construction and major additions must include stormwater management plans. On-site retention required for impervious surface increases over 500 sq ft.", updated: "January 2026" },
      { category: "Tree Removal", title: "Tree Preservation Ordinance", code: "§28-12", summary: "Permit required for removal of trees with 8-inch or greater diameter. Two-for-one replacement required. Heritage trees (24+ inches) receive additional protections.", updated: "August 2025" },
      { category: "Parking", title: "Residential Parking", code: "§36-28", summary: "Single-family: 2 off-street spaces. Two-family: 3 spaces. No overnight parking of commercial vehicles in residential zones.", updated: "March 2025" },
      { category: "Accessory Structures", title: "Accessory Structure Regulations", code: "§36-15", summary: "Sheds under 200 sf do not require a building permit but require a zoning permit. Maximum height: 12 ft. Must maintain 5 ft setback from property lines.", updated: "November 2025" },
    ],
    departments: [
      { name: "Building Department", description: "Handles building permits, inspections, and code enforcement.", phone: "(201) 837-4811", email: "building@teanecknj.gov", hours: "Mon–Fri 8:30 AM – 4:30 PM", address: "818 Teaneck Rd, Teaneck, NJ 07666", website: "https://www.teanecknj.gov/building", portalLabel: "Online Permits", portalUrl: "#" },
      { name: "Zoning Board of Adjustment", description: "Reviews variance applications.", phone: "(201) 837-4813", email: "zoning@teanecknj.gov", hours: "By appointment", address: "818 Teaneck Rd, Teaneck, NJ 07666", meetings: "2nd Thursday of each month, 8:00 PM", deadlines: "Applications due 25 days before meeting", contact: "Linda Feldman, Board Secretary" },
      { name: "Planning Board", description: "Reviews site plans and subdivisions.", phone: "(201) 837-4815", email: "planning@teanecknj.gov", hours: "By appointment", address: "818 Teaneck Rd, Teaneck, NJ 07666", meetings: "4th Wednesday of each month, 8:00 PM", contact: "Mark Epstein, Board Secretary" },
    ],
    upcomingMeetings: [
      { board: "Zoning Board of Adjustment", date: "April 9, 2026", time: "8:00 PM", location: "Municipal Building, 818 Teaneck Rd" },
      { board: "Planning Board", date: "April 22, 2026", time: "8:00 PM", location: "Municipal Building, 818 Teaneck Rd" },
    ],
    communityNotes: [
      { author: "Dave S.", badge: "Licensed Contractor", note: "Teaneck's stormwater requirements are stricter than most Bergen County towns. Budget extra for drainage plans on any addition.", upvotes: 13, date: "Jan 2026" },
      { author: "Rachel B.", badge: "Licensed Contractor", note: "The building department closes for lunch noon-1 PM. Plan your visits for morning or early afternoon.", upvotes: 8, date: "Dec 2025" },
      { author: "Sam T.", badge: "Licensed Contractor", note: "Heritage tree protection is serious here — get the tree survey done early. Removal of a heritage tree can delay your project months.", upvotes: 11, date: "Jan 2026" },
    ],
    nearbyTowns: [
      { name: "Hackensack", medianHome: "$420,000", zones: 12, slug: "hackensack" },
      { name: "Englewood", medianHome: "$510,000", zones: 11, slug: "englewood" },
      { name: "Bergenfield", medianHome: "$430,000", zones: 8 },
      { name: "Bogota", medianHome: "$380,000", zones: 6 },
    ],
    officialLinks: [
      { label: "Township of Teaneck Official Website", url: "https://www.teanecknj.gov" },
      { label: "Online Permit Portal", url: "#" },
      { label: "Meeting Agendas & Minutes", url: "#" },
      { label: "Municipal Code", url: "#" },
    ],
  },

  englewood: {
    slug: "englewood",
    name: "Englewood",
    fullName: "City of Englewood",
    county: "Bergen",
    updated: "Jan 20, 2026",
    source: "Englewood City Code",
    population: "28,390",
    medianHome: "$510,000",
    totalArea: "4.9 sq mi",
    numZones: 11,
    character: "The City of Englewood is a diverse, mid-size city in Bergen County known for its mix of grand residential neighborhoods, active redevelopment areas, and cultural institutions. The city's western section features large homes and estates reminiscent of its Gilded Age history, while the eastern neighborhoods are more urban in character. Englewood is home to the Bergen Performing Arts Center and has been actively pursuing mixed-use redevelopment along Palisade Avenue and Route 9W. With 11 zoning districts including designated redevelopment zones, Englewood is working to balance historic preservation with economic growth. The city has recently adopted new design standards for its downtown area and is encouraging transit-oriented development near NJ Transit bus routes.",
    zbaSchedule: "The Englewood Board of Adjustment meets on the 3rd Tuesday of each month.",
    zbaTimeline: "5–7 weeks",
    zbaFee: "$275–$550",
    zones: [
      { code: "R-AAA", name: "Estate Residential", description: "Large estate lots", minLot: "20,000 sf", setbacks: { front: "50 ft", side: "15 ft", rear: "35 ft" }, maxHeight: "35 ft", maxCoverage: "20%", far: "0.25", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Accessory structures"], conditional: ["ADUs", "Tennis courts", "Swimming pools"], prohibited: ["Multi-family", "Commercial", "Industrial"] },
      { code: "R-AA", name: "Large Lot Residential", description: "Large single-family lots", minLot: "15,000 sf", setbacks: { front: "40 ft", side: "12 ft", rear: "30 ft" }, maxHeight: "35 ft", maxCoverage: "25%", far: "0.30", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Accessory structures"], conditional: ["ADUs", "Home businesses"], prohibited: ["Multi-family", "Commercial", "Industrial"] },
      { code: "R-A", name: "Single Family Residential", description: "Standard single-family", minLot: "10,000 sf", setbacks: { front: "30 ft", side: "10 ft", rear: "25 ft" }, maxHeight: "35 ft", maxCoverage: "30%", far: "0.35", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Parks"], conditional: ["Two-family", "ADUs", "Day care"], prohibited: ["Multi-family (3+)", "Commercial", "Industrial"] },
      { code: "R-B", name: "Two-Family Residential", description: "Two-family and singles", minLot: "7,500 sf", setbacks: { front: "25 ft", side: "8 ft", rear: "20 ft" }, maxHeight: "35 ft", maxCoverage: "35%", far: "0.45", variance: "c", permitted: ["Single-family", "Two-family", "Home occupations"], conditional: ["Multi-family (3-4)", "Group homes"], prohibited: ["Commercial", "Industrial"] },
      { code: "R-C", name: "Multi-Family Residential", description: "Apartments and garden apts", minLot: "10,000 sf", setbacks: { front: "20 ft", side: "10 ft", rear: "20 ft" }, maxHeight: "45 ft", maxCoverage: "45%", far: "1.00", variance: "d", permitted: ["Multi-family dwellings", "Townhomes", "Senior housing"], conditional: ["Mixed-use", "Assisted living"], prohibited: ["Industrial", "Heavy commercial"] },
      { code: "C-1", name: "Central Commercial", description: "Palisade Ave downtown core", minLot: "3,000 sf", setbacks: { front: "0 ft", side: "0 ft", rear: "10 ft" }, maxHeight: "50 ft", maxCoverage: "85%", far: "2.50", variance: "c", permitted: ["Retail", "Restaurants", "Offices", "Mixed-use"], conditional: ["Entertainment venues", "Hotels", "Bars"], prohibited: ["Industrial", "Auto repair", "Gas stations"] },
      { code: "C-2", name: "General Commercial", description: "Route 9W corridor", minLot: "8,000 sf", setbacks: { front: "20 ft", side: "8 ft", rear: "15 ft" }, maxHeight: "45 ft", maxCoverage: "65%", far: "1.50", variance: "c", permitted: ["Retail", "Medical offices", "Auto services", "Hotels"], conditional: ["Drive-throughs", "Gas stations", "Self-storage"], prohibited: ["Heavy industrial", "Junkyards"] },
      { code: "RD-1", name: "Redevelopment Zone 1", description: "Palisade Ave redevelopment", minLot: "5,000 sf", setbacks: { front: "5 ft", side: "0 ft", rear: "10 ft" }, maxHeight: "65 ft", maxCoverage: "80%", far: "3.00", variance: "d", permitted: ["Mixed-use developments", "Residential towers", "Retail", "Offices"], conditional: ["Hotels", "Parking structures", "Cultural facilities"], prohibited: ["Industrial", "Auto services", "Single-family"] },
    ],
    permits: [
      { name: "Building Permit", description: "Required for construction, additions, and renovations.", requirements: ["Completed application", "Two sets of construction plans", "Property survey", "Contractor license", "Lead paint notice (pre-1978 buildings)"], timeline: "4-7 weeks", fee: "$175 - $2,800", feeNote: "based on construction value" },
      { name: "Zoning Permit", description: "Required before building permit.", requirements: ["Zoning application", "Property survey", "Plot plan"], timeline: "2-3 weeks", fee: "$75 - $175", feeNote: "flat fee" },
      { name: "Demolition Permit", description: "Required for demolition work.", requirements: ["Demolition plan", "Asbestos inspection", "Historical review (if over 50 years)", "Utility disconnects"], timeline: "3-5 weeks", fee: "$225 - $550", feeNote: "plus inspection" },
      { name: "Sign Permit", description: "Required for all commercial signage.", requirements: ["Sign drawings with dimensions", "Location on building facade", "Illumination details", "Landlord consent"], timeline: "2-4 weeks", fee: "$100 - $300", feeNote: "per sign" },
    ],
    ordinanceCategories: ["All", "Noise", "Fencing", "Signage", "Parking", "Historic Preservation", "Redevelopment", "Tree Removal"],
    ordinances: [
      { category: "Noise", title: "Construction Hours", code: "§155-3", summary: "Construction Mon–Fri 7:00 AM to 6:00 PM, Saturday 8:00 AM to 5:00 PM. No Sunday construction. Evening work requires special permit from City Manager.", updated: "May 2025" },
      { category: "Fencing", title: "Fence Height and Materials", code: "§245-20", summary: "Maximum fence height: 6 ft rear/side, 4 ft front. Wrought iron, wood, and vinyl permitted. Chain-link must have vinyl coating. Barbed wire prohibited.", updated: "March 2025" },
      { category: "Historic Preservation", title: "Historic District Regulations", code: "§245-65", summary: "Properties within the Englewood Historic District require Historic Preservation Commission approval for exterior alterations. Demolition of contributing structures prohibited without HPC review.", updated: "October 2025" },
      { category: "Redevelopment", title: "Palisade Avenue Redevelopment Plan", code: "§245-R1", summary: "The Palisade Avenue Redevelopment Zone permits mixed-use development up to 65 ft with ground-floor retail requirement. Affordable housing set-aside of 15% required.", updated: "January 2026" },
      { category: "Parking", title: "Parking Requirements", code: "§245-35", summary: "Single-family: 2 spaces. Multi-family: 1.5 per unit. Commercial: 1 per 300 sf. Payment in lieu of parking available in downtown zone ($15,000/space).", updated: "August 2025" },
      { category: "Tree Removal", title: "Tree Protection", code: "§290-5", summary: "Tree removal permit required for trees 6 inches diameter or greater. Three-for-one replacement ratio. Heritage trees require Planning Board approval for removal.", updated: "July 2025" },
    ],
    departments: [
      { name: "Building Department", description: "Handles permits, inspections, and code enforcement.", phone: "(201) 871-6550", email: "building@cityofenglewood.org", hours: "Mon–Fri 8:30 AM – 4:30 PM", address: "2-10 N Van Brunt St, Englewood, NJ 07631", website: "https://www.cityofenglewood.org/building", portalLabel: "Permit Portal", portalUrl: "#" },
      { name: "Zoning Board of Adjustment", description: "Reviews variance applications.", phone: "(201) 871-6552", email: "zoning@cityofenglewood.org", hours: "By appointment", address: "2-10 N Van Brunt St, Englewood, NJ 07631", meetings: "3rd Tuesday of each month, 7:30 PM", deadlines: "Applications due 30 days before meeting", contact: "Gloria Hernandez, Board Secretary" },
      { name: "Planning Board", description: "Reviews site plans, subdivisions, and redevelopment.", phone: "(201) 871-6554", email: "planning@cityofenglewood.org", hours: "By appointment", address: "2-10 N Van Brunt St, Englewood, NJ 07631", meetings: "1st Tuesday of each month, 7:30 PM", contact: "William Torres, Board Secretary" },
    ],
    upcomingMeetings: [
      { board: "Zoning Board of Adjustment", date: "April 21, 2026", time: "7:30 PM", location: "City Hall, 2-10 N Van Brunt St" },
      { board: "Planning Board", date: "May 5, 2026", time: "7:30 PM", location: "City Hall, 2-10 N Van Brunt St" },
    ],
    communityNotes: [
      { author: "Marcus W.", badge: "Licensed Contractor", note: "If your project is in the historic district, expect an extra 3-4 weeks for HPC review. Submit photos of the existing building early.", upvotes: 14, date: "Jan 2026" },
      { author: "Elena R.", badge: "Licensed Contractor", note: "The redevelopment zone has different rules — standard zoning tables don't apply. Get the redevelopment plan document from the Planning Dept.", upvotes: 10, date: "Dec 2025" },
      { author: "Chris D.", badge: "Licensed Contractor", note: "Lead paint notice is required for all work on pre-1978 buildings. Keep the EPA RRP rule compliance docs ready for inspection.", upvotes: 6, date: "Jan 2026" },
    ],
    nearbyTowns: [
      { name: "Teaneck", medianHome: "$475,000", zones: 9, slug: "teaneck" },
      { name: "Fort Lee", medianHome: "$490,000", zones: 10, slug: "fort-lee" },
      { name: "Englewood Cliffs", medianHome: "$1,200,000", zones: 5 },
      { name: "Hackensack", medianHome: "$420,000", zones: 12, slug: "hackensack" },
    ],
    officialLinks: [
      { label: "City of Englewood Official Website", url: "https://www.cityofenglewood.org" },
      { label: "Online Permit Portal", url: "#" },
      { label: "Meeting Agendas & Minutes", url: "#" },
      { label: "Municipal Code (eCode360)", url: "#" },
    ],
  },

  "glen-rock": {
    slug: "glen-rock",
    name: "Glen Rock",
    fullName: "Borough of Glen Rock",
    county: "Bergen",
    updated: "Jan 18, 2026",
    source: "Glen Rock Borough Code",
    population: "11,926",
    medianHome: "$635,000",
    totalArea: "2.8 sq mi",
    numZones: 6,
    character: "The Borough of Glen Rock is a small, quiet suburban community situated between Ridgewood and Fair Lawn in Bergen County. Known for its excellent schools, small-town charm, and NJ Transit rail access, Glen Rock is predominantly single-family residential with a compact downtown along Rock Road. The borough features a mix of Colonial, Cape Cod, and split-level homes built primarily between the 1920s and 1960s. Glen Rock has 6 zoning districts, reflecting its straightforward residential character with limited commercial activity. The borough is particularly strict about maintaining its residential neighborhoods and has conservative lot coverage and FAR requirements. Recent ordinance updates have addressed solar panel installations, electric vehicle charging stations, and updated accessory structure regulations.",
    zbaSchedule: "The Glen Rock Board of Adjustment meets on the 3rd Wednesday of each month.",
    zbaTimeline: "4–6 weeks",
    zbaFee: "$200–$400",
    zones: [
      { code: "R-1", name: "Single Family Residential A", description: "Large-lot single-family", minLot: "12,000 sf", setbacks: { front: "35 ft", side: "10 ft", rear: "25 ft" }, maxHeight: "35 ft", maxCoverage: "28%", far: "0.30", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Accessory structures", "Parks"], conditional: ["ADUs", "Home businesses", "Solar installations"], prohibited: ["Multi-family", "Commercial", "Industrial"] },
      { code: "R-2", name: "Single Family Residential B", description: "Standard single-family", minLot: "9,000 sf", setbacks: { front: "30 ft", side: "8 ft", rear: "20 ft" }, maxHeight: "35 ft", maxCoverage: "30%", far: "0.33", variance: "c", permitted: ["Single-family dwellings", "Home occupations", "Accessory structures"], conditional: ["Two-family conversions", "ADUs", "Pools"], prohibited: ["Multi-family", "Commercial", "Industrial"] },
      { code: "R-3", name: "Single Family Residential C", description: "Smaller-lot single-family", minLot: "7,500 sf", setbacks: { front: "25 ft", side: "6 ft", rear: "15 ft" }, maxHeight: "35 ft", maxCoverage: "32%", far: "0.35", variance: "c", permitted: ["Single-family dwellings", "Home occupations"], conditional: ["Two-family", "ADUs", "Day care"], prohibited: ["Multi-family (3+)", "Commercial", "Industrial"] },
      { code: "R-4", name: "Multi-Family Residential", description: "Townhomes and garden apartments", minLot: "15,000 sf", setbacks: { front: "30 ft", side: "12 ft", rear: "25 ft" }, maxHeight: "38 ft", maxCoverage: "35%", far: "0.50", variance: "d", permitted: ["Multi-family dwellings", "Townhomes", "Senior housing"], conditional: ["Assisted living", "Mixed-use"], prohibited: ["Commercial-only", "Industrial", "Auto services"] },
      { code: "B-1", name: "Business", description: "Rock Road downtown commercial", minLot: "5,000 sf", setbacks: { front: "5 ft", side: "0 ft", rear: "10 ft" }, maxHeight: "35 ft", maxCoverage: "70%", far: "1.50", variance: "c", permitted: ["Retail", "Restaurants", "Offices", "Banks"], conditional: ["Mixed-use residential above", "Bars", "Drive-throughs"], prohibited: ["Industrial", "Auto repair", "Gas stations", "Warehousing"] },
      { code: "I-1", name: "Light Industrial", description: "Limited industrial/commercial", minLot: "10,000 sf", setbacks: { front: "20 ft", side: "10 ft", rear: "15 ft" }, maxHeight: "40 ft", maxCoverage: "55%", far: "0.80", variance: "d", permitted: ["Light manufacturing", "Warehousing", "Office parks"], conditional: ["Outdoor storage", "Heavy equipment"], prohibited: ["Residential", "Schools", "Retail"] },
    ],
    permits: [
      { name: "Building Permit", description: "Required for construction, additions, and renovations.", requirements: ["Completed application", "Two sets of construction plans", "Property survey", "Contractor license"], timeline: "3-5 weeks", fee: "$150 - $2,000", feeNote: "based on project value" },
      { name: "Zoning Permit", description: "Required before building permit.", requirements: ["Zoning application", "Survey showing setbacks", "Plot plan"], timeline: "1-2 weeks", fee: "$50 - $125", feeNote: "flat fee" },
      { name: "Demolition Permit", description: "Required for demolition.", requirements: ["Demolition plan", "Asbestos inspection", "Utility disconnects"], timeline: "2-3 weeks", fee: "$175 - $450", feeNote: "plus inspection fees" },
      { name: "Electrical Permit", description: "Required for electrical modifications.", requirements: ["Licensed electrician info", "Scope of work", "Plans"], timeline: "1-2 weeks", fee: "$70 - $275", feeNote: "based on amperage" },
    ],
    ordinanceCategories: ["All", "Noise", "Fencing", "Parking", "Tree Removal", "Solar Panels", "Accessory Structures"],
    ordinances: [
      { category: "Noise", title: "Construction Hours", code: "§120-4", summary: "Construction Mon–Fri 7:30 AM to 6:00 PM, Saturday 8:00 AM to 4:00 PM. No Sunday or holiday construction. Power equipment restricted to 8 AM–7 PM.", updated: "May 2025" },
      { category: "Fencing", title: "Fence Regulations", code: "§215-12", summary: "Fences may not exceed 6 ft in rear yards, 4 ft in front and side yards forward of the building line. Decorative fencing only in front yards. Permit required for all fences.", updated: "March 2025" },
      { category: "Tree Removal", title: "Tree Preservation", code: "§250-7", summary: "Permit required for trees 8 inches diameter or more. One-for-one replacement required. Significant trees (18+ inches) require two replacements.", updated: "September 2025" },
      { category: "Solar Panels", title: "Solar Energy Systems", code: "§215-55", summary: "Solar panels permitted on residential rooftops without variance if flush-mounted and not exceeding roof height by more than 12 inches. Ground-mounted solar requires a zoning permit.", updated: "January 2026" },
      { category: "Parking", title: "Residential Parking", code: "§215-25", summary: "Two off-street parking spaces required per dwelling unit. No overnight parking on borough streets (2 AM – 6 AM). RVs and boats must be stored behind the front building line.", updated: "April 2025" },
      { category: "Accessory Structures", title: "Sheds and Accessory Buildings", code: "§215-18", summary: "Sheds under 100 sf exempt from building permit but require zoning permit. Maximum height 10 ft. Must be at least 5 ft from property lines and behind the front building line.", updated: "November 2025" },
    ],
    departments: [
      { name: "Building Department", description: "Handles permits, inspections, and code enforcement.", phone: "(201) 670-3956", email: "building@glenrocknj.net", hours: "Mon–Fri 8:30 AM – 4:00 PM", address: "1 Harding Plz, Glen Rock, NJ 07452", website: "https://www.glenrocknj.net/building", portalLabel: "Permit Info", portalUrl: "#" },
      { name: "Zoning Board of Adjustment", description: "Reviews variance applications.", phone: "(201) 670-3958", email: "zoning@glenrocknj.net", hours: "By appointment", address: "1 Harding Plz, Glen Rock, NJ 07452", meetings: "3rd Wednesday of each month, 7:30 PM", deadlines: "Applications due 21 days before meeting", contact: "Karen DeSilva, Board Secretary" },
      { name: "Planning Board", description: "Reviews site plans and subdivisions.", phone: "(201) 670-3960", email: "planning@glenrocknj.net", hours: "By appointment", address: "1 Harding Plz, Glen Rock, NJ 07452", meetings: "2nd Wednesday of each month, 7:30 PM", contact: "Thomas Brennan, Board Secretary" },
    ],
    upcomingMeetings: [
      { board: "Zoning Board of Adjustment", date: "April 15, 2026", time: "7:30 PM", location: "Borough Hall, 1 Harding Plz" },
      { board: "Planning Board", date: "April 8, 2026", time: "7:30 PM", location: "Borough Hall, 1 Harding Plz" },
    ],
    communityNotes: [
      { author: "Phil H.", badge: "Licensed Contractor", note: "Glen Rock is very strict about lot coverage calculations — make sure your survey includes all impervious surfaces including walkways and driveways.", upvotes: 11, date: "Jan 2026" },
      { author: "Janet C.", badge: "Licensed Contractor", note: "Small town feel — you can walk in without an appointment and usually talk to someone. But call ahead during spring rush.", upvotes: 7, date: "Dec 2025" },
      { author: "Mike P.", badge: "Licensed Contractor", note: "Solar panel installations are straightforward here compared to other towns. They recently simplified the process.", upvotes: 5, date: "Jan 2026" },
    ],
    nearbyTowns: [
      { name: "Ridgewood", medianHome: "$825,000", zones: 14, slug: "ridgewood" },
      { name: "Fair Lawn", medianHome: "$490,000", zones: 15 },
      { name: "Midland Park", medianHome: "$475,000", zones: 6 },
      { name: "Hawthorne", medianHome: "$430,000", zones: 10 },
    ],
    officialLinks: [
      { label: "Borough of Glen Rock Official Website", url: "https://www.glenrocknj.net" },
      { label: "Permit Information", url: "#" },
      { label: "Meeting Agendas & Minutes", url: "#" },
      { label: "Municipal Code", url: "#" },
    ],
  },
};

export function getFullTownData(slug: string): FullTownData | undefined {
  return fullTownData[slug];
}
