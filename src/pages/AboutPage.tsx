import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Database, Users, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <AppLayout contained={false}>
      <div className="container py-12 max-w-3xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded bg-accent text-accent-foreground flex items-center justify-center text-sm font-black">TC</div>
            <span className="font-bold text-2xl text-primary">TownCenter</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">
            Building confidence,<br />one town at a time.
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            TownCenter makes local zoning and ordinance information accessible, searchable, and comparable —
            so homeowners and contractors can build with confidence.
          </p>
        </div>

        {/* What We Do */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-3">What We Do</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              TownCenter is a platform that organizes local zoning ordinances, permit requirements, and municipal
              regulations into a clean, searchable, and comparable format. We serve two primary audiences:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-secondary/50">
                <p className="font-semibold text-sm mb-1">🏠 Homeowners</p>
                <p className="text-xs text-muted-foreground">
                  Understand what you can build on your property, what permits you need, and what rules apply —
                  before you call the building department or hire a contractor.
                </p>
              </div>
              <div className="p-4 rounded bg-secondary/50">
                <p className="font-semibold text-sm mb-1">🔨 Contractors</p>
                <p className="text-xs text-muted-foreground">
                  Quickly compare zoning rules across the towns in your service area, track ordinance changes,
                  and share tips with the community through verified notes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sourcing */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-lg">Our Data</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our data comes directly from municipal ordinance codes, verified against official sources.
              We review and update our database within 30 days of any official ordinance change. Every
              data point includes source attribution and a "last verified" date so you always know how
              current the information is.
            </p>
          </CardContent>
        </Card>

        {/* Coverage */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-lg">Our Commitment</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We believe that zoning information should be accessible to everyone, not just attorneys and
              developers. By making this data transparent and easy to understand, we help homeowners avoid
              costly permit delays and code violations, and help contractors work more efficiently across
              multiple municipalities.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-lg">Contact Us</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Have questions, feedback, or want to request coverage for a new county?
              We'd love to hear from you.
            </p>
            <a href="mailto:support@towncenter.io" className="text-sm text-accent font-medium hover:underline">
              support@towncenter.io
            </a>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
