import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const guides = [
  {
    slug: "understanding-nj-zoning",
    title: "Understanding NJ Zoning for First-Time Homeowners",
    description: "A beginner's guide to zoning districts, setbacks, lot coverage, and why they matter for your home project.",
    readTime: "8 min read",
    category: "Zoning Basics",
  },
  {
    slug: "setback-rules-bergen-county",
    title: "How Setback Rules Work in Bergen County",
    description: "Learn what setbacks are, how they're measured, and what to do if your project doesn't comply.",
    readTime: "6 min read",
    category: "Zoning Basics",
  },
  {
    slug: "adu-rules-nj",
    title: "ADU Rules in New Jersey: A Town-by-Town Guide",
    description: "Accessory dwelling units are now permitted in many NJ towns. Here's what you need to know.",
    readTime: "10 min read",
    category: "ADUs",
  },
  {
    slug: "building-a-deck-nj",
    title: "What to Know Before Building a Deck in NJ",
    description: "Permits, setbacks, coverage limits, and the step-by-step process for deck construction in Bergen County.",
    readTime: "7 min read",
    category: "Projects",
  },
  {
    slug: "variance-process-explained",
    title: 'The Variance Process Explained: "C" vs "D" Variances',
    description: "When you need a variance, what type to apply for, and how to navigate the Board of Adjustment process.",
    readTime: "9 min read",
    category: "Variances",
  },
  {
    slug: "permit-timelines-bergen-county",
    title: "Permit Timelines: What to Expect in Bergen County",
    description: "Average turnaround times for building, zoning, and demolition permits across Bergen County towns.",
    readTime: "5 min read",
    category: "Permits",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <div className="container py-8 max-w-4xl flex-1">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">Guides & Resources</h1>
          <p className="text-muted-foreground">
            Practical guides to help you navigate zoning, permits, and construction in Bergen County.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <Link key={guide.slug} to={`/guides/${guide.slug}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-[10px]">{guide.category}</Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                      <Clock className="h-3 w-3" />
                      {guide.readTime}
                    </div>
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
      </div>
      <Footer />
    </div>
  );
}
