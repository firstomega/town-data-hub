import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle, XCircle, AlertTriangle, ArrowRight, ArrowLeft,
  Hammer, Fence, Waves, Home, PlusCircle, Building, Loader2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAllTowns, useTownZones, useTownPermits } from "@/hooks/useTownData";

const projectTypes = [
  { value: "deck",     label: "Deck",                        icon: Hammer,     keywords: ["deck"] },
  { value: "fence",    label: "Fence",                       icon: Fence,      keywords: ["fence"] },
  { value: "pool",     label: "Pool",                        icon: Waves,      keywords: ["pool", "swim"] },
  { value: "adu",      label: "Accessory Dwelling Unit (ADU)", icon: Home,     keywords: ["adu", "accessory dwelling", "accessory apartment"] },
  { value: "addition", label: "Home Addition",               icon: PlusCircle, keywords: ["addition", "expansion", "single-family", "single family", "dwelling"] },
  { value: "shed",     label: "Shed / Accessory Structure",  icon: Building,   keywords: ["shed", "accessory structure", "accessory building"] },
];

type RuleStatus = "pass" | "fail" | "warning";
interface RuleResult { rule: string; status: RuleStatus; detail: string; }

type Zone = {
  id: string;
  code: string;
  name: string | null;
  permitted: string[] | null;
  conditional: string[] | null;
  prohibited: string[] | null;
  setback_front: string | null;
  setback_side: string | null;
  setback_rear: string | null;
  max_height: string | null;
  max_coverage: string | null;
  far: string | null;
  source_url: string | null;
  confidence: string;
};

type Permit = {
  id: string;
  name: string;
  fee: string | null;
  timeline: string | null;
  description: string | null;
};

function matchesAny(haystack: string[] | null | undefined, keywords: string[]): boolean {
  if (!haystack?.length) return false;
  const hay = haystack.map((s) => s.toLowerCase());
  return keywords.some((k) => hay.some((h) => h.includes(k)));
}

function evaluateZone(zone: Zone, projectType: string): { permitted: boolean; rules: RuleResult[] } {
  const meta = projectTypes.find((p) => p.value === projectType)!;
  const rules: RuleResult[] = [];
  let permitted = true;

  const isPermitted   = matchesAny(zone.permitted, meta.keywords);
  const isConditional = matchesAny(zone.conditional, meta.keywords);
  const isProhibited  = matchesAny(zone.prohibited, meta.keywords);

  if (isProhibited) {
    permitted = false;
    rules.push({
      rule: "Permitted Use",
      status: "fail",
      detail: `${meta.label} is listed as a prohibited use in zone ${zone.code}. A use variance would be required.`,
    });
  } else if (isPermitted) {
    rules.push({
      rule: "Permitted Use",
      status: "pass",
      detail: `${meta.label} is a permitted use in zone ${zone.code}.`,
    });
  } else if (isConditional) {
    rules.push({
      rule: "Permitted Use",
      status: "warning",
      detail: `${meta.label} is a conditional use in zone ${zone.code}. You'll need conditional use approval from the Planning Board.`,
    });
  } else {
    // No explicit listing — common when extraction is incomplete
    rules.push({
      rule: "Permitted Use",
      status: "warning",
      detail: `${meta.label} is not explicitly listed as permitted, conditional, or prohibited in zone ${zone.code}. Verify with the Zoning Officer.`,
    });
  }

  if (zone.setback_front) {
    rules.push({ rule: "Front setback", status: "warning", detail: `Minimum front setback: ${zone.setback_front}. Confirm your structure stays behind this line.` });
  }
  if (zone.setback_side) {
    rules.push({ rule: "Side setback", status: "warning", detail: `Minimum side setback: ${zone.setback_side}.` });
  }
  if (zone.setback_rear) {
    rules.push({ rule: "Rear setback", status: "warning", detail: `Minimum rear setback: ${zone.setback_rear}.` });
  }
  if (zone.max_height && (projectType === "addition" || projectType === "adu" || projectType === "shed")) {
    rules.push({ rule: "Max height", status: "warning", detail: `Maximum building height: ${zone.max_height}.` });
  }
  if (zone.max_coverage && (projectType === "deck" || projectType === "pool" || projectType === "addition" || projectType === "adu" || projectType === "shed")) {
    rules.push({ rule: "Max lot coverage", status: "warning", detail: `Lot coverage cap: ${zone.max_coverage}. Verify your existing coverage before adding.` });
  }
  if (zone.far && (projectType === "addition" || projectType === "adu")) {
    rules.push({ rule: "Floor Area Ratio (FAR)", status: "warning", detail: `Maximum FAR: ${zone.far}.` });
  }

  return { permitted, rules };
}

