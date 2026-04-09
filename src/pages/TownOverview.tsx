import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Layers, MapPin, ArrowRight, Map } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Population", value: "25,255", icon: Users },
  { label: "Median Home Value", value: "$825,000", icon: DollarSign },
  { label: "Zoning Districts", value: "14", icon: Layers },
  { label: "Total Area", value: "5.8 sq mi", icon: MapPin },
];

const nearbyTowns = [
  { name: "Glen Rock", pop: "11,926", medianHome: "$635,000", zones: 8 },
  { name: "Midland Park", pop: "7,128", medianHome: "$475,000", zones: 6 },
  { name: "Wyckoff", pop: "17,006", medianHome: "$720,000", zones: 9 },
  { name: "Paramus", pop: "26,342", medianHome: "$580,000", zones: 11 },
];

export default function TownOverview() {
  return (
    <TownProfileLayout>
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
                The Village of Ridgewood is a suburban community known for its charming downtown, excellent schools,
                and tree-lined residential streets. The town features a vibrant Central Business District with local shops
                and restaurants, surrounded by well-maintained residential neighborhoods. Ridgewood maintains strict
                zoning regulations to preserve its residential character, with a focus on single-family homes in most
                residential zones. Recent ordinance updates have addressed accessory dwelling units and sustainable
                building practices.
              </p>
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
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <p>Pop.</p>
                        <p className="font-medium text-foreground">{t.pop}</p>
                      </div>
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
