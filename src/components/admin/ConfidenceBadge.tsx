import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, AlertTriangle, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  confidence: number | null;
  method: "platform_directory" | "ai_ranked" | "manual" | null;
  reasoning?: string | null;
  className?: string;
}

/**
 * Visual indicator of how trustworthy a discovered source URL is.
 *   ≥ 0.85 → green (auto-trustworthy)
 *   0.6 – 0.85 → yellow (review recommended)
 *   < 0.6 → red (review required)
 *   manual → gray check (admin set it; trust is implicit)
 *   null → gray "no score"
 */
export function ConfidenceBadge({ confidence, method, reasoning, className }: ConfidenceBadgeProps) {
  if (method === "manual") {
    return (
      <Badge variant="secondary" className={cn("gap-1 text-micro", className)}>
        <User className="h-3 w-3" /> manual
      </Badge>
    );
  }
  if (confidence === null || confidence === undefined) {
    return (
      <Badge variant="secondary" className={cn("text-micro", className)}>
        no score
      </Badge>
    );
  }

  let variant: "success" | "warning" | "destructive" = "success";
  let Icon = CheckCircle2;
  if (confidence < 0.6) {
    variant = "destructive";
    Icon = AlertCircle;
  } else if (confidence < 0.85) {
    variant = "warning";
    Icon = AlertTriangle;
  }

  const pct = Math.round(confidence * 100);
  const label = method === "platform_directory" ? "verified directory" : `AI ${pct}%`;

  const badge = (
    <Badge variant={variant} className={cn("gap-1 text-micro", className)}>
      <Icon className="h-3 w-3" /> {label}
    </Badge>
  );

  if (!reasoning) return badge;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{badge}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{reasoning}</TooltipContent>
    </Tooltip>
  );
}
