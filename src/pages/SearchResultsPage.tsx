import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Layers, FileText, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";

function useSearch(q: string) {
  return useQuery({
    queryKey: ["search", q],
    enabled: q.trim().length >= 2,
    queryFn: async () => {
      const term = `%${q.trim()}%`;
      const [townsRes, zonesRes, ordRes] = await Promise.all([
        supabase
          .from("towns")
          .select("name,full_name,county,slug,num_zones,data_status,character")
          .or(`name.ilike.${term},full_name.ilike.${term},county.ilike.${term}`)
          .limit(10),
        supabase
          .from("zones")
          .select("code,name,description,town_slug,confidence")
          .neq("confidence", "placeholder")
          .or(`name.ilike.${term},code.ilike.${term},description.ilike.${term}`)
          .limit(15),
        supabase
          .from("ordinances")
          .select("title,summary,category,town_slug,confidence")
          .neq("confidence", "placeholder")
          .or(`title.ilike.${term},summary.ilike.${term},category.ilike.${term}`)
          .limit(15),
      ]);
      return {
        towns: townsRes.data ?? [],
        zones: zonesRes.data ?? [],
        ordinances: ordRes.data ?? [],
      };
    },
  });
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const { data, isLoading } = useSearch(query);
  const hasQuery = query.trim().length >= 2;
  const totalHits =
    (data?.towns.length ?? 0) + (data?.zones.length ?? 0) + (data?.ordinances.length ?? 0);

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6 max-w-3xl">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search towns, zoning rules, or ordinances…"
            className="h-12 pl-12 pr-4 text-sm bg-card border shadow-sm"
          />
        </div>

        {!hasQuery ? (
          <EmptyState
            icon={Search}
            size="lg"
            title="Start typing to search"
            description="Search across Bergen County towns, zoning districts, and ordinances."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/town/ridgewood">
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Ridgewood</Badge>
                </Link>
                <Link to="/town/paramus">
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Paramus</Badge>
                </Link>
                <Link to="/">
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Browse All Towns</Badge>
                </Link>
              </div>
            }
          />
        ) : isLoading ? (
          <LoadingState size="lg" label="Searching…" />
        ) : totalHits === 0 ? (
          <EmptyState
            icon={Search}
            size="lg"
            title="No results found"
            description={`Nothing matched "${query}". Verified zoning and ordinance content is still being added — try a town name.`}
          />
        ) : (
          <>
            {data!.towns.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-accent" />
                  <h2 className="font-semibold text-sm">Towns</h2>
                  <Badge variant="secondary" className="text-micro">{data!.towns.length}</Badge>
                </div>
                <div className="space-y-2">
                  {data!.towns.map((t) => (
                    <Link key={t.slug} to={`/town/${t.slug}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent padding="sm" className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{t.name}</span>
                              <Badge variant="secondary" className="text-micro">{t.county} County</Badge>
                              {t.data_status === "placeholder" && (
                                <Badge variant="outline" className="text-micro">Coming soon</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {t.character ?? `${t.full_name} — ${t.num_zones ?? "—"} zoning districts`}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data!.zones.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-accent" />
                  <h2 className="font-semibold text-sm">Zoning Districts</h2>
                  <Badge variant="secondary" className="text-micro">{data!.zones.length}</Badge>
                </div>
                <div className="space-y-2">
                  {data!.zones.map((z) => (
                    <Link key={`${z.town_slug}-${z.code}`} to={`/town/${z.town_slug}/zoning`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent padding="sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{z.code} — {z.name}</span>
                          </div>
                          {z.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{z.description}</p>
                          )}
                          <Badge variant="outline" className="text-micro capitalize">{z.town_slug}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data!.ordinances.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-accent" />
                  <h2 className="font-semibold text-sm">Ordinances</h2>
                  <Badge variant="secondary" className="text-micro">{data!.ordinances.length}</Badge>
                </div>
                <div className="space-y-2">
                  {data!.ordinances.map((o, i) => (
                    <Link key={`${o.town_slug}-${i}`} to={`/town/${o.town_slug}/ordinances`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent padding="sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{o.title}</span>
                          </div>
                          {o.summary && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{o.summary}</p>
                          )}
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className="text-micro capitalize">{o.town_slug}</Badge>
                            <Badge variant="secondary" className="text-micro">{o.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
