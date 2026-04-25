import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Trash2, Loader2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAllTowns } from "@/hooks/useTownData";
import { LoadingState } from "@/components/states/LoadingState";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const userId = user?.id;

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, user_type, primary_address, primary_town_slug, primary_zone_code")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: allTowns = [] } = useAllTowns();

  const { data: savedTowns = [], isLoading: loadingTowns } = useQuery({
    queryKey: ["settings", "saved-towns", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_towns")
        .select("id, created_at, town_slug, towns(name)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [fullName, setFullName] = useState("");
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile?.full_name]);

  const [homeAddress, setHomeAddress] = useState("");
  const [homeSlug, setHomeSlug] = useState("");
  useEffect(() => {
    setHomeAddress(profile?.primary_address ?? "");
    setHomeSlug(profile?.primary_town_slug ?? "");
  }, [profile?.primary_address, profile?.primary_town_slug]);

  const saveHome = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ primary_address: homeAddress || null, primary_town_slug: homeSlug || null })
        .eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Home updated");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not save home"),
  });

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["profile", userId] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not save profile"),
  });

  const removeTown = useMutation({
    mutationFn: async (rowId: string) => {
      const { error } = await supabase.from("saved_towns").delete().eq("id", rowId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Town removed");
      qc.invalidateQueries({ queryKey: ["settings", "saved-towns", userId] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not remove town"),
  });

  const handleDeleteAccount = async () => {
    if (!confirm("Permanently delete your account? Your projects and saved towns will be removed.")) return;
    // Best-effort cleanup of user-owned rows the client can delete via RLS.
    await supabase.from("saved_towns").delete().eq("user_id", userId!);
    await supabase.from("projects").delete().eq("user_id", userId!);
    toast.message("Your data has been removed. Sign in again to fully delete the account, or contact support.", { duration: 6000 });
    await signOut();
    navigate("/");
  };

  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-primary mb-1">Account Settings</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your profile and saved towns.</p>

        {/* Profile */}
        <Card className="mb-6">
          <CardContent padding="md">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">Profile</h2>
            </div>
            {loadingProfile ? (
              <LoadingState size="sm" />
            ) : (
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input value={user?.email ?? ""} disabled className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Account Type</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="capitalize">{profile?.user_type ?? "homeowner"}</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-fit bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => saveProfile.mutate()}
                  disabled={saveProfile.isPending}
                >
                  {saveProfile.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Home */}
        <Card className="mb-6">
          <CardContent padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">Your Home</h2>
            </div>
            <div className="grid gap-4">
              <div>
                <Label className="text-xs">Street address</Label>
                <Input
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="123 Main St"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs">Town</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto">
                  {allTowns.map((t) => {
                    const selected = homeSlug === t.slug;
                    return (
                      <button
                        key={t.slug}
                        onClick={() => setHomeSlug(t.slug)}
                        className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                          selected
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-secondary text-muted-foreground border-transparent hover:text-foreground"
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Button
                size="sm"
                className="w-fit bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => saveHome.mutate()}
                disabled={saveHome.isPending}
              >
                {saveHome.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : null}
                Save Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Towns */}
        <Card className="mb-6">
          <CardContent padding="md">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-sm">Saved Towns</h2>
            </div>
            {loadingTowns ? (
              <LoadingState size="sm" />
            ) : savedTowns.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't saved any towns yet.</p>
            ) : (
              <div className="space-y-2">
                {savedTowns.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded border">
                    <div>
                      <p className="text-sm font-medium">{t.towns?.name ?? t.town_slug}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive"
                      onClick={() => removeTown.mutate(t.id)}
                      disabled={removeTown.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardContent padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <h2 className="font-semibold text-sm text-destructive">Delete Account</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Removes your projects and saved towns. To fully delete your auth record, contact support.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={handleDeleteAccount}
            >
              Delete My Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
