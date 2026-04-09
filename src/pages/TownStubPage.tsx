import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bell, Clock, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const stubTowns: Record<string, { name: string; fullName: string; county: string; zones: number; pop: string }> = {
  hackensack: { name: "Hackensack", fullName: "City of Hackensack", county: "Bergen", zones: 18, pop: "44,113" },
  "fort-lee": { name: "Fort Lee", fullName: "Borough of Fort Lee", county: "Bergen", zones: 13, pop: "37,907" },
  teaneck: { name: "Teaneck", fullName: "Township of Teaneck", county: "Bergen", zones: 12, pop: "40,356" },
  englewood: { name: "Englewood", fullName: "City of Englewood", county: "Bergen", zones: 15, pop: "28,390" },
};

export default function TownStubPage() {
  const { slug } = useParams<{ slug: string }>();
  const town = stubTowns[slug || ""] || { name: slug, fullName: slug, county: "Bergen", zones: 0, pop: "—" };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl flex-1">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">NJ</Link>
          <span>›</span>
          <Link to="/" className="hover:text-foreground">{town.county} County</Link>
          <span>›</span>
          <span className="text-foreground font-medium">{town.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-1">{town.fullName}</h1>
          <p className="text-sm text-muted-foreground">{town.county} County, New Jersey</p>
        </div>

        <Card className="mb-6 border-warning/30 bg-warning/5">
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-7 w-7 text-warning" />
            </div>
            <Badge className="mb-3 bg-warning/10 text-warning border-0">Data Pending</Badge>
            <h2 className="font-bold text-lg mb-2">Full profile coming soon</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              We're actively collecting and verifying zoning data for {town.name} from official municipal sources. 
              Full zoning rules, permit info, and ordinances will be available shortly.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Bell className="h-3.5 w-3.5" /> Notify Me When Ready
              </Button>
              <Link to="/town/ridgewood">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                  Browse Ridgewood Instead <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* What we know */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-4">What We Know So Far</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Population</p>
                <p className="text-lg font-bold">{town.pop}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">County</p>
                <p className="text-lg font-bold">{town.county}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Zoning Districts</p>
                <p className="text-lg font-bold">{town.zones || "TBD"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h3 className="font-semibold text-sm mb-3">Available Town Profiles</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Ridgewood", slug: "ridgewood", zones: 14 },
              { name: "Paramus", slug: "paramus", zones: 11 },
            ].map((t) => (
              <Link key={t.slug} to={`/town/${t.slug}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.zones} zones · Full profile</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
