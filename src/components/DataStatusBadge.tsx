import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, AlertTriangle } from "lucide-react";

type Status = "verified" | "partial" | "placeholder" | null | undefined;

export function DataStatusBadge({ status }: { status: Status }) {
  if (!status) return null;
  if (status === "verified") {
    return (
      <Badge variant="success" className="text-micro gap-1">
        <ShieldCheck className="h-3 w-3" /> Verified
      </Badge>
    );
  }
  if (status === "partial") {
    return (
      <Badge variant="warning" className="text-micro gap-1">
        <Clock className="h-3 w-3" /> Partial
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="text-micro gap-1">
      <AlertTriangle className="h-3 w-3" /> Placeholder
    </Badge>
  );
}