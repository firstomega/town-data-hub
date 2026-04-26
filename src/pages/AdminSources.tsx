import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Loader2, Search, Trash2, Plus, Inbox, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAllTowns } from "@/hooks/useTownData";
import { LoadingState } from "@/components/states/LoadingState";
import { EmptyState } from "@/components/states/EmptyState";
import { ConfidenceBadge } from "@/components/admin/ConfidenceBadge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type IngestionType = "zones" | "permits" | "ordinances" | "contacts";
const INGESTION_TYPES: IngestionType[] = ["zones", "permits", "ordinances", "contacts"];

type SourceRow = {
  id: string;
  town_slug: string;
  ingestion_type: IngestionType;
  source_url: string;
  source_label: string | null;
  notes: string | null;
  last_used_at: string | null;
  updated_at: string;
  discovery_confidence: number | null;
  discovery_method: "platform_directory" | "ai_ranked" | "manual" | null;
  discovery_reasoning: string | null;
  verified_at: string | null;
};

function useTownSources(townSlug: string | null) {
  return useQuery({
    queryKey: ["admin-town-sources", townSlug],
    enabled: !!townSlug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("town_sources")
        .select("id, town_slug, ingestion_type, source_url, source_label, notes, last_used_at, updated_at, discovery_confidence, discovery_method, discovery_reasoning, verified_at")
        .eq("town_slug", townSlug!)
        .order("ingestion_type");
      if (error) throw error;
      return (data ?? []) as SourceRow[];
    },
  });
}

