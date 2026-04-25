import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Home, MapPin, Phone, Calendar, Bell, ListChecks, GitCompare, Search, Loader2, ArrowRight, Check, Volume2, Trees, Fence, Waves, Car, Dog, ChevronRight } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";

// Map ordinance category → friendly label + icon. Matches lower-cased values from the ingestion pipeline.
const QOL_CATEGORIES: { key: string; label: string; icon: React.ElementType; match: (c: string) => boolean }[] = [
  { key: "noise", label: "Noise", icon: Volume2, match: (c) => /noise|quiet/.test(c) },
  { key: "lawn", label: "Lawn & Yard", icon: Trees, match: (c) => /lawn|leaf|landscap|yard/.test(c) },
  { key: "fence", label: "Fences", icon: Fence, match: (c) => /fence/.test(c) },
  { key: "pool", label: "Pools & Sheds", icon: Waves, match: (c) => /pool|shed|accessor/.test(c) },
  { key: "parking", label: "Parking", icon: Car, match: (c) => /parking|vehicle/.test(c) },
  { key: "pets", label: "Pets", icon: Dog, match: (c) => /pet|dog|animal/.test(c) },
];

const SERVICE_DEPTS = [
  { key: "police", label: "Police (non-emergency)", match: (d: string) => /police/i.test(d) },
  { key: "fire", label: "Fire department", match: (d: string) => /fire/i.test(d) },
  { key: "dpw", label: "Public Works / Sanitation", match: (d: string) => /public works|dpw|sanitation|recycl|garbage/i.test(d) },
  { key: "town_hall", label: "Town Hall", match: (d: string) => /town hall|borough hall|clerk|administrat/i.test(d) },
  { key: "building", label: "Building / Permits", match: (d: string) => /build|permit|construction|zoning/i.test(d) },
];

