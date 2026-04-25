import { AppLayout } from "@/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./NotFound";

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: guide, isLoading } = useQuery({
    queryKey: ["guide", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <AppLayout contained={false}>
        <div className="container py-12 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin inline" />
        </div>
      </AppLayout>
    );
  }

  if (!guide) return <NotFound />;

  const published = guide.published_at
    ? new Date(guide.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  // Lightweight markdown rendering: bold (**text**) + ## headings + paragraphs
  const renderBody = (md: string) => {
    const blocks = md.split(/\n\n+/);
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={i} className="text-lg font-bold text-primary mb-3 mt-6">
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      }
      const html = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>');
      return (
        <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
  };

  return (
    <AppLayout contained={false}>
      <div className="container py-6 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/guides" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Guides
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{guide.title}</span>
        </nav>

        {guide.hero_image_url ? (
          <img src={guide.hero_image_url} alt={guide.title} className="h-48 w-full object-cover rounded-lg mb-6" />
        ) : (
          <div className="h-32 bg-gradient-to-br from-secondary to-accent/10 rounded-lg mb-6" />
        )}

        {/* Article Header */}
        <div className="mb-8">
          {guide.category && <Badge variant="secondary" className="text-micro mb-3">{guide.category}</Badge>}
          <h1 className="text-2xl font-bold text-primary mb-3">{guide.title}</h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>By {guide.author ?? "TownCenter Team"}</span>
            {published && (<><span>·</span><span>{published}</span></>)}
            {guide.read_time && (
              <>
                <span>·</span>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{guide.read_time}</div>
              </>
            )}
          </div>
        </div>

        <article className="prose prose-sm max-w-none text-sm text-muted-foreground leading-relaxed">
          {renderBody(guide.body ?? "")}
        </article>
      </div>
    </AppLayout>
  );
}
