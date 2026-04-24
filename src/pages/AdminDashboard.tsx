import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Users, Activity, AlertTriangle, Database, Loader2, MapPin, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, projects, savedTowns, drifts, runs] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("saved_towns").select("id", { count: "exact", head: true }),
        supabase.from("data_drifts").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("ingestion_runs").select("id", { count: "exact", head: true }),
      ]);
      return {
        users: profiles.count ?? 0,
        projects: projects.count ?? 0,
        savedTowns: savedTowns.count ?? 0,
        pendingDrifts: drifts.count ?? 0,
        totalRuns: runs.count ?? 0,
      };
    },
  });
}

function usePendingExtracted() {
  return useQuery({
    queryKey: ["admin-pending-extracted"],
    queryFn: async () => {
      const tables = ["zones", "permits", "ordinances", "contacts"] as const;
      const counts = await Promise.all(
        tables.map((t) =>
          supabase.from(t).select("id", { count: "exact", head: true }).eq("confidence", "ai_extracted")
        )
      );
      return tables.reduce<Record<string, number>>((acc, t, i) => {
        acc[t] = counts[i].count ?? 0;
        return acc;
      }, {});
    },
  });
}

function useTownsCompleteness() {
  return useQuery({
    queryKey: ["admin-town-completeness"],
    queryFn: async () => {
      const { data: towns, error } = await supabase
        .from("towns")
        .select("slug, name, data_status, last_verified, updated_at")
        .order("name");
      if (error) throw error;
      const slugs = (towns ?? []).map((t) => t.slug);
      if (!slugs.length) return [];
      const tables = ["zones", "permits", "ordinances", "contacts"] as const;
      const rows = await Promise.all(
        tables.map((t) => supabase.from(t).select("town_slug, confidence").in("town_slug", slugs))
      );
      const counts: Record<string, Record<string, { total: number; verified: number }>> = {};
      tables.forEach((t, i) => {
        for (const r of (rows[i].data ?? []) as Array<{ town_slug: string; confidence: string }>) {
          counts[r.town_slug] ??= {};
          counts[r.town_slug][t] ??= { total: 0, verified: 0 };
          counts[r.town_slug][t].total += 1;
          if (r.confidence === "verified") counts[r.town_slug][t].verified += 1;
        }
      });
      return (towns ?? []).map((t) => {
        const c = counts[t.slug] ?? {};
        const sections = tables.map((tbl) => ({
          name: tbl,
          has: (c[tbl]?.total ?? 0) > 0,
          verified: (c[tbl]?.verified ?? 0) > 0,
        }));
        const totalRows = tables.reduce((s, tbl) => s + (c[tbl]?.total ?? 0), 0);
        const verifiedRows = tables.reduce((s, tbl) => s + (c[tbl]?.verified ?? 0), 0);
        const completeness = totalRows === 0 ? 0 : Math.round((verifiedRows / totalRows) * 100);
        return { ...t, sections, completeness };
      });
    },
  });
}

