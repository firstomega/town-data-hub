import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Noise", "Fencing", "Signage", "Parking", "Short-term Rentals", "Tree Removal", "Demolition"];

const ordinances = [
  { category: "Fencing", title: "Fence Height Regulations", code: "§190-73", summary: "Fences in residential zones shall not exceed 6 ft in side/rear yards and 4 ft in front yards. Corner lots treat street-side yards as front yards.", updated: "March 2025" },
  { category: "Fencing", title: "Fence Materials", code: "§190-73.1", summary: "Chain-link fencing is prohibited in front yards. All fences must be finished on the exterior-facing side.", updated: "January 2024" },
  { category: "Noise", title: "Construction Hours", code: "§186-4", summary: "Construction activities are permitted Monday–Friday 7:00 AM to 6:00 PM, Saturday 8:00 AM to 5:00 PM. No construction on Sundays or federal holidays.", updated: "June 2025" },
  { category: "Noise", title: "General Noise Restrictions", code: "§186-2", summary: "Unreasonable noise that disturbs the peace is prohibited at all times. Power equipment (leaf blowers, mowers) restricted to 7 AM–8 PM weekdays, 8 AM–6 PM weekends.", updated: "June 2025" },
  { category: "Signage", title: "Residential Sign Regulations", code: "§190-95", summary: "One non-illuminated sign per residential property, max 2 sq ft. Real estate signs max 6 sq ft, must be removed within 7 days of sale/lease.", updated: "September 2024" },
  { category: "Signage", title: "Commercial Sign Regulations", code: "§190-96", summary: "Signs in commercial zones require a sign permit. Maximum sign area is 10% of the building façade. Internally illuminated signs require Planning Board approval.", updated: "September 2024" },
  { category: "Parking", title: "Residential Parking Requirements", code: "§190-82", summary: "Single-family homes require 2 off-street parking spaces. Multi-family requires 1.5 spaces per unit. No commercial vehicles over 10,000 lbs may be parked in residential zones.", updated: "April 2025" },
  { category: "Short-term Rentals", title: "Short-term Rental Regulations", code: "§190-110", summary: "Short-term rentals (less than 30 days) are prohibited in all residential zones. Violations subject to fines of $500–$2,000 per occurrence.", updated: "November 2025" },
  { category: "Tree Removal", title: "Tree Preservation Ordinance", code: "§227-3", summary: "A permit is required to remove any tree with a trunk diameter of 8 inches or more. Replacement trees may be required. Emergency removals must be reported within 48 hours.", updated: "August 2025" },
  { category: "Demolition", title: "Demolition Requirements", code: "§190-105", summary: "Full demolition requires a demolition permit, asbestos survey, utility disconnect confirmations, and a 30-day public notice period. Partial demolitions may qualify for expedited review.", updated: "February 2025" },
];

export default function TownOrdinances() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = ordinances.filter((o) => {
    const matchesCategory = activeCategory === "All" || o.category === activeCategory;
    const matchesSearch = search === "" || o.title.toLowerCase().includes(search.toLowerCase()) || o.summary.toLowerCase().includes(search.toLowerCase()) || o.code.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <TownProfileLayout>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Local Ordinances</h2>
        <p className="text-sm text-muted-foreground">Searchable, categorized local ordinances for Ridgewood.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search ordinances by keyword or code…"
          className="pl-9 h-9 bg-secondary border-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeCategory === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ordinance List */}
      <div className="space-y-3">
        {filtered.map((o) => (
          <Card key={o.code}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] font-mono">{o.code}</Badge>
                  <Badge variant="outline" className="text-[10px]">{o.category}</Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">Updated {o.updated}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{o.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{o.summary}</p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No ordinances match your search.</p>
        )}
      </div>
    </TownProfileLayout>
  );
}
