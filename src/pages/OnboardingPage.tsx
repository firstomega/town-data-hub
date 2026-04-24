import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAllTowns } from "@/hooks/useTownData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: towns = [], isLoading } = useAllTowns();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleTown = (slug: string) => {
    setSelectedTowns((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (selectedTowns.length === 0) {
      setStep(2);
      return;
    }
    setSaving(true);
    try {
      const rows = selectedTowns.map((town_slug) => ({ user_id: user.id, town_slug }));
      const { error } = await supabase.from("saved_towns").upsert(rows, {
        onConflict: "user_id,town_slug",
        ignoreDuplicates: true,
      });
      if (error) throw error;
      toast.success(`Saved ${selectedTowns.length} town${selectedTowns.length > 1 ? "s" : ""}`);
      setStep(2);
    } catch (e: any) {
      toast.error(e.message ?? "Could not save towns");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-accent" : "bg-secondary"}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-accent" : "bg-secondary"}`} />
            </div>

            {step === 1 && (
              <div>
                <div className="text-center mb-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-1">Pick the towns you care about</h2>
                  <p className="text-sm text-muted-foreground">We'll keep you updated when their rules change.</p>
                </div>

                <div className="mb-3">
                  <Input
                    placeholder="Optional: your home address (we'll match it to a town later)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : towns.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No towns available yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-6 max-h-48 overflow-y-auto">
                    {towns.map((town) => {
                      const selected = selectedTowns.includes(town.slug);
                      return (
                        <button
                          key={town.slug}
                          onClick={() => toggleTown(town.slug)}
                          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                            selected
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-secondary text-muted-foreground border-transparent hover:text-foreground"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3 inline mr-1" />}
                          {town.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mb-4">
                  {selectedTowns.length} town{selectedTowns.length === 1 ? "" : "s"} selected
                </p>
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Link to="/dashboard">
                  <Button variant="ghost" className="w-full mt-2 text-muted-foreground text-sm">
                    Skip for now
                  </Button>
                </Link>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-success" />
                </div>
                <h2 className="text-xl font-bold text-primary mb-2">You're all set!</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedTowns.length > 0
                    ? `We'll keep you updated on ${selectedTowns.length} town${selectedTowns.length > 1 ? "s" : ""}.`
                    : "You can add towns from your dashboard anytime."}
                </p>
                <Link to="/dashboard">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11">
                    Go to My Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
