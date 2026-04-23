import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be less than 72 characters");

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<"homeowner" | "contractor">("homeowner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, from, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailParse = emailSchema.safeParse(email);
    if (!emailParse.success) return toast.error(emailParse.error.issues[0].message);
    const passParse = passwordSchema.safeParse(password);
    if (!passParse.success) return toast.error(passParse.error.issues[0].message);

    setSubmitting(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: emailParse.data,
        password: passParse.data,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { user_type: userType },
        },
      });
      setSubmitting(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Welcome to TownCenter.");
      navigate("/onboarding");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailParse.data,
        password: passParse.data,
      });
      setSubmitting(false);
      if (error) return toast.error(error.message);
      navigate(from, { replace: true });
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
  };

  const handleForgotPassword = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error("Enter your email above first");
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent. Check your email.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-8 w-8 rounded bg-accent text-accent-foreground flex items-center justify-center text-sm font-black">TC</div>
                <span className="font-bold text-lg text-primary">TownCenter</span>
              </div>
              <h1 className="text-xl font-bold text-primary">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignUp ? "Start exploring zoning data for Bergen County" : "Sign in to your TownCenter account"}
              </p>
            </div>

            {/* Google Sign In */}
            <Button type="button" onClick={handleGoogle} variant="outline" className="w-full gap-2 mb-4 h-11">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1.5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={8}
                  maxLength={72}
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <Label className="text-sm mb-2 block">I am a…</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType("homeowner")}
                      className={`p-3 rounded border text-sm font-medium transition-colors ${
                        userType === "homeowner"
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      🏠 Homeowner
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("contractor")}
                      className={`p-3 rounded border text-sm font-medium transition-colors ${
                        userType === "contractor"
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      🔨 Contractor
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11"
              >
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            {!isSignUp && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                <button type="button" onClick={handleForgotPassword} className="text-accent hover:underline">
                  Forgot password?
                </button>
              </p>
            )}

            <p className="text-sm text-center text-muted-foreground mt-6">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-accent font-medium hover:underline">
                {isSignUp ? "Sign in" : "Create account"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
