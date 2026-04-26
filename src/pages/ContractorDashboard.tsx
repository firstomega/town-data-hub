import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { LoadingState } from "@/components/states/LoadingState";

type Zone = {
  id: string;
  town_slug: string;
  code: string;
  name: string | null;
  setback_front: string | null;
  setback_side: string | null;
  setback_rear: string | null;
  max_height: string | null;
  max_coverage: string | null;
  far: string | null;
};

function useContractorWorkspace(userId: string | undefined) {
  return useQuery({
    queryKey: ["contractor-workspace", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [savedRes, projectsRes] = await Promise.all([
        supabase.from("saved_towns").select("town_slug, created_at").eq("user_id", userId!).order("created_at"),
        supabase
          .from("projects")
          .select("id, address, project_type, town_slug, status, zone, updated_at")
          .eq("user_id", userId!)
          .order("updated_at", { ascending: false }),
      ]);
      const saved = (savedRes.data ?? []) as Array<{ town_slug: string }>;
      const slugs = saved.map((s) => s.town_slug);

      const [townsRes, zonesRes] = await Promise.all([
        slugs.length
          ? supabase.from("towns").select("slug, name, county").in("slug", slugs)
          : Promise.resolve({ data: [], error: null }),
        slugs.length
          ? supabase
              .from("zones")
              .select("id, town_slug, code, name, setback_front, setback_side, setback_rear, max_height, max_coverage, far")
              .in("town_slug", slugs)
              .order("code")
          : Promise.resolve({ data: [], error: null }),
      ]);

      return {
        savedTowns: (townsRes.data ?? []) as Array<{ slug: string; name: string; county: string | null }>,
        projects: (projectsRes.data ?? []) as Array<{
          id: string;
          address: string;
          project_type: string;
          town_slug: string | null;
          status: string;
          zone: string | null;
          updated_at: string;
        }>,
        zones: (zonesRes.data ?? []) as Zone[],
      };
    },
  });
}

const RULE_FIELDS: Array<{ key: keyof Zone; label: string }> = [
  { key: "setback_front", label: "Front setback" },
  { key: "setback_side", label: "Side setback" },
  { key: "setback_rear", label: "Rear setback" },
  { key: "max_height", label: "Max height" },
  { key: "max_coverage", label: "Max coverage" },
  { key: "far", label: "FAR" },
];

export default function ContractorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading } = useContractorWorkspace(user?.id);

  if (authLoading || isLoading) {
    return (
      <AppLayout showSearch contained={false}>
        <LoadingState fill size="lg" />
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout contained={false}>
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent padding="lg" className="text-center space-y-3">
              <h1 className="text-lg font-bold">Sign in required</h1>
              <p className="text-sm text-muted-foreground">The Contractor Dashboard is for logged-in pros.</p>
              <Link to="/auth"><Button>Sign In</Button></Link>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const savedTowns = data?.savedTowns ?? [];
  const projects = data?.projects ?? [];
  const zones = data?.zones ?? [];

  // Group zones by town for the rule grid (cap at 3 zones per town for readability)
  const zonesByTown: Record<string, Zone[]> = {};
  for (const z of zones) {
    zonesByTown[z.town_slug] ??= [];
    zonesByTown[z.town_slug].push(z);
  }

  return (
    <AppLayout showSearch contained={false}>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-card min-h-[calc(100vh-3.5rem)] p-4">
          <div className="mb-6">
            <p className="text-sm font-semibold">{user.email}</p>
            <p className="text-xs text-muted-foreground">Contractor workspace</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Service Area</h3>
            {savedTowns.length === 0 && (
              <p className="text-xs text-muted-foreground">No saved towns yet.</p>
            )}
            {savedTowns.map((t) => {
              const projectsHere = projects.filter((p) => p.town_slug === t.slug).length;
              return (
                <Link
                  key={t.slug}
                  to={`/town/${t.slug}`}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-secondary rounded transition-colors"
                >
                  <MapPin className="h-3 w-3 text-accent" />
                  <span className="text-xs">{t.name}</span>
                  {projectsHere > 0 && (
                    <Badge variant="secondary" className="ml-auto text-micro h-4">{projectsHere}</Badge>
                  )}
                </Link>
              );
            })}
            <Link to="/onboarding">
              <Button variant="ghost" size="sm" className="mt-2 w-full text-xs text-accent gap-1">
                <Plus className="h-3 w-3" /> Add towns
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary">Contractor Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {savedTowns.length} saved town{savedTowns.length === 1 ? "" : "s"} · {projects.length} project{projects.length === 1 ? "" : "s"}
                </p>
              </div>
              <Link to="/feasibility">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Feasibility check
                </Button>
              </Link>
            </div>

            {/* Empty state */}
            {savedTowns.length === 0 && projects.length === 0 && (
              <Card className="mb-6">
                <CardContent padding="lg" className="text-center space-y-3">
                  <h3 className="font-semibold text-sm">Set up your workspace</h3>
                  <p className="text-xs text-muted-foreground">
                    Save the towns you work in. We'll pull the zoning rules side-by-side so you can compare without flipping tabs.
                  </p>
                  <Link to="/onboarding"><Button size="sm">Add Towns</Button></Link>
                </CardContent>
              </Card>
            )}

            {/* Rule Variations — real DB rows */}
            {savedTowns.length > 0 && (
              <Card className="mb-6">
                <CardContent padding="none">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold text-sm">Zone rules across your towns</h2>
                    <p className="text-caption text-muted-foreground">Pulled from the verified zoning database. Each row is one zone.</p>
                  </div>
                  {zones.length === 0 ? (
                    <p className="p-6 text-center text-xs text-muted-foreground">No zones loaded for your towns yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-secondary/50">
                            <TableHead className="font-semibold text-xs">Town · Zone</TableHead>
                            {RULE_FIELDS.map((f) => (
                              <TableHead key={f.key as string} className="font-semibold text-xs">{f.label}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {savedTowns.flatMap((t) =>
                            (zonesByTown[t.slug] ?? []).slice(0, 5).map((z, i) => (
                              <TableRow key={z.id} className={i % 2 === 0 ? "" : "bg-secondary/20"}>
                                <TableCell className="text-xs font-medium whitespace-nowrap">
                                  <Link to={`/town/${t.slug}/zoning`} className="hover:text-accent">
                                    {t.name} · {z.code}
                                  </Link>
                                </TableCell>
                                {RULE_FIELDS.map((f) => (
                                  <TableCell key={f.key as string} className="text-xs">
                                    {(z[f.key] as string | null) ?? <span className="text-muted-foreground">—</span>}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Projects — real */}
            <Card className="mb-6">
              <CardContent padding="none">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Your projects</h2>
                  <Link to="/checklist">
                    <Button variant="ghost" size="sm" className="text-xs text-accent gap-1">
                      <Plus className="h-3 w-3" /> New project
                    </Button>
                  </Link>
                </div>
                {projects.length === 0 ? (
                  <p className="p-6 text-center text-xs text-muted-foreground">
                    No projects yet. Save one from the Permit Checklist.
                  </p>
                ) : (
                  projects.map((p, i) => (
                    <Link
                      to={`/project/${p.id}`}
                      key={p.id}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors ${
                        i < projects.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.project_type}
                          {p.town_slug ? ` · ${p.town_slug}` : ""}
                          {p.zone ? ` · Zone ${p.zone}` : ""}
                          {" · updated "}
                          {formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant={p.status === "complete" ? "default" : "secondary"} className="text-xs capitalize">
                        {p.status}
                      </Badge>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
