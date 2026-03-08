import { motion } from "framer-motion";

const activities = [
  { text: "Dr. Sharma uploaded CO-PO mapping for CSE", time: "2 min ago", type: "upload" },
  { text: "Gap analysis completed for Criterion 3", time: "15 min ago", type: "analysis" },
  { text: "SAR Section 2.1 auto-drafted by AI", time: "1 hr ago", type: "ai" },
  { text: "Library data synced — 2,340 records", time: "2 hrs ago", type: "sync" },
  { text: "Task assigned: Submit placement data", time: "3 hrs ago", type: "task" },
];

export default function ActivityFeed() {
  return (
    <div className="glass-card p-4 h-full">
      <h3 className="font-heading text-xs tracking-wider text-muted-foreground uppercase mb-4">
        Live Activity
      </h3>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0"
          >
            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0 glow-dot" />
            <div>
              <p className="text-sm leading-snug">{a.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
