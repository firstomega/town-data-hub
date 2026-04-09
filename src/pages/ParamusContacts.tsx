import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock, MapPin, ExternalLink, Calendar, Users } from "lucide-react";

const departments = [
  {
    name: "Building Department",
    description: "Handles building permits, inspections, and code enforcement.",
    phone: "(201) 265-2100 ext. 305",
    email: "building@paramusborough.org",
    hours: "Mon–Fri 8:00 AM – 4:00 PM",
    address: "1 Jockish Square, Paramus, NJ 07652",
    website: "https://www.paramusborough.org/building",
    portalLabel: "Online Permit Portal", portalUrl: "#",
  },
  {
    name: "Zoning Board of Adjustment",
    description: "Reviews variance applications and use interpretations.",
    phone: "(201) 265-2100 ext. 310",
    email: "zoning@paramusborough.org",
    hours: "By appointment",
    address: "1 Jockish Square, Paramus, NJ 07652",
    meetings: "1st & 3rd Thursday of each month, 7:30 PM",
    deadlines: "Applications due 21 days before meeting",
    contact: "Maria Rodriguez, Board Secretary",
  },
  {
    name: "Planning Board",
    description: "Reviews site plans, subdivisions, and master plan amendments.",
    phone: "(201) 265-2100 ext. 312",
    email: "planning@paramusborough.org",
    hours: "By appointment",
    address: "1 Jockish Square, Paramus, NJ 07652",
    meetings: "2nd & 4th Tuesday of each month, 7:30 PM",
    contact: "David Park, Board Secretary",
  },
];

export default function ParamusContacts() {
  return (
    <TownProfileLayout townSlug="paramus">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Municipal Contacts</h2>
        <p className="text-sm text-muted-foreground">Contact directory for Paramus municipal departments and boards.</p>
      </div>
      <div className="space-y-4">
        {departments.map((dept) => (
          <Card key={dept.name}>
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
                  {dept.meetings && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div><p className="font-medium">Meeting Schedule</p><p className="text-muted-foreground text-xs">{dept.meetings}</p></div>
                    </div>
                  )}
                  {dept.deadlines && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div><p className="font-medium">Application Deadlines</p><p className="text-muted-foreground text-xs">{dept.deadlines}</p></div>
                    </div>
                  )}
                  {dept.contact && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div><p className="font-medium">Contact Person</p><p className="text-muted-foreground text-xs">{dept.contact}</p></div>
                    </div>
                  )}
                  {dept.website && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <a href={dept.website} className="text-accent hover:underline text-xs">{dept.website}</a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Upcoming Meetings */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" /> Upcoming Meetings
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded border bg-secondary/20">
              <p className="text-sm font-semibold">Zoning Board of Adjustment</p>
              <p className="text-xs text-muted-foreground">April 17, 2026 · 7:30 PM</p>
              <p className="text-xs text-muted-foreground">Borough Hall, 1 Jockish Square</p>
            </div>
            <div className="p-3 rounded border bg-secondary/20">
              <p className="text-sm font-semibold">Planning Board</p>
              <p className="text-xs text-muted-foreground">April 28, 2026 · 7:30 PM</p>
              <p className="text-xs text-muted-foreground">Borough Hall, 1 Jockish Square</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3">Official Links</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { label: "Borough of Paramus Official Website", url: "https://www.paramusborough.org" },
              { label: "Online Permit Portal", url: "#" },
              { label: "Meeting Agendas & Minutes", url: "#" },
              { label: "Municipal Code", url: "#" },
            ].map((link) => (
              <a key={link.label} href={link.url} className="flex items-center gap-2 p-2.5 rounded border text-sm hover:bg-secondary/50 transition-colors">
                <ExternalLink className="h-3.5 w-3.5 text-accent flex-shrink-0" /><span>{link.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </TownProfileLayout>
  );
}
