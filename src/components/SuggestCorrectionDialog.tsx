import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Flag } from "lucide-react";
import { toast } from "sonner";

interface SuggestCorrectionDialogProps {
  townName: string;
  section?: string;
}

export function SuggestCorrectionDialog({ townName, section }: SuggestCorrectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    toast.success("Thank you! Your correction has been submitted for review.");
    setDescription("");
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
          <Input
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSubmit} disabled={!description.trim()}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