function useRecentRuns() {
  return useQuery({
    queryKey: ["admin-recent-runs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingestion_runs")
        .select("id, town_slug, ingestion_type, status, started_at, rows_added, source_url")
        .order("started_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export default function AdminDashboard() {
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: pending, isLoading: loadingPending } = usePendingExtracted();
  const { data: townRows, isLoading: loadingTowns } = useTownsCompleteness();
  const { data: runs, isLoading: loadingRuns } = useRecentRuns();

  const totalPending = pending ? Object.values(pending).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Internal tools · Content management · Live data</p>
          </div>
          <Badge variant="destructive" className="text-xs">Admin Only</Badge>
        </div>

        <Link to="/admin/data-review">
          <Card className="mb-6 hover:shadow-md transition-shadow cursor-pointer border-accent/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-semibold text-sm">Data Ingestion & Review</p>
                  <p className="text-xs text-muted-foreground">
                    {totalPending > 0
                      ? `${totalPending} AI-extracted row${totalPending === 1 ? "" : "s"} pending review`
                      : "Pull from official sources, review AI-extracted rows, approve into the verified dataset."}
                    {stats && stats.pendingDrifts > 0 ? ` · ${stats.pendingDrifts} drift alert${stats.pendingDrifts === 1 ? "" : "s"}` : ""}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">Open</Button>
            </CardContent>
          </Card>
        </Link>

        {/* Live counts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Registered users", value: stats?.users ?? 0, icon: Users },
            { label: "Saved towns", value: stats?.savedTowns ?? 0, icon: MapPin },
            { label: "User projects", value: stats?.projects ?? 0, icon: FileText },
            { label: "Pending drift alerts", value: stats?.pendingDrifts ?? 0, icon: AlertTriangle },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <s.icon className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{loadingStats ? <Loader2 className="h-5 w-5 animate-spin inline" /> : s.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending review by table */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(["zones", "permits", "ordinances", "contacts"] as const).map((tbl) => (
            <Card key={tbl}>
              <CardContent className="p-4">
                <Activity className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-lg font-bold">
                  {loadingPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : (pending?.[tbl] ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{tbl} pending review</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Completeness */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm">Data Completeness</h2>
              <p className="text-[11px] text-muted-foreground">Live from the towns table. % = verified rows ÷ total rows across all four sections.</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="font-semibold">Town</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Completeness</TableHead>
                  <TableHead className="font-semibold text-center">Zoning</TableHead>
                  <TableHead className="font-semibold text-center">Permits</TableHead>
                  <TableHead className="font-semibold text-center">Ordinances</TableHead>
                  <TableHead className="font-semibold text-center">Contacts</TableHead>
                  <TableHead className="font-semibold">Last Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingTowns && (
                  <TableRow><TableCell colSpan={7} className="text-center py-6"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
                )}
                {!loadingTowns && (townRows ?? []).length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-6 text-xs text-muted-foreground">No towns yet.</TableCell></TableRow>
                )}
                {(townRows ?? []).map((t, i) => (
                  <TableRow key={t.slug} className={i % 2 === 0 ? "" : "bg-secondary/20"}>
                    <TableCell className="font-medium text-sm">{t.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={t.data_status === "verified" ? "default" : t.data_status === "partial" ? "secondary" : "outline"}
                        className="text-[10px]"
                      >
                        {t.data_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={t.completeness} className="h-2 w-20" />
                        <span className="text-xs font-medium">{t.completeness}%</span>
                      </div>
                    </TableCell>
                    {(["zones", "permits", "ordinances", "contacts"] as const).map((tbl) => {
                      const sec = t.sections.find((s) => s.name === tbl);
                      return (
                        <TableCell key={tbl} className="text-center">
                          {!sec?.has ? (
                            <X className="h-4 w-4 text-destructive mx-auto" />
                          ) : sec.verified ? (
                            <Check className="h-4 w-4 text-success mx-auto" />
                          ) : (
                            <span className="text-[10px] text-warning">unverified</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-xs text-muted-foreground">
                      {t.last_verified
                        ? formatDistanceToNow(new Date(t.last_verified), { addSuffix: true })
                        : "Never"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent ingestion runs */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm">Recent Ingestion Activity</h2>
              <p className="text-[11px] text-muted-foreground">Last 10 source pulls. Manage and review them in Data Review.</p>
            </div>
            <div className="divide-y">
              {loadingRuns && <div className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></div>}
              {!loadingRuns && (runs ?? []).length === 0 && (
                <p className="p-6 text-center text-xs text-muted-foreground">No ingestion runs yet. Open Data Review to ingest a source.</p>
              )}
              {(runs ?? []).map((r) => (
                <div key={r.id} className="px-4 py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1 truncate">
                    <span className="font-mono">{r.town_slug ?? "—"}</span> · {r.ingestion_type} ·{" "}
                    <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate">
                      {r.source_url}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={r.status === "completed" ? "default" : r.status === "failed" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {r.status}
                    </Badge>
                    {(r.rows_added ?? 0) > 0 && <span className="text-muted-foreground">+{r.rows_added}</span>}
                    <span className="text-muted-foreground">
                      {r.started_at ? formatDistanceToNow(new Date(r.started_at), { addSuffix: true }) : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
