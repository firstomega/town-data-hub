import { ExternalLink, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type Confidence = "verified" | "ai_extracted" | "placeholder";

interface DataProvenanceProps {
  confidence?: Confidence | null;
  sourceDoc?: string | null;
  sourceUrl?: string | null;
  lastVerifiedAt?: string | null;
  className?: string;
}

const STALE_MONTHS = 12;

export function DataProvenance({
  confidence = "placeholder",
  sourceDoc,
  sourceUrl,
  lastVerifiedAt,
  className,
}: DataProvenanceProps) {
  const isStale = lastVerifiedAt
    ? (Date.now() - new Date(lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24 * 30) > STALE_MONTHS
    : false;

  const verifiedDate = lastVerifiedAt
    ? new Date(lastVerifiedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-3 mt-3 border-t", className)}>
      {confidence === "verified" && (
        <span className="inline-flex items-center gap-1 text-success font-medium">
          <ShieldCheck className="h-3 w-3" /> Verified
        </span>
      )}
      {confidence === "ai_extracted" && (
        <span className="inline-flex items-center gap-1 text-accent font-medium">
          <Sparkles className="h-3 w-3" /> AI-extracted
        </span>
      )}
      {confidence === "placeholder" && (
        <span className="inline-flex items-center gap-1 text-warning font-medium">
          <AlertCircle className="h-3 w-3" /> Placeholder — not yet verified
        </span>
      )}
      {sourceDoc && (
        <span>
          · Source: {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center gap-0.5">
              {sourceDoc} <ExternalLink className="h-2.5 w-2.5" />
            </a>
          ) : sourceDoc}
        </span>
      )}
      {verifiedDate && <span>· Verified {verifiedDate}</span>}
      {isStale && (
        <span className="inline-flex items-center gap-1 text-warning">· May be outdated</span>
      )}
    </div>
  );
}