import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const zones = [
  {
    code: "R-1", name: "Single Family Residential", description: "Low-density single-family homes",
    minLot: "15,000 sf", setbacks: { front: "40 ft", side: "12 ft", rear: "30 ft" },
    maxHeight: "35 ft", maxCoverage: "25%", far: "0.30",
    uses: "Single-family dwellings, home occupations, accessory structures",
  },
  {
    code: "R-2", name: "Single Family Residential", description: "Medium-density single-family homes",
    minLot: "10,000 sf", setbacks: { front: "35 ft", side: "10 ft", rear: "25 ft" },
    maxHeight: "35 ft", maxCoverage: "30%", far: "0.35",
    uses: "Single-family dwellings, home occupations, accessory structures",
  },
  {
    code: "R-3", name: "Multi-Family Residential", description: "Multi-family and townhomes",
    minLot: "7,500 sf", setbacks: { front: "30 ft", side: "8 ft", rear: "20 ft" },
    maxHeight: "40 ft", maxCoverage: "35%", far: "0.50",
    uses: "Multi-family dwellings, townhouses, senior housing",
  },
  {
    code: "C-1", name: "Central Business", description: "Downtown commercial core",
    minLot: "5,000 sf", setbacks: { front: "0 ft", side: "0 ft", rear: "10 ft" },
    maxHeight: "45 ft", maxCoverage: "80%", far: "2.00",
    uses: "Retail, restaurants, offices, mixed-use",
  },
  {
    code: "C-2", name: "General Commercial", description: "Highway commercial and services",
    minLot: "10,000 sf", setbacks: { front: "25 ft", side: "10 ft", rear: "20 ft" },
    maxHeight: "40 ft", maxCoverage: "60%", far: "1.00",
    uses: "Retail, auto services, offices, medical",
  },
  {
    code: "I-1", name: "Light Industrial", description: "Light manufacturing and warehousing",
    minLot: "20,000 sf", setbacks: { front: "30 ft", side: "15 ft", rear: "25 ft" },
    maxHeight: "45 ft", maxCoverage: "50%", far: "0.75",
    uses: "Light manufacturing, warehousing, research",
  },
];

export default function TownZoning() {
  return (
    <TownProfileLayout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Zoning Districts</h2>
          <p className="text-sm text-muted-foreground">
            All zone types with key dimensional requirements. Hover dotted terms for definitions.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">14 Districts</Badge>
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
                <TableHead className="font-semibold">Permitted Uses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((z, i) => (
                <TableRow key={z.code} className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
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
                  <TableCell className="text-xs text-muted-foreground max-w-[200px]">{z.uses}</TableCell>
                </TableRow>
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
              </div>
              <p className="text-xs text-muted-foreground mb-3">{z.description}</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div><span className="text-muted-foreground">Min Lot:</span> <span className="font-medium">{z.minLot}</span></div>
                <div><span className="text-muted-foreground">Max Height:</span> <span className="font-medium">{z.maxHeight}</span></div>
                <div><span className="text-muted-foreground"><GlossaryTooltip term="Setback" />s:</span> <span className="font-medium font-mono">{z.setbacks.front}/{z.setbacks.side}/{z.setbacks.rear}</span></div>
                <div><span className="text-muted-foreground"><GlossaryTooltip term="Lot Coverage" />:</span> <span className="font-medium">{z.maxCoverage}</span></div>
                <div><span className="text-muted-foreground"><GlossaryTooltip term="FAR" />:</span> <span className="font-medium">{z.far}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Uses:</span> {z.uses}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TownProfileLayout>
  );
}
