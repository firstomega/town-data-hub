import { Search, MapPin, Hammer, Bell, FileText, Plus, ChevronRight, Clock, AlertTriangle, Fence, Waves, ArrowRight, ListChecks, GitCompare } from "lucide-react";
import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const savedTowns = [
  { name: "Ridgewood", county: "Bergen", zones: 14, lastViewed: "2 hours ago" },
  { name: "Paramus", county: "Bergen", zones: 11, lastViewed: "Yesterday" },
  { name: "Glen Rock", county: "Bergen", zones: 8, lastViewed: "3 days ago" },
];

const projectIcons: Record<string, React.ElementType> = {
  Deck: Hammer,
  Fence: Fence,
  Pool: Waves,
};

const activeProjects = [
  { type: "Deck", address: "123 Oak St, Ridgewood", status: "Researching" },
  { type: "Fence", address: "456 Maple Ave, Paramus", status: "Permit Filed" },
  { type: "Pool", address: "123 Oak St, Ridgewood", status: "Planning" },
];

const recentChanges = [
  { town: "Ridgewood", date: "Jan 10, 2026", summary: "Updated fence height regulations for corner lots in R-1 and R-2 zones.", severity: "medium" },
  { town: "Paramus", date: "Jan 8, 2026", summary: "New ADU ordinance adopted — accessory dwelling units now permitted in all residential zones.", severity: "high" },
  { town: "Glen Rock", date: "Dec 22, 2025", summary: "Permit fee schedule updated. Building permit fees increased by 5%.", severity: "low" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-card min-h-[calc(100vh-3.5rem)] p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Saved Towns</h3>
            {savedTowns.map((t) => (
              <Link
                key={t.name}
                to="/town/ridgewood"
                className="flex items-center gap-2 px-2 py-2 rounded text-sm hover:bg-secondary transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span className="font-medium">{t.name}</span>
              </Link>
            ))}
          </div>
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Links</h3>
            <Link to="/compare" className="flex items-center gap-2 px-2 py-2 rounded text-sm hover:bg-secondary transition-colors">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Compare Towns
            </Link>
            <Link to="/query" className="flex items-center gap-2 px-2 py-2 rounded text-sm hover:bg-secondary transition-colors">
              <Search className="h-3.5 w-3.5 text-muted-foreground" /> Ask a Question
            </Link>
            <Link to="/checklist" className="flex items-center justify-between px-2 py-2 rounded text-sm hover:bg-secondary transition-colors">
              <span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-muted-foreground" /> Permit Checklist</span>
            </Link>
            <Link to="/town/ridgewood/ordinances" className="flex items-center justify-between px-2 py-2 rounded text-sm hover:bg-secondary transition-colors">
              <span className="flex items-center gap-2"><Bell className="h-3.5 w-3.5 text-muted-foreground" /> Ordinance Updates</span>
              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[9px]">2</Badge>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-primary mb-1">Welcome back, John</h1>
            <p className="text-sm text-muted-foreground mb-6">Here's what's happening across your saved towns.</p>

            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link to="/query">
                  <Card className="hover:shadow-md transition-shadow hover:border-accent/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Search className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Look Up Address</p>
                        <p className="text-xs text-muted-foreground">Search a new address or town</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/compare">
                  <Card className="hover:shadow-md transition-shadow hover:border-accent/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <GitCompare className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Compare Towns</p>
                        <p className="text-xs text-muted-foreground">Side-by-side rule comparison</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/checklist">
                  <Card className="hover:shadow-md transition-shadow hover:border-accent/30">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <ListChecks className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Permit Checklist</p>
                        <p className="text-xs text-muted-foreground">Generate a project checklist</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </section>

            {/* Saved Towns */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Your Towns</h2>
                <Button variant="ghost" size="sm" className="text-accent text-xs"><Plus className="h-3 w-3 mr-1" /> Add Town</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {savedTowns.map((t) => (
                  <Link key={t.name} to="/town/ridgewood">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-accent" />
                          <span className="font-semibold text-sm">{t.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.zones} zones · {t.county} County</p>
                        <p className="text-xs text-muted-foreground mt-1">Viewed {t.lastViewed}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Active Projects */}
            <section className="mb-8">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Active Projects</h2>
              <Card>
                <CardContent className="p-0">
                  {activeProjects.map((p, i) => {
                    const Icon = projectIcons[p.type] || Hammer;
                    return (
                      <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < activeProjects.length - 1 ? "border-b" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{p.type}</p>
                            <p className="text-xs text-muted-foreground">{p.address}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{p.status}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </section>

            {/* Recent Ordinance Changes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recent Ordinance Changes</h2>
                <Button variant="ghost" size="sm" className="text-accent text-xs">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentChanges.map((c, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                        c.severity === "high" ? "bg-destructive" : c.severity === "medium" ? "bg-warning" : "bg-success"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{c.town}</span>
                          <span className="text-xs text-muted-foreground">{c.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.summary}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
