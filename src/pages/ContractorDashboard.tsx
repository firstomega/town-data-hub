import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Users, Hammer, Bell, ChevronRight, Map, Plus, Settings, ThumbsUp, Filter, UserPlus, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const serviceTowns = [
  { name: "Ridgewood", zones: 14, activeProjects: 3 },
  { name: "Paramus", zones: 11, activeProjects: 5 },
  { name: "Glen Rock", zones: 8, activeProjects: 1 },
  { name: "Fair Lawn", zones: 15, activeProjects: 2 },
  { name: "Wyckoff", zones: 9, activeProjects: 0 },
];

const ruleVariations = [
  { rule: "R-1 Front Setback", ridgewood: "40 ft", paramus: "30 ft", glenRock: "35 ft", fairLawn: "30 ft", wyckoff: "50 ft" },
  { rule: "Max Lot Coverage", ridgewood: "25%", paramus: "30%", glenRock: "28%", fairLawn: "30%", wyckoff: "20%" },
  { rule: "Max Height", ridgewood: "35 ft", paramus: "35 ft", glenRock: "35 ft", fairLawn: "35 ft", wyckoff: "35 ft" },
  { rule: "Building Permit Fee", ridgewood: "$150+", paramus: "$125+", glenRock: "$175+", fairLawn: "$100+", wyckoff: "$200+" },
  { rule: "Permit Timeline", ridgewood: "4-6 wk", paramus: "3-4 wk", glenRock: "4-5 wk", fairLawn: "3-5 wk", wyckoff: "5-7 wk" },
];

const projects = [
  { client: "Johnson Residence", type: "Deck", town: "Ridgewood", status: "In Progress" },
  { client: "Smith Property", type: "Addition", town: "Paramus", status: "Permit Filed" },
  { client: "Williams Home", type: "Fence", town: "Fair Lawn", status: "Planning" },
  { client: "Garcia Residence", type: "Pool", town: "Paramus", status: "Complete" },
];

const changes = [
  { town: "Paramus", date: "Jan 8", summary: "New ADU ordinance — now permitted in all residential zones." },
  { town: "Ridgewood", date: "Jan 10", summary: "Updated fence regs for corner lots in R-1 and R-2." },
  { town: "Fair Lawn", date: "Jan 5", summary: "Permit fee schedule updated — 5% increase." },
];

const teamMembers = [
  { name: "John Doe", role: "Owner", initials: "JD", email: "john@buildright.com" },
  { name: "Sarah Kim", role: "Project Manager", initials: "SK", email: "sarah@buildright.com" },
  { name: "Mike Chen", role: "Estimator", initials: "MC", email: "mike@buildright.com" },
];

const communityNotes = [
  { town: "Ridgewood", note: "Building dept is strict on survey accuracy — use a licensed surveyor, not a sketch.", upvotes: 24 },
  { town: "Paramus", note: "ADU applications are being fast-tracked since the new ordinance. Expect 2-3 weeks.", upvotes: 18 },
  { town: "Fair Lawn", note: "Inspector availability limited on Fridays — schedule early in the week.", upvotes: 12 },
];

