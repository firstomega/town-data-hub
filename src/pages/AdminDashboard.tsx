import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Users, Activity, TrendingUp, DollarSign, Search, BarChart3, Shield, Clock, CheckCircle, XCircle, Edit, Database } from "lucide-react";
import { Link } from "react-router-dom";

const towns = [
  { name: "Ridgewood", completeness: 95, zoning: true, permits: true, ordinances: true, contacts: true, updated: "Jan 15, 2026" },
  { name: "Paramus", completeness: 95, zoning: true, permits: true, ordinances: true, contacts: true, updated: "Jan 10, 2026" },
  { name: "Hackensack", completeness: 85, zoning: true, permits: true, ordinances: true, contacts: true, updated: "Feb 5, 2026" },
  { name: "Fort Lee", completeness: 80, zoning: true, permits: true, ordinances: true, contacts: true, updated: "Feb 1, 2026" },
  { name: "Teaneck", completeness: 78, zoning: true, permits: true, ordinances: true, contacts: true, updated: "Jan 28, 2026" },
  { name: "Englewood", completeness: 75, zoning: true, permits: true, ordinances: true, contacts: true, updated: "Jan 20, 2026" },
  { name: "Glen Rock", completeness: 72, zoning: true, permits: true, ordinances: true, contacts: true, updated: "Jan 18, 2026" },
];

const moderationQueue = [
  { id: 1, contractor: "Tony M.", town: "Hackensack", note: "The Building Department now requires digital plan submissions for all commercial projects.", timestamp: "2 hours ago" },
  { id: 2, contractor: "Lisa M.", town: "Paramus", note: "Sunday deliveries are definitely not happening — they enforce blue laws strictly on construction materials too.", timestamp: "5 hours ago" },
  { id: 3, contractor: "Dave S.", town: "Teaneck", note: "New stormwater ordinance is being enforced retroactively on active permits. Check with the dept.", timestamp: "1 day ago" },
  { id: 4, contractor: "Phil H.", town: "Glen Rock", note: "Solar panel permits are being approved same-week now. Great improvement from last year.", timestamp: "2 days ago" },
  { id: 5, contractor: "Ana G.", town: "Fort Lee", note: "Parking variance applications are being denied at a higher rate this quarter. Come prepared.", timestamp: "3 days ago" },
];

const verificationQueue = [
  { business: "Summit Builders LLC", license: "NJ-GC-2024-18742", linkedin: "linkedin.com/in/jsmithsummit", applied: "Apr 8, 2026" },
  { business: "Bergen Home Pros", license: "NJ-GC-2023-15521", linkedin: "linkedin.com/in/mwilsonbhp", applied: "Apr 6, 2026" },
  { business: "ProBuild Contractors", license: "NJ-GC-2025-20134", linkedin: "linkedin.com/in/cgarciapb", applied: "Apr 3, 2026" },
];

