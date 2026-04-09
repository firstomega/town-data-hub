import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Bell, MapPin, Trash2, ExternalLink } from "lucide-react";

const savedTowns = [
  { name: "Ridgewood", addedDate: "Dec 15, 2025" },
  { name: "Paramus", addedDate: "Dec 20, 2025" },
  { name: "Glen Rock", addedDate: "Jan 5, 2026" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-2xl flex-1">
        <h1 className="text-2xl font-bold text-primary mb-1">Account Settings</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your profile, subscription, and preferences.</p>

        {/* Profile */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">Profile</h2>
            </div>
            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Full Name</Label>
                  <Input defaultValue="John Doe" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input defaultValue="john@example.com" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Account Type</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary">Homeowner</Badge>
                  <span className="text-xs text-muted-foreground">
                    <button className="text-accent hover:underline">Switch to Contractor</button>
                  </span>
                </div>
              </div>
              <Button size="sm" className="w-fit bg-accent hover:bg-accent/90 text-accent-foreground">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">Subscription</h2>
            </div>
            <div className="p-4 rounded bg-secondary/50 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">Homeowner Plan</p>
                  <p className="text-xs text-muted-foreground">$29/year · Billed annually</p>
                </div>
                <Badge className="bg-success/10 text-success border-0 text-xs">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Next billing date: December 15, 2026</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">Upgrade to Contractor</Button>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                Manage Billing <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Ordinance Change Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when saved towns update their ordinances</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div>
                <Label className="text-xs mb-1.5 block">Digest Frequency</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Towns */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">Saved Towns</h2>
            </div>
            <div className="space-y-2">
              {savedTowns.map((t) => (
                <div key={t.name} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">Added {t.addedDate}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <h2 className="font-semibold text-sm text-destructive">Delete Account</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="outline" size="sm" className="text-xs text-destructive border-destructive/30 hover:bg-destructive/5">
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