export default function ContractorDashboard() {
  const [townFilter, setTownFilter] = useState("All");

  const filteredChanges = townFilter === "All" ? changes : changes.filter((c) => c.town === townFilter);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-card min-h-[calc(100vh-3.5rem)] p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">BD</div>
              <div>
                <p className="text-sm font-semibold">BuildRight Contractors</p>
                <p className="text-xs text-muted-foreground">Pro Plan · 3 of 5 seats</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Team</h3>
            {teamMembers.map((m) => (
              <div key={m.name} className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">{m.initials}</div>
                <div>
                  <p className="text-xs font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="mt-2 w-full text-xs text-accent gap-1">
              <UserPlus className="h-3 w-3" /> Invite Member
            </Button>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Service Area</h3>
            {serviceTowns.map((t) => (
              <Link key={t.name} to="/town/ridgewood" className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-secondary rounded transition-colors">
                <MapPin className="h-3 w-3 text-accent" />
                <span className="text-xs">{t.name}</span>
                <Badge variant="secondary" className="ml-auto text-[10px] h-4">{t.activeProjects}</Badge>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary">Contractor Dashboard</h1>
                <p className="text-sm text-muted-foreground">5 towns · 11 active projects · 3 of 5 seats used</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5"><Settings className="h-3.5 w-3.5" /> Manage</Button>
            </div>

            {/* Team Management Card */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Team Management</h3>
                    <p className="text-xs text-muted-foreground">3 of 5 seats used · 2 seats available</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {teamMembers.map((m) => (
                        <div key={m.initials} className="h-8 w-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium">{m.initials}</div>
                      ))}
                      <div className="h-8 w-8 rounded-full bg-secondary/50 border-2 border-card flex items-center justify-center text-xs text-muted-foreground border-dashed">+2</div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      <Mail className="h-3 w-3" /> Invite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coverage Map */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="h-48 bg-secondary flex items-center justify-center rounded-t-lg">
                  <div className="text-center text-muted-foreground">
                    <Map className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">Multi-Town Coverage Map</p>
                    <p className="text-xs">5 municipalities in Bergen County</p>
                  </div>
                </div>
                <div className="p-3 border-t flex gap-2 flex-wrap">
                  {serviceTowns.map((t) => (
                    <Badge key={t.name} variant="secondary" className="text-xs">{t.name}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rule Variations */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-sm">Rule Variations Across Your Towns</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="font-semibold text-xs">Rule</TableHead>
                      {serviceTowns.map((t) => (
                        <TableHead key={t.name} className="font-semibold text-xs">{t.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ruleVariations.map((r, i) => (
                      <TableRow key={r.rule} className={i % 2 === 0 ? "" : "bg-secondary/20"}>
                        <TableCell className="text-xs font-medium">{r.rule}</TableCell>
                        <TableCell className="text-xs">{r.ridgewood}</TableCell>
                        <TableCell className="text-xs">{r.paramus}</TableCell>
                        <TableCell className="text-xs">{r.glenRock}</TableCell>
                        <TableCell className="text-xs">{r.fairLawn}</TableCell>
                        <TableCell className="text-xs">{r.wyckoff}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Projects */}
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-sm">Projects</h2>
                    <Button variant="ghost" size="sm" className="text-xs text-accent"><Plus className="h-3 w-3 mr-1" /> New</Button>
                  </div>
                  {projects.map((p, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < projects.length - 1 ? "border-b" : ""}`}>
                      <div>
                        <p className="text-sm font-medium">{p.client}</p>
                        <p className="text-xs text-muted-foreground">{p.type} · {p.town}</p>
                      </div>
                      <Badge variant={p.status === "Complete" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Changes — Filterable */}
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-sm">Recent Ordinance Changes</h2>
                    <div className="flex items-center gap-1">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      <select
                        value={townFilter}
                        onChange={(e) => setTownFilter(e.target.value)}
                        className="text-xs bg-transparent border-0 text-muted-foreground focus:outline-none"
                      >
                        <option value="All">All Towns</option>
                        {serviceTowns.map((t) => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {filteredChanges.map((c, i) => (
                    <div key={i} className={`px-4 py-3 ${i < filteredChanges.length - 1 ? "border-b" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px]">{c.town}</Badge>
                        <span className="text-xs text-muted-foreground">{c.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.summary}</p>
                    </div>
                  ))}
                  {filteredChanges.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No changes for this town.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Community Notes */}
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-sm">Your Community Notes</h2>
                  <p className="text-xs text-muted-foreground">Tips you've shared with the community</p>
                </div>
                {communityNotes.map((n, i) => (
                  <div key={i} className={`px-4 py-3 flex items-start gap-3 ${i < communityNotes.length - 1 ? "border-b" : ""}`}>
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5">
                      <ThumbsUp className="h-3 w-3 text-accent" />
                      <span className="text-xs font-semibold">{n.upvotes}</span>
                    </div>
                    <div>
                      <Badge variant="secondary" className="text-[10px] mb-1">{n.town}</Badge>
                      <p className="text-xs text-muted-foreground">{n.note}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
