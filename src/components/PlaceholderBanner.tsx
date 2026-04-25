import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SuggestCorrectionDialog } from "@/components/SuggestCorrectionDialog";

interface PlaceholderBannerProps {
  townName: string;
  status: "partial" | "placeholder";
}

export function PlaceholderBanner({ townName, status }: PlaceholderBannerProps) {
  if (status !== "partial" && status !== "placeholder") return null;

  const isPartial = status === "partial";

  return (
    <Card className="mb-4 border-warning/30 bg-warning/5">
      <CardContent padding="xs" className="flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <p className="font-semibold text-foreground">
            {isPartial ? "Placeholder data — verification in progress" : "Data pending verification"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isPartial
              ? `${townName} data has been entered but not yet verified against the official municipal code. Do not rely on it for permit decisions — confirm with the municipality.`
              : `We have not yet ingested official municipal data for ${townName}. The figures shown are illustrative placeholders only.`}
          </p>
          <div className="mt-2">
            <SuggestCorrectionDialog townName={townName} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}