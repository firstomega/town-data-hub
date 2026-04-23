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
import { Loader2, ExternalLink, Check, X, Sparkles, RefreshCw, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { useAllTowns } from "@/hooks/useTownData";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow } from "date-fns";

type TableName = "zones" | "permits" | "ordinances" | "contacts";

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
          <RunsList />
        </div>
        <Tabs defaultValue="zones">
          <TabsList>
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="permits">Permits</TabsTrigger>
            <TabsTrigger value="ordinances">Ordinances</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
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