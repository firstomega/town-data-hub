import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, ArrowLeft, Hammer, Fence, Waves, Home, PlusCircle, Building } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const projectTypes = [
  { value: "deck", label: "Deck", icon: Hammer },
  { value: "fence", label: "Fence", icon: Fence },
  { value: "pool", label: "Pool", icon: Waves },
  { value: "adu", label: "Accessory Dwelling Unit (ADU)", icon: Home },
  { value: "addition", label: "Home Addition", icon: PlusCircle },
  { value: "shed", label: "Shed / Accessory Structure", icon: Building },
];

const zones = [
  { value: "R-1", label: "R-1 (Single Family Residential)" },
  { value: "R-2", label: "R-2 (Single Family Residential)" },
  { value: "R-3", label: "R-3 (Multi-Family Residential)" },
  { value: "B-1", label: "B-1 (Central Business District)" },
  { value: "B-2", label: "B-2 (General Business)" },
];

interface RuleResult {
  rule: string;
  status: "pass" | "fail" | "warning";
  detail: string;
}

const mockResults: Record<string, { permitted: boolean; rules: RuleResult[]; nextSteps: string[] }> = {
  deck: {
    permitted: true,
    rules: [
      { rule: "Permitted Use", status: "pass", detail: "Decks are permitted as accessory structures in all residential zones." },
      { rule: "Rear Setback", status: "pass", detail: "Minimum 25 ft rear setback required. Your lot has ~40 ft available." },
      { rule: "Lot Coverage", status: "warning", detail: "Current lot coverage is 22% of 30% max. A 300 sq ft deck would bring you to 25%." },
      { rule: "Height Limit", status: "pass", detail: "Deck height must not exceed 4 ft above grade without variance." },
      { rule: "Building Permit", status: "warning", detail: "Building permit required for any deck over 200 sq ft or more than 30 inches above grade." },
    ],
    nextSteps: [
      "Apply for a zoning permit ($50) from the Building Department",
      "Submit construction plans (2 sets, to scale) with your building permit application",
      "Schedule foundation and framing inspections",
      "Use the Permit Checklist Generator for a full document list",
    ],
  },
  fence: {
    permitted: true,
    rules: [
      { rule: "Permitted Use", status: "pass", detail: "Fences are permitted in all residential zones." },
      { rule: "Front Yard Height", status: "warning", detail: "Maximum 4 ft in front yard. 6 ft in side and rear yards." },
      { rule: "Corner Lot Sight Triangle", status: "warning", detail: "If on a corner lot, fences within the sight triangle must not exceed 3 ft." },
      { rule: "Material Restrictions", status: "pass", detail: "Wood, vinyl, and ornamental metal permitted. Chain-link prohibited in front yards." },
      { rule: "Permit Required", status: "pass", detail: "Zoning permit required. No building permit needed for fences under 6 ft." },
    ],
    nextSteps: [
      "Apply for a zoning permit ($50)",
      "Verify your property lines with a recent survey",
      "Check for utility easements that may affect placement",
    ],
  },
  pool: {
    permitted: true,
    rules: [
      { rule: "Permitted Use", status: "pass", detail: "In-ground and above-ground pools permitted in residential zones." },
      { rule: "Setbacks", status: "pass", detail: "Pools must be at least 10 ft from any property line." },
      { rule: "Fencing Requirement", status: "warning", detail: "4 ft fence with self-closing, self-latching gate required around all pools." },
      { rule: "Lot Coverage", status: "warning", detail: "Pool area counts toward lot coverage. Verify you have sufficient remaining coverage." },
      { rule: "Electrical", status: "pass", detail: "Separate electrical permit required for pool equipment." },
    ],
    nextSteps: [
      "Apply for zoning permit, building permit, and electrical permit",
      "Submit pool plan with dimensions and setback measurements",
      "Arrange for barrier/fence inspection before filling pool",
    ],
  },
  adu: {
    permitted: false,
    rules: [
      { rule: "Permitted Use", status: "fail", detail: "ADUs are NOT currently permitted in Ridgewood R-1 or R-2 zones." },
      { rule: "State NJSA 40:55D", status: "warning", detail: "NJ is considering statewide ADU legislation. Check for updates." },
      { rule: "Variance Option", status: "warning", detail: "A 'D' variance (use variance) would be required. Approval is rare and requires enhanced showing of need." },
    ],
    nextSteps: [
      "Consider applying for a use variance ($500 application fee)",
      "Consult with a land use attorney before proceeding",
      "Check Paramus — ADUs are permitted in all residential zones there",
    ],
  },
  addition: {
    permitted: true,
    rules: [
      { rule: "Permitted Use", status: "pass", detail: "Home additions are permitted as of right in residential zones." },
      { rule: "Side Setback", status: "warning", detail: "Minimum 10 ft side setback. Verify your existing structure clearance." },
      { rule: "Height Limit", status: "pass", detail: "Maximum building height of 35 ft (2.5 stories) in R-2." },
      { rule: "FAR", status: "warning", detail: "Floor Area Ratio must not exceed 0.35. Calculate your current FAR before designing." },
      { rule: "Lot Coverage", status: "pass", detail: "Total building coverage must not exceed 30% of lot area." },
    ],
    nextSteps: [
      "Hire an architect to prepare plans compliant with setback and FAR limits",
      "Apply for zoning and building permits",
      "Plan for multiple inspections (foundation, framing, electrical, plumbing, final)",
    ],
  },
  shed: {
    permitted: true,
    rules: [
      { rule: "Permitted Use", status: "pass", detail: "Sheds under 200 sq ft are permitted as accessory structures." },
      { rule: "Setbacks", status: "pass", detail: "Must be at least 5 ft from side and rear property lines." },
      { rule: "Height", status: "pass", detail: "Maximum 15 ft height for accessory structures." },
      { rule: "Permit", status: "warning", detail: "Zoning permit required. Building permit required only if over 200 sq ft." },
    ],
    nextSteps: [
      "Apply for a zoning permit ($50)",
      "If over 200 sq ft, submit construction plans for building permit",
    ],
  },
};

