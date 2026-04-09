import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Layers, MapPin, ArrowRight, Map, Gavel, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Population", value: "25,255", icon: Users },
  { label: "Median Home Value", value: "$825,000", icon: DollarSign },
  { label: "Zoning Districts", value: "14", icon: Layers },
  { label: "Total Area", value: "5.8 sq mi", icon: MapPin },
];

const nearbyTowns = [
  { name: "Glen Rock", medianHome: "$635,000", zones: 8 },
  { name: "Midland Park", medianHome: "$475,000", zones: 6 },
  { name: "Wyckoff", medianHome: "$720,000", zones: 9 },
  { name: "Paramus", medianHome: "$580,000", zones: 11 },
];

export default function TownOverview() {
  return (
    <TownProfileLayout>
      {/* Source Attribution */}
      <div className="mb-6 p-3 rounded border bg-secondary/30">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Data sourced from Village of Ridgewood Municipal Code.</strong> Last verified: January 15, 2026. Always confirm with the municipality before making decisions.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Zoning Map Placeholder */}
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
                <p className="text-xs text-muted-foreground">
                  14 zoning districts · Last boundary update: March 2025
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Town Character */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-3">Town Character</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Village of Ridgewood is a suburban community known for its charming, walkable downtown and
                tree-lined residential streets. Located in the heart of Bergen County, Ridgewood features a vibrant
                Central Business District with locally owned shops, restaurants, and cafés. The town is predominantly
                single-family residential, with housing stock ranging from turn-of-the-century Colonials to mid-century
                split-levels. Ridgewood is consistently ranked among the best places to live in New Jersey, driven by
                its excellent public schools (consistently ranked top 10 in the state), strong property values, and
                active civic community. The town maintains strict zoning regulations to preserve its residential
                character, with recent ordinance updates addressing accessory dwelling units (ADUs), sustainable
                building practices, and stormwater management.
              </p>
            </CardContent>
          </Card>

          {/* Variance & Zoning Board */}
          <Card className="border-accent/20">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Gavel className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Variance & Zoning Board of Adjustment</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If your project doesn't conform to current zoning, you may need to apply for a variance from the
                    Ridgewood Board of Adjustment. The board meets on the 2nd and 4th Tuesday of each month.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs mb-3">
                    <div className="p-2.5 rounded bg-secondary">
                      <p className="font-semibold text-foreground mb-0.5">"C" Variance (Bulk)</p>
                      <p className="text-muted-foreground">For deviations from setback, height, coverage, or lot size requirements.</p>
                    </div>
                    <div className="p-2.5 rounded bg-secondary">
                      <p className="font-semibold text-foreground mb-0.5">"D" Variance (Use)</p>
                      <p className="text-muted-foreground">For uses not permitted in the zone. Requires enhanced showing of need.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Typical timeline: 6–8 weeks</span>
                    <span>·</span>
                    <span>Application fee: $250–$500</span>
                  </div>
                  <Link to="/town/ridgewood/contacts" className="inline-flex items-center gap-1 text-xs text-accent mt-2 hover:underline">
                    View ZBA contact details <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Nearby Municipalities */}
        <div>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Nearby Municipalities</h3>
              <div className="space-y-3">
                {nearbyTowns.map((t) => (
                  <Link
                    key={t.name}
                    to="/town/ridgewood"
                    className="block p-3 rounded border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{t.name}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <p>Med. Home</p>
                        <p className="font-medium text-foreground">{t.medianHome}</p>
                      </div>
                      <div>
                        <p>Zones</p>
                        <p className="font-medium text-foreground">{t.zones}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TownProfileLayout>
  );
}
