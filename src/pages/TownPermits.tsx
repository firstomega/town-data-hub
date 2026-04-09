import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, DollarSign, FileText, Hammer, Fence, Waves, Home, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const permits = [
  {
    name: "Building Permit",
    description: "Required for new construction, additions, and major renovations.",
    requirements: ["Completed application form", "Two sets of construction plans", "Property survey", "Contractor license"],
    timeline: "4-6 weeks",
    fee: "$150 - $2,500",
    link: "#",
  },
  {
    name: "Zoning Permit",
    description: "Required before applying for a building permit to confirm zoning compliance.",
    requirements: ["Completed zoning application", "Property survey showing setbacks", "Plot plan"],
    timeline: "1-2 weeks",
    fee: "$50 - $150",
    link: "#",
  },
  {
    name: "Demolition Permit",
    description: "Required for full or partial demolition of structures.",
    requirements: ["Demolition plan", "Asbestos inspection report", "Utility disconnect confirmation"],
    timeline: "2-3 weeks",
    fee: "$200 - $500",
    link: "#",
  },
  {
    name: "Electrical Permit",
    description: "Required for new wiring, panel upgrades, and electrical modifications.",
    requirements: ["Licensed electrician information", "Scope of work description", "Electrical plans"],
    timeline: "1-2 weeks",
    fee: "$75 - $300",
    link: "#",
  },
];

const projectTypes = [
  { label: "Deck", icon: Hammer },
  { label: "Fence", icon: Fence },
  { label: "Pool", icon: Waves },
  { label: "Addition", icon: Home },
  { label: "ADU", icon: PlusCircle },
];

export default function TownPermits() {
  return (
    <TownProfileLayout>
      {/* Permit Checklist Generator CTA */}
      <Card className="mb-6 border-accent/30 bg-accent/5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-1">Permit Checklist Generator</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select your project type to auto-generate a custom permit checklist for Ridgewood.
              </p>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((p) => (
                  <Link key={p.label} to="/checklist">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <p.icon className="h-3.5 w-3.5" />
                      {p.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-bold mb-4">Permit Types & Requirements</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {permits.map((p) => (
          <Card key={p.name}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <Button variant="ghost" size="sm" className="text-xs text-accent gap-1">
                  Apply <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{p.description}</p>

              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{p.timeline}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{p.fee}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2">Requirements</p>
                <ul className="space-y-1">
                  {p.requirements.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TownProfileLayout>
  );
}
