import { Search, MapPin, Hammer, Bell, FileText, Plus, ChevronRight, Fence, Waves, ListChecks, GitCompare, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import HomeownerDashboard from "./HomeownerDashboard";
import { LoadingState } from "@/components/states/LoadingState";

const projectIcons: Record<string, React.ElementType> = {
  Deck: Hammer,
  deck: Hammer,
  Fence: Fence,
  fence: Fence,
  Pool: Waves,
  pool: Waves,
};

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes("permit")) return "bg-warning/10 text-warning";
  if (s.includes("research")) return "bg-accent/10 text-accent";
  return "";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Route homeowners to their dedicated dashboard; contractors keep the multi-town view.
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState size="lg" />
      </div>
    );
  }
  if (profile?.user_type !== "contractor") {
    return <HomeownerDashboard />;
  }

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  const { data: savedTowns = [], isLoading: loadingTowns } = useQuery({
    queryKey: ["dashboard", "saved-towns", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_towns")
        .select("created_at, town_slug, towns(name, county, num_zones, slug)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["dashboard", "projects", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, project_type, address, status, town_slug, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: changes = [], isLoading: loadingChanges } = useQuery({
    queryKey: ["dashboard", "drifts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_drifts")
        .select("id, town_slug, detected_at, diff_summary, change_type")
        .eq("status", "applied")
        .order("detected_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });

  const unreadChanges = changes.length;

  const unsaveTown = async (slug: string, name: string) => {
    if (!userId) return;
    const { error } = await supabase.from("saved_towns").delete().eq("user_id", userId).eq("town_slug", slug);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Removed ${name}`);
    queryClient.invalidateQueries({ queryKey: ["dashboard", "saved-towns"] });
  };

  return (
    <AppLayout showSearch contained={false}>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-card min-h-[calc(100vh-3.5rem)] p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Saved Towns</h3>
            {loadingTowns ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : savedTowns.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2">No towns saved yet.</p>
            ) : (
              savedTowns.map((row: any) => (
                <div key={row.town_slug} className="group flex items-center gap-1 px-2 py-1 rounded hover:bg-secondary transition-colors">
                  <Link to={`/town/${row.town_slug}`} className="flex items-center gap-2 text-sm flex-1 min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                    <span className="font-medium truncate">{row.towns?.name ?? row.town_slug}</span>
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); unsaveTown(row.town_slug, row.towns?.name ?? row.town_slug); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity"
                    aria-label={`Unsave ${row.towns?.name ?? row.town_slug}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
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
            {savedTowns[0] && (
              <Link to={`/town/${savedTowns[0].town_slug}/ordinances`} className="flex items-center justify-between px-2 py-2 rounded text-sm hover:bg-secondary transition-colors">
                <span className="flex items-center gap-2"><Bell className="h-3.5 w-3.5 text-muted-foreground" /> Ordinance Updates</span>
                {unreadChanges > 0 && (
                  <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[9px]">{unreadChanges}</Badge>
                )}
              </Link>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-primary mb-1">Welcome back, {firstName}</h1>
            <p className="text-sm text-muted-foreground mb-4">Here's what's happening across your saved towns.</p>

            {/* Seasonal Tip */}
            <Card className="mb-6 border-warning/20 bg-warning/5">
              <CardContent padding="sm" className="flex items-start gap-3">
                <span className="text-lg">☀️</span>
                <div>
                  <p className="text-sm font-medium">Spring Building Season</p>
                  <p className="text-xs text-muted-foreground">
                    Permit applications spike in spring. Submit early to avoid delays.{" "}
                    <Link to="/feasibility" className="text-accent hover:underline">Check project feasibility →</Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link to="/search">
                  <Card className="hover:shadow-md transition-shadow hover:border-accent/30">
                    <CardContent padding="sm" className="flex items-center gap-3">
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
                    <CardContent padding="sm" className="flex items-center gap-3">
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
                    <CardContent padding="sm" className="flex items-center gap-3">
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
                <Link to="/onboarding">
                  <Button variant="ghost" size="sm" className="text-accent text-xs"><Plus className="h-3 w-3 mr-1" /> Add Town</Button>
                </Link>
              </div>
              {loadingTowns ? (
                <LoadingState size="sm" />
              ) : savedTowns.length === 0 ? (
                <Card><CardContent padding="lg" className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">You haven't saved any towns yet.</p>
                  <Link to="/onboarding"><Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">Add your first town</Button></Link>
                </CardContent></Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {savedTowns.map((row: any) => (
                    <Card key={row.town_slug} className="hover:shadow-md transition-shadow group relative">
                      <button
                        onClick={() => unsaveTown(row.town_slug, row.towns?.name ?? row.town_slug)}
                        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity"
                        aria-label={`Unsave ${row.towns?.name ?? row.town_slug}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <Link to={`/town/${row.town_slug}`}>
                        <CardContent padding="sm">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-accent" />
                            <span className="font-semibold text-sm">{row.towns?.name ?? row.town_slug}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {row.towns?.num_zones ? `${row.towns.num_zones} zones · ` : ""}{row.towns?.county ?? "Bergen"} County
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Saved {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}
                          </p>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Active Projects */}
            <section className="mb-8">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Active Projects</h2>
              {loadingProjects ? (
                <LoadingState size="sm" />
              ) : projects.length === 0 ? (
                <Card><CardContent padding="lg" className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">No projects yet. Start one with a checklist.</p>
                  <Link to="/checklist"><Button size="sm" variant="outline">Create a checklist</Button></Link>
                </CardContent></Card>
              ) : (
                <Card>
                  <CardContent padding="none">
                    {projects.map((p: any, i: number) => {
                      const Icon = projectIcons[p.project_type] || Hammer;
                      const label = p.project_type.charAt(0).toUpperCase() + p.project_type.slice(1);
                      return (
                        <Link key={p.id} to={`/project/${p.id}`} className={`flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors ${i < projects.length - 1 ? "border-b" : ""}`}>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{label}</p>
                              <p className="text-xs text-muted-foreground">{p.address}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className={`text-xs ${statusBadgeClass(p.status)}`}>{p.status}</Badge>
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Recent Ordinance Changes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recent Ordinance Changes</h2>
              </div>
              {loadingChanges ? (
                <LoadingState size="sm" />
              ) : changes.length === 0 ? (
                <Card><CardContent padding="lg" className="text-center">
                  <p className="text-sm text-muted-foreground">No ordinance changes detected yet. We refresh data weekly.</p>
                </CardContent></Card>
              ) : (
                <div className="space-y-3">
                  {changes.map((c: any) => (
                    <Card key={c.id}>
                      <CardContent padding="sm" className="flex items-start gap-3">
                        <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                          c.change_type === "added" ? "bg-success" : c.change_type === "removed" ? "bg-destructive" : "bg-warning"
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold capitalize">{c.town_slug}</span>
                            <span className="text-xs text-muted-foreground">{new Date(c.detected_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{c.diff_summary ?? "Data updated."}</p>
                        </div>
                        <Link to={`/town/${c.town_slug}/ordinances`}>
                          <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
