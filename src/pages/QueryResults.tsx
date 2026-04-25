import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, Layers, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function QueryResults() {
  return (
    <AppLayout showSearch contained={false}>
      <div className="container py-12 max-w-2xl">
        <Card className="border-accent/30">
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <Badge className="mb-3 bg-accent/10 text-accent border-0">Coming soon</Badge>
            <h1 className="text-2xl font-bold text-primary mb-3">Ask a zoning question</h1>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Natural-language Q&amp;A grounded in each town's official ordinances is in development.
              We're building it on top of our verified zoning &amp; permit dataset so every answer
              cites a real source.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              In the meantime, browse a town directly or use search.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link to="/search">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Search className="h-3.5 w-3.5" /> Search
                </Button>
              </Link>
              <Link to="/town/ridgewood/zoning">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> Browse zoning
                </Button>
              </Link>
              <Link to="/town/ridgewood/ordinances">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Browse ordinances
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
