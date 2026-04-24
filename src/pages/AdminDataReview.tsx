import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, ExternalLink, Check, X, Sparkles, RefreshCw, ShieldCheck, Clock, AlertTriangle, Search, Bookmark, Trash2 } from "lucide-react";
import { useAllTowns } from "@/hooks/useTownData";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow } from "date-fns";

type TableName = "zones" | "permits" | "ordinances" | "contacts";
const ALL_TYPES: TableName[] = ["zones", "permits", "ordinances", "contacts"];

function useExtracted(table: TableName) {
  return useQuery({
    queryKey: ["extracted", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("confidence", "ai_extracted")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });
}

function useRecentRuns() {
  return useQuery({
    queryKey: ["ingestion-runs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingestion_runs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}

function ReviewList({ table }: { table: TableName }) {
  const { data, isLoading, refetch } = useExtracted(table);
  const { user } = useAuth();
  const qc = useQueryClient();

  const approve = async (id: string, town_slug: string) => {
    const { error } = await supabase
      .from(table)
      .update({ confidence: "verified", verified_by: user?.id ?? null, last_verified_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Approved");
    refetch();
    qc.invalidateQueries({ queryKey: [table === "zones" ? "zones" : table === "permits" ? "permits" : table === "ordinances" ? "ordinances" : "contacts", town_slug] });
  };
  const reject = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Rejected & removed");
    refetch();
  };

  if (isLoading) return <div className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></div>;
  if (!data?.length) return <p className="py-12 text-center text-sm text-muted-foreground">No AI-extracted {table} pending review.</p>;

  return (
    <div className="space-y-3">
      {data.map((row: Record<string, unknown>) => (
        <Card key={row.id as string}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px]">{row.town_slug as string}</Badge>
                  <Badge variant="outline" className="text-[10px] gap-1"><Sparkles className="h-2.5 w-2.5" /> AI-extracted</Badge>
                </div>
                <p className="font-semibold text-sm">
                  {(row.code as string) || (row.name as string) || (row.title as string) || (row.dept as string)}
                </p>
                <pre className="mt-2 text-[10px] bg-muted/30 p-2 rounded overflow-x-auto max-h-40">{JSON.stringify(row, null, 2)}</pre>
                {row.source_url ? (
                  <a href={row.source_url as string} target="_blank" rel="noopener noreferrer" className="text-[11px] text-accent hover:underline inline-flex items-center gap-1 mt-1">
                    Source <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button size="sm" className="gap-1" onClick={() => approve(row.id as string, row.town_slug as string)}><Check className="h-3.5 w-3.5" /> Approve</Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => reject(row.id as string)}><X className="h-3.5 w-3.5" /> Reject</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function IngestForm() {
  const { data: towns } = useAllTowns();
  const [townSlug, setTownSlug] = useState("");
  const [type, setType] = useState<TableName>("zones");
  const [url, setUrl] = useState("");
  const [doc, setDoc] = useState("");
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  // Auto-fill URL when a saved source exists for this town+type
  const { data: savedSources } = useQuery({
    queryKey: ["town-sources", townSlug],
    enabled: !!townSlug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("town_sources")
        .select("*")
        .eq("town_slug", townSlug)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const matchingSaved = (savedSources ?? []).filter((s) => s.ingestion_type === type);

  const submit = async () => {
    if (!townSlug || !url) return toast.error("Pick a town and paste a source URL");
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("ingest-town-data", {
        body: { town_slug: townSlug, ingestion_type: type, source_url: url, source_doc: doc || null },
      });
      if (error) throw error;
      const d = data as { rows_added?: number };
      toast.success(`Ingested ${d?.rows_added ?? 0} rows. Review below.`);
      setUrl("");
      setDoc("");
      qc.invalidateQueries({ queryKey: ["extracted", type] });
      qc.invalidateQueries({ queryKey: ["ingestion-runs"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ingestion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <h3 className="font-semibold text-sm">Ingest from official source</h3>
        <p className="text-xs text-muted-foreground">Paste a municipal code chapter URL (eCode360, Municode, town PDF). Firecrawl scrapes it, Lovable AI extracts structured rows for review.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Town</Label>
            <Select value={townSlug} onValueChange={setTownSlug}>
              <SelectTrigger><SelectValue placeholder="Select town" /></SelectTrigger>
              <SelectContent>
                {(towns ?? []).map((t: { slug: string; name: string }) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Data type</Label>
            <Select value={type} onValueChange={(v) => setType(v as TableName)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="zones">Zones</SelectItem>
                <SelectItem value="permits">Permits</SelectItem>
                <SelectItem value="ordinances">Ordinances</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {townSlug && matchingSaved.length > 0 && (
          <div className="rounded border bg-muted/30 p-2 space-y-1">
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Saved sources for this town & type</p>
            {matchingSaved.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setUrl(s.source_url); setDoc(s.source_doc ?? ""); }}
                className="w-full text-left text-[11px] hover:bg-background rounded px-1.5 py-1 truncate flex items-center gap-1"
              >
                <Bookmark className="h-2.5 w-2.5 text-accent flex-shrink-0" />
                <span className="truncate">{s.source_url}</span>
              </button>
            ))}
          </div>
        )}
        <div>
          <Label className="text-xs">Source URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://ecode360.com/PA1234/laws/..." />
        </div>
        <div>
          <Label className="text-xs">Source label (optional)</Label>
          <Input value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="e.g. Borough of Paramus Code §250" />
        </div>
        <Button onClick={submit} disabled={busy} className="w-full gap-2">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? "Scraping & extracting…" : "Ingest"}
        </Button>
      </CardContent>
    </Card>
  );
}

function RunsList() {
  const { data } = useRecentRuns();
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-3">Recent ingestion runs</h3>
        {!data?.length && <p className="text-xs text-muted-foreground">No runs yet.</p>}
        <div className="space-y-2">
          {(data ?? []).map((r: Record<string, unknown>) => (
            <div key={r.id as string} className="flex items-center justify-between text-xs p-2 rounded border">
              <div className="min-w-0 flex-1 truncate">
                <span className="font-mono">{r.town_slug as string}</span> · {r.ingestion_type as string} · <a href={r.source_url as string} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{r.source_url as string}</a>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={r.status === "completed" ? "default" : r.status === "failed" ? "destructive" : "secondary"} className="text-[10px]">{r.status as string}</Badge>
                {(r.rows_added as number) > 0 && <span className="text-muted-foreground">+{r.rows_added as number}</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type DiscoverPick = { url: string; title?: string; description?: string; reason?: string };
type DiscoverResult = { picked: DiscoverPick | null; candidates: Array<{ url: string; title?: string; description?: string }> };

function DiscoverSources() {
  const { data: towns } = useAllTowns();
  const [townSlug, setTownSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Record<string, DiscoverResult> | null>(null);
  const qc = useQueryClient();

  const { data: saved } = useQuery({
    queryKey: ["town-sources-list", townSlug],
    enabled: !!townSlug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("town_sources")
        .select("*")
        .eq("town_slug", townSlug)
        .order("ingestion_type");
      if (error) throw error;
      return data ?? [];
    },
  });

  const discover = async (save: boolean) => {
    if (!townSlug) return toast.error("Pick a town first");
    setBusy(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("discover-town-sources", {
        body: { town_slug: townSlug, save },
      });
      if (error) throw error;
      const d = data as { results: Record<string, DiscoverResult> };
      setResults(d.results);
      if (save) {
        toast.success("Saved best picks to town sources");
        qc.invalidateQueries({ queryKey: ["town-sources-list", townSlug] });
        qc.invalidateQueries({ queryKey: ["town-sources", townSlug] });
      } else {
        toast.success("Discovery complete");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Discovery failed");
    } finally {
      setBusy(false);
    }
  };

  const removeSaved = async (id: string) => {
    const { error } = await supabase.from("town_sources").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["town-sources-list", townSlug] });
    qc.invalidateQueries({ queryKey: ["town-sources", townSlug] });
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Search className="h-4 w-4" /> Auto-discover official sources
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Web searches for the best zoning / permit / ordinance / contact URLs and asks AI to pick the official one. Save once, re-ingest with one click later.
            </p>
          </div>
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <Label className="text-xs">Town</Label>
            <Select value={townSlug} onValueChange={setTownSlug}>
              <SelectTrigger><SelectValue placeholder="Select town" /></SelectTrigger>
              <SelectContent>
                {(towns ?? []).map((t: { slug: string; name: string }) => (
                  <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" variant="outline" onClick={() => discover(false)} disabled={busy || !townSlug} className="gap-1">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Discover
          </Button>
          <Button size="sm" onClick={() => discover(true)} disabled={busy || !townSlug} className="gap-1">
            <Bookmark className="h-3.5 w-3.5" /> Discover & save
          </Button>
        </div>

        {/* Saved sources for this town */}
        {townSlug && (saved ?? []).length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Saved sources</p>
            {(saved ?? []).map((s) => (
              <div key={s.id} className="flex items-center gap-2 text-[11px] p-1.5 rounded border">
                <Badge variant="secondary" className="text-[9px]">{s.ingestion_type}</Badge>
                <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate flex-1">
                  {s.source_url}
                </a>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeSaved(s.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Discovery results */}
        {results && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Discovery results</p>
            {ALL_TYPES.map((t) => {
              const r = results[t];
              return (
                <div key={t} className="text-[11px] p-2 rounded border">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[9px] capitalize">{t}</Badge>
                    {r?.picked ? (
                      <Badge variant="default" className="text-[9px] gap-1">
                        <Sparkles className="h-2.5 w-2.5" /> AI picked
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[9px]">No clear match</Badge>
                    )}
                  </div>
                  {r?.picked && (
                    <a href={r.picked.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate block">
                      {r.picked.url}
                    </a>
                  )}
                  {r?.picked?.reason && <p className="text-muted-foreground italic mt-1">{r.picked.reason}</p>}
                  {r?.candidates?.length ? (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-muted-foreground">{r.candidates.length} candidate(s)</summary>
                      <ul className="mt-1 space-y-0.5 pl-4">
                        {r.candidates.map((c, i) => (
                          <li key={i} className="truncate">
                            <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{c.url}</a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function useDrifts() {
  return useQuery({
    queryKey: ["data-drifts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_drifts")
        .select("*")
        .eq("status", "pending")
        .order("detected_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });
}

function DriftReview() {
  const { data, isLoading, refetch } = useDrifts();
  const { user } = useAuth();
  const qc = useQueryClient();

  const accept = async (drift: Record<string, unknown>) => {
    const table = drift.table_name as "zones" | "permits" | "ordinances" | "contacts";
    const newSnap = drift.new_snapshot as Record<string, unknown> | null;
    const oldSnap = drift.old_snapshot as Record<string, unknown> | null;
    const changeType = drift.change_type as string;
    try {
      if (changeType === "added" && newSnap) {
        const { error } = await supabase.from(table).insert({
          ...newSnap,
          town_slug: drift.town_slug,
          source_url: drift.source_url,
          confidence: "ai_extracted",
          id: undefined,
        } as never);
        if (error) throw error;
      } else if (changeType === "modified" && newSnap && oldSnap) {
        const { id, town_slug: _t, source_url: _s, confidence: _c, ...patch } = newSnap as Record<string, unknown>;
        const { error } = await supabase.from(table).update({
          ...patch,
          confidence: "ai_extracted",
          last_verified_at: null,
        } as never).eq("id", oldSnap.id as string);
        if (error) throw error;
      } else if (changeType === "removed" && oldSnap) {
        const { error } = await supabase.from(table).delete().eq("id", oldSnap.id as string);
        if (error) throw error;
      }
      await supabase.from("data_drifts").update({
        status: "applied",
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
      }).eq("id", drift.id as string);
      toast.success("Change applied — row needs re-verification");
      refetch();
      qc.invalidateQueries({ queryKey: ["extracted", table] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Apply failed");
    }
  };

  const dismiss = async (id: string) => {
    const { error } = await supabase.from("data_drifts").update({
      status: "dismissed",
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Dismissed — current data kept");
    refetch();
  };

  if (isLoading) return <div className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></div>;
  if (!data?.length) return (
    <p className="py-12 text-center text-sm text-muted-foreground">
      No upstream changes detected. The weekly refresh will flag any drift here.
    </p>
  );

  return (
    <div className="space-y-3">
      {data.map((d: Record<string, unknown>) => (
        <Card key={d.id as string}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]">{d.town_slug as string}</Badge>
                  <Badge variant="outline" className="text-[10px]">{d.table_name as string}</Badge>
                  <Badge
                    variant={d.change_type === "removed" ? "destructive" : d.change_type === "added" ? "default" : "secondary"}
                    className="text-[10px] gap-1"
                  >
                    <AlertTriangle className="h-2.5 w-2.5" /> {d.change_type as string}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {d.detected_at ? formatDistanceToNow(new Date(d.detected_at as string), { addSuffix: true }) : ""}
                  </span>
                </div>
                <p className="text-sm font-medium mb-2">{d.diff_summary as string}</p>
                {d.source_url ? (
                  <a href={d.source_url as string} target="_blank" rel="noopener noreferrer" className="text-[11px] text-accent hover:underline inline-flex items-center gap-1">
                    Source <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ) : null}
                <div className="grid sm:grid-cols-2 gap-2 mt-2">
                  {d.old_snapshot ? (
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Current (kept)</p>
                      <pre className="text-[10px] bg-destructive/5 p-2 rounded overflow-x-auto max-h-40">{JSON.stringify(d.old_snapshot, null, 2)}</pre>
                    </div>
                  ) : null}
                  {d.new_snapshot ? (
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Upstream (proposed)</p>
                      <pre className="text-[10px] bg-primary/5 p-2 rounded overflow-x-auto max-h-40">{JSON.stringify(d.new_snapshot, null, 2)}</pre>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button size="sm" className="gap-1" onClick={() => accept(d)}>
                  <Check className="h-3.5 w-3.5" /> Apply
                </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => dismiss(d.id as string)}>
                  <X className="h-3.5 w-3.5" /> Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FreshnessControls() {
  const { data: towns, refetch } = useAllTowns();
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const qc = useQueryClient();

  const toggleAuto = async (slug: string, enabled: boolean) => {
    const { error } = await supabase.from("towns").update({ auto_refresh_enabled: enabled }).eq("slug", slug);
    if (error) return toast.error(error.message);
    toast.success(`Auto-refresh ${enabled ? "enabled" : "paused"} for ${slug}`);
    refetch();
  };

  const refreshNow = async (slug: string) => {
    setBusySlug(slug);
    try {
      const { data, error } = await supabase.functions.invoke("refresh-town-data", {
        body: { town_slug: slug },
      });
      if (error) throw error;
      const r = data as { refreshed?: number };
      toast.success(`Scanned ${r?.refreshed ?? 0} source(s) for ${slug}`);
      qc.invalidateQueries({ queryKey: ["data-drifts"] });
      qc.invalidateQueries({ queryKey: ["ingestion-runs"] });
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setBusySlug(null);
    }
  };

  const syncSecret = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke("sync-cron-secret");
      if (error) throw error;
      toast.success("Cron secret synced. Weekly auto-refresh is live.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" /> Freshness controls
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Auto-refresh runs every Sunday 03:00 UTC. Diffs are queued in the Drift queue — never overwritten silently.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={syncSecret} disabled={syncing} className="gap-1">
            {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            Activate weekly cron
          </Button>
        </div>
        <div className="space-y-2">
          {(towns ?? []).map((t: { slug: string; name: string; auto_refresh_enabled?: boolean; next_refresh_at?: string | null; last_verified?: string | null; data_status?: string }) => (
            <div key={t.slug} className="flex items-center justify-between gap-3 p-2 rounded border text-xs">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t.name}</span>
                  <Badge
                    variant={t.data_status === "verified" ? "default" : t.data_status === "partial" ? "secondary" : "outline"}
                    className="text-[9px]"
                  >
                    {t.data_status ?? "placeholder"}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {t.last_verified
                    ? `Last verified ${formatDistanceToNow(new Date(t.last_verified), { addSuffix: true })}`
                    : "Never verified"}
                  {t.next_refresh_at ? ` · Next refresh ${formatDistanceToNow(new Date(t.next_refresh_at), { addSuffix: true })}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={t.auto_refresh_enabled !== false}
                    onCheckedChange={(v) => toggleAuto(t.slug, v)}
                  />
                  <span className="text-[10px] text-muted-foreground">auto</span>
                </div>
                <Button
                  size="sm" variant="outline" className="gap-1 h-7 text-[11px]"
                  disabled={busySlug === t.slug}
                  onClick={() => refreshNow(t.slug)}
                >
                  {busySlug === t.slug ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  Refresh now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDataReview() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 flex-1 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Data Review</h1>
            <p className="text-sm text-muted-foreground">Ingest official sources, review AI-extracted rows, approve into the verified dataset.</p>
          </div>
          <Badge variant="destructive" className="text-xs">Admin Only</Badge>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <IngestForm />
          <DiscoverSources />
        </div>
        <div className="mb-6">
          <RunsList />
        </div>
        <div className="mb-6">
          <FreshnessControls />
        </div>
        <Tabs defaultValue="drifts">
          <TabsList>
            <TabsTrigger value="drifts" className="gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Drift queue
            </TabsTrigger>
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="permits">Permits</TabsTrigger>
            <TabsTrigger value="ordinances">Ordinances</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          <TabsContent value="drifts" className="mt-4"><DriftReview /></TabsContent>
          <TabsContent value="zones" className="mt-4"><ReviewList table="zones" /></TabsContent>
          <TabsContent value="permits" className="mt-4"><ReviewList table="permits" /></TabsContent>
          <TabsContent value="ordinances" className="mt-4"><ReviewList table="ordinances" /></TabsContent>
          <TabsContent value="contacts" className="mt-4"><ReviewList table="contacts" /></TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}