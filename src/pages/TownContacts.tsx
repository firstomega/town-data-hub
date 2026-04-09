import { TownProfileLayout } from "@/components/TownProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock, MapPin, ExternalLink, Calendar, Users } from "lucide-react";

const departments = [
  {
    name: "Building Department",
    description: "Handles building permits, inspections, and code enforcement.",
    phone: "(201) 670-5500 ext. 215",
    email: "building@ridgewoodnj.net",
    hours: "Mon–Fri 8:30 AM – 4:30 PM",
    address: "131 N Maple Ave, Ridgewood, NJ 07450",
    website: "https://www.ridgewoodnj.net/building",
    portalLabel: "Online Permit Portal",
    portalUrl: "#",
  },
  {
    name: "Zoning Board of Adjustment",
    description: "Reviews variance applications and use interpretations.",
    phone: "(201) 670-5500 ext. 220",
    email: "zoning@ridgewoodnj.net",
    hours: "By appointment",
    address: "131 N Maple Ave, Ridgewood, NJ 07450",
    meetings: "2nd & 4th Tuesday of each month, 7:30 PM",
    deadlines: "Applications due 30 days before meeting",
    contact: "Jane Martinez, Board Secretary",
  },
  {
    name: "Planning Board",
    description: "Reviews site plans, subdivisions, and master plan amendments.",
    phone: "(201) 670-5500 ext. 222",
    email: "planning@ridgewoodnj.net",
    hours: "By appointment",
    address: "131 N Maple Ave, Ridgewood, NJ 07450",
    meetings: "1st & 3rd Wednesday of each month, 7:30 PM",
    contact: "Robert Chen, Board Secretary",
  },
];

export default function TownContacts() {
  return (
    <TownProfileLayout>
      <div className="mb-6">
        <h2 className="text-lg font-bold">Municipal Contacts</h2>
        <p className="text-sm text-muted-foreground">Contact directory for Ridgewood municipal departments and boards.</p>
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
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a href={`mailto:${dept.email}`} className="text-accent hover:underline">{dept.email}</a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{dept.hours}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{dept.address}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {dept.meetings && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Meeting Schedule</p>
                        <p className="text-muted-foreground text-xs">{dept.meetings}</p>
                      </div>
                    </div>
                  )}
                  {dept.deadlines && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Application Deadlines</p>
                        <p className="text-muted-foreground text-xs">{dept.deadlines}</p>
                      </div>
                    </div>
                  )}
                  {dept.contact && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Contact Person</p>
                        <p className="text-muted-foreground text-xs">{dept.contact}</p>
                      </div>
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
              <p className="text-xs text-muted-foreground">April 22, 2026 · 7:30 PM</p>
              <p className="text-xs text-muted-foreground">Village Hall, 131 N Maple Ave</p>
            </div>
            <div className="p-3 rounded border bg-secondary/20">
              <p className="text-sm font-semibold">Planning Board</p>
              <p className="text-xs text-muted-foreground">April 16, 2026 · 7:30 PM</p>
              <p className="text-xs text-muted-foreground">Village Hall, 131 N Maple Ave</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Official Links */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3">Official Links</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { label: "Village of Ridgewood Official Website", url: "https://www.ridgewoodnj.net" },
              { label: "Online Permit Portal", url: "#" },
              { label: "Meeting Agendas & Minutes", url: "#" },
              { label: "Municipal Code (eCode360)", url: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="flex items-center gap-2 p-2.5 rounded border text-sm hover:bg-secondary/50 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </TownProfileLayout>
  );
}
