import { useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Printer, Save, Phone, Clock, DollarSign, MapPin, Building, Mail, ExternalLink, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAllTowns, useTownPermits, useTownContacts } from "@/hooks/useTownData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PROJECT_TYPES = [
  { value: "deck", label: "Deck" },
  { value: "fence", label: "Fence" },
  { value: "pool", label: "Pool" },
  { value: "shed", label: "Shed" },
  { value: "addition", label: "Addition" },
  { value: "adu", label: "ADU" },
];

const STANDARD_DOCS = [
  "Property survey showing current structures and setbacks",
  "Construction plans (2 sets) — to scale, showing dimensions",
  "Material specifications",
  "Contractor license and insurance certificates",
];

export default function ChecklistPage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const townSlug = params.get("town") ?? "";
  const projectType = params.get("type") ?? "";
  const [address, setAddress] = useState(params.get("address") ?? "");

  const { data: towns = [] } = useAllTowns();
  const { data: permits = [], isLoading: loadingPermits } = useTownPermits(townSlug || undefined);
  const { data: contacts = [] } = useTownContacts(townSlug || undefined);
  const buildingContact = contacts.find((c) =>
    /build/i.test(c.dept) || /zoning/i.test(c.dept)
  ) ?? contacts[0];

  const filteredPermits = useMemo(() => {
    if (!projectType) return permits;
    const re = new RegExp(projectType, "i");
    const matched = permits.filter((p) => re.test(p.name) || re.test(p.description ?? ""));
    return matched.length > 0 ? matched : permits;
  }, [permits, projectType]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const townLabel = towns.find((t) => t.slug === townSlug)?.name ?? "";
  const typeLabel = PROJECT_TYPES.find((p) => p.value === projectType)?.label ?? "";

  const saveProject = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to save a project");
      if (!projectType) throw new Error("Choose a project type first");
      if (!address.trim()) throw new Error("Enter an address");

      const checklist = [
        ...filteredPermits.map((p) => ({ item: p.name, done: false })),
        ...STANDARD_DOCS.map((d) => ({ item: d, done: false })),
      ];

      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          town_slug: townSlug || null,
          project_type: projectType,
          address: address.trim(),
          status: "researching",
          checklist: checklist as unknown as any,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Project saved");
      navigate(`/project/${data.id}`);
    },
    onError: (e: any) => toast.error(e.message ?? "Could not save project"),
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="mb-2 bg-accent/10 text-accent border-0 text-xs">Before You Call</Badge>
            <h1 className="text-2xl font-bold text-primary mb-1">
              Permit Checklist{typeLabel ? `: ${typeLabel}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground">
              {townLabel ? `${townLabel}, NJ` : "Select a town to see local requirements"}
            </p>
          </div>
        </div>

        {/* Inputs */}
        <Card className="mb-6">
          <CardContent className="p-4 grid sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Town</Label>
              <Select value={townSlug} onValueChange={(v) => setParam("town", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select town" /></SelectTrigger>
                <SelectContent>
                  {towns.map((t) => (
                    <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Project Type</Label>
              <Select value={projectType} onValueChange={(v) => setParam("type", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Property Address</Label>
              <Input className="mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" disabled>
            <FileDown className="h-3.5 w-3.5" /> Export as PDF
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={saveProject.isPending || !user || !projectType || !address.trim()}
            onClick={() => saveProject.mutate()}
          >
            {saveProject.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save This Project
          </Button>
        </div>

        {!townSlug || !projectType ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Select a town and project type to see required permits.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Required Permits */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-4">Required Permits</h3>
                {loadingPermits ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
                ) : filteredPermits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No permit data on file for {townLabel} yet.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredPermits.map((p) => (
                      <div key={p.id} className="flex items-start gap-3 p-3 rounded border bg-secondary/20">
                        <Checkbox className="mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{p.name}</p>
                          {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                          <div className="flex gap-3 mt-1 text-[11px] text-muted-foreground">
                            {p.timeline && <span>⏱ {p.timeline}</span>}
                            {p.fee && <span>💵 {p.fee}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm mb-4">Documents to Prepare</h3>
                <div className="space-y-2">
                  {STANDARD_DOCS.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <Checkbox className="mt-0.5" />
                      <p className="text-sm text-muted-foreground">{d}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Timeline & Fees aggregated */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-4">Estimated Timeline & Fees</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Permit Timelines</p>
                        <p className="text-xs text-muted-foreground">
                          {filteredPermits.map((p) => p.timeline).filter(Boolean).join(" + ") || "Not yet recorded"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Permit Fees</p>
                        <p className="text-xs text-muted-foreground">
                          {filteredPermits.map((p) => p.fee).filter(Boolean).join(" + ") || "Not yet recorded"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Municipal Contact */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-4">Municipal Contact</h3>
                  {!buildingContact ? (
                    <p className="text-xs text-muted-foreground">No contact recorded for {townLabel} yet.</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{buildingContact.dept}</p>
                          {townLabel && <p className="text-xs text-muted-foreground">{townLabel}</p>}
                        </div>
                      </div>
                      {buildingContact.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{buildingContact.phone}</p>
                            {buildingContact.hours && <p className="text-xs text-muted-foreground">{buildingContact.hours}</p>}
                          </div>
                        </div>
                      )}
                      {buildingContact.address && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{buildingContact.address}</p>
                        </div>
                      )}
                      {buildingContact.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${buildingContact.email}`} className="text-xs text-accent hover:underline">{buildingContact.email}</a>
                        </div>
                      )}
                      {buildingContact.website && (
                        <div className="flex items-center gap-3">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <a href={buildingContact.website} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                            {buildingContact.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {!user && (
          <Card className="border-accent/30">
            <CardContent className="p-4 text-sm">
              <Link to="/login" className="text-accent hover:underline">Sign in</Link> to save this checklist as a project.
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
