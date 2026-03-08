import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Brain, Download } from "lucide-react";
import { useState } from "react";

const mockGaps = [
  { id: 1, criterion: "C3", desc: "Research publications below threshold (need 50, have 32)", severity: "critical", action: "Compile all indexed journal publications from last 5 years", dept: "Research" },
  { id: 2, criterion: "C5", desc: "Alumni feedback data missing for 2 years", severity: "critical", action: "Conduct alumni survey via Google Forms immediately", dept: "IQAC" },
  { id: 3, criterion: "C2", desc: "CO-PO attainment analysis incomplete for 3 programs", severity: "moderate", action: "Department HODs to submit CO-PO mapping spreadsheets", dept: "Academics" },
  { id: 4, criterion: "C7", desc: "Green audit report not available", severity: "moderate", action: "Commission green audit from approved agency", dept: "Admin" },
  { id: 5, criterion: "C1", desc: "Minor syllabus revision documentation gap", severity: "minor", action: "Upload BoS meeting minutes for syllabus changes", dept: "Academics" },
];

const severityColors: Record<string, string> = {
  critical: "status-gap",
  moderate: "status-partial",
  minor: "status-not-started",
};

export default function GapAnalysis() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? mockGaps : mockGaps.filter(g => g.severity === filter);

  return (
    <DashboardLayout title="Gap Analysis">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {["all", "critical", "moderate", "minor"].map(f => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                className={filter === f ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground"}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-secondary text-secondary-foreground gap-2">
              <Brain className="h-3 w-3" /> Run AI Gap Analysis
            </Button>
            <Button size="sm" variant="outline" className="border-border text-muted-foreground gap-2">
              <Download className="h-3 w-3" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((gap, i) => (
            <motion.div
              key={gap.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{gap.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">Criterion: {gap.criterion} • Department: {gap.dept}</p>
                  </div>
                </div>
                <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs border ${severityColors[gap.severity]}`}>
                  {gap.severity}
                </span>
              </div>
              <div className="pl-8 text-xs text-primary">
                💡 Suggested: {gap.action}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
