import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** When true, fills available height (use inside a flex-1 container). */
  fill?: boolean;
}

const iconSizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

const padMap = {
  sm: "py-6",
  md: "py-12",
  lg: "py-16",
} as const;

export function LoadingState({ label, className, size = "md", fill = false }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-muted-foreground text-sm",
        fill ? "flex-1" : padMap[size],
        className,
      )}
    >
      <Loader2 className={cn(iconSizeMap[size], "animate-spin")} />
      {label && <span>{label}</span>}
    </div>
  );
}
