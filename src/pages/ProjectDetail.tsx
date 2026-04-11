import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Hammer, Fence, Waves, ArrowLeft, Trash2, Share2, ChevronRight, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const projects = [
  {
    id: "1",
    type: "Deck",
    icon: Hammer,
    address: "123 Oak St, Ridgewood, NJ 07450",
    town: "Ridgewood",
    zone: "R-2",
    status: "Researching",
    statusColor: "bg-accent text-accent-foreground",
    rules: [
      { label: "Front Setback", value: "35 ft", status: "ok" },
      { label: "Side Setback", value: "10 ft", status: "ok" },
      { label: "Rear Setback", value: "25 ft", status: "ok" },
      { label: "Max Lot Coverage", value: "30% (current: 22%)", status: "ok" },
      { label: "Max Height", value: "35 ft", status: "ok" },
    ],
    timeline: [
      { step: "Researching", active: true, complete: false },
      { step: "Application Submitted", active: false, complete: false },
      { step: "Under Review", active: false, complete: false },
      { step: "Approved", active: false, complete: false },
      { step: "Construction", active: false, complete: false },
    ],
    checklist: [
      { item: "Property survey showing setbacks", done: true },
      { item: "Construction plans (2 sets)", done: false },
      { item: "Elevation drawings", done: false },
      { item: "Material specifications", done: false },
      { item: "Contractor license", done: true },
      { item: "Zoning permit application", done: false },
    ],
    changes: [
      { date: "Jan 10, 2026", summary: "Updated fence height regulations for corner lots in R-1 and R-2 zones." },
    ],
  },
  {
    id: "2",
    type: "Fence",
    icon: Fence,
    address: "456 Maple Ave, Paramus, NJ 07652",
    town: "Paramus",
    zone: "R-1",
    status: "Permit Filed",
    statusColor: "bg-warning text-warning-foreground",
    rules: [
      { label: "Max Front Yard Height", value: "4 ft", status: "ok" },
      { label: "Max Side/Rear Height", value: "6 ft", status: "ok" },
      { label: "Solid Fence Zoning Permit", value: "Required for >4 ft", status: "warning" },
      { label: "Material Restrictions", value: "No chain-link in front yard", status: "ok" },
    ],
    timeline: [
      { step: "Researching", active: false, complete: true },
      { step: "Application Submitted", active: false, complete: true },
      { step: "Under Review", active: true, complete: false },
      { step: "Approved", active: false, complete: false },
      { step: "Construction", active: false, complete: false },
    ],
    checklist: [
      { item: "Property survey", done: true },
      { item: "Fence plan with dimensions", done: true },
      { item: "Material specifications", done: true },
      { item: "Zoning permit application", done: true },
      { item: "Building permit application", done: true },
      { item: "Neighbor notification", done: false },
    ],
    changes: [
      { date: "Jan 8, 2026", summary: "New ADU ordinance adopted — accessory dwelling units now permitted in all residential zones." },
    ],
  },
  {
    id: "3",
    type: "Pool",
    icon: Waves,
    address: "123 Oak St, Ridgewood, NJ 07450",
    town: "Ridgewood",
    zone: "R-2",
    status: "Planning",
    statusColor: "bg-secondary text-secondary-foreground",
    rules: [
      { label: "Pool Setback (rear)", value: "10 ft from property line", status: "ok" },
      { label: "Pool Setback (side)", value: "5 ft from property line", status: "ok" },
      { label: "Fence Requirement", value: "4 ft min with self-closing gate", status: "warning" },
      { label: "Lot Coverage Impact", value: "+400 sf (within limit)", status: "ok" },
    ],
    timeline: [
      { step: "Researching", active: true, complete: false },
      { step: "Application Submitted", active: false, complete: false },
      { step: "Under Review", active: false, complete: false },
      { step: "Approved", active: false, complete: false },
      { step: "Construction", active: false, complete: false },
    ],
    checklist: [
      { item: "Pool plan with dimensions and location", done: false },
      { item: "Property survey", done: true },
      { item: "Fencing plan (4 ft min)", done: false },
      { item: "Electrical plan for pump/filter", done: false },
      { item: "Contractor license", done: false },
    ],
    changes: [],
  },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id) || projects[0];
  const Icon = project.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl flex-1">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">{project.type} Project</h1>
              <p className="text-sm text-muted-foreground">{project.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px]">{project.town}</Badge>
                <Badge variant="outline" className="text-[10px] font-mono">Zone {project.zone}</Badge>
                <Badge className={`text-[10px] ${project.statusColor}`}>{project.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Project link copied!"); }}>
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Permit Status Timeline */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-4">Permit Status</h3>
            <div className="flex items-center justify-between">
              {project.timeline.map((step, i) => (
                <div key={step.step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      step.complete ? "bg-success text-success-foreground" : step.active ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {step.complete ? <CheckCircle className="h-4 w-4" /> : i + 1}
                    </div>
                    <p className={`text-[10px] mt-1.5 text-center max-w-[80px] ${step.active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step.step}</p>
                  </div>
                  {i < project.timeline.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${step.complete ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applicable Rules */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-4">Applicable Zoning Rules — Zone {project.zone}</h3>
            <div className="space-y-2">
              {project.rules.map((r) => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.value}</span>
                    {r.status === "ok" ? (
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Permit Checklist</h3>
              <span className="text-xs text-muted-foreground">{project.checklist.filter(c => c.done).length}/{project.checklist.length} complete</span>
            </div>
            <div className="space-y-2">
              {project.checklist.map((c, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <Checkbox checked={c.done} className="mt-0.5" />
                  <p className={`text-sm ${c.done ? "line-through text-muted-foreground" : ""}`}>{c.item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Changes */}
        {project.changes.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Related Ordinance Changes</h3>
              <div className="space-y-2">
                {project.changes.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded border bg-secondary/20">
                    <FileText className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{c.date}</p>
                      <p className="text-sm text-muted-foreground">{c.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
