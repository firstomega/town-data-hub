import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTown, useTownOrdinances } from "@/hooks/useTownData";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";
import { DataProvenance } from "@/components/DataProvenance";

export default function GenericTownOrdinances() {
  const { slug } = useParams<{ slug: string }>();
  const { data: town } = useTown(slug);
  const { data: ordinances, isLoading } = useTownOrdinances(slug);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const list = ordinances ?? [];
  const categories = useMemo(() => ["All", ...Array.from(new Set(list.map((o) => o.category)))], [list]);
  const filtered = list.filter((o) => {
    const matchesCat = activeCategory === "All" || o.category === activeCategory;
    const matchesSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || (o.summary ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (isLoading) {
    return (
      <TownProfileLayout townSlug={slug}>
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-9 w-full mb-4" />
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      </TownProfileLayout>
    );
  }

  return (
    <TownProfileLayout townSlug={slug}>
      <div className="animate-fade-in">
        {town && <PlaceholderBanner townName={town.name} status={(town.data_status as "partial" | "placeholder") ?? "placeholder"} />}
        <div className="mb-4">
          <h2 className="text-lg font-bold">Local Ordinances</h2>
          <p className="text-sm text-muted-foreground">Searchable, categorized local ordinances for {town?.name ?? "this town"}.</p>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ordinances…" className="pl-9 h-9 bg-secondary border-0" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeCategory === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{cat}</button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map((o) => (
            <Card key={o.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {o.code && <Badge variant="secondary" className="text-micro font-mono">{o.code}</Badge>}
                    <Badge variant="outline" className="text-micro">{o.category}</Badge>
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.summary}</p>
                <DataProvenance confidence={o.confidence as "verified" | "ai_extracted" | "placeholder"} sourceDoc={o.source_doc} sourceUrl={o.source_url} lastVerifiedAt={o.last_verified_at} />
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No ordinances match your search.</p>}
        </div>
      </div>
    </TownProfileLayout>
  );
}
