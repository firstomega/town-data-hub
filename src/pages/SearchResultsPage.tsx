import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Layers, MessageSquare, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";

const townResults = [
  { name: "Ridgewood", county: "Bergen", zones: 14, slug: "ridgewood", snippet: "Village of Ridgewood — 14 zoning districts, walkable downtown, strong residential character." },
  { name: "Paramus", county: "Bergen", zones: 11, slug: "paramus", snippet: "Borough of Paramus — 11 zoning districts, major retail corridor along Route 17 and Route 4." },
];

const zoningResults = [
  { title: "R-1 Residential Zone — Ridgewood", snippet: "Single-family residential. Front setback: 40 ft, side: 12 ft, rear: 30 ft. Max lot coverage: 25%. Max height: 35 ft.", town: "Ridgewood", link: "/town/ridgewood/zoning" },
  { title: "Fence Height Regulations — Ridgewood", snippet: "Fences in residential zones shall not exceed 6 ft in side/rear yards and 4 ft in front yards. Corner lots treat street-side yards as front yards.", town: "Ridgewood", link: "/town/ridgewood/ordinances" },
  { title: "R-1 Residential Zone — Paramus", snippet: "Single-family residential. Front setback: 30 ft, side: 10 ft, rear: 25 ft. Max lot coverage: 30%. Max height: 35 ft.", town: "Paramus", link: "/town/paramus/zoning" },
];

const noteResults = [
  { author: "Verified Contractor", town: "Ridgewood", note: "Building dept is strict on survey accuracy — use a licensed surveyor, not a sketch.", upvotes: 24 },
  { author: "Verified Contractor", town: "Paramus", note: "ADU applications are being fast-tracked since the new ordinance. Expect 2-3 weeks.", upvotes: 18 },
];

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const hasResults = query.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl flex-1">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search towns, zoning rules, or community notes…"
            className="h-12 pl-12 pr-4 text-sm bg-card border shadow-sm"
          />
        </div>

        {hasResults ? (
          <>
            {/* Towns */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-accent" />
                <h2 className="font-semibold text-sm">Towns</h2>
                <Badge variant="secondary" className="text-[10px]">{townResults.length}</Badge>
              </div>
              <div className="space-y-2">
                {townResults.map((t) => (
                  <Link key={t.slug} to={`/town/${t.slug}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{t.name}</span>
                            <Badge variant="secondary" className="text-[10px]">{t.county} County</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{t.snippet}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Zoning Rules */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-accent" />
                <h2 className="font-semibold text-sm">Zoning Rules</h2>
                <Badge variant="secondary" className="text-[10px]">{zoningResults.length}</Badge>
              </div>
              <div className="space-y-2">
                {zoningResults.map((r) => (
                  <Link key={r.title} to={r.link}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{r.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{r.snippet}</p>
                        <Badge variant="outline" className="text-[10px]">{r.town}</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Community Notes */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-accent" />
                <h2 className="font-semibold text-sm">Community Notes</h2>
                <Badge variant="secondary" className="text-[10px]">{noteResults.length}</Badge>
              </div>
              <div className="space-y-2">
                {noteResults.map((n, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px]">{n.town}</Badge>
                        <span className="text-[10px] text-muted-foreground">by {n.author}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">👍 {n.upvotes}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{n.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-primary mb-2">No results found</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Try searching by town name or browse Bergen County towns.
            </p>
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
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
