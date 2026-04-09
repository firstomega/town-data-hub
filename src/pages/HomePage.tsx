import { Search, ArrowRight, Lightbulb, MapPin, Clock, Shield, RefreshCw, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const featuredTowns = [
  { name: "Ridgewood", county: "Bergen", zones: 14, slug: "ridgewood" },
  { name: "Paramus", county: "Bergen", zones: 11, slug: "paramus" },
  { name: "Hackensack", county: "Bergen", zones: 18, slug: "hackensack" },
  { name: "Fort Lee", county: "Bergen", zones: 13, slug: "fort-lee" },
  { name: "Teaneck", county: "Bergen", zones: 12, slug: "teaneck" },
  { name: "Englewood", county: "Bergen", zones: 15, slug: "englewood" },
];

const suggestions = [
  "Can I build a deck in Ridgewood?",
  "Fence height limits in Paramus",
  "ADU rules Bergen County",
  "Pool permit requirements Teaneck",
];

const quickPills = [
  { label: "Ridgewood", link: "/town/ridgewood" },
  { label: "Paramus", link: "/town/paramus" },
  { label: "Hackensack", link: "/search?q=Hackensack" },
  { label: "Fort Lee", link: "/search?q=Fort+Lee" },
  { label: "Fence permits", link: "/search?q=fence+permits" },
  { label: "Setback rules", link: "/search?q=setback+rules" },
  { label: "ADU regulations", link: "/search?q=ADU+regulations" },
];

const howItWorks = [
  { step: 1, icon: Search, title: "Search your address or town", description: "Enter any address, town name, or ask a natural language question about zoning rules." },
  { step: 2, icon: Layers, title: "Get instant zoning rules & permit info", description: "See setbacks, lot coverage, height limits, permit requirements, fees, and timelines." },
  { step: 3, icon: Clock, title: "Save your project and track changes", description: "Save your address, generate checklists, and get notified when ordinances change." },
];

const valueProps = [
  { icon: Clock, title: "Time Savings", description: "Get answers in seconds instead of hours spent calling municipal offices and reading code." },
  { icon: Shield, title: "Risk Mitigation", description: "Avoid costly permit delays and code violations by knowing the rules before you start." },
  { icon: RefreshCw, title: "Always Current", description: "Data updated within 30 days of any official ordinance change. Never work with stale info." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground" size="sm" onClick={handleSearch}>
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

            {/* Quick-search pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {quickPills.map((pill) => (
                <Link
                  key={pill.label}
                  to={pill.link}
                  className="text-xs text-primary-foreground/60 hover:text-primary-foreground bg-primary-foreground/5 border border-primary-foreground/10 px-3 py-1 rounded-full transition-colors"
                >
                  {pill.label}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTowns.map((town) => (
            <Link key={town.slug} to={town.slug === "ridgewood" || town.slug === "paramus" ? `/town/${town.slug}` : `/search?q=${town.name}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{town.name}</h3>
                      <p className="text-xs text-muted-foreground">{town.county} County</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{town.zones} zoning districts</p>
                    <span className="text-xs text-accent font-medium">View Profile →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30">
        <div className="container py-12" id="how-it-works">
          <h2 className="text-xl font-bold text-primary text-center mb-2">How It Works</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Three simple steps to zoning clarity</p>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="text-xs font-semibold text-accent mb-1">Step {step.step}</div>
                <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Did You Know */}
      <section className="container py-12">
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

      {/* Value Propositions */}
      <section className="container pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {valueProps.map((vp) => (
            <Card key={vp.title}>
              <CardContent className="p-5 text-center">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <vp.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{vp.title}</h3>
                <p className="text-sm text-muted-foreground">{vp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="container pb-12">
        <div className="text-center py-8 border rounded-lg bg-secondary/20">
          <p className="text-sm font-semibold text-muted-foreground">
            Trusted by homeowners and contractors across Bergen County
          </p>
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">70</p>
              <p className="text-xs text-muted-foreground">Municipalities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">2,400+</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">15,000+</p>
              <p className="text-xs text-muted-foreground">Queries Answered</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
