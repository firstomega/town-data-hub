import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Layers, MapPin, ArrowRight, Map, Gavel, ThumbsUp, CheckCircle, Share2, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SuggestCorrectionDialog } from "@/components/SuggestCorrectionDialog";
import { toast } from "sonner";
import { getFullTownData } from "@/data/townData";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

export default function GenericTownOverview() {
  const { slug } = useParams<{ slug: string }>();
  const town = getFullTownData(slug || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [slug]);

  if (!town) return null;

  const stats = [
    { label: "Population", value: town.population, icon: Users },
    { label: "Median Home Value", value: town.medianHome, icon: DollarSign },
    { label: "Zoning Districts", value: String(town.numZones), icon: Layers },
    { label: "Total Area", value: town.totalArea, icon: MapPin },
  ];

  if (loading) {
    return (
      <TownProfileLayout townSlug={town.slug}>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </TownProfileLayout>
    );
  }

  return (
    <TownProfileLayout townSlug={town.slug}>
      <div className="animate-fade-in">
        <div className="mb-6 p-3 rounded border bg-secondary/30 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Data sourced from {town.source}.</strong> Last verified: {town.updated}. Always confirm with the municipality before making decisions.
          </p>
          <SuggestCorrectionDialog townName={town.name} />
        </div>

        <div className="flex gap-2 mb-6">
          <Link to={`/compare?town1=${town.slug}`}>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Compare with Another Town
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied to clipboard!"); }}>
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded bg-accent/10 flex items-center justify-center">
                    <s.icon className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-secondary flex items-center justify-center rounded-t-lg">
                  <div className="text-center text-muted-foreground">
                    <Map className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">Interactive Zoning Map</p>
                    <p className="text-xs">Coming soon</p>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <p className="text-xs text-muted-foreground">{town.numZones} zoning districts · Last boundary update: {town.updated}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-3">Town Character</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{town.character}</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Gavel className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Variance & Zoning Board of Adjustment</h3>
                    <p className="text-sm text-muted-foreground mb-3">{town.zbaSchedule}</p>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs mb-3">
                      <div className="p-2.5 rounded bg-secondary">
                        <p className="font-semibold text-foreground mb-0.5">"C" Variance (Bulk)</p>
                        <p className="text-muted-foreground">For deviations from setback, height, coverage, or lot size.</p>
                      </div>
                      <div className="p-2.5 rounded bg-secondary">
                        <p className="font-semibold text-foreground mb-0.5">"D" Variance (Use)</p>
                        <p className="text-muted-foreground">For uses not permitted in the zone.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Typical timeline: {town.zbaTimeline}</span>
                      <span>·</span>
                      <span>Application fee: {town.zbaFee}</span>
                    </div>
                    <Link to={`/town/${town.slug}/contacts`} className="inline-flex items-center gap-1 text-xs text-accent mt-2 hover:underline">
                      View ZBA contact details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-4">Community Notes</h3>
                <p className="text-xs text-muted-foreground mb-4">Tips from verified contractors who work in {town.name}.</p>
                {town.communityNotes.length > 0 ? (
                  <div className="space-y-3">
                    {town.communityNotes.map((n, i) => (
                      <div key={i} className="p-3 rounded border bg-secondary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">{n.author}</span>
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <CheckCircle className="h-2.5 w-2.5" /> {n.badge}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground ml-auto">{n.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{n.note}</p>
                        <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="h-3 w-3" /> {n.upvotes}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No contractor tips yet for this town. Verified contractors can share their local knowledge here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" /> Upcoming Meetings
                </h3>
                <div className="space-y-3">
                  {town.upcomingMeetings.map((m, i) => (
                    <div key={i} className="p-3 rounded border bg-secondary/20 text-xs">
                      <p className="font-semibold text-foreground">{m.board}</p>
                      <p className="text-muted-foreground">{m.date} · {m.time}</p>
                      <p className="text-muted-foreground">{m.location}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-4">Nearby Municipalities</h3>
                <div className="space-y-3">
                  {town.nearbyTowns.map((t) => (
                    <Link key={t.name} to={t.slug ? `/town/${t.slug}` : "#"} className="block p-3 rounded border hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{t.name}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div><p>Med. Home</p><p className="font-medium text-foreground">{t.medianHome}</p></div>
                        <div><p>Zones</p><p className="font-medium text-foreground">{t.zones}</p></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TownProfileLayout>
  );
}
