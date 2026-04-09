import { NavBar } from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisonData = [
  { metric: "Population", ridgewood: "25,255", paramus: "26,342", type: "info" },
  { metric: "Median Home Value", ridgewood: "$825,000", paramus: "$580,000", type: "info" },
  { metric: "Zoning Districts", ridgewood: "14", paramus: "11", type: "info" },
  { metric: "R-1 Front Setback", ridgewood: "40 ft", paramus: "30 ft", type: "compare", winner: "paramus" },
  { metric: "R-1 Side Setback", ridgewood: "12 ft", paramus: "10 ft", type: "compare", winner: "paramus" },
  { metric: "R-1 Rear Setback", ridgewood: "30 ft", paramus: "25 ft", type: "compare", winner: "paramus" },
  { metric: "Max Lot Coverage (R-1)", ridgewood: "25%", paramus: "30%", type: "compare", winner: "paramus" },
  { metric: "Max Building Height", ridgewood: "35 ft", paramus: "35 ft", type: "compare", winner: "tie" },
  { metric: "Permit Turnaround", ridgewood: "4-6 weeks", paramus: "3-4 weeks", type: "compare", winner: "paramus" },
  { metric: "Building Permit Fee", ridgewood: "$150-$2,500", paramus: "$125-$2,000", type: "compare", winner: "paramus" },
  { metric: "ADU Permitted", ridgewood: "Yes (conditional)", paramus: "Yes (all residential)", type: "compare", winner: "paramus" },
  { metric: "Fence Max Height (rear)", ridgewood: "6 ft", paramus: "6 ft", type: "compare", winner: "tie" },
];

function CompareIndicator({ winner, side }: { winner?: string; side: string }) {
  if (!winner || winner === "tie") return null;
  if (winner === side) {
    return <span className="inline-block h-2 w-2 rounded-full bg-success ml-2" title="More permissive" />;
  }
  return <span className="inline-block h-2 w-2 rounded-full bg-destructive/40 ml-2" title="More restrictive" />;
}

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6">
        <h1 className="text-2xl font-bold text-primary mb-1">Town Comparison</h1>
        <p className="text-sm text-muted-foreground mb-6">Side-by-side comparison of zoning rules and requirements.</p>

        {/* Town Selectors */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
            Ridgewood <ChevronDown className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-muted-foreground">vs</span>
          <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
            Paramus <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> More permissive</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive/40" /> More restrictive</div>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-border" /> Same</div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-1/3 font-semibold">Metric</TableHead>
                  <TableHead className="w-1/3 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">R</div>
                      Ridgewood
                    </div>
                  </TableHead>
                  <TableHead className="w-1/3 font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">P</div>
                      Paramus
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, i) => (
                  <TableRow key={row.metric} className={i % 2 === 0 ? "" : "bg-secondary/20"}>
                    <TableCell className="text-sm font-medium">{row.metric}</TableCell>
                    <TableCell className="text-sm">
                      {row.ridgewood}
                      {row.type === "compare" && <CompareIndicator winner={row.winner} side="ridgewood" />}
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.paramus}
                      {row.type === "compare" && <CompareIndicator winner={row.winner} side="paramus" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
