import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Layers } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAllTowns, useTownZones } from "@/hooks/useTownData";

type ZoneRow = { code: string; name: string; min_lot: string | null; setback_front: string | null; setback_side: string | null; setback_rear: string | null; max_height: string | null; max_coverage: string | null; far: string | null; confidence: string };

const ZONE_FIELDS: { key: keyof ZoneRow; label: string }[] = [
  { key: "min_lot", label: "Min lot size" },
  { key: "setback_front", label: "Front setback" },
  { key: "setback_side", label: "Side setback" },
  { key: "setback_rear", label: "Rear setback" },
  { key: "max_height", label: "Max height" },
  { key: "max_coverage", label: "Max lot coverage" },
  { key: "far", label: "FAR" },
];

function findZone(zones: ZoneRow[] | undefined, code: string | undefined): ZoneRow | undefined {
  if (!zones || !code) return undefined;
  return zones.find((z) => z.code === code);
}

export default function ComparisonPage() {
  const [params, setParams] = useSearchParams();
  const { data: towns, isLoading: townsLoading } = useAllTowns();

  const verifiedTowns = useMemo(
    () => (towns ?? []).filter((t) => t.data_status !== "placeholder"),
    [towns]
  );

  const [townA, setTownA] = useState<string>(params.get("town1") ?? "");
  const [townB, setTownB] = useState<string>(params.get("town2") ?? "");

  useEffect(() => {
    if (!townA && verifiedTowns[0]) setTownA(verifiedTowns[0].slug);
    if (!townB && verifiedTowns[1]) setTownB(verifiedTowns[1].slug);
  }, [verifiedTowns, townA, townB]);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (townA) next.set("town1", townA); else next.delete("town1");
    if (townB) next.set("town2", townB); else next.delete("town2");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [townA, townB]);

  const { data: zonesA, isLoading: aLoading } = useTownZones(townA || undefined);
  const { data: zonesB, isLoading: bLoading } = useTownZones(townB || undefined);

  const visibleA = (zonesA ?? []).filter((z: ZoneRow) => z.confidence !== "placeholder") as ZoneRow[];
  const visibleB = (zonesB ?? []).filter((z: ZoneRow) => z.confidence !== "placeholder") as ZoneRow[];

  const sharedCodes = useMemo(
    () => visibleA.map((z) => z.code).filter((c) => visibleB.some((z) => z.code === c)),
    [visibleA, visibleB]
  );
  const [zoneCode, setZoneCode] = useState<string>("");
  useEffect(() => {
    if (sharedCodes.length && !sharedCodes.includes(zoneCode)) setZoneCode(sharedCodes[0]);
  }, [sharedCodes, zoneCode]);

  const zoneA = findZone(visibleA, zoneCode);
  const zoneB = findZone(visibleB, zoneCode);

  const townAName = towns?.find((t) => t.slug === townA)?.name ?? "—";
  const townBName = towns?.find((t) => t.slug === townB)?.name ?? "—";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 flex-1">
        <h1 className="text-2xl font-bold text-primary mb-1">Town Comparison</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Side-by-side zoning rules pulled from each town's verified district records.
        </p>

        {townsLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-12 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading towns…
          </div>
        ) : verifiedTowns.length < 2 ? (
          <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">
            At least two towns with verified data are required to compare. Check back soon.
          </CardContent></Card>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <Select value={townA} onValueChange={setTownA}>
                <SelectTrigger className="min-w-[200px]"><SelectValue placeholder="Select town" /></SelectTrigger>
                <SelectContent>
                  {verifiedTowns.map((t) => (
                    <SelectItem key={t.slug} value={t.slug} disabled={t.slug === townB}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm font-semibold text-muted-foreground">vs</span>
              <Select value={townB} onValueChange={setTownB}>
                <SelectTrigger className="min-w-[200px]"><SelectValue placeholder="Select town" /></SelectTrigger>
                <SelectContent>
                  {verifiedTowns.map((t) => (
                    <SelectItem key={t.slug} value={t.slug} disabled={t.slug === townA}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {sharedCodes.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <Select value={zoneCode} onValueChange={setZoneCode}>
                    <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="Zone" /></SelectTrigger>
                    <SelectContent>
                      {sharedCodes.map((c) => <SelectItem key={c} value={c}>Zone {c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {(aLoading || bLoading) ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-12 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading zoning…
              </div>
            ) : sharedCodes.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">
                These two towns don't share a zone code in our verified data yet, so we can't render a fair side-by-side.
              </CardContent></Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="w-1/3 font-semibold">Metric — Zone {zoneCode}</TableHead>
                        <TableHead className="w-1/3 font-semibold">{townAName}</TableHead>
                        <TableHead className="w-1/3 font-semibold">{townBName}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm font-medium">Zone name</TableCell>
                        <TableCell className="text-sm">{zoneA?.name ?? "—"}</TableCell>
                        <TableCell className="text-sm">{zoneB?.name ?? "—"}</TableCell>
                      </TableRow>
                      {ZONE_FIELDS.map((f, i) => {
                        const a = zoneA?.[f.key] ?? "—";
                        const b = zoneB?.[f.key] ?? "—";
                        return (
                          <TableRow key={f.key as string} className={i % 2 === 0 ? "bg-secondary/20" : ""}>
                            <TableCell className="text-sm font-medium">{f.label}</TableCell>
                            <TableCell className="text-sm">{a || "—"}</TableCell>
                            <TableCell className="text-sm">{b || "—"}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              Only zones marked verified or AI-extracted are shown. Placeholder rows are hidden.
            </p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
