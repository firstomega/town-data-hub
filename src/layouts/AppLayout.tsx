import { ReactNode } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  /** Show search input in NavBar. Defaults to false. */
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  /** Wrap children in the standard `container` with section padding. Defaults to true. */
  contained?: boolean;
  /** Override the section padding when `contained` is true. */
  sectionPadding?: "none" | "sm" | "md" | "lg";
  /** Extra classes for the <main> element. */
  mainClassName?: string;
}

const paddingMap = {
  none: "",
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
} as const;

export function AppLayout({
  children,
  showSearch = false,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  contained = true,
  sectionPadding = "md",
  mainClassName,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar
        showSearch={showSearch}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />
      <main className={cn("flex-1 flex flex-col", mainClassName)}>
        {contained ? (
          <div className={cn("container", paddingMap[sectionPadding])}>{children}</div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
}
