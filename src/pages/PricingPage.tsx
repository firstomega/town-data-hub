import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Users, Plus, Minus } from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    description: "Explore zoning basics",
    features: [
      { name: "5 town searches/month", included: true },
      { name: "Basic zoning data", included: true },
      { name: "Community Notes (read-only)", included: true },
      { name: "Natural Language Query", included: false },
      { name: "Permit checklists", included: false },
      { name: "Ordinance change alerts", included: false },
      { name: "Town comparisons", included: false },
      { name: "PDF exports", included: false },
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Homeowner",
    monthly: 3,
    annual: 29,
    description: "Everything for your project",
    features: [
      { name: "Unlimited searches", included: true },
      { name: "Full zoning data", included: true },
      { name: "Community Notes (read-only)", included: true },
      { name: "Natural Language Query", included: true },
      { name: "Permit checklists", included: true },
      { name: "Ordinance change alerts", included: true },
      { name: "Town comparisons (2 towns)", included: true },
      { name: "PDF exports", included: true },
    ],
    cta: "Start 14-Day Free Trial",
    highlight: true,
  },
  {
    name: "Contractor",
    monthly: 15,
    annual: 144,
    description: "Per seat · Multi-town coverage",
    features: [
      { name: "Everything in Homeowner", included: true },
      { name: "Multi-town dashboards", included: true },
      { name: "Unlimited town comparisons", included: true },
      { name: "Team management", included: true },
      { name: "Project tracking", included: true },
      { name: "Priority data updates", included: true },
      { name: "Community Notes (read & write)", included: true },
      { name: "Dedicated support", included: true },
    ],
    cta: "Start 14-Day Free Trial",
    highlight: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [seats, setSeats] = useState(3);

  return (
    <AppLayout contained={false}>
      <div className="container py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground mb-6">Start free. Upgrade when you need more.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${!annual ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${annual ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Annual
              <Badge variant="success" className="text-micro">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`relative ${tier.highlight ? "border-accent shadow-md" : ""}`}>
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="accentSolid" className="text-xs">Most Popular</Badge>
                </div>
              )}
              <CardContent padding="lg">
                <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{tier.description}</p>

                <div className="mb-6">
                  {tier.monthly === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">$0</span>
                      <span className="text-sm text-muted-foreground">/forever</span>
                    </div>
                  ) : tier.name === "Contractor" ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">
                          ${annual ? tier.annual : tier.monthly}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{annual ? "year" : "mo"} per seat
                        </span>
                      </div>
                      {/* Seat selector */}
                      <div className="mt-3 flex items-center gap-3 p-3 rounded bg-secondary">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Seats:</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <button onClick={() => setSeats(Math.max(1, seats - 1))} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-card">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{seats}</span>
                          <button onClick={() => setSeats(seats + 1)} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-card">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Total: <strong className="text-foreground">${annual ? tier.annual * seats : tier.monthly * seats}/{annual ? "year" : "mo"}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        ${annual ? tier.annual : tier.monthly}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{annual ? "year" : "mo"}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full mb-6 ${tier.highlight ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}
                  variant={tier.highlight ? "default" : "outline"}
                  size="sm"
                >
                  {tier.cta}
                </Button>

                <div className="space-y-2.5">
                  {tier.features.map((f) => (
                    <div key={f.name} className="flex items-center gap-2 text-xs">
                      {f.included ? (
                        <Check className="h-3.5 w-3.5 text-success flex-shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                      )}
                      <span className={f.included ? "text-foreground" : "text-muted-foreground/60"}>{f.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What happens after my free trial?", a: "You'll be downgraded to the Free plan with limited searches. No credit card required to start." },
              { q: "Can I switch plans anytime?", a: "Yes, upgrade or downgrade at any time. Changes take effect at your next billing cycle." },
              { q: "How often is zoning data updated?", a: "We update data within 30 days of any official ordinance change. Pro and Contractor plans get priority updates." },
              { q: "What towns are covered?", a: "We currently cover all 70 municipalities in Bergen County, NJ. More counties coming soon." },
              { q: "Is my data secure?", a: "Yes. We use industry-standard encryption and never share your personal information with third parties." },
            ].map((faq) => (
              <Card key={faq.q}>
                <CardContent padding="sm">
                  <h3 className="font-semibold text-sm mb-1">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Questions? Contact us at <a href="mailto:support@towncenter.io" className="text-accent hover:underline">support@towncenter.io</a>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
