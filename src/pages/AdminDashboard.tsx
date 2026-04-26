import { useState, useMemo } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Check, X, AlertTriangle, Database, Loader2, MapPin, FileText, Inbox, Zap, RefreshCw, ExternalLink,
  ChevronDown, ChevronUp, Sparkles, ShieldCheck, Search, Filter, Edit3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ConfidenceBadge } from "@/components/admin/ConfidenceBadge";
import { LoadingState } from "@/components/states/LoadingState";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

type IngestionType = "zones" | "permits" | "ordinances" | "contacts";
const INGESTION_TYPES: IngestionType[] = ["zones", "permits", "ordinances", "contacts"];

const CONFIDENCE_PRESETS = {
  "below-0.6": { value: 0.6, label: "Below 0.6 (high risk)" },
  "below-0.85": { value: 0.85, label: "Below 0.85 (default)" },
  "all": { value: 1.01, label: "Everything unverified" },
} as const;

type QueueRow = {
  id: string;
  town_slug: string;
  ingestion_type: IngestionType;
  source_url: string;
  source_label: string | null;
  discovery_confidence: number | null;
  discovery_method: "platform_directory" | "ai_ranked" | "manual" | null;
  discovery_reasoning: string | null;
  verified_at: string | null;
  updated_at: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Data hooks
// ─────────────────────────────────────────────────────────────────────────────

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, projects, savedTowns, drifts, runs, reviewQueue, towns] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("saved_towns").select("id", { count: "exact", head: true }),
        supabase.from("data_drifts").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("ingestion_runs").select("id", { count: "exact", head: true }),
        supabase
          .from("town_sources")
          .select("id", { count: "exact", head: true })
          .is("verified_at", null)
          .or("discovery_confidence.lt.0.85,discovery_confidence.is.null"),
        supabase.from("towns").select("data_status"),
      ]);
      const verifiedTowns = (towns.data ?? []).filter((t) => t.data_status === "verified").length;
      const partialTowns = (towns.data ?? []).filter((t) => t.data_status === "partial").length;
      const totalTowns = (towns.data ?? []).length;
      return {
        users: profiles.count ?? 0,
        projects: projects.count ?? 0,
        savedTowns: savedTowns.count ?? 0,
        pendingDrifts: drifts.count ?? 0,
        totalRuns: runs.count ?? 0,
        reviewQueue: reviewQueue.count ?? 0,
        verifiedTowns,
        partialTowns,
        totalTowns,
      };
    },
  });
}

function usePendingExtracted() {
  return useQuery({
    queryKey: ["admin-pending-extracted"],
    queryFn: async () => {
      const counts = await Promise.all(
        INGESTION_TYPES.map((t) =>
          supabase.from(t).select("id", { count: "exact", head: true }).eq("confidence", "ai_extracted")
        )
      );
      return INGESTION_TYPES.reduce<Record<string, number>>((acc, t, i) => {
        acc[t] = counts[i].count ?? 0;
        return acc;
      }, {});
    },
  });
}

function useReviewQueue(threshold: number) {
  return useQuery({
    queryKey: ["admin-review-queue", threshold],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("town_sources")
        .select(
          "id, town_slug, ingestion_type, source_url, source_label, discovery_confidence, discovery_method, discovery_reasoning, verified_at, updated_at",
        )
        .is("verified_at", null)
        .or(`discovery_confidence.lt.${threshold},discovery_confidence.is.null`)
        .order("discovery_confidence", { ascending: true, nullsFirst: true })
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as QueueRow[];
    },
  });
}

