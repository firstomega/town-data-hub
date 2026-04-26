import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Users, MapPin, Plus, Minus } from "lucide-react";
import { useState } from "react";

type FeatureRow = { name: string; included: boolean };
type Tier =
  | {
      kind: "free";
      name: string;
      description: string;
      features: FeatureRow[];
      cta: string;
      highlight: boolean;
    }
  | {
      kind: "one-time";
      name: string;
      price: number;
      description: string;
      features: FeatureRow[];
      cta: string;
      highlight: boolean;
    }
  | {
      kind: "subscription";
      name: string;
      monthly: number;
      annual: number;
      stateAddOnMonthly: number;
      stateAddOnAnnual: number;
      description: string;
      features: FeatureRow[];
      cta: string;
      highlight: boolean;
    };

const tiers: Tier[] = [
  {
    kind: "free",
    name: "Free",
    description: "Browse zoning basics",
    features: [
      { name: "Browse all 70 Bergen towns", included: true },
      { name: "Basic zoning data", included: true },
      { name: "Community Notes (read-only)", included: true },
      { name: "Custom permit checklist", included: false },
      { name: "PDF exports", included: false },
      { name: "Multi-town dashboards", included: false },
      { name: "Community Notes (write)", included: false },
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    kind: "one-time",
    name: "Project Pack",
    price: 19,
    description: "One project, one address",
    features: [
      { name: "Custom permit checklist", included: true },
      { name: "Applicable zoning rules", included: true },
      { name: "PDF export", included: true },
      { name: "30-day access to your project", included: true },
      { name: "Upgrade credit toward Contractor", included: true },
      { name: "Multi-town dashboards", included: false },
      { name: "Recurring access", included: false },
    ],
    cta: "Buy Project Pack",
    highlight: false,
  },
  {
    kind: "subscription",
    name: "Contractor",
    monthly: 29,
    annual: 278,
    stateAddOnMonthly: 15,
    stateAddOnAnnual: 144,
    description: "Per seat · All towns in one state",
    features: [
      { name: "Everything in Project Pack", included: true },
      { name: "All towns in one state", included: true },
      { name: "Multi-town dashboards", included: true },
      { name: "Unlimited town comparisons", included: true },
      { name: "Team management", included: true },
      { name: "Project tracking", included: true },
      { name: "Priority data updates", included: true },
      { name: "Community Notes (read & write)", included: true },
    ],
    cta: "Start Contractor",
    highlight: true,
  },
];

type Cell = boolean | string;
type ComparisonRow = { feature: string; free: Cell; projectPack: Cell; contractor: Cell };

const comparisonMatrix: ComparisonRow[] = [
  { feature: "Browse all 70 Bergen towns", free: true, projectPack: true, contractor: true },
  { feature: "Basic zoning data", free: true, projectPack: true, contractor: true },
  { feature: "Custom permit checklist", free: false, projectPack: "1 project", contractor: "Unlimited" },
  { feature: "Applicable zoning lookup", free: false, projectPack: "1 address", contractor: "Unlimited" },
  { feature: "PDF export", free: false, projectPack: true, contractor: true },
  { feature: "Town coverage", free: "Browse only", projectPack: "1 address", contractor: "All in 1 state" },
  { feature: "Add additional states", free: false, projectPack: false, contractor: "+$15/seat/mo each" },
  { feature: "Multi-town dashboards", free: false, projectPack: false, contractor: true },
  { feature: "Town comparisons", free: false, projectPack: false, contractor: "Unlimited" },
  { feature: "Team management", free: false, projectPack: false, contractor: true },
  { feature: "Project tracking", free: false, projectPack: false, contractor: true },
  { feature: "Priority data updates", free: false, projectPack: false, contractor: true },
  { feature: "Community Notes (read)", free: true, projectPack: true, contractor: true },
  { feature: "Community Notes (write)", free: false, projectPack: false, contractor: true },
  { feature: "Access duration", free: "Ongoing", projectPack: "30 days", contractor: "Active subscription" },
];

function Cell({ value }: { value: Cell }) {
  if (value === true) return <Check className="h-3.5 w-3.5 text-success mx-auto" />;
  if (value === false) return <X className="h-3.5 w-3.5 text-muted-foreground/40 mx-auto" />;
  return <span className="text-xs text-foreground">{value}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [seats, setSeats] = useState(3);
  const [states, setStates] = useState(1);

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
          <p className="text-xs text-muted-foreground mt-3">Billing toggle applies to Contractor only.</p>
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
                  {tier.kind === "free" && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">$0</span>
                      <span className="text-sm text-muted-foreground">/forever</span>
                    </div>
                  )}

                  {tier.kind === "one-time" && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-sm text-muted-foreground">one-time</span>
                    </div>
                  )}

                  {tier.kind === "subscription" && (
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
                        <span className="text-xs text-muted-foreground">Seats</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <button onClick={() => setSeats(Math.max(1, seats - 1))} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-card" aria-label="Decrease seats">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{seats}</span>
                          <button onClick={() => setSeats(seats + 1)} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-card" aria-label="Increase seats">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* States selector */}
                      <div className="mt-2 flex items-center gap-3 p-3 rounded bg-secondary">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">States</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <button onClick={() => setStates(Math.max(1, states - 1))} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-card" aria-label="Decrease states">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{states}</span>
                          <button onClick={() => setStates(states + 1)} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-card" aria-label="Increase states">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {(() => {
                        const base = annual ? tier.annual : tier.monthly;
                        const addOn = annual ? tier.stateAddOnAnnual : tier.stateAddOnMonthly;
                        const perSeat = base + Math.max(0, states - 1) * addOn;
                        const total = perSeat * seats;
                        const period = annual ? "year" : "mo";
                        return (
                          <p className="text-xs text-muted-foreground mt-2">
                            Total: <strong className="text-foreground">${total}/{period}</strong>
                            {states > 1 && (
                              <span className="block text-micro mt-1">
                                Includes {states - 1} additional state{states - 1 === 1 ? "" : "s"} at ${addOn}/seat/{period}.
                              </span>
                            )}
                          </p>
                        );
                      })()}
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

        {/* Comparison matrix */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-center mb-6">Compare features</h2>
          <Card>
            <CardContent padding="md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-semibold py-2 pr-4">Feature</th>
                      <th className="text-center font-semibold py-2 px-2">Free</th>
                      <th className="text-center font-semibold py-2 px-2">Project Pack</th>
                      <th className="text-center font-semibold py-2 pl-2">Contractor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonMatrix.map((row, idx) => (
                      <tr key={row.feature} className={idx < comparisonMatrix.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="py-2 pr-4 text-foreground">{row.feature}</td>
                        <td className="py-2 px-2 text-center"><Cell value={row.free} /></td>
                        <td className="py-2 px-2 text-center"><Cell value={row.projectPack} /></td>
                        <td className="py-2 pl-2 text-center"><Cell value={row.contractor} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What's a Project Pack?", a: "A $19 one-time purchase covering a custom permit checklist, applicable zoning, and PDF export for one project at one address. No subscription, no recurring billing." },
              { q: "Can I upgrade my Project Pack to Contractor later?", a: "Yes — the $19 you paid is credited toward your first Contractor month." },
              { q: "How does multi-state coverage work?", a: "Contractor includes all towns in one state. Each additional state is $15/seat/mo (or the annual equivalent). Use the States selector on the Contractor card to model your team's coverage." },
              { q: "Can I switch plans anytime?", a: "Yes, upgrade or downgrade at any time. Changes take effect at your next billing cycle." },
              { q: "How often is zoning data updated?", a: "We update data within 30 days of any official ordinance change. Contractor plans get priority updates." },
              { q: "What towns are covered?", a: "We currently cover all 70 municipalities in Bergen County, NJ, expanding statewide and into the tri-state area." },
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
