import { Search, ArrowRight, Lightbulb, MapPin, Users, Layers, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const featuredTowns = [
  { name: "Ridgewood", pop: "25,255", zones: 14, medianHome: "$825,000", slug: "ridgewood" },
  { name: "Paramus", pop: "26,342", zones: 11, medianHome: "$580,000", slug: "paramus" },
  { name: "Hackensack", pop: "44,113", zones: 18, medianHome: "$420,000", slug: "hackensack" },
  { name: "Teaneck", pop: "40,356", zones: 12, medianHome: "$485,000", slug: "teaneck" },
  { name: "Glen Rock", pop: "11,926", zones: 8, medianHome: "$635,000", slug: "glen-rock" },
  { name: "Fair Lawn", pop: "33,710", zones: 15, medianHome: "$510,000", slug: "fair-lawn" },
  { name: "Wyckoff", pop: "17,006", zones: 9, medianHome: "$720,000", slug: "wyckoff" },
  { name: "Mahwah", pop: "26,363", zones: 16, medianHome: "$575,000", slug: "mahwah" },
];

const suggestions = [
  "Can I build a deck in Ridgewood?",
  "Fence height limits in Paramus",
  "ADU rules Bergen County",
  "Pool permit requirements Teaneck",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 text-center">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground border-0 text-xs font-medium">
            Bergen County, NJ — Now Live
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Know Your Zoning<br />Before You Build
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            Instant access to local zoning rules, permit requirements, and ordinances for every town in Bergen County.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter an address, town name, or ask a question…"
                className="h-14 pl-12 pr-4 text-base bg-card text-card-foreground border-0 shadow-lg"
              />
              <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
                Search
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {suggestions.map((s) => (
                <Link
                  key={s}
                  to="/query"
                  className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 bg-primary-foreground/10 px-3 py-1.5 rounded transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Towns */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary">Featured Towns — Bergen County</h2>
            <p className="text-sm text-muted-foreground">Explore zoning data for 70 municipalities</p>
          </div>
          <Button variant="ghost" size="sm" className="text-accent">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTowns.map((town) => (
            <Link key={town.slug} to="/town/ridgewood">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="font-semibold text-sm">{town.name}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Population</p>
                      <p className="font-medium">{town.pop}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Zones</p>
                      <p className="font-medium">{town.zones}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Med. Home</p>
                      <p className="font-medium">{town.medianHome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Did You Know */}
      <section className="container pb-12">
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Did You Know?</h3>
              <p className="text-sm text-muted-foreground">
                In Ridgewood, fences in the front yard cannot exceed 4 feet, while side and rear fences can be up to 6 feet.
                But if your property is on a corner lot, different rules may apply. Over 60% of homeowner permit delays are caused by
                not knowing setback requirements before starting construction.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-8 text-center text-xs text-muted-foreground">
          <p className="mb-2">
            TownCenter provides zoning and ordinance information for educational purposes only. Always verify with your local municipality before making decisions.
          </p>
          <p>© 2026 TownCenter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
