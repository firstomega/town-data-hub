import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

const glossaryTerms = [
  { term: "Setback", definition: "The minimum required distance between a structure and a property line (front, side, or rear). Setbacks vary by zone and are designed to ensure adequate light, air, and open space between buildings.", related: ["Yard", "Lot Coverage"] },
  { term: "Floor Area Ratio (FAR)", definition: "The ratio of a building's total floor area to the size of the lot on which it is built. A FAR of 0.35 on a 10,000 sq ft lot means the maximum floor area is 3,500 sq ft.", related: ["Lot Coverage", "Bulk Requirements"] },
  { term: "Lot Coverage", definition: "The percentage of a lot that is covered by buildings and impervious surfaces. Maximum lot coverage limits are set by the zoning ordinance for each zone district.", related: ["FAR", "Impervious Coverage"] },
  { term: "Impervious Coverage", definition: "The total area of surfaces that do not absorb water, including buildings, driveways, patios, and walkways. Many towns set a maximum impervious coverage percentage to manage stormwater runoff.", related: ["Lot Coverage", "Stormwater Management"] },
  { term: "Variance", definition: "Permission to depart from the literal requirements of a zoning ordinance. There are two main types: 'C' variances (bulk/area) and 'D' variances (use). Variances are granted by the Zoning Board of Adjustment.", related: ["C Variance", "D Variance", "Board of Adjustment"] },
  { term: "C Variance (Bulk Variance)", definition: "A variance that allows deviation from dimensional or physical requirements like setbacks, height limits, lot coverage, or lot size. Requires showing that strict compliance would cause undue hardship.", related: ["Variance", "Setback", "Bulk Requirements"] },
  { term: "D Variance (Use Variance)", definition: "A variance that allows a use not otherwise permitted in a particular zone. Requires a higher burden of proof than a C variance, including showing special reasons and that the variance can be granted without substantial detriment to the public good.", related: ["Variance", "Permitted Use"] },
  { term: "Permitted Use", definition: "A land use that is allowed as of right in a particular zoning district without need for special approval. Examples include single-family homes in residential zones.", related: ["Conditional Use", "D Variance"] },
  { term: "Conditional Use", definition: "A use that is allowed in a zone only if specific conditions are met, such as site plan approval, buffering, or parking requirements. Requires Planning Board approval.", related: ["Permitted Use", "Site Plan"] },
  { term: "Nonconforming Use", definition: "A land use that was legal when established but no longer conforms to current zoning regulations. Nonconforming uses are generally allowed to continue but cannot be expanded.", related: ["Variance", "Grandfathered"] },
  { term: "Accessory Dwelling Unit (ADU)", definition: "A secondary residential unit on a single-family lot, such as a basement apartment, garage conversion, or detached cottage. ADU regulations vary significantly by municipality in New Jersey.", related: ["Permitted Use", "Conditional Use"] },
  { term: "Site Plan", definition: "A detailed plan showing the proposed development of a property, including buildings, parking, landscaping, drainage, and utilities. Required for most commercial and multi-family development.", related: ["Planning Board", "Conditional Use"] },
  { term: "Board of Adjustment", definition: "A municipal board that hears and decides applications for variances and certain appeals of zoning determinations. Also known as the Zoning Board of Adjustment (ZBA).", related: ["Variance", "C Variance", "D Variance"] },
  { term: "Planning Board", definition: "A municipal board responsible for reviewing site plans, subdivisions, and conditional use applications. Also maintains and updates the municipal Master Plan.", related: ["Site Plan", "Subdivision", "Master Plan"] },
  { term: "Master Plan", definition: "A comprehensive long-range plan for the physical development of a municipality. The zoning ordinance must be substantially consistent with the Master Plan.", related: ["Planning Board", "Zoning Ordinance"] },
  { term: "Bulk Requirements", definition: "The set of dimensional standards in a zoning ordinance including lot size, lot width, setbacks, building height, FAR, and lot coverage. Also called 'area' or 'dimensional' requirements.", related: ["Setback", "FAR", "Lot Coverage", "C Variance"] },
  { term: "Certificate of Occupancy (CO)", definition: "An official document issued after final inspection confirming that a building complies with all applicable codes and is safe for occupancy. Required before moving into a new or renovated structure.", related: ["Building Permit", "Inspection"] },
  { term: "Subdivision", definition: "The division of a lot or parcel into two or more lots. Requires Planning Board approval and must comply with lot size and frontage requirements of the zone.", related: ["Planning Board", "Lot Size"] },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filtered = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl flex-1">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold text-primary">Zoning Glossary</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Definitions of common zoning and land use terms used across New Jersey municipalities.
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms…"
            className="pl-9 bg-secondary border-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filtered.map((t) => (
            <Card key={t.term} id={t.term.toLowerCase().replace(/\s+/g, "-")}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-1">{t.term}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.definition}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.related.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs cursor-pointer" onClick={() => {
                      setSearch("");
                      const el = document.getElementById(r.toLowerCase().replace(/\s+/g, "-"));
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}>
                      {r}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No matching terms</p>
              <p className="text-sm">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
