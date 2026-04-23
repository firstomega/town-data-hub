import { Link, useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { ChevronRight, Clock } from "lucide-react";
import { useTown } from "@/hooks/useTownData";
import { DataStatusBadge } from "./DataStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface TownProfileLayoutProps {
  children: React.ReactNode;
  townSlug?: string;
}

export function TownProfileLayout({ children, townSlug = "ridgewood" }: TownProfileLayoutProps) {
  const location = useLocation();
  const { data: town, isLoading } = useTown(townSlug);

  const tabs = [
    { label: "Overview", href: `/town/${townSlug}` },
    { label: "Zoning", href: `/town/${townSlug}/zoning` },
    { label: "Permits", href: `/town/${townSlug}/permits` },
    { label: "Ordinances", href: `/town/${townSlug}/ordinances` },
    { label: "Contacts", href: `/town/${townSlug}/contacts` },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-4 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">NJ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/" className="hover:text-foreground">{town?.county ?? "Bergen"} County</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{town?.name ?? townSlug}</span>
        </nav>

        {/* Town Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-7 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-primary">{town?.full_name ?? townSlug}</h1>
                  <p className="text-sm text-muted-foreground">{town?.county ?? "Bergen"} County, New Jersey</p>
                </div>
                <DataStatusBadge status={town?.data_status as "verified" | "partial" | "placeholder" | undefined} />
              </div>
            )}
          </div>
          {town && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {town.last_verified
                ? `Verified ${new Date(town.last_verified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                : "Not yet verified"}
              {town.source && <> · Source: {town.source}</>}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b mt-4 mb-6">
          <nav className="flex gap-0">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.href;
              return (
                <Link
                  key={tab.label}
                  to={tab.href}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {children}
      </div>
      <Footer />
    </div>
  );
}
