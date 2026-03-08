import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const reports = [
  { id: 1, name: "NAAC SSR 2025-26 Draft v3", date: "2026-03-05", body: "NAAC", status: "Draft" },
  { id: 2, name: "NBA SAR - CSE Program", date: "2026-02-28", body: "NBA", status: "Final" },
  { id: 3, name: "NAAC SSR 2025-26 Draft v2", date: "2026-02-20", body: "NAAC", status: "Archived" },
  { id: 4, name: "ABET Self-Study - ECE", date: "2026-02-15", body: "ABET", status: "Draft" },
  { id: 5, name: "NAAC SSR 2025-26 Draft v1", date: "2026-01-30", body: "NAAC", status: "Archived" },
];

const statusStyles: Record<string, string> = {
  Draft: "status-partial",
  Final: "status-compliant",
  Archived: "status-not-started",
};

export default function ReportsArchive() {
  return (
    <DashboardLayout title="Reports Archive">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search reports..." className="pl-9 bg-muted/50 border-border" />
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="p-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="p-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">Body</th>
                <th className="p-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-muted-foreground">{r.date}</td>
                  <td className="p-3">{r.body}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
