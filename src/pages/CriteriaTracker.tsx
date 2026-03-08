import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

const criteria = [
  { num: 1, name: "Curricular Aspects", pct: 85, evidence: 24, required: 28, status: "compliant" },
  { num: 2, name: "Teaching-Learning & Evaluation", pct: 72, evidence: 18, required: 25, status: "partial" },
  { num: 3, name: "Research, Innovations & Extension", pct: 60, evidence: 15, required: 30, status: "partial" },
  { num: 4, name: "Infrastructure & Learning Resources", pct: 90, evidence: 20, required: 22, status: "compliant" },
  { num: 5, name: "Student Support & Progression", pct: 45, evidence: 10, required: 26, status: "gap" },
  { num: 6, name: "Governance, Leadership & Management", pct: 78, evidence: 16, required: 20, status: "partial" },
  { num: 7, name: "Institutional Values & Best Practices", pct: 55, evidence: 12, required: 24, status: "gap" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; class: string; label: string }> = {
  compliant: { icon: CheckCircle, class: "status-compliant", label: "Compliant" },
  partial: { icon: AlertTriangle, class: "status-partial", label: "Partial" },
  gap: { icon: XCircle, class: "status-gap", label: "Gap" },
  "not-started": { icon: Clock, class: "status-not-started", label: "Not Started" },
};

export default function CriteriaTracker() {
  const [active, setActive] = useState(1);
  const activeCriterion = criteria.find(c => c.num === active)!;
  const st = statusConfig[activeCriterion.status];

  return (
    <DashboardLayout title="NAAC Criteria Tracker">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {criteria.map(c => (
            <Button
              key={c.num}
              size="sm"
              variant={active === c.num ? "default" : "outline"}
              className={active === c.num
                ? "bg-primary text-primary-foreground shrink-0"
                : "border-border text-muted-foreground shrink-0 hover:border-primary/30"
              }
              onClick={() => setActive(c.num)}
            >
              C{c.num}
            </Button>
          ))}
        </div>

        {/* Active criterion detail */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-5"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold">
                Criterion {activeCriterion.num}: {activeCriterion.name}
              </h2>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${st.class}`}>
              <st.icon className="h-3 w-3" /> {st.label}
            </span>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Completion</span>
              <span className="font-heading">{activeCriterion.pct}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${activeCriterion.pct}%` }}
                transition={{ duration: 0.8 }}
                style={{
                  background: activeCriterion.pct >= 75 ? "hsl(142,76%,50%)" : activeCriterion.pct >= 50 ? "hsl(40,100%,55%)" : "hsl(0,84%,60%)",
                }}
              />
            </div>
          </div>

          {/* Evidence */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Evidence: {activeCriterion.evidence} / {activeCriterion.required}
            </span>
            <Button size="sm" className="bg-primary text-primary-foreground gap-2">
              <Upload className="h-3 w-3" /> Upload Evidence
            </Button>
          </div>

          {/* Sub-criteria flip cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flip-card h-32">
                <div className="flip-card-inner relative w-full h-full">
                  <div className="flip-card-front absolute inset-0 glass-card p-4 flex flex-col justify-center">
                    <p className="font-heading text-sm font-semibold">
                      {activeCriterion.num}.{i + 1}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Sub-criterion {i + 1}</p>
                  </div>
                  <div className="flip-card-back absolute inset-0 glass-card-violet p-4 flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground">Evidence required: {3 + i}</p>
                    <p className="text-xs text-muted-foreground">Uploaded: {1 + i}</p>
                    <p className="text-xs text-primary mt-1">Click to manage →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
