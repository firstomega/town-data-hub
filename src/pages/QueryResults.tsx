import { NavBar } from "@/components/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, BookOpen, MessageSquare, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const relatedQuestions = [
  "What are the setback requirements for R-1 zone in Ridgewood?",
  "Do I need a permit for a fence in Ridgewood?",
  "What is the maximum height for a shed in Ridgewood R-1?",
  "Can I build a pool in my backyard in Ridgewood?",
];

export default function QueryResults() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 max-w-3xl">
        {/* Search Bar with Query */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            defaultValue="Can I build a fence over 6 feet in Ridgewood R-1 zone?"
            className="h-12 pl-12 pr-4 text-sm bg-card border shadow-sm"
          />
        </div>

        {/* AI Answer Card */}
        <Card className="mb-4 border-accent/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-accent/10 text-accent border-0 text-xs font-medium">AI-Generated Summary</Badge>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-success font-medium">High Confidence</span>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold mb-3">No — fences in the R-1 zone cannot exceed 6 feet in height.</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  According to the Village of Ridgewood Zoning Ordinance, fences in the <strong className="text-foreground">R-1 Residential Zone</strong> are
                  subject to the following height restrictions:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Front yard:</strong> Maximum 4 feet</li>
                  <li><strong className="text-foreground">Side and rear yard:</strong> Maximum 6 feet</li>
                  <li><strong className="text-foreground">Corner lots:</strong> Special restrictions apply — the "street side" yard is treated as a front yard (4 ft max)</li>
                </ul>
                <p>
                  A fence exceeding 6 feet would require a <strong className="text-foreground">variance</strong> from the Ridgewood Board of Adjustment.
                  Variance applications typically take 6-8 weeks and require a public hearing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Source Ordinance */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Source Ordinance</h3>
            </div>
            <div className="bg-secondary/50 rounded p-4 text-sm font-mono leading-relaxed border">
              <p className="text-xs text-muted-foreground mb-2">§190-73. Fences and Walls — Village of Ridgewood Code</p>
              <p className="text-foreground">
                "No fence or wall in any residential zone shall exceed six (6) feet in height when measured from the
                finished grade at the base of the fence or wall. In any required front yard, no fence or wall shall
                exceed four (4) feet in height. On corner lots, the side yard abutting a street shall be considered
                a front yard for the purposes of this section."
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs text-accent gap-1">
                View Full Ordinance <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-6 border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Disclaimer:</strong> This is an AI-generated summary of municipal ordinances.
              Always verify with the Village of Ridgewood Building Department at (201) 670-5500 before making any decisions.
              Ordinances may have been updated since our last data refresh.
            </p>
          </CardContent>
        </Card>

        {/* Related Questions */}
        <div>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Related Questions
          </h3>
          <div className="space-y-2">
            {relatedQuestions.map((q) => (
              <button
                key={q}
                className="w-full text-left p-3 rounded border text-sm hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