export default function FeasibilityCheck() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [address, setAddress] = useState("");
  const [zoneCode, setZoneCode] = useState("");
  const [townSlug, setTownSlug] = useState("");

  const { data: towns, isLoading: loadingTowns } = useAllTowns();
  const { data: zones, isLoading: loadingZones } = useTownZones(townSlug || undefined);
  const { data: permits } = useTownPermits(townSlug || undefined);

  const selectedZone = useMemo<Zone | null>(() => {
    if (!zoneCode || !zones) return null;
    return (zones as Zone[]).find((z) => z.code === zoneCode) ?? null;
  }, [zoneCode, zones]);

  const evaluation = useMemo(() => {
    if (!selectedZone || !projectType) return null;
    return evaluateZone(selectedZone, projectType);
  }, [selectedZone, projectType]);

  const matchingPermits = useMemo(() => {
    if (!permits || !projectType) return [];
    const meta = projectTypes.find((p) => p.value === projectType);
    if (!meta) return [];
    return (permits as Permit[]).filter((p) =>
      meta.keywords.some((k) => p.name.toLowerCase().includes(k) || (p.description ?? "").toLowerCase().includes(k))
    );
  }, [permits, projectType]);

  const selectedTown = (towns ?? []).find((t) => t.slug === townSlug);

  const handleCheck = () => {
    if (projectType && townSlug && zoneCode) setStep(3);
  };

  const reset = () => {
    setStep(1);
    setProjectType("");
    setZoneCode("");
  };

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6 max-w-3xl">
        <Badge className="mb-2 bg-accent/10 text-accent border-0 text-xs">Quick Check</Badge>
        <h1 className="text-2xl font-bold text-primary mb-1">Project Feasibility Check</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Real zoning rules from the verified database. Find out if your project is permissible before calling a contractor.
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-accent" : "bg-secondary"}`} />}
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            {step === 1 ? "Select project" : step === 2 ? "Enter location" : "Results"}
          </span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="font-semibold text-sm mb-4">What do you want to build?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectTypes.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => { setProjectType(pt.value); setStep(2); }}
                  className={`p-4 rounded-lg border text-left transition-all hover:border-accent/50 hover:shadow-sm ${
                    projectType === pt.value ? "border-accent bg-accent/5" : ""
                  }`}
                >
                  <pt.icon className="h-6 w-6 text-accent mb-2" />
                  <p className="text-sm font-medium">{pt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="font-semibold text-sm mb-4">Where is your property?</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Address (optional)</label>
                <Input
                  placeholder="123 Oak St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Town</label>
                <Select value={townSlug} onValueChange={(v) => { setTownSlug(v); setZoneCode(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingTowns ? "Loading…" : "Select a town"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(towns ?? []).map((t) => (
                      <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Zone</label>
                <Select value={zoneCode} onValueChange={setZoneCode} disabled={!townSlug || loadingZones}>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !townSlug ? "Pick a town first"
                      : loadingZones ? "Loading zones…"
                      : (zones ?? []).length === 0 ? "No zones loaded for this town"
                      : "Select a zone"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {((zones ?? []) as Zone[]).map((z) => (
                      <SelectItem key={z.id} value={z.code}>
                        {z.code}{z.name ? ` — ${z.name}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleCheck}
                  disabled={!projectType || !townSlug || !zoneCode}
                >
                  Check Feasibility <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            {!evaluation || !selectedZone ? (
              <div className="py-12 text-center">
                <Loader2 className="h-5 w-5 animate-spin inline text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Verdict */}
                <Card className={`mb-6 ${evaluation.permitted ? "border-success/30" : "border-destructive/30"}`}>
                  <CardContent className="p-5 flex items-start gap-4">
                    {evaluation.permitted ? (
                      <CheckCircle className="h-8 w-8 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-8 w-8 text-destructive flex-shrink-0" />
                    )}
                    <div>
                      <h2 className="font-bold text-lg mb-1">
                        {evaluation.permitted ? "Likely Permissible" : "Not Permitted as of Right"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.permitted
                          ? `A ${projectTypes.find(p => p.value === projectType)?.label.toLowerCase()} is permissible in this zone, subject to the constraints below.`
                          : `This project type is not currently permitted in this zone. A variance may be required.`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedTown?.name ?? townSlug}, Zone {selectedZone.code}
                        {address ? ` · ${address}` : ""}
                      </p>
                      {selectedZone.confidence !== "verified" && (
                        <Badge variant="secondary" className="mt-2 text-micro">
                          ⚠ Source data is {selectedZone.confidence} — confirm with the Zoning Officer
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Rules */}
                <Card className="mb-6">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm mb-4">Zoning Rule Check</h3>
                    <div className="space-y-3">
                      {evaluation.rules.map((r) => (
                        <div key={r.rule} className="flex items-start gap-3 p-3 rounded border bg-secondary/20">
                          {r.status === "pass" && <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />}
                          {r.status === "fail" && <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />}
                          {r.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />}
                          <div>
                            <p className="text-sm font-medium">{r.rule}</p>
                            <p className="text-xs text-muted-foreground">{r.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedZone.source_url && (
                      <a href={selectedZone.source_url} target="_blank" rel="noopener noreferrer" className="text-caption text-accent hover:underline mt-3 inline-block">
                        View official source →
                      </a>
                    )}
                  </CardContent>
                </Card>

                {/* Matching Permits */}
                {matchingPermits.length > 0 && (
                  <Card className="mb-6">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-sm mb-3">Permits you'll likely need</h3>
                      <ul className="space-y-2">
                        {matchingPermits.map((p) => (
                          <li key={p.id} className="text-sm border-l-2 border-accent pl-3">
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.fee ? `${p.fee} · ` : ""}{p.timeline ?? ""}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={reset}>
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Check Another Project
                  </Button>
                  <Link to={`/checklist?town=${townSlug}&type=${projectType}`}>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Generate Permit Checklist <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
