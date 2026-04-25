import { Bell, FileText, MessageSquare, AlertTriangle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const notifications = [
  {
    id: 1,
    type: "ordinance",
    icon: AlertTriangle,
    title: "Paramus ADU Ordinance Adopted",
    desc: "Accessory dwelling units now permitted in all residential zones.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "ordinance",
    icon: FileText,
    title: "Ridgewood Fence Height Update",
    desc: "Updated corner lot fence regulations in R-1 and R-2 zones.",
    time: "2 days ago",
    unread: true,
  },
  {
    id: 3,
    type: "ordinance",
    icon: FileText,
    title: "Glen Rock Permit Fee Increase",
    desc: "Building permit fees increased by 5% effective Jan 1.",
    time: "1 week ago",
    unread: true,
  },
  {
    id: 4,
    type: "note",
    icon: MessageSquare,
    title: "New Community Note — Ridgewood",
    desc: "Contractor tip: 'Ridgewood inspectors are strict on deck joist hangers.'",
    time: "3 days ago",
    unread: true,
  },
  {
    id: 5,
    type: "reminder",
    icon: Bell,
    title: "Permit Timeline Reminder",
    desc: "Your deck permit for 123 Oak St is estimated to be ready for pickup.",
    time: "5 days ago",
    unread: false,
  },
];

export function NotificationCenter() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8 rounded flex items-center justify-center hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" className="text-xs text-accent h-auto py-1">Mark all read</Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-secondary/50 transition-colors ${
                n.unread ? "bg-accent/5" : ""
              }`}
            >
              <div className={`h-7 w-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                n.type === "ordinance" ? "bg-warning/10" : n.type === "note" ? "bg-accent/10" : "bg-secondary"
              }`}>
                <n.icon className={`h-3.5 w-3.5 ${
                  n.type === "ordinance" ? "text-warning" : n.type === "note" ? "text-accent" : "text-muted-foreground"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium truncate">{n.title}</p>
                  {n.unread && <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0 mt-1" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.desc}</p>
                <p className="text-micro text-muted-foreground mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="px-4 py-2">
          <Button variant="ghost" size="sm" className="w-full text-xs text-accent justify-center">
            View All Notifications <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
