import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Clock, MapPin, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTown, useTownContacts } from "@/hooks/useTownData";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";
import { DataProvenance } from "@/components/DataProvenance";

export default function GenericTownContacts() {
  const { slug } = useParams<{ slug: string }>();
  const { data: town } = useTown(slug);
  const { data: contacts, isLoading } = useTownContacts(slug);

  if (isLoading) {
    return (
      <TownProfileLayout townSlug={slug}>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}</div>
      </TownProfileLayout>
    );
  }

  const list = contacts ?? [];

  return (
    <TownProfileLayout townSlug={slug}>
      <div className="animate-fade-in">
        {town && <PlaceholderBanner townName={town.name} status={(town.data_status as "partial" | "placeholder") ?? "placeholder"} />}
        <div className="mb-6">
          <h2 className="text-lg font-bold">Municipal Contacts</h2>
          <p className="text-sm text-muted-foreground">Contact directory for {town?.name ?? "this town"} municipal departments and boards.</p>
        </div>
        <div className="space-y-4">
          {list.length === 0 && (
            <Card><CardContent padding="xl" className="text-center text-sm text-muted-foreground">No contacts have been verified yet for this town.</CardContent></Card>
          )}
          {list.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardContent padding="md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-base mb-1">{dept.dept}</h3>
                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                  </div>
                  {dept.website && (
                    <a href={dept.website} target="_blank" rel="noopener noreferrer" className="text-xs gap-1.5 flex items-center text-accent hover:underline">
                      <ExternalLink className="h-3 w-3" /> Website
                    </a>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {dept.phone && <div className="flex items-center gap-2.5 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{dept.phone}</span></div>}
                    {dept.email && <div className="flex items-center gap-2.5 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><a href={`mailto:${dept.email}`} className="text-accent hover:underline">{dept.email}</a></div>}
                    {dept.hours && <div className="flex items-center gap-2.5 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /><span>{dept.hours}</span></div>}
                    {dept.address && <div className="flex items-center gap-2.5 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{dept.address}</span></div>}
                  </div>
                  <div className="space-y-3">
                    {dept.meetings && <div className="flex items-start gap-2.5 text-sm"><Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /><div><p className="font-medium">Meeting Schedule</p><p className="text-muted-foreground text-xs">{dept.meetings}</p></div></div>}
                  </div>
                </div>
                <DataProvenance confidence={dept.confidence as "verified" | "ai_extracted" | "placeholder"} sourceDoc={dept.source_doc} sourceUrl={dept.source_url} lastVerifiedAt={dept.last_verified_at} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TownProfileLayout>
  );
}
