import { motion } from "framer-motion";
import { CheckCircle, Upload, AlertTriangle, CalendarClock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KPICardsProps {
  criteriaCompleted: string;
  evidenceUploaded: string;
  gapsIdentified: string;
  daysToDeadline: string;
  loading?: boolean;
}

export default function KPICards({ criteriaCompleted, evidenceUploaded, gapsIdentified, daysToDeadline, loading }: KPICardsProps) {
  const kpis = [
    { label: "Criteria Completed", value: criteriaCompleted, icon: CheckCircle, color: "text-success" },
    { label: "Evidence Uploaded", value: evidenceUploaded, icon: Upload, color: "text-primary" },
    { label: "Gaps Identified", value: gapsIdentified, icon: AlertTriangle, color: "text-amber" },
    { label: "Days to Deadline", value: daysToDeadline, icon: CalendarClock, color: "text-secondary" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="glass-card p-4 flex items-center gap-4 hover:border-primary/20 transition-colors"
        >
          <div className={`p-2.5 rounded-lg bg-muted ${kpi.color}`}>
            <kpi.icon className="h-5 w-5" />
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-heading font-bold">{kpi.value}</p>
            )}
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
