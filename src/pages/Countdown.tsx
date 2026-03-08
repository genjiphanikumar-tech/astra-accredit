import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

const deadline = new Date("2026-04-30T23:59:59");

const milestones = [
  { title: "Data Collection Complete", date: "2026-03-15", done: true },
  { title: "CO-PO Mapping Validated", date: "2026-03-20", done: true },
  { title: "Gap Analysis Complete", date: "2026-03-25", done: false },
  { title: "SAR Draft Ready", date: "2026-04-05", done: false },
  { title: "Internal Review", date: "2026-04-15", done: false },
  { title: "Final Submission", date: "2026-04-30", done: false },
];

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);
  return time;
}

export default function Countdown() {
  const time = useCountdown(deadline);

  return (
    <DashboardLayout title="Compliance Countdown">
      <div className="space-y-8">
        {/* Timer */}
        <div className="glass-card-glow p-8 text-center">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Time to Submission
          </p>
          <div className="flex justify-center gap-4 md:gap-8">
            {[
              { val: time.days, label: "Days" },
              { val: time.hours, label: "Hours" },
              { val: time.minutes, label: "Minutes" },
              { val: time.seconds, label: "Seconds" },
            ].map(t => (
              <div key={t.label} className="text-center">
                <motion.div
                  key={t.val}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-4xl md:text-6xl font-heading font-bold text-gradient-cyan tabular-nums"
                >
                  {String(t.val).padStart(2, "0")}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="glass-card p-6">
          <h3 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-6">
            Milestone Timeline
          </h3>
          <div className="space-y-0">
            {milestones.map((m, i) => {
              const isOverdue = !m.done && new Date(m.date) < new Date();
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      m.done ? "bg-success/20" : isOverdue ? "bg-destructive/20" : "bg-muted"
                    }`}>
                      {m.done ? <CheckCircle className="h-3 w-3 text-success" /> :
                       isOverdue ? <AlertTriangle className="h-3 w-3 text-destructive" /> :
                       <Clock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    {i < milestones.length - 1 && <div className="w-px h-8 bg-border" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
