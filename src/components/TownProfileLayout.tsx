import { Link, useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { ChevronRight, Clock } from "lucide-react";
import { getTown } from "@/data/towns";

interface TownProfileLayoutProps {
  children: React.ReactNode;
  townSlug?: string;
}

export function TownProfileLayout({ children, townSlug = "ridgewood" }: TownProfileLayoutProps) {
  const location = useLocation();
  const town = getTown(townSlug);

  const tabs = [
    { label: "Overview", href: `/town/${town.slug}` },
    { label: "Zoning", href: `/town/${town.slug}/zoning` },
    { label: "Permits", href: `/town/${town.slug}/permits` },
    { label: "Ordinances", href: `/town/${town.slug}/ordinances` },
    { label: "Contacts", href: `/town/${town.slug}/contacts` },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-4 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">NJ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/" className="hover:text-foreground">{town.county} County</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{town.name}</span>
        </nav>

        {/* Town Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold text-primary">{town.fullName}</h1>
            <p className="text-sm text-muted-foreground">{town.county} County, New Jersey</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated {town.updated} · Source: {town.source}
          </div>
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
