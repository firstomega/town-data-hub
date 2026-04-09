import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavBarProps {
  isLoggedIn?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
}

export function NavBar({ isLoggedIn = false, showSearch = false, searchValue = "", onSearchChange, onSearchSubmit }: NavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchValue);

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Guides", href: "/guides" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  const handleSearchSubmit = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
    } else if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

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
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold cursor-pointer">
                    JD
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-3.5 w-3.5" /> Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex items-center gap-2 text-destructive">
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link to="/pricing"><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
