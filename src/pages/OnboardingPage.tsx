import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const bergenTowns = [
  "Ridgewood", "Paramus", "Hackensack", "Fort Lee", "Teaneck", "Englewood",
  "Glen Rock", "Fair Lawn", "Wyckoff", "Mahwah", "Ramsey", "Saddle River",
  "Ho-Ho-Kus", "Midland Park", "Waldwick", "Allendale", "Upper Saddle River",
  "Woodcliff Lake", "Hillsdale", "River Vale",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [userType] = useState<"homeowner" | "contractor">("homeowner");
  const [address, setAddress] = useState("");
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);

  const toggleTown = (town: string) => {
    setSelectedTowns((prev) =>
      prev.includes(town) ? prev.filter((t) => t !== town) : [...prev, town]
    );
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

            {step === 1 && userType === "homeowner" && (
              <div>
                <div className="text-center mb-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-1">What's your address?</h2>
                  <p className="text-sm text-muted-foreground">We'll find your town and zone automatically.</p>
                </div>
                <Input
                  placeholder="Enter your home address…"
                  className="h-12 mb-4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11"
                  onClick={() => setStep(2)}
                >
                  Find My Zone <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Link to="/dashboard">
                  <Button variant="ghost" className="w-full mt-2 text-muted-foreground text-sm">
                    Skip for now
                  </Button>
                </Link>
              </div>
            )}

            {step === 1 && userType === "contractor" && (
              <div>
                <div className="text-center mb-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-1">What towns do you work in?</h2>
                  <p className="text-sm text-muted-foreground">Select the Bergen County towns in your service area.</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-6 max-h-48 overflow-y-auto">
                  {bergenTowns.map((town) => (
                    <button
                      key={town}
                      onClick={() => toggleTown(town)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                        selectedTowns.includes(town)
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-secondary text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                    >
                      {selectedTowns.includes(town) && <Check className="h-3 w-3 inline mr-1" />}
                      {town}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {selectedTowns.length} towns selected
                </p>
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11"
                  onClick={() => setStep(2)}
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Link to="/contractor">
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
                <p className="text-sm text-muted-foreground mb-2">
                  We found your property:
                </p>
                <Card className="mb-6 text-left">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="font-semibold text-sm">
                        {address || "123 Oak St, Ridgewood, NJ 07450"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs mt-3">
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-muted-foreground">Town</p>
                        <p className="font-semibold">Ridgewood</p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-muted-foreground">Zone</p>
                        <p className="font-semibold">R-2</p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-muted-foreground">Lot Size</p>
                        <p className="font-semibold">10,200 sq ft</p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-muted-foreground">Max Coverage</p>
                        <p className="font-semibold">30%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
