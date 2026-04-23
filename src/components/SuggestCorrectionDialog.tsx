import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SuggestCorrectionDialogProps {
  townName: string;
  townSlug?: string;
  section?: string;
  tableName?: string;
  rowId?: string;
  field?: string;
  currentValue?: string;
}

export function SuggestCorrectionDialog({ townName, townSlug, section, tableName, rowId, field, currentValue }: SuggestCorrectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [proposedValue, setProposedValue] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("data_corrections").insert({
      table_name: tableName ?? "towns",
      town_slug: townSlug ?? null,
      row_id: rowId ?? null,
      field: field ?? null,
      section: section ?? null,
      current_value: currentValue ?? null,
      proposed_value: proposedValue || null,
      evidence_url: evidenceUrl || null,
      description,
      submitter_user_id: user?.id ?? null,
      submitter_email: email || user?.email || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit correction. Please try again.");
      return;
    }
    toast.success("Thank you! Your correction has been submitted for review.");
    setDescription("");
    setProposedValue("");
    setEvidenceUrl("");
    setEmail("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Flag className="h-3 w-3" /> Suggest a correction
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Suggest a Correction</DialogTitle>
          <DialogDescription className="text-sm">
            Found outdated or incorrect data for {townName}{section ? ` (${section})` : ""}? Let us know and we'll verify it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Textarea
            placeholder="Describe the issue (e.g., 'The R-2 setback was changed to 20 ft in 2025')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <Input placeholder="Proposed correct value (optional)" value={proposedValue} onChange={(e) => setProposedValue(e.target.value)} />
          <Input placeholder="Source / evidence URL (optional)" value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} />
          <Input
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSubmit} disabled={!description.trim() || submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
