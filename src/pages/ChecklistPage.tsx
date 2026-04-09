import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDown, Printer, Save, Phone, Clock, DollarSign, MapPin, Building, Mail, ExternalLink } from "lucide-react";

const requiredPermits = [
  { name: "Zoning Permit", desc: "Confirm the deck complies with R-2 setback and coverage requirements" },
  { name: "Building Permit", desc: "Required for any structure attached to the dwelling" },
  { name: "Electrical Permit", desc: "If the deck includes any electrical wiring or lighting" },
];

const documents = [
  { name: "Property survey showing current structures and setbacks" },
  { name: "Construction plans (2 sets) — to scale, showing dimensions" },
  { name: "Elevation drawings showing height from grade" },
  { name: "Material specifications" },
  { name: "Contractor license and insurance certificates" },
  { name: "Proof of homeowner's insurance" },
];

export default function ChecklistPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="mb-2 bg-accent/10 text-accent border-0 text-xs">Before You Call</Badge>
            <h1 className="text-2xl font-bold text-primary mb-1">Permit Checklist: Deck</h1>
            <p className="text-sm text-muted-foreground">123 Oak St, Ridgewood, NJ 07450</p>
          </div>
        </div>

        {/* Action Buttons — Prominent at top */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <FileDown className="h-3.5 w-3.5" /> Export as PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Mail className="h-3.5 w-3.5" /> Email This Checklist
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="h-3.5 w-3.5" /> Save This Project
          </Button>
        </div>

        {/* Property Context */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Property Context</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Zone</p>
                <p className="font-semibold">R-2</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lot Size</p>
                <p className="font-semibold">10,200 sq ft</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Coverage</p>
                <p className="font-semibold">22% of 30% max</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available Coverage</p>
                <p className="font-semibold text-success">816 sq ft</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Permits */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-4">Required Permits</h3>
            <div className="space-y-3">
              {requiredPermits.map((p) => (
                <div key={p.name} className="flex items-start gap-3 p-3 rounded border bg-secondary/20">
                  <Checkbox className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents to Prepare */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-4">Documents to Prepare</h3>
            <div className="space-y-2">
              {documents.map((d, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <Checkbox className="mt-0.5" />
                  <p className="text-sm text-muted-foreground">{d.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Timeline & Fees */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Estimated Timeline & Fees</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Timeline</p>
                    <p className="text-xs text-muted-foreground">6-8 weeks (zoning: 1-2 wks + building: 4-6 wks)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Estimated Permit Fees</p>
                    <p className="text-xs text-muted-foreground">$200 - $650 (zoning: $50 + building: $150-$600)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Municipal Contact */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Municipal Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Building Department</p>
                    <p className="text-xs text-muted-foreground">Village of Ridgewood</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">(201) 670-5500</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 8:30 AM - 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">131 N Maple Ave</p>
                    <p className="text-xs text-muted-foreground">Ridgewood, NJ 07450</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a href="https://www.ridgewoodnj.net/building" className="text-xs text-accent hover:underline">
                    www.ridgewoodnj.net/building
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Cost Estimator */}
        <Card className="mb-6 border-accent/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-1">Estimated Project Cost</h3>
            <p className="text-xs text-muted-foreground mb-3">Average costs for deck projects in Bergen County, NJ (excluding permit fees).</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded bg-secondary text-center">
                <p className="text-xs text-muted-foreground mb-1">Basic Deck</p>
                <p className="text-sm font-bold">$8,000 – $12,000</p>
                <p className="text-[10px] text-muted-foreground">Pressure-treated wood, 200 sq ft</p>
              </div>
              <div className="p-3 rounded bg-secondary text-center">
                <p className="text-xs text-muted-foreground mb-1">Mid-Range</p>
                <p className="text-sm font-bold">$15,000 – $25,000</p>
                <p className="text-[10px] text-muted-foreground">Composite, 300 sq ft with railing</p>
              </div>
              <div className="p-3 rounded bg-secondary text-center">
                <p className="text-xs text-muted-foreground mb-1">Premium</p>
                <p className="text-sm font-bold">$30,000 – $50,000</p>
                <p className="text-[10px] text-muted-foreground">Multi-level, built-in seating, lighting</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Source: HomeAdvisor & local contractor estimates, 2025. Costs vary by materials, complexity, and contractor.</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