function useTownsCompleteness() {
  return useQuery({
    queryKey: ["admin-town-completeness"],
    queryFn: async () => {
      const { data: towns, error } = await supabase
        .from("towns")
        .select("slug, name, county, data_status, last_verified, updated_at")
        .order("name");
      if (error) throw error;
      const slugs = (towns ?? []).map((t) => t.slug);
      if (!slugs.length) return [];
      const rows = await Promise.all(
        INGESTION_TYPES.map((t) => supabase.from(t).select("town_slug, confidence").in("town_slug", slugs))
      );
      const counts: Record<string, Record<string, { total: number; verified: number }>> = {};
      INGESTION_TYPES.forEach((t, i) => {
        for (const r of (rows[i].data ?? []) as Array<{ town_slug: string; confidence: string }>) {
          counts[r.town_slug] ??= {};
          counts[r.town_slug][t] ??= { total: 0, verified: 0 };
          counts[r.town_slug][t].total += 1;
          if (r.confidence === "verified") counts[r.town_slug][t].verified += 1;
        }
      });
      return (towns ?? []).map((t) => {
        const c = counts[t.slug] ?? {};
        const sections = INGESTION_TYPES.map((tbl) => ({
          name: tbl,
          has: (c[tbl]?.total ?? 0) > 0,
          verified: (c[tbl]?.verified ?? 0) > 0,
        }));
        const totalRows = INGESTION_TYPES.reduce((s, tbl) => s + (c[tbl]?.total ?? 0), 0);
        const verifiedRows = INGESTION_TYPES.reduce((s, tbl) => s + (c[tbl]?.verified ?? 0), 0);
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

// ─────────────────────────────────────────────────────────────────────────────
// Auto-checks for the inline source-review checklist
// ─────────────────────────────────────────────────────────────────────────────

type CheckResult = { ok: boolean | "warn"; label: string };

function autoChecksFor(row: QueueRow): CheckResult[] {
  const out: CheckResult[] = [];
  let url: URL | null = null;
  try { url = new URL(row.source_url); } catch { /* invalid URL */ }

  out.push({
    ok: !!url,
    label: url ? "URL is well-formed" : "URL is malformed",
  });

  if (url) {
    const hostname = url.hostname.toLowerCase();
    const isGov = hostname.endsWith(".gov") || hostname.includes(".gov.");
    const slugFragments = row.town_slug.replace(/-/g, "");
    const hostnameMatchesTown = hostname.replace(/[-.]/g, "").includes(slugFragments);
    out.push({
      ok: isGov || hostnameMatchesTown,
      label: isGov
        ? "Domain is .gov"
        : hostnameMatchesTown
          ? `Domain mentions "${row.town_slug}"`
          : "Domain is not .gov and doesn't mention the town",
    });

    const path = url.pathname.toLowerCase();
    const expectsKeywords: Record<IngestionType, string[]> = {
      zones: ["zone", "zoning", "land", "develop"],
      permits: ["permit", "construction", "build", "fee"],
      ordinances: ["code", "ordinance", "chapter"],
      contacts: ["contact", "depart", "staff", "directory"],
    };
    const matched = expectsKeywords[row.ingestion_type].some((kw) => path.includes(kw));
    out.push({
      ok: matched ? true : "warn",
      label: matched
        ? `URL path contains expected keyword for ${row.ingestion_type}`
        : `URL path doesn't contain typical ${row.ingestion_type} keywords`,
    });
  }

  if (row.discovery_reasoning) {
    const doubt = /(might|may|appears|likely|possibly|seems|could be)/i.test(row.discovery_reasoning);
    if (doubt) {
      out.push({ ok: "warn", label: "AI used hedging language in its reasoning" });
    }
  }

  if (row.discovery_method === "platform_directory") {
    out.push({ ok: true, label: "Came from publisher's official directory" });
  }

  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulk-action hooks
// ─────────────────────────────────────────────────────────────────────────────

type BulkProgress = { running: boolean; completed: number; total: number; failures: string[] } | null;

function useBulkDiscover() {
  const qc = useQueryClient();
  const [progress, setProgress] = useState<BulkProgress>(null);

  const run = async () => {
    const { data: townRows, error } = await supabase
      .from("towns")
      .select("slug, name")
      .eq("data_status", "placeholder")
      .order("name");
    if (error) {
      toast.error(error.message);
      return;
    }

    // Skip towns that already have town_sources rows.
    const slugs = (townRows ?? []).map((t) => t.slug);
    const { data: existingSources } = await supabase
      .from("town_sources")
      .select("town_slug")
      .in("town_slug", slugs.length ? slugs : ["__none__"]);
    const seen = new Set((existingSources ?? []).map((s) => s.town_slug));
    const targets = (townRows ?? []).filter((t) => !seen.has(t.slug));

    if (!targets.length) {
      toast.success("Every placeholder town already has at least one source. Nothing to discover.");
      return;
    }

    setProgress({ running: true, completed: 0, total: targets.length, failures: [] });
    const failures: string[] = [];

    // Sequential to avoid hammering Firecrawl/Lovable AI rate limits.
    for (const t of targets) {
      try {
        const { error: invokeErr } = await supabase.functions.invoke("discover-town-sources", {
          body: { town_slug: t.slug, save: true },
        });
        if (invokeErr) failures.push(`${t.name}: ${invokeErr.message}`);
      } catch (e) {
        failures.push(`${t.name}: ${e instanceof Error ? e.message : "unknown error"}`);
      }
      setProgress((prev) => prev ? { ...prev, completed: prev.completed + 1, failures } : prev);
    }

    setProgress((prev) => prev ? { ...prev, running: false, failures } : prev);
    toast.success(
      `Discovery complete — ${targets.length - failures.length}/${targets.length} succeeded${
        failures.length ? `, ${failures.length} failed` : ""
      }`,
    );
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    qc.invalidateQueries({ queryKey: ["admin-review-queue"] });
    qc.invalidateQueries({ queryKey: ["admin-town-completeness"] });
  };

  return { progress, run };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: pending, isLoading: loadingPending } = usePendingExtracted();
  const { data: townRows, isLoading: loadingTowns } = useTownsCompleteness();
  const { data: runs, isLoading: loadingRuns } = useRecentRuns();

  const totalPending = pending ? Object.values(pending).reduce((a, b) => a + b, 0) : 0;

  // Inline review-queue state
  const [thresholdKey, setThresholdKey] = useState<keyof typeof CONFIDENCE_PRESETS>("below-0.85");
  const [typeFilter, setTypeFilter] = useState<IngestionType | "all">("all");
  const [reviewExpanded, setReviewExpanded] = useState(true);
  const threshold = CONFIDENCE_PRESETS[thresholdKey].value;
  const { data: queueRows = [], isLoading: loadingQueue } = useReviewQueue(threshold);
  const filteredQueue = typeFilter === "all" ? queueRows : queueRows.filter((r) => r.ingestion_type === typeFilter);

  // Coverage table filtering / sorting
  const [coverageFilter, setCoverageFilter] = useState<"all" | "verified" | "partial" | "placeholder">("all");
  const [coverageSearch, setCoverageSearch] = useState("");
  const [coverageSort, setCoverageSort] = useState<"name" | "completeness" | "last_verified">("name");
  const filteredCoverage = useMemo(() => {
    let rows = townRows ?? [];
    if (coverageFilter !== "all") rows = rows.filter((r) => r.data_status === coverageFilter);
    if (coverageSearch.trim()) {
      const needle = coverageSearch.trim().toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(needle) || r.slug.includes(needle));
    }
    rows = [...rows].sort((a, b) => {
      if (coverageSort === "completeness") return b.completeness - a.completeness;
      if (coverageSort === "last_verified") {
        const av = a.last_verified ? new Date(a.last_verified).getTime() : 0;
        const bv = b.last_verified ? new Date(b.last_verified).getTime() : 0;
        return bv - av;
      }
      return a.name.localeCompare(b.name);
    });
    return rows;
  }, [townRows, coverageFilter, coverageSearch, coverageSort]);

  const placeholderCount = (townRows ?? []).filter((r) => r.data_status === "placeholder").length;

  // Mutations on queue rows
  const approve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("town_sources")
        .update({ verified_by: user?.id ?? null, verified_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Approved");
      qc.invalidateQueries({ queryKey: ["admin-review-queue"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Approve failed"),
  });

  const replaceUrl = useMutation({
    mutationFn: async ({ id, source_url }: { id: string; source_url: string }) => {
      const { error } = await supabase
        .from("town_sources")
        .update({
          source_url,
          discovery_method: "manual",
          discovery_confidence: 1.0,
          discovery_reasoning: null,
          verified_by: user?.id ?? null,
          verified_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("URL replaced & verified");
      qc.invalidateQueries({ queryKey: ["admin-review-queue"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Update failed"),
  });

  const reject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("town_sources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["admin-review-queue"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Remove failed"),
  });

  const rediscover = useMutation({
    mutationFn: async (row: QueueRow) => {
      const { error } = await supabase.functions.invoke("discover-town-sources", {
        body: { town_slug: row.town_slug, types: [row.ingestion_type], save: true },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Re-discovery complete");
      qc.invalidateQueries({ queryKey: ["admin-review-queue"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Re-discovery failed"),
  });

  const { progress: bulkProgress, run: runBulkDiscover } = useBulkDiscover();

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin</h1>
            <p className="text-sm text-muted-foreground">
              Everything you need on one screen. Drill into a town from the table below to manage its sources directly.
            </p>
          </div>
          <Badge variant="destructive" className="text-xs">Admin Only</Badge>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent padding="sm">
              <MapPin className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">
                {loadingStats ? <Loader2 className="h-5 w-5 animate-spin inline" /> : `${stats?.verifiedTowns ?? 0}/${stats?.totalTowns ?? 0}`}
              </p>
              <p className="text-xs text-muted-foreground">Towns with verified data</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent padding="sm">
              <ShieldCheck className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{loadingStats ? <Loader2 className="h-5 w-5 animate-spin inline" /> : (stats?.partialTowns ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Towns partially covered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent padding="sm">
              <Inbox className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{loadingStats ? <Loader2 className="h-5 w-5 animate-spin inline" /> : (stats?.reviewQueue ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Sources need review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent padding="sm">
              <Database className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{loadingPending ? <Loader2 className="h-5 w-5 animate-spin inline" /> : totalPending}</p>
              <p className="text-xs text-muted-foreground">Extracted rows pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Bulk actions */}
        <Card className="mb-6 border-accent/30">
          <CardContent padding="sm">
            <div className="flex flex-wrap items-center gap-3">
              <Zap className="h-5 w-5 text-accent" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Bulk operations</p>
                <p className="text-xs text-muted-foreground">
                  {placeholderCount > 0
                    ? `${placeholderCount} town${placeholderCount === 1 ? "" : "s"} still placeholder. Discover sources for all of them at once.`
                    : "All towns have sources. Run ingest from Data Review to actually scrape data."}
                </p>
              </div>
              <Button
                size="sm"
                onClick={runBulkDiscover}
                disabled={bulkProgress?.running || placeholderCount === 0}
                className="gap-2"
              >
                {bulkProgress?.running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Discover sources for all placeholder towns
              </Button>
              <Link to="/admin/data-review">
                <Button size="sm" variant="outline" className="gap-2">
                  <Database className="h-4 w-4" /> Open advanced data review
                </Button>
              </Link>
            </div>
            {bulkProgress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>
                    {bulkProgress.running ? "Discovering" : "Discovery finished"}: {bulkProgress.completed} of {bulkProgress.total}
                    {bulkProgress.failures.length > 0 ? ` · ${bulkProgress.failures.length} failed` : ""}
                  </span>
                  <span>{Math.round((bulkProgress.completed / bulkProgress.total) * 100)}%</span>
                </div>
                <Progress value={(bulkProgress.completed / bulkProgress.total) * 100} className="h-2" />
                {!bulkProgress.running && bulkProgress.failures.length > 0 && (
                  <details className="text-xs text-destructive mt-2">
                    <summary className="cursor-pointer">{bulkProgress.failures.length} failures (click to expand)</summary>
                    <ul className="list-disc ml-5 mt-1">
                      {bulkProgress.failures.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source Review Queue (inline) */}
        <Card className="mb-6">
          <CardContent padding="none">
            <button
              onClick={() => setReviewExpanded((v) => !v)}
              className="w-full p-4 border-b flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
            >
              <div>
                <h2 className="font-semibold text-sm flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-accent" />
                  Sources needing review
                  {filteredQueue.length > 0 && (
                    <Badge variant="warning" className="text-micro">{filteredQueue.length}</Badge>
                  )}
                </h2>
                <p className="text-caption text-muted-foreground">
                  Auto-discovered URLs the system isn't 100% sure about. Approve, replace, or re-discover each.
                </p>
              </div>
              {reviewExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {reviewExpanded && (
              <>
                {/* Filters */}
                <div className="p-4 border-b flex flex-wrap items-end gap-3 bg-secondary/20">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Filter className="h-3 w-3" /> Confidence threshold
                    </label>
                    <Select value={thresholdKey} onValueChange={(v) => setThresholdKey(v as keyof typeof CONFIDENCE_PRESETS)}>
                      <SelectTrigger className="mt-1.5 w-48 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(CONFIDENCE_PRESETS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Ingestion type</label>
                    <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as IngestionType | "all")}>
                      <SelectTrigger className="mt-1.5 w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {INGESTION_TYPES.map((t) => (
                          <SelectItem key={t} value={t}><span className="capitalize">{t}</span></SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {loadingQueue ? (
                  <LoadingState />
                ) : filteredQueue.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShieldCheck className="h-8 w-8 text-success/40 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Inbox zero</p>
                    <p className="text-xs text-muted-foreground">Every discovered source meets the threshold or has been verified.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredQueue.map((row) => (
                      <ReviewItem
                        key={row.id}
                        row={row}
                        onApprove={() => approve.mutate(row.id)}
                        onReplace={(url) => replaceUrl.mutate({ id: row.id, source_url: url })}
                        onReject={() => reject.mutate(row.id)}
                        onRediscover={() => rediscover.mutate(row)}
                        busy={approve.isPending || replaceUrl.isPending || reject.isPending || rediscover.isPending}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Data Approvals — high-level counts, link to AdminDataReview for per-row */}
        <Card className="mb-6">
          <CardContent padding="none">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" /> Extracted rows pending approval
                </h2>
                <p className="text-caption text-muted-foreground">
                  AI-extracted data waiting for verification. Open Data Review for the per-row interface.
                </p>
              </div>
              <Link to="/admin/data-review">
                <Button size="sm" variant="outline" className="gap-1.5"><Database className="h-3.5 w-3.5" /> Review per row</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0">
              {INGESTION_TYPES.map((tbl) => (
                <div key={tbl} className="p-4">
                  <p className="text-xs text-muted-foreground capitalize mb-1">{tbl}</p>
                  <p className="text-2xl font-bold">
                    {loadingPending ? <Loader2 className="h-5 w-5 animate-spin inline" /> : (pending?.[tbl] ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coverage Table */}
        <Card className="mb-6">
          <CardContent padding="none">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-sm">Data Completeness by Town</h2>
                  <p className="text-caption text-muted-foreground">% verified rows ÷ total rows across the four sections.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={coverageSearch}
                  onChange={(e) => setCoverageSearch(e.target.value)}
                  placeholder="Search town…"
                  className="h-8 text-xs max-w-xs"
                />
                <Select value={coverageFilter} onValueChange={(v) => setCoverageFilter(v as typeof coverageFilter)}>
                  <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="placeholder">Placeholder</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={coverageSort} onValueChange={(v) => setCoverageSort(v as typeof coverageSort)}>
                  <SelectTrigger className="h-8 text-xs w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort: Name (A→Z)</SelectItem>
                    <SelectItem value="completeness">Sort: Completeness (high→low)</SelectItem>
                    <SelectItem value="last_verified">Sort: Last verified (recent)</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground ml-auto">
                  {filteredCoverage.length} of {townRows?.length ?? 0}
                </span>
              </div>
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
                  <TableHead className="font-semibold w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingTowns && (
                  <TableRow><TableCell colSpan={9} className="text-center py-6"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
                )}
                {!loadingTowns && filteredCoverage.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center py-6 text-xs text-muted-foreground">No towns match.</TableCell></TableRow>
                )}
                {filteredCoverage.map((t, i) => (
                  <TableRow key={t.slug} className={i % 2 === 0 ? "" : "bg-secondary/20"}>
                    <TableCell className="font-medium text-sm">{t.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={t.data_status === "verified" ? "default" : t.data_status === "partial" ? "secondary" : "outline"}
                        className="text-micro"
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
                    {INGESTION_TYPES.map((tbl) => {
                      const sec = t.sections.find((s) => s.name === tbl);
                      return (
                        <TableCell key={tbl} className="text-center">
                          {!sec?.has ? (
                            <X className="h-4 w-4 text-destructive mx-auto" />
                          ) : sec.verified ? (
                            <Check className="h-4 w-4 text-success mx-auto" />
                          ) : (
                            <span className="text-micro text-warning">unverified</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-xs text-muted-foreground">
                      {t.last_verified
                        ? formatDistanceToNow(new Date(t.last_verified), { addSuffix: true })
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/sources?slug=${t.slug}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          <Edit3 className="h-3 w-3" /> Sources
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent ingestion activity */}
        <Card className="mb-6">
          <CardContent padding="none">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm">Recent Ingestion Activity</h2>
              <p className="text-caption text-muted-foreground">Last 10 source pulls.</p>
            </div>
            <div className="divide-y">
              {loadingRuns && <div className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></div>}
              {!loadingRuns && (runs ?? []).length === 0 && (
                <p className="p-6 text-center text-xs text-muted-foreground">No ingestion runs yet.</p>
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
                      className="text-micro"
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
    </AppLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReviewItem — one queue card with the informational checklist
// ─────────────────────────────────────────────────────────────────────────────

function ReviewItem({
  row,
  onApprove,
  onReplace,
  onReject,
  onRediscover,
  busy,
}: {
  row: QueueRow;
  onApprove: () => void;
  onReplace: (url: string) => void;
  onReject: () => void;
  onRediscover: () => void;
  busy: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(row.source_url);
  const checks = useMemo(() => autoChecksFor(row), [row]);

  return (
    <div className="p-4 hover:bg-secondary/20 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="secondary" className="text-micro capitalize">{row.town_slug}</Badge>
            <Badge variant="outline" className="text-micro capitalize">{row.ingestion_type}</Badge>
            <ConfidenceBadge confidence={row.discovery_confidence} method={row.discovery_method} />
            <span className="text-micro text-muted-foreground">
              discovered {formatDistanceToNow(new Date(row.updated_at), { addSuffix: true })}
            </span>
          </div>
          {editing ? (
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-8 text-xs mt-2"
              autoFocus
            />
          ) : (
            <a
              href={row.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline inline-flex items-center gap-1 break-all"
            >
              {row.source_url} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          )}
          {row.discovery_reasoning && !editing && (
            <p className="text-xs text-muted-foreground mt-1.5 italic">
              AI said: "{row.discovery_reasoning}"
            </p>
          )}
        </div>
      </div>

      {!editing && (
        <div className="mt-2 mb-3 bg-secondary/30 rounded p-2.5 space-y-1">
          <p className="text-micro font-semibold text-muted-foreground uppercase tracking-wider mb-1">Auto-checks (informational)</p>
          {checks.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              {c.ok === true ? (
                <Check className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
              ) : c.ok === "warn" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
              ) : (
                <X className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <span className="text-foreground">{c.label}</span>
            </div>
          ))}
          <p className="text-micro text-muted-foreground pt-1.5 border-t border-border/40 mt-1.5">
            <strong>Eyeball the URL above</strong> — does the page actually have the data we'd want for "{row.ingestion_type}"? Then act below.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {editing ? (
          <>
            <Button
              size="sm"
              className="gap-1 text-xs"
              onClick={() => {
                onReplace(draft.trim());
                setEditing(false);
              }}
              disabled={busy || !draft.trim() || draft.trim() === row.source_url}
            >
              <Check className="h-3.5 w-3.5" /> Save & verify
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs"
              onClick={() => { setDraft(row.source_url); setEditing(false); }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" className="gap-1 text-xs" onClick={onApprove} disabled={busy}>
              <Check className="h-3.5 w-3.5" /> Approve as-is
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setEditing(true)} disabled={busy}>
              Replace URL
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={onRediscover} disabled={busy}>
              <RefreshCw className="h-3.5 w-3.5" /> Re-discover
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 text-xs text-destructive hover:text-destructive ml-auto"
              onClick={() => {
                if (confirm("Remove this source URL? It will reappear if re-discovered.")) onReject();
              }}
              disabled={busy}
            >
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
