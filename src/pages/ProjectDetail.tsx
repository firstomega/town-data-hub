import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Hammer, Fence, Waves, ArrowLeft, Trash2, Share2, CheckCircle, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { LoadingState } from "@/components/states/LoadingState";

const projectIcons: Record<string, React.ElementType> = {
  deck: Hammer,
  fence: Fence,
  pool: Waves,
};

const TIMELINE_STEPS = ["researching", "submitted", "under_review", "approved", "construction"] as const;
const TIMELINE_LABELS: Record<string, string> = {
  researching: "Researching",
  submitted: "Application Submitted",
  under_review: "Under Review",
  approved: "Approved",
  construction: "Construction",
};

type ChecklistItem = { item: string; done: boolean };

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    enabled: !!id && !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: zone } = useQuery({
    queryKey: ["project-zone", project?.town_slug, project?.zone],
    enabled: !!project?.town_slug && !!project?.zone,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .eq("town_slug", project!.town_slug!)
        .eq("code", project!.zone!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: drifts = [] } = useQuery({
    queryKey: ["project-drifts", project?.town_slug],
    enabled: !!project?.town_slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_drifts")
        .select("id, detected_at, diff_summary")
        .eq("town_slug", project!.town_slug!)
        .eq("status", "applied")
        .order("detected_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  useEffect(() => {
    if (project?.checklist && Array.isArray(project.checklist)) {
      setChecklist(project.checklist as unknown as ChecklistItem[]);
    }
  }, [project?.checklist]);

  const updateChecklist = useMutation({
    mutationFn: async (next: ChecklistItem[]) => {
      const { error } = await supabase
        .from("projects")
        .update({ checklist: next as unknown as any })
        .eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project", id] }),
  });

  const deleteProject = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").delete().eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project deleted");
      navigate("/dashboard");
    },
    onError: (e: any) => toast.error(e.message ?? "Could not delete project"),
  });

  if (isLoading) {
    return (
      <AppLayout showSearch contained={false}>
        <LoadingState fill size="lg" />
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout showSearch contained={false}>
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-muted-foreground">Project not found.</p>
          <Link to="/dashboard"><Button size="sm" variant="outline">Back to Dashboard</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const Icon = projectIcons[project.project_type] || Hammer;
  const typeLabel = project.project_type.charAt(0).toUpperCase() + project.project_type.slice(1);
  const status = (project.status || "researching").toLowerCase().replace(/\s+/g, "_");
  const stepIndex = TIMELINE_STEPS.indexOf(status as typeof TIMELINE_STEPS[number]);

  const rules = zone
    ? [
        { label: "Front Setback", value: zone.setback_front },
        { label: "Side Setback", value: zone.setback_side },
        { label: "Rear Setback", value: zone.setback_rear },
        { label: "Max Lot Coverage", value: zone.max_coverage },
        { label: "Max Height", value: zone.max_height },
        { label: "Min Lot Size", value: zone.min_lot },
      ].filter((r) => r.value)
    : [];

  const toggleItem = (i: number) => {
    const next = checklist.map((c, idx) => (idx === i ? { ...c, done: !c.done } : c));
    setChecklist(next);
    updateChecklist.mutate(next);
  };

  const completed = checklist.filter((c) => c.done).length;

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6 max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">{typeLabel} Project</h1>
              <p className="text-sm text-muted-foreground">{project.address}</p>
              <div className="flex items-center gap-2 mt-1">
                {project.town_slug && <Badge variant="secondary" className="text-micro capitalize">{project.town_slug}</Badge>}
                {project.zone && <Badge variant="outline" className="text-micro font-mono">Zone {project.zone}</Badge>}
                <Badge className="text-micro capitalize">{project.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Project link copied!"); }}>
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 text-destructive hover:text-destructive" onClick={() => {
              if (confirm("Delete this project? This cannot be undone.")) deleteProject.mutate();
            }}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-6">
          <CardContent padding="md">
            <h3 className="font-semibold text-sm mb-4">Permit Status</h3>
            <div className="flex items-center justify-between">
              {TIMELINE_STEPS.map((step, i) => {
                const complete = stepIndex > i;
                const active = stepIndex === i;
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        complete ? "bg-success text-success-foreground" : active ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {complete ? <CheckCircle className="h-4 w-4" /> : i + 1}
                      </div>
                      <p className={`text-micro mt-1.5 text-center max-w-[80px] ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{TIMELINE_LABELS[step]}</p>
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${complete ? "bg-success" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Applicable Rules */}
        <Card className="mb-6">
          <CardContent padding="md">
            <h3 className="font-semibold text-sm mb-4">
              Applicable Zoning Rules{project.zone ? ` — Zone ${project.zone}` : ""}
            </h3>
            {!project.zone || !zone ? (
              <p className="text-sm text-muted-foreground">No zone data available for this project yet.</p>
            ) : rules.length === 0 ? (
              <p className="text-sm text-muted-foreground">Zone exists but no rule values are recorded.</p>
            ) : (
              <div className="space-y-2">
                {rules.map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{r.label}</span>
                    <span className="text-sm font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card className="mb-6">
          <CardContent padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Permit Checklist</h3>
              <span className="text-xs text-muted-foreground">{completed}/{checklist.length} complete</span>
            </div>
            {checklist.length === 0 ? (
              <p className="text-sm text-muted-foreground">No checklist items saved with this project.</p>
            ) : (
              <div className="space-y-2">
                {checklist.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <Checkbox checked={c.done} onCheckedChange={() => toggleItem(i)} className="mt-0.5" />
                    <p className={`text-sm ${c.done ? "line-through text-muted-foreground" : ""}`}>{c.item}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Changes */}
        {drifts.length > 0 && (
          <Card className="mb-6">
            <CardContent padding="md">
              <h3 className="font-semibold text-sm mb-4">Recent Ordinance Changes in {project.town_slug}</h3>
              <div className="space-y-2">
                {drifts.map((c: any) => (
                  <div key={c.id} className="flex items-start gap-3 p-3 rounded border bg-secondary/20">
                    <FileText className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{new Date(c.detected_at).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{c.diff_summary ?? "Data updated"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
