import { Search, ArrowRight, MapPin, Clock, Shield, RefreshCw, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAllTowns } from "@/hooks/useTownData";
import { DataStatusBadge } from "@/components/DataStatusBadge";

const suggestions = [
  "Setback rules",
  "Fence height",
  "ADU regulations",
  "Pool permits",
];

const howItWorks = [
  { step: 1, icon: Search, title: "Search your address or town", description: "Enter any address, town name, or ask a natural language question about zoning rules." },
  { step: 2, icon: Layers, title: "Get instant zoning rules & permit info", description: "See setbacks, lot coverage, height limits, permit requirements, fees, and timelines." },
  { step: 3, icon: Clock, title: "Save your project and track changes", description: "Save your address, generate checklists, and get notified when ordinances change." },
];

const valueProps = [
  { icon: Clock, title: "Time Savings", description: "Get answers in seconds instead of hours spent calling municipal offices and reading code." },
  { icon: Shield, title: "Risk Mitigation", description: "Avoid costly permit delays and code violations by knowing the rules before you start." },
  { icon: RefreshCw, title: "Refreshed weekly", description: "Every town is re-scanned weekly against its official source, with on-demand refreshes for active changes." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: towns } = useAllTowns();

  const totalTowns = towns?.length ?? 0;
  const verifiedTowns = (towns ?? []).filter((t) => t.data_status === "verified");
  const partialTowns = (towns ?? []).filter((t) => t.data_status === "partial");
  const liveTowns = [...verifiedTowns, ...partialTowns];
  const featuredTowns = liveTowns.length > 0 ? liveTowns.slice(0, 8) : (towns ?? []).slice(0, 8);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <AppLayout contained={false}>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 text-center">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground border-0 text-xs font-medium">
            Bergen County, NJ — Early Access
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Know Your Zoning<br />Before You Build
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            Local zoning rules, permit requirements, and ordinances for Bergen County towns — sourced directly from each town's official code.
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
                  to={`/search?q=${encodeURIComponent(s)}`}
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
            <h2 className="text-xl font-bold text-primary">Towns — Bergen County</h2>
            <p className="text-sm text-muted-foreground">
              {totalTowns > 0
                ? `${totalTowns} towns onboarded · ${verifiedTowns.length} verified · ${partialTowns.length} in progress`
                : "Loading towns…"}
            </p>
          </div>
        </div>

        {featuredTowns.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No towns yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredTowns.map((town) => (
              <Link key={town.slug} to={`/town/${town.slug}`}>
                <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border h-full">
                  <CardContent padding="sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{town.name}</h3>
                        <p className="text-xs text-muted-foreground">{town.county} County</p>
                      </div>
                      <div className="ml-auto"><DataStatusBadge status={town.data_status} /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {town.num_zones ? `${town.num_zones} zoning districts` : "—"}
                      </p>
                      <span className="text-xs text-accent font-medium">View Profile →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
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

      {/* Value Propositions */}
      <section className="container py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {valueProps.map((vp) => (
            <Card key={vp.title}>
              <CardContent padding="md" className="text-center">
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

      {/* CTA */}
      <section className="container pb-12 text-center">
        <Card className="border-accent/20 bg-accent/5">
          <CardContent padding="xl">
            <h3 className="text-lg font-semibold text-primary mb-2">Don't see your town?</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              We're onboarding Bergen County town-by-town. Verified rows go live as our team confirms each source.
            </p>
            <Link to="/about">
              <Button variant="outline" size="sm" className="gap-1.5">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

    </AppLayout>
  );
}
