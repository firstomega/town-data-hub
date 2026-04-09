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
    code: "R-1", name: "Single Family Residential", description: "Large-lot single-family homes",
    minLot: "12,000 sf", setbacks: { front: "30 ft", side: "10 ft", rear: "25 ft" },
    maxHeight: "35 ft", maxCoverage: "30%", far: "0.35", variance: "c",
    permitted: ["Single-family dwellings", "Home occupations", "Accessory structures", "Houses of worship"],
    conditional: ["ADUs (all residential zones)", "Home-based businesses", "Group homes"],
    prohibited: ["Multi-family dwellings", "Commercial uses", "Industrial uses"],
  },
  {
    code: "R-2", name: "Single Family Residential", description: "Medium-lot single-family",
    minLot: "8,500 sf", setbacks: { front: "25 ft", side: "8 ft", rear: "20 ft" },
    maxHeight: "35 ft", maxCoverage: "35%", far: "0.40", variance: "c",
    permitted: ["Single-family dwellings", "Home occupations", "Parks", "Accessory structures"],
    conditional: ["Two-family dwellings", "ADUs", "Day care"],
    prohibited: ["Multi-family (3+)", "Commercial", "Industrial"],
  },
  {
    code: "R-3", name: "Multi-Family Residential", description: "Townhomes and apartments",
    minLot: "6,000 sf", setbacks: { front: "20 ft", side: "6 ft", rear: "15 ft" },
    maxHeight: "40 ft", maxCoverage: "40%", far: "0.60", variance: "d",
    permitted: ["Multi-family dwellings", "Townhouses", "Senior housing"],
    conditional: ["Mixed-use", "Assisted living", "Group homes"],
    prohibited: ["Industrial", "Heavy commercial", "Auto services"],
  },
  {
    code: "B-1", name: "Neighborhood Business", description: "Local retail and services",
    minLot: "5,000 sf", setbacks: { front: "10 ft", side: "5 ft", rear: "15 ft" },
    maxHeight: "35 ft", maxCoverage: "65%", far: "1.50", variance: "c",
    permitted: ["Retail", "Restaurants", "Professional offices", "Banks"],
    conditional: ["Drive-through", "Mixed-use residential above"],
    prohibited: ["Industrial", "Auto repair", "Warehousing"],
  },
  {
    code: "B-2", name: "Highway Business", description: "Route 4/17 commercial corridor",
    minLot: "15,000 sf", setbacks: { front: "40 ft", side: "15 ft", rear: "25 ft" },
    maxHeight: "45 ft", maxCoverage: "55%", far: "1.00", variance: "c",
    permitted: ["Shopping centers", "Auto dealerships", "Hotels", "Offices"],
    conditional: ["Gas stations", "Self-storage", "Entertainment venues"],
    prohibited: ["Residential", "Heavy industrial", "Junkyards"],
  },
];

export default function ParamusZoning() {
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  return (
    <TownProfileLayout townSlug="paramus">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Zoning Districts</h2>
          <p className="text-sm text-muted-foreground">All zone types with key dimensional requirements.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <FileDown className="h-3.5 w-3.5" /> Download Zone Summary
          </Button>
          <Badge variant="secondary" className="text-xs">11 Districts</Badge>
        </div>
      </div>

      <Card>
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
                      <Badge variant={z.code.startsWith("R") ? "default" : "secondary"} className="font-mono text-xs">{z.code}</Badge>
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
                            <ul className="space-y-1">{z.permitted.map((u) => <li key={u} className="text-xs text-muted-foreground">• {u}</li>)}</ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-warning mb-2">Conditional Uses</p>
                            <ul className="space-y-1">{z.conditional.map((u) => <li key={u} className="text-xs text-muted-foreground">• {u}</li>)}</ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-destructive mb-2">Prohibited Uses</p>
                            <ul className="space-y-1">{z.prohibited.map((u) => <li key={u} className="text-xs text-muted-foreground">• {u}</li>)}</ul>
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
    </TownProfileLayout>
  );
}
