import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function GuidesPage() {
  const { data: guides, isLoading } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("slug, title, description, category, read_time")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AppLayout contained={false}>
      <div className="container py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">Guides & Resources</h1>
          <p className="text-muted-foreground">
            Practical guides to help you navigate zoning, permits, and construction in Bergen County.
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin inline" />
          </div>
        ) : !guides?.length ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No guides published yet.</p>
        ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <Link key={guide.slug} to={`/guides/${guide.slug}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    {guide.category && <Badge variant="secondary" className="text-micro">{guide.category}</Badge>}
                    {guide.read_time && (
                      <div className="flex items-center gap-1 text-micro text-muted-foreground ml-auto">
                        <Clock className="h-3 w-3" />
                        {guide.read_time}
                      </div>
                    )}
                  </div>
                  <h2 className="font-semibold text-sm mb-2">{guide.title}</h2>
                  <p className="text-xs text-muted-foreground mb-4 flex-1">{guide.description}</p>
                  <span className="text-xs text-accent font-medium flex items-center gap-1">
                    Read Guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        )}
      </div>
    </AppLayout>
  );
}
