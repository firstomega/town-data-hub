import { Link, useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { ChevronRight, Clock } from "lucide-react";

const tabs = [
  { label: "Overview", href: "/town/ridgewood" },
  { label: "Zoning", href: "/town/ridgewood/zoning" },
  { label: "Permits", href: "/town/ridgewood/permits" },
  { label: "Ordinances", href: "#" },
  { label: "Contacts", href: "#" },
];

export function TownProfileLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <NavBar isLoggedIn showSearch />
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">NJ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/" className="hover:text-foreground">Bergen County</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Ridgewood</span>
        </nav>

        {/* Town Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold text-primary">Village of Ridgewood</h1>
            <p className="text-sm text-muted-foreground">Bergen County, New Jersey</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated Jan 15, 2026 · Source: Ridgewood Village Code
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
    </div>
  );
}