export default function FeasibilityCheck() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState("");
  const [town, setTown] = useState("");

  const result = projectType ? mockResults[projectType] || mockResults.deck : null;

  const handleCheck = () => {
    if (projectType && (address || zone)) {
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl flex-1">
        <Badge className="mb-2 bg-accent/10 text-accent border-0 text-xs">Quick Check</Badge>
        <h1 className="text-2xl font-bold text-primary mb-1">Project Feasibility Check</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Find out if your project is likely permissible before calling a contractor or visiting the municipal office.
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

        {/* Step 1: Select Project Type */}
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

        {/* Step 2: Enter Location */}
        {step === 2 && (
          <div>
            <h2 className="font-semibold text-sm mb-4">Where is your property?</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Address (optional)</label>
                <Input
                  placeholder="123 Oak St, Ridgewood, NJ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Town</label>
                <Select value={town} onValueChange={setTown}>
                  <SelectTrigger><SelectValue placeholder="Select a town" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ridgewood">Ridgewood</SelectItem>
                    <SelectItem value="paramus">Paramus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Zone (if known)</label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger><SelectValue placeholder="Select or skip" /></SelectTrigger>
                  <SelectContent>
                    {zones.map((z) => (
                      <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCheck}>
                  Check Feasibility <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div>
            {/* Overall verdict */}
            <Card className={`mb-6 ${result.permitted ? "border-success/30" : "border-destructive/30"}`}>
              <CardContent className="p-5 flex items-start gap-4">
                {result.permitted ? (
                  <CheckCircle className="h-8 w-8 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-8 w-8 text-destructive flex-shrink-0" />
                )}
                <div>
                  <h2 className="font-bold text-lg mb-1">
                    {result.permitted ? "Likely Permissible" : "Not Permitted as of Right"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {result.permitted
                      ? `A ${projectTypes.find(p => p.value === projectType)?.label.toLowerCase()} is generally permitted in this zone, subject to the constraints below.`
                      : `This project type is not currently permitted in this zone. A variance may be required — see details below.`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on: {town ? (town === "ridgewood" ? "Ridgewood" : "Paramus") : "Ridgewood"}, Zone {zone || "R-2"} · {address || "123 Oak St"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-4">Zoning Rule Check</h3>
                <div className="space-y-3">
                  {result.rules.map((r) => (
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
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-3">Recommended Next Steps</h3>
                <ol className="space-y-2">
                  {result.nextSteps.map((ns, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="h-5 w-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="text-muted-foreground">{ns}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => { setStep(1); setProjectType(""); }}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Check Another Project
              </Button>
              <Link to="/checklist">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Generate Permit Checklist <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
