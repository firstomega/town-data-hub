import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Layers, MapPin, ArrowRight, Map, Gavel, Share2, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTown } from "@/hooks/useTownData";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";
import { DataProvenance } from "@/components/DataProvenance";

export default function GenericTownOverview() {
  const { slug } = useParams<{ slug: string }>();
  const { data: town, isLoading } = useTown(slug);

  if (isLoading) {
    return (
      <TownProfileLayout townSlug={slug}>
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

  if (!town) {
    return (
      <TownProfileLayout townSlug={slug}>
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Town not found.</CardContent></Card>
      </TownProfileLayout>
    );
  }

  const stats = [
    { label: "Population", value: town.population ?? "—", icon: Users },
    { label: "Median Home Value", value: town.median_home ?? "—", icon: DollarSign },
    { label: "Zoning Districts", value: town.num_zones ? String(town.num_zones) : "—", icon: Layers },
    { label: "Total Area", value: town.total_area ?? "—", icon: MapPin },
  ];

  return (
    <TownProfileLayout townSlug={town.slug}>
      <div className="animate-fade-in">
        <PlaceholderBanner townName={town.name} status={(town.data_status as "partial" | "placeholder") ?? "placeholder"} />

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
                  <p className="text-xs text-muted-foreground">{town.num_zones ?? "—"} zoning districts</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-3">Town Character</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{town.character ?? "Character description not yet available."}</p>
                <DataProvenance confidence="placeholder" sourceDoc={town.source} lastVerifiedAt={town.last_verified} />
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
                    <p className="text-sm text-muted-foreground mb-3">See the Contacts tab for the ZBA meeting schedule.</p>
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
                    <Link to={`/town/${town.slug}/contacts`} className="inline-flex items-center gap-1 text-xs text-accent mt-2 hover:underline">
                      View ZBA contact details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" /> Upcoming Meetings
                </h3>
                <p className="text-xs text-muted-foreground">See the Contacts tab for the latest meeting schedule.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TownProfileLayout>
  );
}
