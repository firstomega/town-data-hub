import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const zones = [
  {
    code: "R-1", name: "Single Family Residential", description: "Low-density single-family homes",
    minLot: "15,000 sf", setbacks: { front: "40 ft", side: "12 ft", rear: "30 ft" },
    maxHeight: "35 ft", maxCoverage: "25%", far: "0.30",
    uses: "Single-family dwellings, home occupations, accessory structures",
    variance: "c",
    permitted: ["Single-family detached dwellings", "Home occupations (with conditions)", "Accessory structures (sheds, garages)", "Places of worship"],
    conditional: ["Accessory dwelling units (ADUs)", "Home-based businesses with employees", "Bed & breakfast (max 3 rooms)"],
    prohibited: ["Multi-family dwellings", "Commercial uses", "Industrial uses", "Short-term rentals (<30 days)"],
  },
  {
    code: "R-2", name: "Single Family Residential", description: "Medium-density single-family homes",
    minLot: "10,000 sf", setbacks: { front: "35 ft", side: "10 ft", rear: "25 ft" },
    maxHeight: "35 ft", maxCoverage: "30%", far: "0.35",
    uses: "Single-family dwellings, home occupations, accessory structures",
    variance: "c",
    permitted: ["Single-family detached dwellings", "Home occupations", "Accessory structures", "Parks and playgrounds"],
    conditional: ["Two-family dwellings (with variance)", "ADUs", "Day care centers"],
    prohibited: ["Multi-family (3+ units)", "Commercial uses", "Industrial uses"],
  },
  {
    code: "R-3", name: "Multi-Family Residential", description: "Multi-family and townhomes",
    minLot: "7,500 sf", setbacks: { front: "30 ft", side: "8 ft", rear: "20 ft" },
    maxHeight: "40 ft", maxCoverage: "35%", far: "0.50",
    uses: "Multi-family dwellings, townhouses, senior housing",
    variance: "d",
    permitted: ["Multi-family dwellings", "Townhouses", "Senior housing", "Home occupations"],
    conditional: ["Mixed-use (ground floor commercial)", "Group homes", "Assisted living"],
    prohibited: ["Industrial uses", "Heavy commercial", "Auto repair/sales"],
  },
  {
    code: "C-1", name: "Central Business", description: "Downtown commercial core",
    minLot: "5,000 sf", setbacks: { front: "0 ft", side: "0 ft", rear: "10 ft" },
    maxHeight: "45 ft", maxCoverage: "80%", far: "2.00",
    uses: "Retail, restaurants, offices, mixed-use",
    variance: "c",
    permitted: ["Retail stores", "Restaurants & cafés", "Professional offices", "Mixed-use (residential above)"],
    conditional: ["Drive-through facilities", "Bars/nightclubs", "Hotels"],
    prohibited: ["Industrial uses", "Auto repair", "Gas stations", "Warehousing"],
  },
  {
    code: "C-2", name: "General Commercial", description: "Highway commercial and services",
    minLot: "10,000 sf", setbacks: { front: "25 ft", side: "10 ft", rear: "20 ft" },
    maxHeight: "40 ft", maxCoverage: "60%", far: "1.00",
    uses: "Retail, auto services, offices, medical",
    variance: "c",
    permitted: ["Retail stores", "Auto service stations", "Medical offices", "Banks"],
    conditional: ["Drive-through restaurants", "Car dealerships", "Self-storage"],
    prohibited: ["Heavy industrial", "Junkyards", "Adult entertainment"],
  },
  {
    code: "I-1", name: "Light Industrial", description: "Light manufacturing and warehousing",
    minLot: "20,000 sf", setbacks: { front: "30 ft", side: "15 ft", rear: "25 ft" },
    maxHeight: "45 ft", maxCoverage: "50%", far: "0.75",
    uses: "Light manufacturing, warehousing, research",
    variance: "d",
    permitted: ["Light manufacturing", "Warehousing/distribution", "Research laboratories", "Office parks"],
    conditional: ["Heavy manufacturing", "Waste processing", "Outdoor storage"],
    prohibited: ["Residential uses", "Schools", "Hospitals", "Retail (except accessory)"],
  },
];