export default function AdminSources() {
  const { data: towns = [], isLoading: loadingTowns } = useAllTowns();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSlug = searchParams.get("slug") ?? "";
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);
  // Keep URL in sync when picker changes — admins can deep-link / share.
  useEffect(() => {
    if (selectedSlug) {
      setSearchParams({ slug: selectedSlug }, { replace: true });
    } else if (searchParams.get("slug")) {
      const next = new URLSearchParams(searchParams);
      next.delete("slug");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug]);
  const { data: sources = [], isLoading: loadingSources } = useTownSources(selectedSlug || null);
  const qc = useQueryClient();

  const [discovering, setDiscovering] = useState(false);
  const [adding, setAdding] = useState<IngestionType | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const selectedTown = towns.find((t) => t.slug === selectedSlug);

  const discover = async () => {
    if (!selectedSlug) return;
    setDiscovering(true);
    try {
      const { data, error } = await supabase.functions.invoke("discover-town-sources", {
        body: { town_slug: selectedSlug, save: true },
      });
      if (error) throw error;
      const r = data as { results?: Record<string, { picked?: { url?: string } | null }> };
      const picked = Object.entries(r.results ?? {}).filter(([, v]) => v?.picked?.url).length;
      toast.success(`Discovery complete — ${picked}/4 source types found.`);
      qc.invalidateQueries({ queryKey: ["admin-town-sources", selectedSlug] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Discovery failed");
    } finally {
      setDiscovering(false);
    }
  };

  const updateUrl = useMutation({
    mutationFn: async ({ id, source_url }: { id: string; source_url: string }) => {
      const { error } = await supabase.from("town_sources").update({ source_url }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Source updated");
      qc.invalidateQueries({ queryKey: ["admin-town-sources", selectedSlug] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Update failed"),
  });

  const removeRow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("town_sources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Source removed");
      qc.invalidateQueries({ queryKey: ["admin-town-sources", selectedSlug] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Remove failed"),
  });

  const addRow = useMutation({
    mutationFn: async () => {
      if (!selectedSlug || !adding || !newUrl.trim()) {
        throw new Error("Pick a type and paste a URL");
      }
      const { error } = await supabase.from("town_sources").insert({
        town_slug: selectedSlug,
        ingestion_type: adding,
        source_url: newUrl.trim(),
        source_label: newLabel.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Source added");
      setAdding(null);
      setNewUrl("");
      setNewLabel("");
      qc.invalidateQueries({ queryKey: ["admin-town-sources", selectedSlug] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Add failed"),
  });

  const sourcesByType = INGESTION_TYPES.reduce<Record<IngestionType, SourceRow[]>>((acc, t) => {
    acc[t] = sources.filter((s) => s.ingestion_type === t);
    return acc;
  }, { zones: [], permits: [], ordinances: [], contacts: [] });

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6 max-w-5xl">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Dashboard
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Town Sources</h1>
            <p className="text-sm text-muted-foreground">
              Pick a town. Discover its eCode360 / Municode pages, or paste URLs manually.
              The ingestion job will pull data from each source on its monthly refresh.
            </p>
          </div>
          <Badge variant="destructive" className="text-xs">Admin Only</Badge>
        </div>

        {/* Town picker */}
        <Card className="mb-6">
          <CardContent padding="md">
            <div className="grid sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Town</label>
                <Select value={selectedSlug} onValueChange={setSelectedSlug}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={loadingTowns ? "Loading…" : "Select a town"} />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map((t) => (
                      <SelectItem key={t.slug} value={t.slug}>
                        {t.name} <span className="text-muted-foreground">({t.county})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={discover}
                disabled={!selectedSlug || discovering}
                className="gap-2"
              >
                {discovering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Discover sources
              </Button>
            </div>
            {selectedTown && (
              <p className="text-xs text-muted-foreground mt-3">
                {selectedTown.full_name} · status:{" "}
                <Badge variant="secondary" className="text-micro capitalize">{selectedTown.data_status}</Badge>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Per-type tables */}
        {!selectedSlug ? (
          <EmptyState
            icon={Search}
            title="Pick a town to manage its sources"
            description="The system uses these URLs to scrape zoning, permit, ordinance, and contact data on the monthly refresh."
          />
        ) : loadingSources ? (
          <LoadingState />
        ) : (
          <div className="space-y-6">
            {INGESTION_TYPES.map((type) => (
              <Card key={type}>
                <CardContent padding="none">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-sm capitalize">{type}</h2>
                      <p className="text-caption text-muted-foreground">
                        {sourcesByType[type].length} source{sourcesByType[type].length === 1 ? "" : "s"} configured
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAdding(type);
                        setNewUrl("");
                        setNewLabel("");
                      }}
                      className="gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add URL
                    </Button>
                  </div>

                  {sourcesByType[type].length === 0 && adding !== type ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      No sources yet. Run discovery or add a URL manually.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary/50">
                          <TableHead className="font-semibold">URL</TableHead>
                          <TableHead className="font-semibold">Confidence</TableHead>
                          <TableHead className="font-semibold">Label</TableHead>
                          <TableHead className="font-semibold">Last used</TableHead>
                          <TableHead className="w-24"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sourcesByType[type].map((row) => (
                          <SourceRowItem
                            key={row.id}
                            row={row}
                            onSave={(url) => updateUrl.mutate({ id: row.id, source_url: url })}
                            onRemove={() => removeRow.mutate(row.id)}
                            saving={updateUrl.isPending}
                          />
                        ))}
                        {adding === type && (
                          <TableRow>
                            <TableCell>
                              <Input
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="https://ecode360.com/RO0104/…"
                                className="h-8 text-xs"
                                autoFocus
                              />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <Input
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="optional label"
                                className="h-8 text-xs"
                              />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => addRow.mutate()}
                                  disabled={addRow.isPending || !newUrl.trim()}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs"
                                  onClick={() => setAdding(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card className="bg-muted/20">
              <CardContent padding="md">
                <div className="flex items-start gap-3">
                  <Inbox className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">Working at scale?</p>
                    <p>
                      Skip per-town review and use the{" "}
                      <Link to="/admin/review-queue" className="text-accent hover:underline">
                        Review Queue
                      </Link>{" "}
                      to triage every low-confidence source across all towns at once.
                    </p>
                    <p className="pt-1">
                      Or jump to{" "}
                      <Link to="/admin/data-review" className="text-accent hover:underline">
                        Data Review & Ingest
                      </Link>{" "}
                      to scrape and extract rows from these URLs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function SourceRowItem({
  row,
  onSave,
  onRemove,
  saving,
}: {
  row: SourceRow;
  onSave: (url: string) => void;
  onRemove: () => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(row.source_url);

  if (editing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-8 text-xs"
            autoFocus
          />
        </TableCell>
        <TableCell>
          <ConfidenceBadge
            confidence={row.discovery_confidence}
            method={row.discovery_method}
            reasoning={row.discovery_reasoning}
          />
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">{row.source_label ?? "—"}</TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {row.last_used_at ? formatDistanceToNow(new Date(row.last_used_at), { addSuffix: true }) : "never"}
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                onSave(draft.trim());
                setEditing(false);
              }}
              disabled={saving || !draft.trim() || draft.trim() === row.source_url}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => {
                setDraft(row.source_url);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <a
          href={row.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline inline-flex items-center gap-1 break-all"
        >
          {row.source_url} <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      </TableCell>
      <TableCell>
        <ConfidenceBadge
          confidence={row.discovery_confidence}
          method={row.discovery_method}
          reasoning={row.discovery_reasoning}
        />
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{row.source_label ?? "—"}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {row.last_used_at ? formatDistanceToNow(new Date(row.last_used_at), { addSuffix: true }) : "never"}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm("Remove this source URL?")) onRemove();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