export default function HomeownerDashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";
  const homeSlug = profile?.primary_town_slug ?? null;

  const { data: town } = useQuery({
    queryKey: ["home-town", homeSlug],
    enabled: !!homeSlug,
    queryFn: async () => {
      const { data, error } = await supabase.from("towns").select("*").eq("slug", homeSlug!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: zone } = useQuery({
    queryKey: ["home-zone", homeSlug, profile?.primary_zone_code],
    enabled: !!homeSlug && !!profile?.primary_zone_code,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones")
        .select("*")
        .eq("town_slug", homeSlug!)
        .eq("code", profile!.primary_zone_code!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["home-contacts", homeSlug],
    enabled: !!homeSlug,
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*").eq("town_slug", homeSlug!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: ordinances = [] } = useQuery({
    queryKey: ["home-ordinances", homeSlug],
    enabled: !!homeSlug,
    queryFn: async () => {
      const { data, error } = await supabase.from("ordinances").select("id, code, title, summary, category").eq("town_slug", homeSlug!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["home-events", homeSlug],
    enabled: !!homeSlug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("civic_events")
        .select("id, title, kind, starts_at, location, source_url")
        .eq("town_slug", homeSlug!)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ["home-alerts", homeSlug],
    enabled: !!homeSlug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_drifts")
        .select("id, town_slug, detected_at, diff_summary, change_type, table_name")
        .eq("town_slug", homeSlug!)
        .eq("status", "applied")
        .order("detected_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Group services by best-match dept
  const services = useMemo(() => {
    return SERVICE_DEPTS.map((s) => ({
      ...s,
      contact: contacts.find((c: any) => s.match(c.dept ?? "")),
    }));
  }, [contacts]);

  // Group quality-of-life ordinances
  const qol = useMemo(() => {
    return QOL_CATEGORIES.map((cat) => {
      const items = ordinances.filter((o: any) => o.category && cat.match(String(o.category).toLowerCase()));
      return { ...cat, items };
    }).filter((c) => c.items.length > 0);
  }, [ordinances]);

  // No primary home set yet → onboarding nudge
  if (!profileLoading && !profile?.primary_town_slug) {
    return (
      <AppLayout showSearch contained={false} mainClassName="items-center justify-center">
        <div className="flex-1 flex items-center justify-center p-6 w-full">
          <Card className="max-w-md w-full">
            <CardContent padding="xl" className="text-center">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Home className="h-6 w-6 text-accent" />
              </div>
              <h1 className="text-xl font-bold text-primary mb-2">Welcome, {firstName}</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Set your home address so we can show you the rules, services, and meetings that affect your property.
              </p>
              <Link to="/onboarding">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11">
                  Set my home <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showSearch contained={false}>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero: your home */}
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Welcome back, {firstName}</h1>
            <Link to="/settings"><Button variant="ghost" size="sm" className="text-xs">Edit home</Button></Link>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Everything below is specific to your home.</p>

          <Card className="mb-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent padding="md">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Home className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Home</p>
                    <p className="text-base font-semibold truncate">{profile?.primary_address ?? "Address not set"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {town?.name ?? profile?.primary_town_slug} · {town?.county ?? ""} County
                      {profile?.primary_zone_code ? ` · Zone ${profile.primary_zone_code}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/town/${homeSlug}`}>
                    <Button variant="outline" size="sm" className="text-xs">Town profile</Button>
                  </Link>
                  <Link to="/feasibility">
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs">
                      Check a project
                    </Button>
                  </Link>
                </div>
              </div>

              {zone && (
                <div className="mt-4 pt-4 border-t border-accent/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <Stat label="Front setback" value={zone.setback_front} />
                  <Stat label="Side setback" value={zone.setback_side} />
                  <Stat label="Max height" value={zone.max_height} />
                  <Stat label="Max coverage" value={zone.max_coverage} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <QuickAction to="/search" icon={Search} title="Look up an address" subtitle="Friend or family's town" />
              <QuickAction to="/checklist" icon={ListChecks} title="Permit checklist" subtitle="For your next project" />
              <QuickAction to="/compare" icon={GitCompare} title="Compare towns" subtitle="If you're shopping for a home" />
            </div>
          </section>

          {/* Alerts for your address */}
          {alerts.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Updates for your home</h2>
                <Badge variant="secondary" className="text-xs">{alerts.length}</Badge>
              </div>
              <div className="space-y-2">
                {alerts.map((a: any) => (
                  <Card key={a.id}>
                    <CardContent padding="xs" className="flex items-start gap-3">
                      <Bell className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{a.diff_summary ?? `${a.table_name} updated`}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(a.detected_at), { addSuffix: true })} · {a.change_type}
                        </p>
                      </div>
                      <Link to={`/town/${a.town_slug}/${a.table_name === "ordinances" ? "ordinances" : a.table_name === "zones" ? "zoning" : a.table_name === "permits" ? "permits" : "contacts"}`}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Local services */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Local services</h2>
              <Link to={`/town/${homeSlug}/contacts`}>
                <Button variant="ghost" size="sm" className="text-xs text-accent">View all</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <Card key={s.key}>
                  <CardContent padding="sm">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    {s.contact ? (
                      <>
                        <p className="text-sm font-semibold">{s.contact.dept}</p>
                        {s.contact.phone && (
                          <a href={`tel:${s.contact.phone}`} className="text-sm text-accent hover:underline flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" /> {s.contact.phone}
                          </a>
                        )}
                        {s.contact.hours && <p className="text-xs text-muted-foreground mt-1">{s.contact.hours}</p>}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Not on file yet</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quality-of-life rules */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Quality-of-life rules</h2>
              <Link to={`/town/${homeSlug}/ordinances`}>
                <Button variant="ghost" size="sm" className="text-xs text-accent">All ordinances</Button>
              </Link>
            </div>
            {qol.length === 0 ? (
              <Card><CardContent padding="lg" className="text-center text-sm text-muted-foreground">
                No categorized ordinances on file for {town?.name ?? "your town"} yet. Check back as we ingest more data.
              </CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {qol.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Card key={cat.key}>
                      <CardContent padding="sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4 text-accent" />
                          <p className="text-sm font-semibold">{cat.label}</p>
                          <Badge variant="secondary" className="text-micro ml-auto">{cat.items.length}</Badge>
                        </div>
                        <ul className="space-y-1">
                          {cat.items.slice(0, 3).map((o: any) => (
                            <li key={o.id} className="text-xs text-muted-foreground line-clamp-1">
                              <span className="font-medium text-foreground">{o.code ? `§${o.code} ` : ""}</span>
                              {o.title}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Civic calendar */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Upcoming meetings</h2>
            </div>
            {events.length === 0 ? (
              <Card><CardContent padding="lg" className="text-center text-sm text-muted-foreground">
                No upcoming meetings on file. We're working on syncing each town's calendar.
              </CardContent></Card>
            ) : (
              <div className="space-y-2">
                {events.map((e: any) => (
                  <Card key={e.id}>
                    <CardContent padding="xs" className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded bg-secondary text-center flex-shrink-0">
                        <span className="text-micro uppercase text-muted-foreground">{format(new Date(e.starts_at), "MMM")}</span>
                        <span className="text-base font-bold">{format(new Date(e.starts_at), "d")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {format(new Date(e.starts_at), "EEE, h:mm a")}
                          {e.location ? ` · ${e.location}` : ""}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-micro capitalize">{e.kind}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-micro uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, subtitle }: { to: string; icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <Link to={to}>
      <Card className="hover:shadow-md transition-shadow hover:border-accent/30">
        <CardContent padding="sm" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}