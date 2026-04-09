import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const glossary: Record<string, string> = {
  "setback": "The minimum distance a building must be set back from a property line, road, or other boundary.",
  "FAR": "Floor Area Ratio — the ratio of a building's total floor area to the size of the lot it sits on.",
  "lot coverage": "The percentage of a lot that is covered by buildings and impervious surfaces.",
  "impervious coverage": "Surfaces that prevent water absorption, like driveways, patios, and buildings.",
  "variance": "Official permission to deviate from zoning requirements, granted by a zoning board.",
  "permitted use": "A land use that is allowed by right in a specific zoning district without special approval.",
  "conditional use": "A use that may be allowed in a zone with special conditions or approval from a board.",
};

export function GlossaryTooltip({ term }: { term: string }) {
  const definition = glossary[term.toLowerCase()] || glossary[term] || "Definition not available.";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="border-b border-dashed border-muted-foreground/50 cursor-help">{term}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        <p className="font-semibold mb-0.5">{term}</p>
        <p className="text-muted-foreground">{definition}</p>
      </TooltipContent>
    </Tooltip>
  );
}
