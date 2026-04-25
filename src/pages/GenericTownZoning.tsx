import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTown, useTownZones } from "@/hooks/useTownData";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";
import { DataProvenance } from "@/components/DataProvenance";

export default function GenericTownZoning() {
  const { slug } = useParams<{ slug: string }>();
  const { data: town } = useTown(slug);
  const { data: zones, isLoading } = useTownZones(slug);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  if (isLoading) {
    return (
      <TownProfileLayout townSlug={slug}>
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-[400px] w-full" />
      </TownProfileLayout>
    );
  }

  const list = zones ?? [];
  const variance = (z: { conditional?: string[] | null }) => (z.conditional && z.conditional.length > 0 ? "c" : "d");

  return (
    <TownProfileLayout townSlug={slug}>
      <div className="animate-fade-in">
        {town && <PlaceholderBanner townName={town.name} status={(town.data_status as "partial" | "placeholder") ?? "placeholder"} />}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Zoning Districts</h2>
            <p className="text-sm text-muted-foreground">All zone types with key dimensional requirements.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <FileDown className="h-3.5 w-3.5" /> Download Zone Summary
            </Button>
            <Badge variant="secondary" className="text-xs">{list.length} Districts</Badge>
          </div>
        </div>

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
                {list.map((z, i) => (
                  <>
                    <TableRow key={z.code} className={`cursor-pointer ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"} hover:bg-secondary/40`} onClick={() => setExpandedZone(expandedZone === z.code ? null : z.code)}>
                      <TableCell><Badge variant={z.code.startsWith("R") ? "default" : z.code.startsWith("C") || z.code.startsWith("B") ? "secondary" : "outline"} className="font-mono text-xs">{z.code}</Badge></TableCell>
                      <TableCell><p className="text-sm font-medium">{z.name}</p><p className="text-xs text-muted-foreground">{z.description}</p></TableCell>
                      <TableCell className="text-sm">{z.min_lot ?? "—"}</TableCell>
                      <TableCell className="text-sm font-mono text-xs">{z.setback_front}/{z.setback_side}/{z.setback_rear}</TableCell>
                      <TableCell className="text-sm">{z.max_height ?? "—"}</TableCell>
                      <TableCell className="text-sm font-semibold">{z.max_coverage ?? "—"}</TableCell>
                      <TableCell className="text-sm font-mono">{z.far ?? "—"}</TableCell>
                      <TableCell><Badge variant="outline" className="text-micro font-mono">{variance(z) === "c" ? '"c" bulk' : '"d" use'}</Badge></TableCell>
                      <TableCell>{expandedZone === z.code ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}</TableCell>
                    </TableRow>
                    {expandedZone === z.code && (
                      <TableRow key={`${z.code}-expanded`}>
                        <TableCell colSpan={9} className="bg-secondary/10 p-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-success mb-2">Permitted Uses</p>
                              <ul className="space-y-1">{(z.permitted ?? []).map((u: string) => <li key={u} className="text-xs text-muted-foreground">• {u}</li>)}</ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-warning mb-2">Conditional Uses</p>
                              <ul className="space-y-1">{(z.conditional ?? []).map((u: string) => <li key={u} className="text-xs text-muted-foreground">• {u}</li>)}</ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-destructive mb-2">Prohibited Uses</p>
                              <ul className="space-y-1">{(z.prohibited ?? []).map((u: string) => <li key={u} className="text-xs text-muted-foreground">• {u}</li>)}</ul>
                            </div>
                          </div>
                          <DataProvenance confidence={z.confidence as "verified" | "ai_extracted" | "placeholder"} sourceDoc={z.source_doc} sourceUrl={z.source_url} lastVerifiedAt={z.last_verified_at} />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="lg:hidden space-y-3">
          {list.map((z) => (
            <Card key={z.code}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="font-mono text-xs">{z.code}</Badge>
                  <span className="text-sm font-semibold">{z.name}</span>
                  <Badge variant="outline" className="text-micro font-mono ml-auto">{variance(z) === "c" ? '"c"' : '"d"'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{z.description}</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div><span className="text-muted-foreground">Min Lot:</span> <span className="font-medium">{z.min_lot ?? "—"}</span></div>
                  <div><span className="text-muted-foreground">Max Height:</span> <span className="font-medium">{z.max_height ?? "—"}</span></div>
                  <div><span className="text-muted-foreground">Setbacks:</span> <span className="font-medium font-mono">{z.setback_front}/{z.setback_side}/{z.setback_rear}</span></div>
                  <div><span className="text-muted-foreground">Coverage:</span> <span className="font-medium">{z.max_coverage ?? "—"}</span></div>
                </div>
                <button className="mt-3 text-xs text-accent hover:underline" onClick={() => setExpandedZone(expandedZone === z.code ? null : z.code)}>
                  {expandedZone === z.code ? "Hide uses ▴" : "Show uses ▾"}
                </button>
                {expandedZone === z.code && (
                  <div className="mt-3 pt-3 border-t space-y-3">
                    <div><p className="text-xs font-semibold text-success mb-1">Permitted</p>{(z.permitted ?? []).map((u: string) => <p key={u} className="text-xs text-muted-foreground">• {u}</p>)}</div>
                    <div><p className="text-xs font-semibold text-warning mb-1">Conditional</p>{(z.conditional ?? []).map((u: string) => <p key={u} className="text-xs text-muted-foreground">• {u}</p>)}</div>
                    <div><p className="text-xs font-semibold text-destructive mb-1">Prohibited</p>{(z.prohibited ?? []).map((u: string) => <p key={u} className="text-xs text-muted-foreground">• {u}</p>)}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TownProfileLayout>
  );
}
