import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { padding: "py-8", icon: "h-8 w-8", title: "text-sm", description: "text-xs" },
  md: { padding: "py-12", icon: "h-10 w-10", title: "text-base", description: "text-sm" },
  lg: { padding: "py-16", icon: "h-10 w-10", title: "text-lg", description: "text-sm" },
} as const;

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("text-center", s.padding, className)}>
      {Icon && <Icon className={cn(s.icon, "text-muted-foreground/30 mx-auto mb-4")} />}
      <h2 className={cn(s.title, "font-semibold text-primary mb-2")}>{title}</h2>
      {description && (
        <p className={cn(s.description, "text-muted-foreground mb-6 max-w-md mx-auto")}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
