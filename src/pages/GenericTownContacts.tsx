import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock, MapPin, ExternalLink, Calendar, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { getFullTownData } from "@/data/townData";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

export default function GenericTownContacts() {
  const { slug } = useParams<{ slug: string }>();
  const town = getFullTownData(slug || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [slug]);

  if (!town) return null;

  if (loading) {
    return (
      <TownProfileLayout townSlug={town.slug}>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}</div>
      </TownProfileLayout>
    );
  }

  return (
    <TownProfileLayout townSlug={town.slug}>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h2 className="text-lg font-bold">Municipal Contacts</h2>
          <p className="text-sm text-muted-foreground">Contact directory for {town.name} municipal departments and boards.</p>
        </div>
        <div className="space-y-4">
          {town.departments.map((dept) => (
            <Card key={dept.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-base mb-1">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                  </div>
                  {dept.portalUrl && (
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 flex-shrink-0">
                      <ExternalLink className="h-3 w-3" /> {dept.portalLabel || "Website"}
                    </Button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{dept.phone}</span></div>
                    <div className="flex items-center gap-2.5 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><a href={`mailto:${dept.email}`} className="text-accent hover:underline">{dept.email}</a></div>
                    <div className="flex items-center gap-2.5 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /><span>{dept.hours}</span></div>
                    <div className="flex items-center gap-2.5 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{dept.address}</span></div>
                  </div>
                  <div className="space-y-3">
                    {dept.meetings && <div className="flex items-start gap-2.5 text-sm"><Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><div><p className="font-medium">Meeting Schedule</p><p className="text-muted-foreground text-xs">{dept.meetings}</p></div></div>}
                    {dept.deadlines && <div className="flex items-start gap-2.5 text-sm"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><div><p className="font-medium">Application Deadlines</p><p className="text-muted-foreground text-xs">{dept.deadlines}</p></div></div>}
                    {dept.contact && <div className="flex items-start gap-2.5 text-sm"><Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><div><p className="font-medium">Contact Person</p><p className="text-muted-foreground text-xs">{dept.contact}</p></div></div>}
                    {dept.website && <div className="flex items-start gap-2.5 text-sm"><ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><a href={dept.website} className="text-accent hover:underline text-xs">{dept.website}</a></div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> Upcoming Meetings</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {town.upcomingMeetings.map((m, i) => (
                <div key={i} className="p-3 rounded border bg-secondary/20">
                  <p className="text-sm font-semibold">{m.board}</p>
                  <p className="text-xs text-muted-foreground">{m.date} · {m.time}</p>
                  <p className="text-xs text-muted-foreground">{m.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">Official Links</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {town.officialLinks.map((link) => (
                <a key={link.label} href={link.url} className="flex items-center gap-2 p-2.5 rounded border text-sm hover:bg-secondary/50 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5 text-accent flex-shrink-0" /><span>{link.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TownProfileLayout>
  );
}
