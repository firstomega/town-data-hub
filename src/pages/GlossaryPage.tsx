import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const { data: terms, isLoading } = useQuery({
    queryKey: ["glossary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("glossary_terms")
        .select("term, definition, related")
        .order("term", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (terms ?? []).filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold text-primary">Zoning Glossary</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Definitions of common zoning and land use terms used across New Jersey municipalities.
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms…"
            className="pl-9 bg-secondary border-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading && (
          <div className="py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div>
        )}

        <div className="space-y-3">
          {filtered.map((t) => (
            <Card key={t.term} id={t.term.toLowerCase().replace(/\s+/g, "-")}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-1">{t.term}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.definition}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(t.related ?? []).map((r: string) => (
                    <Badge key={r} variant="secondary" className="text-xs cursor-pointer" onClick={() => {
                      setSearch("");
                      const el = document.getElementById(r.toLowerCase().replace(/\s+/g, "-"));
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}>
                      {r}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No matching terms</p>
              <p className="text-sm">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