const activityLog = [
  "New user signup — sarah.j@gmail.com (Homeowner)",
  "Community note submitted for Ridgewood by Mike R.",
  "Ordinance data updated for Paramus — Blue Laws section",
  "Contractor verification approved: BuildRight Contractors",
  "New user signup — kevin.l@buildfast.com (Contractor)",
  "Search query: 'fence permit ridgewood' — 3 results returned",
  "Community note flagged for review — Teaneck",
  "Hackensack town profile published",
  "Subscription upgrade: Free → Homeowner (david.l@gmail.com)",
  "New user signup — maria.s@example.com (Homeowner)",
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn showSearch />
      <div className="container py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Internal tools · Content management · Analytics</p>
          </div>
          <Badge variant="destructive" className="text-xs">Admin Only</Badge>
        </div>

        <Link to="/admin/data-review">
          <Card className="mb-6 hover:shadow-md transition-shadow cursor-pointer border-accent/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-semibold text-sm">Data Ingestion & Review</p>
                  <p className="text-xs text-muted-foreground">Pull from official municipal sources, review AI-extracted rows, approve into the verified dataset.</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Open</Button>
            </CardContent>
          </Card>
        </Link>

        {/* User Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: "1,247", icon: Users, change: "+12%" },
            { label: "Active This Month", value: "389", icon: Activity, change: "+8%" },
            { label: "Paid Subscribers", value: "67", icon: TrendingUp, change: "+15%" },
            { label: "MRR", value: "$487", icon: DollarSign, change: "+22%" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <Badge className="bg-success/10 text-success border-0 text-[10px]">{s.change}</Badge>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Contractor Accounts", value: "12", icon: Users },
            { label: "Churn Rate", value: "4.2%", icon: TrendingUp },
            { label: "Most Searched Town", value: "Ridgewood", icon: Search },
            { label: "Top Query", value: '"fence permit"', icon: BarChart3 },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <s.icon className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Health */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "API Calls Today", value: "1,203", icon: Activity },
            { label: "Error Rate", value: "0.3%", icon: Shield },
            { label: "Avg Page Load", value: "1.2s", icon: Clock },
            { label: "Searches Today", value: "342", icon: Search },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <s.icon className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts placeholder */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Signups This Month</h3>
              <div className="flex items-end gap-1 h-32">
                {[12, 8, 15, 22, 18, 25, 20, 30, 14, 28, 35, 24, 32, 19, 27, 38, 22, 31, 26, 40, 18, 29, 33, 21, 36, 28, 42, 30, 25, 35].map((v, i) => (
                  <div key={i} className="flex-1 bg-accent/20 hover:bg-accent/40 transition-colors rounded-t" style={{ height: `${(v / 42) * 100}%` }} title={`Day ${i+1}: ${v} signups`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last 30 days · Total: 782 signups</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Subscription Distribution</h3>
              <div className="flex items-center gap-6">
                <div className="relative h-32 w-32">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--secondary))" strokeWidth="20" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--accent))" strokeWidth="20" strokeDasharray={`${0.78 * 251.3} ${251.3}`} />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--success))" strokeWidth="20" strokeDasharray={`${0.15 * 251.3} ${251.3}`} strokeDashoffset={`${-0.78 * 251.3}`} />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--warning))" strokeWidth="20" strokeDasharray={`${0.07 * 251.3} ${251.3}`} strokeDashoffset={`${-0.93 * 251.3}`} />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs"><div className="h-3 w-3 rounded bg-accent" /> Free: 78% (973)</div>
                  <div className="flex items-center gap-2 text-xs"><div className="h-3 w-3 rounded bg-success" /> Homeowner: 15% (187)</div>
                  <div className="flex items-center gap-2 text-xs"><div className="h-3 w-3 rounded bg-warning" /> Contractor: 7% (87)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Completeness */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="p-4 border-b"><h2 className="font-semibold text-sm">Data Completeness Tracker</h2></div>
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="font-semibold">Town</TableHead>
                  <TableHead className="font-semibold">Completeness</TableHead>
                  <TableHead className="font-semibold text-center">Zoning</TableHead>
                  <TableHead className="font-semibold text-center">Permits</TableHead>
                  <TableHead className="font-semibold text-center">Ordinances</TableHead>
                  <TableHead className="font-semibold text-center">Contacts</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {towns.map((t, i) => (
                  <TableRow key={t.name} className={i % 2 === 0 ? "" : "bg-secondary/20"}>
                    <TableCell className="font-medium text-sm">{t.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={t.completeness} className="h-2 w-20" />
                        <span className="text-xs font-medium">{t.completeness}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{t.zoning ? <Check className="h-4 w-4 text-success mx-auto" /> : <X className="h-4 w-4 text-destructive mx-auto" />}</TableCell>
                    <TableCell className="text-center">{t.permits ? <Check className="h-4 w-4 text-success mx-auto" /> : <X className="h-4 w-4 text-destructive mx-auto" />}</TableCell>
                    <TableCell className="text-center">{t.ordinances ? <Check className="h-4 w-4 text-success mx-auto" /> : <X className="h-4 w-4 text-destructive mx-auto" />}</TableCell>
                    <TableCell className="text-center">{t.contacts ? <Check className="h-4 w-4 text-success mx-auto" /> : <X className="h-4 w-4 text-destructive mx-auto" />}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.updated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Content Moderation */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-sm">Content Moderation Queue</h2>
                <Badge variant="secondary" className="text-xs">{moderationQueue.length} pending</Badge>
              </div>
              {moderationQueue.map((item) => (
                <div key={item.id} className="p-4 border-b last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{item.contractor}</span>
                    <Badge variant="outline" className="text-[10px]">{item.town}</Badge>
                    <span className="text-[10px] text-muted-foreground ml-auto">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.note}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 text-success"><CheckCircle className="h-3 w-3" /> Approve</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 text-destructive"><XCircle className="h-3 w-3" /> Reject</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1"><Edit className="h-3 w-3" /> Edit</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contractor Verification + Activity Log */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Contractor Verification Queue</h2>
                  <Badge variant="secondary" className="text-xs">{verificationQueue.length} pending</Badge>
                </div>
                {verificationQueue.map((v, i) => (
                  <div key={i} className="p-4 border-b last:border-0">
                    <p className="text-sm font-medium">{v.business}</p>
                    <p className="text-xs text-muted-foreground">License: {v.license} · Applied: {v.applied}</p>
                    <p className="text-xs text-muted-foreground mb-2">{v.linkedin}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 text-success"><CheckCircle className="h-3 w-3" /> Approve</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 text-destructive"><XCircle className="h-3 w-3" /> Reject</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b"><h2 className="font-semibold text-sm">Recent Activity Log</h2></div>
                <div className="max-h-64 overflow-y-auto">
                  {activityLog.map((log, i) => (
                    <div key={i} className="px-4 py-2 border-b last:border-0 flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{log}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