export default function TownZoning() {
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  return (
    <TownProfileLayout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Zoning Districts</h2>
          <p className="text-sm text-muted-foreground">
            All zone types with key dimensional requirements. Hover dotted terms for definitions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <FileDown className="h-3.5 w-3.5" /> Download Zone Summary
          </Button>
          <Badge variant="secondary" className="text-xs">14 Districts</Badge>
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="w-20 font-semibold">Zone</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Min Lot</TableHead>
                <TableHead className="font-semibold"><GlossaryTooltip term="Setback" /> (F/S/R)</TableHead>
                <TableHead className="font-semibold">Max Height</TableHead>
                <TableHead className="font-semibold"><GlossaryTooltip term="Lot Coverage" /></TableHead>
                <TableHead className="font-semibold"><GlossaryTooltip term="FAR" /></TableHead>
                <TableHead className="font-semibold">Variance</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((z, i) => (
                <>
                  <TableRow
                    key={z.code}
                    className={`cursor-pointer ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-secondary/40`}
                    onClick={() => setExpandedZone(expandedZone === z.code ? null : z.code)}
                  >
                    <TableCell>
                      <Badge variant={z.code.startsWith("R") ? "default" : z.code.startsWith("C") ? "secondary" : "outline"} className="font-mono text-xs">
                        {z.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{z.name}</p>
                      <p className="text-xs text-muted-foreground">{z.description}</p>
                    </TableCell>
                    <TableCell className="text-sm">{z.minLot}</TableCell>
                    <TableCell className="text-sm font-mono text-xs">{z.setbacks.front}/{z.setbacks.side}/{z.setbacks.rear}</TableCell>
                    <TableCell className="text-sm">{z.maxHeight}</TableCell>
                    <TableCell className="text-sm font-semibold">{z.maxCoverage}</TableCell>
                    <TableCell className="text-sm font-mono">{z.far}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {z.variance === "c" ? '"c" bulk' : '"d" use'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expandedZone === z.code ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                    </TableCell>
                  </TableRow>
                  {expandedZone === z.code && (
                    <TableRow key={`${z.code}-expanded`}>
                      <TableCell colSpan={9} className="bg-secondary/10 p-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-success mb-2">Permitted Uses</p>
                            <ul className="space-y-1">
                              {z.permitted.map((u) => (
                                <li key={u} className="text-xs text-muted-foreground">• {u}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-warning mb-2">Conditional Uses</p>
                            <ul className="space-y-1">
                              {z.conditional.map((u) => (
                                <li key={u} className="text-xs text-muted-foreground">• {u}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-destructive mb-2">Prohibited Uses</p>
                            <ul className="space-y-1">
                              {z.prohibited.map((u) => (
                                <li key={u} className="text-xs text-muted-foreground">• {u}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {zones.map((z) => (
          <Card key={z.code}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="font-mono text-xs">{z.code}</Badge>
                <span className="text-sm font-semibold">{z.name}</span>
                <Badge variant="outline" className="text-[10px] font-mono ml-auto">
                  {z.variance === "c" ? '"c"' : '"d"'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{z.description}</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div><span className="text-muted-foreground">Min Lot:</span> <span className="font-medium">{z.minLot}</span></div>
                <div><span className="text-muted-foreground">Max Height:</span> <span className="font-medium">{z.maxHeight}</span></div>
                <div><span className="text-muted-foreground"><GlossaryTooltip term="Setback" />s:</span> <span className="font-medium font-mono">{z.setbacks.front}/{z.setbacks.side}/{z.setbacks.rear}</span></div>
                <div><span className="text-muted-foreground"><GlossaryTooltip term="Lot Coverage" />:</span> <span className="font-medium">{z.maxCoverage}</span></div>
                <div><span className="text-muted-foreground"><GlossaryTooltip term="FAR" />:</span> <span className="font-medium">{z.far}</span></div>
              </div>
              <button
                className="mt-3 text-xs text-accent hover:underline"
                onClick={() => setExpandedZone(expandedZone === z.code ? null : z.code)}
              >
                {expandedZone === z.code ? "Hide uses ▴" : "Show permitted/conditional/prohibited uses ▾"}
              </button>
              {expandedZone === z.code && (
                <div className="mt-3 pt-3 border-t space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-success mb-1">Permitted</p>
                    {z.permitted.map((u) => <p key={u} className="text-xs text-muted-foreground">• {u}</p>)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-warning mb-1">Conditional</p>
                    {z.conditional.map((u) => <p key={u} className="text-xs text-muted-foreground">• {u}</p>)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-destructive mb-1">Prohibited</p>
                    {z.prohibited.map((u) => <p key={u} className="text-xs text-muted-foreground">• {u}</p>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TownProfileLayout>
  );
}
