import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Layers, MapPin, ArrowRight, Map, Gavel, ThumbsUp, CheckCircle, Share2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SuggestCorrectionDialog } from "@/components/SuggestCorrectionDialog";
import { toast } from "sonner";

const stats = [
  { label: "Population", value: "26,342", icon: Users },
  { label: "Median Home Value", value: "$580,000", icon: DollarSign },
  { label: "Zoning Districts", value: "11", icon: Layers },
  { label: "Total Area", value: "10.5 sq mi", icon: MapPin },
];

const nearbyTowns = [
  { name: "Ridgewood", medianHome: "$825,000", zones: 14, slug: "ridgewood" },
  { name: "Fair Lawn", medianHome: "$490,000", zones: 15 },
  { name: "Rochelle Park", medianHome: "$410,000", zones: 7 },
  { name: "River Edge", medianHome: "$455,000", zones: 9 },
];

const communityNotes = [
  { author: "Joe D.", badge: "Licensed Contractor", note: "Paramus blue laws mean no Sunday deliveries. Plan material drops for Saturday or weekdays.", upvotes: 18, date: "Jan 2026" },
  { author: "Lisa M.", badge: "Licensed Contractor", note: "The Building Dept here is actually fast — I've gotten permits back in under 2 weeks consistently.", upvotes: 11, date: "Dec 2025" },
  { author: "Carlos V.", badge: "Licensed Contractor", note: "If you're building an ADU, Paramus just adopted new regs. Much easier than Ridgewood.", upvotes: 7, date: "Jan 2026" },
];

const upcomingMeetings = [
  { board: "Zoning Board of Adjustment", date: "April 17, 2026", time: "7:30 PM", location: "Borough Hall" },
  { board: "Planning Board", date: "April 28, 2026", time: "7:30 PM", location: "Borough Hall" },
];

export default function ParamusOverview() {
  return (
    <TownProfileLayout townSlug="paramus">
      <div className="mb-6 p-3 rounded border bg-secondary/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Data sourced from Borough of Paramus Municipal Code.</strong> Last verified: January 10, 2026. Always confirm with the municipality before making decisions.
        </p>
        <SuggestCorrectionDialog townName="Paramus" />
      </div>

      {/* Action Bar */}
      <div className="flex gap-2 mb-6">
        <Link to="/compare?town1=paramus">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Compare with Another Town
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
          }}
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </Button>
      </div>

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
                <p className="text-xs text-muted-foreground">11 zoning districts · Last boundary update: June 2025</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-3">Town Character</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Borough of Paramus is one of the largest retail destinations in the United States, with major
                shopping centers along Routes 4 and 17 including Garden State Plaza and Paramus Park Mall. Despite
                its commercial prominence, Paramus maintains a strong residential character with well-established
                neighborhoods of single-family homes. The borough is unique in New Jersey for its strict blue laws
                prohibiting most retail activity on Sundays. Paramus has 11 zoning districts and has recently adopted
                progressive ADU ordinances permitting accessory dwelling units in all residential zones, making it
                one of the most ADU-friendly towns in Bergen County.
              </p>
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
                  <p className="text-sm text-muted-foreground mb-3">
                    The Paramus Board of Adjustment meets on the 1st and 3rd Thursday of each month to hear variance applications.
                  </p>
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
                    <span>Typical timeline: 4–6 weeks</span>
                    <span>·</span>
                    <span>Application fee: $200–$400</span>
                  </div>
                  <Link to="/town/paramus/contacts" className="inline-flex items-center gap-1 text-xs text-accent mt-2 hover:underline">
                    View ZBA contact details <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Notes */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Community Notes</h3>
              <p className="text-xs text-muted-foreground mb-4">Tips from verified contractors who work in Paramus.</p>
              <div className="space-y-3">
                {communityNotes.map((n, i) => (
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Upcoming Meetings */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" /> Upcoming Meetings
              </h3>
              <div className="space-y-3">
                {upcomingMeetings.map((m, i) => (
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
                {nearbyTowns.map((t) => (
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
    </TownProfileLayout>
  );
}
