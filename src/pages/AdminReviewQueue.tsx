import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Check, X, RefreshCw, Loader2, Inbox, Filter, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/states/LoadingState";
import { EmptyState } from "@/components/states/EmptyState";
import { ConfidenceBadge } from "@/components/admin/ConfidenceBadge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type IngestionType = "zones" | "permits" | "ordinances" | "contacts";

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

const CONFIDENCE_PRESETS: Record<string, number> = {
  "below-0.6": 0.6,
  "below-0.85": 0.85,
  all: 1.01,
};

function useReviewQueue(threshold: number) {
  return useQuery({
    queryKey: ["admin-review-queue", threshold],
    queryFn: async () => {
      // We want unverified rows whose confidence is below the threshold,
      // PLUS rows with NULL confidence (legacy or platform misses worth a glance).
      // Sort: lowest confidence first, then most recently discovered.
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

export default function AdminReviewQueue() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [thresholdKey, setThresholdKey] = useState<keyof typeof CONFIDENCE_PRESETS>("below-0.85");
  const [typeFilter, setTypeFilter] = useState<IngestionType | "all">("all");
  const threshold = CONFIDENCE_PRESETS[thresholdKey];
  const { data: rows = [], isLoading } = useReviewQueue(threshold);

  const filtered = typeFilter === "all" ? rows : rows.filter((r) => r.ingestion_type === typeFilter);

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

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6 max-w-5xl">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Dashboard
        </Link>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Source Review Queue</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Sources auto-discovered with low confidence, sorted least-confident first.
              High-confidence sources (≥ 0.85) are auto-trusted and don't appear here.
              Approve to mark verified, or paste the correct URL to replace.
            </p>
          </div>
          <Badge variant="destructive" className="text-xs">Admin Only</Badge>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent padding="md" className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Filter className="h-3 w-3" /> Confidence threshold
              </label>
              <Select value={thresholdKey} onValueChange={(v) => setThresholdKey(v as keyof typeof CONFIDENCE_PRESETS)}>
                <SelectTrigger className="mt-1.5 w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="below-0.6">Below 0.6 (high risk)</SelectItem>
                  <SelectItem value="below-0.85">Below 0.85 (default)</SelectItem>
                  <SelectItem value="all">Everything unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Ingestion type</label>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as IngestionType | "all")}>
                <SelectTrigger className="mt-1.5 w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="zones">Zones</SelectItem>
                  <SelectItem value="permits">Permits</SelectItem>
                  <SelectItem value="ordinances">Ordinances</SelectItem>
                  <SelectItem value="contacts">Contacts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "row" : "rows"}
            </div>
          </CardContent>
        </Card>

        {/* Queue */}
        {isLoading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Inbox zero — nothing to review"
            description="Every discovered source meets the confidence threshold, or you've verified everything below it. Lower the threshold if you want to spot-check the high-confidence ones."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((row) => (
              <ReviewRow
                key={row.id}
                row={row}
                onApprove={() => approve.mutate(row.id)}
                onReplace={(url) => replaceUrl.mutate({ id: row.id, source_url: url })}
                onReject={() => reject.mutate(row.id)}
                onRediscover={() => rediscover.mutate(row)}
                approving={approve.isPending}
                replacing={replaceUrl.isPending}
                rejecting={reject.isPending}
                rediscovering={rediscover.isPending}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-xs text-muted-foreground">
          Back to <Link to="/admin/sources" className="text-accent hover:underline">Town Sources</Link>{" "}
          or <Link to="/admin" className="text-accent hover:underline">Admin Dashboard</Link>.
        </div>
      </div>
    </AppLayout>
  );
}

function ReviewRow({
  row,
  onApprove,
  onReplace,
  onReject,
  onRediscover,
  approving,
  replacing,
  rejecting,
  rediscovering,
}: {
  row: QueueRow;
  onApprove: () => void;
  onReplace: (url: string) => void;
  onReject: () => void;
  onRediscover: () => void;
  approving: boolean;
  replacing: boolean;
  rejecting: boolean;
  rediscovering: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(row.source_url);
  const busy = approving || replacing || rejecting || rediscovering;

  return (
    <Card>
      <CardContent padding="md">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="secondary" className="text-micro capitalize">{row.town_slug}</Badge>
              <Badge variant="outline" className="text-micro capitalize">{row.ingestion_type}</Badge>
              <ConfidenceBadge
                confidence={row.discovery_confidence}
                method={row.discovery_method}
              />
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

        <div className="flex flex-wrap gap-2 mt-3">
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
                {replacing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save & verify
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  setDraft(row.source_url);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                className="gap-1 text-xs"
                onClick={onApprove}
                disabled={busy}
              >
                {approving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Approve as-is
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs"
                onClick={() => setEditing(true)}
                disabled={busy}
              >
                Replace URL
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs"
                onClick={onRediscover}
                disabled={busy}
              >
                {rediscovering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Re-discover
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
                {rejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
