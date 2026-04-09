import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Noise", "Fencing", "Signage", "Parking", "Short-term Rentals", "Tree Removal", "Demolition", "Blue Laws"];

const ordinances = [
  { category: "Fencing", title: "Fence Height Regulations", code: "§250-45", summary: "Fences in residential zones may not exceed 6 ft in side/rear yards and 4 ft in front yards. Solid fences over 4 ft require a zoning permit.", updated: "April 2025" },
  { category: "Noise", title: "Construction Hours", code: "§220-8", summary: "Construction permitted Mon–Fri 7:00 AM to 6:00 PM, Saturday 8:00 AM to 4:00 PM. No construction on Sundays (see Blue Laws).", updated: "July 2025" },
  { category: "Blue Laws", title: "Sunday Closing Regulations", code: "§175-1", summary: "Most retail businesses are prohibited from operating on Sundays within the Borough of Paramus. Exceptions include restaurants, gas stations, and pharmacies.", updated: "January 2024" },
  { category: "Parking", title: "Residential Parking Requirements", code: "§250-60", summary: "Single-family: 2 spaces. Multi-family: 1.5 per unit. No commercial vehicles over 8,000 lbs in residential zones overnight.", updated: "March 2025" },
  { category: "Short-term Rentals", title: "Short-term Rental Prohibition", code: "§250-88", summary: "Short-term rentals (less than 30 days) are prohibited in all zones. Fines of $500–$1,500 per violation.", updated: "September 2025" },
  { category: "Tree Removal", title: "Tree Removal Permit", code: "§280-5", summary: "Permit required for removing trees with trunk diameter of 6 inches or more. Two replacement trees required for each removed tree.", updated: "June 2025" },
  { category: "Demolition", title: "Demolition Requirements", code: "§250-92", summary: "Full demolition requires permit, asbestos survey, utility disconnects, and 21-day notice period.", updated: "February 2025" },
  { category: "Signage", title: "Commercial Sign Regulations", code: "§250-70", summary: "Signs in B-1 and B-2 zones require permits. Maximum area: 1.5 sq ft per linear foot of building frontage. LED signs restricted to shopping centers.", updated: "November 2025" },
];

export default function ParamusOrdinances() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = ordinances.filter((o) => {
    const matchesCat = activeCategory === "All" || o.category === activeCategory;
    const matchesSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <TownProfileLayout townSlug="paramus">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Local Ordinances</h2>
        <p className="text-sm text-muted-foreground">Searchable, categorized local ordinances for Paramus.</p>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search ordinances…" className="pl-9 h-9 bg-secondary border-0" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeCategory === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >{cat}</button>
        ))}
      </div>
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
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No ordinances match your search.</p>}
      </div>
    </TownProfileLayout>
  );
}
