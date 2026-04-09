import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <div className="container py-6 max-w-3xl flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/guides" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Guides
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Understanding NJ Zoning</span>
        </nav>

        {/* Hero Image Placeholder */}
        <div className="h-48 bg-secondary rounded-lg flex items-center justify-center mb-6">
          <p className="text-sm text-muted-foreground">Guide Cover Image</p>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="text-[10px] mb-3">Zoning Basics</Badge>
          <h1 className="text-2xl font-bold text-primary mb-3">
            Understanding NJ Zoning for First-Time Homeowners
          </h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>By TownCenter Team</span>
            <span>·</span>
            <span>January 5, 2026</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              8 min read
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-sm max-w-none">
          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-primary mb-3">What Is Zoning and Why Does It Matter?</h2>
              <p>
                Zoning is the system by which municipalities divide land into different categories — residential,
                commercial, industrial — and set rules for how property in each zone can be used. In New Jersey,
                every municipality has its own zoning ordinance, which means the rules can vary significantly
                from one town to the next, even within the same county.
              </p>
              <p className="mt-3">
                For homeowners, zoning matters because it determines what you can and cannot do with your property.
                Want to build a deck? Your zone's setback requirements will determine how close it can be to your
                property line. Thinking about an addition? Lot coverage limits may restrict how much of your lot
                can be covered by structures. Planning to run a business from home? Your zone's permitted uses
                will dictate whether that's allowed.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-primary mb-3">Key Zoning Terms You Should Know</h2>
              <p>
                <strong className="text-foreground">Setback:</strong> The minimum distance a structure must be
                from a property line. There are typically three types: front setback (distance from the street),
                side setback (distance from neighboring properties), and rear setback (distance from the back
                property line). In Bergen County, front setbacks commonly range from 25 to 50 feet for residential zones.
              </p>
              <p className="mt-3">
                <strong className="text-foreground">Lot Coverage:</strong> The percentage of your lot that can be
                covered by structures (buildings, decks, patios, sheds). Most residential zones in Bergen County
                cap lot coverage between 20% and 35%. This includes all impervious surfaces in some towns.
              </p>
              <p className="mt-3">
                <strong className="text-foreground">FAR (Floor Area Ratio):</strong> The ratio of a building's
                total floor area to the lot size. A FAR of 0.30 on a 10,000 sq ft lot means you can build up to
                3,000 sq ft of total floor area. This controls the overall bulk of buildings in a zone.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-primary mb-3">How Zoning Works in Bergen County</h2>
              <p>
                Bergen County has 70 municipalities, each with its own zoning code. This means a project that's
                perfectly legal in Paramus might require a variance in Ridgewood, or vice versa. Common residential
                zone designations include R-1 (large-lot single family), R-2 (medium-lot single family), and R-3
                (multi-family or higher density).
              </p>
              <p className="mt-3">
                Before starting any home improvement project, the first step is always to check your property's
                zone designation and review the applicable rules. TownCenter makes this easy by providing instant
                access to zoning data for every municipality in Bergen County, with plain-language explanations
                of what each rule means for your specific project.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-primary mb-3">What to Do If Your Project Doesn't Comply</h2>
              <p>
                If your project doesn't meet the zoning requirements, you may need to apply for a variance from
                your town's Board of Adjustment. There are two main types of variances in New Jersey:
              </p>
              <p className="mt-3">
                A <strong className="text-foreground">"c" variance (bulk variance)</strong> is needed when your
                project deviates from dimensional requirements like setbacks, height, or lot coverage. These are
                the most common type and are generally easier to obtain if you can show the deviation is minor
                and won't negatively impact neighbors.
              </p>
              <p className="mt-3">
                A <strong className="text-foreground">"d" variance (use variance)</strong> is needed when you want
                to use your property for something not permitted in your zone — for example, operating a commercial
                business in a residential zone. These are harder to obtain and require a stronger showing of need.
              </p>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
