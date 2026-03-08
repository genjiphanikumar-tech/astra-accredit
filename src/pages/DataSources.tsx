import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { Database, RefreshCw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const sources = [
  { name: "Learning Management System", key: "LMS", connected: true, lastSync: "5 min ago", records: 12450 },
  { name: "Enterprise Resource Planning", key: "ERP", connected: true, lastSync: "1 hr ago", records: 8320 },
  { name: "Library System", key: "Library", connected: false, lastSync: "Never", records: 0 },
  { name: "Placement Cell", key: "Placement", connected: true, lastSync: "2 hrs ago", records: 3200 },
  { name: "Research Database", key: "Research", connected: false, lastSync: "Never", records: 0 },
];

export default function DataSources() {
  return (
    <DashboardLayout title="Data Sources">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-heading text-sm font-semibold">{s.key}</h3>
                  <p className="text-xs text-muted-foreground">{s.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${s.connected ? "bg-success animate-pulse" : "bg-destructive"}`} />
                <span className="text-xs">{s.connected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Last sync: {s.lastSync}</div>
              <div>Records: {s.records.toLocaleString()}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-primary/20 text-primary hover:bg-primary/10 gap-2"
              disabled={!s.connected}
            >
              <RefreshCw className="h-3 w-3" /> Sync Now
            </Button>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
