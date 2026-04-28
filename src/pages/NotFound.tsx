import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { MapPinOff, Home, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AppLayout contained={false} mainClassName="items-center justify-center">
      <div className="container py-section flex flex-col items-center text-center max-w-xl">
        <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-6">
          <MapPinOff className="h-7 w-7 text-accent" aria-hidden="true" />
        </div>

        <p className="text-caption uppercase tracking-widest text-muted-foreground mb-2">
          Error 404
        </p>
        <h1 className="text-3xl font-bold text-primary mb-3">
          This page isn't on file.
        </h1>
        <p className="text-base text-muted-foreground mb-2">
          We checked the zoning map, the permit ledger, and even the back of the
          filing cabinet — no luck.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Sorry about that. The page you're looking for may have moved, been
          renamed, or never existed in the first place.
        </p>

        {location.pathname && (
          <div className="mb-8 px-3 py-2 rounded bg-muted/50 border border-border">
            <code className="text-xs text-muted-foreground break-all">
              {location.pathname}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/guides">
              <BookOpen className="h-4 w-4" />
              Browse Guides
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          Think this is a bug?{" "}
          <a
            href="mailto:support@towncenter.io"
            className="text-accent hover:underline"
          >
            Email support@towncenter.io
          </a>
        </p>
      </div>
    </AppLayout>
  );
};

export default NotFound;