import { Link, useLocation } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface NavBarProps {
  isLoggedIn?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
}

export function NavBar({ isLoggedIn = false, showSearch = false, searchValue = "", onSearchChange, onSearchSubmit }: NavBarProps) {
  const location = useLocation();
  const [query, setQuery] = useState(searchValue);

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container flex h-14 items-center gap-4">
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-accent text-accent-foreground text-xs font-black">TC</div>
          TownCenter
        </Link>

        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search address, town, or ask a question…"
                className="pl-9 h-9 bg-secondary border-0"
                value={query}
                onChange={(e) => { setQuery(e.target.value); onSearchChange?.(e.target.value); }}
                onKeyDown={(e) => e.key === "Enter" && onSearchSubmit?.()}
              />
            </div>
          </div>
        )}

        <nav className="hidden md:flex items-center gap-6 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold">JD</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/dashboard"><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link to="/pricing"><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
