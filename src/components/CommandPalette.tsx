import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Layers, ListChecks, GitCompare, HelpCircle, ArrowRight } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

const towns = [
  { name: "Ridgewood", slug: "ridgewood" },
  { name: "Paramus", slug: "paramus" },
  { name: "Hackensack", slug: "hackensack" },
  { name: "Fort Lee", slug: "fort-lee" },
  { name: "Teaneck", slug: "teaneck" },
  { name: "Englewood", slug: "englewood" },
  { name: "Glen Rock", slug: "glen-rock" },
];

const recentSearches = [
  "Fence permit Ridgewood",
  "Setback rules R-1",
  "ADU regulations Paramus",
];

const quickActions = [
  { label: "Compare Towns", icon: GitCompare, path: "/compare" },
  { label: "Permit Checklist", icon: ListChecks, path: "/checklist" },
  { label: "Ask a Question", icon: HelpCircle, path: "/query" },
  { label: "Feasibility Check", icon: Layers, path: "/feasibility" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runAction = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search towns, rules, or actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Recent Searches">
          {recentSearches.map((s) => (
            <CommandItem key={s} onSelect={() => runAction(`/search?q=${encodeURIComponent(s)}`)}>
              <Search className="mr-2 h-4 w-4" />
              {s}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Towns">
          {towns.map((t) => (
            <CommandItem key={t.slug} onSelect={() => runAction(`/town/${t.slug}`)}>
              <MapPin className="mr-2 h-4 w-4" />
              {t.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          {quickActions.map((a) => (
            <CommandItem key={a.label} onSelect={() => runAction(a.path)}>
              <a.icon className="mr-2 h-4 w-4" />
              {a.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
