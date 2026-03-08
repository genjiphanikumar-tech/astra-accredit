import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

function StatItem({ value, label, suffix = "", delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.6 }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-heading font-bold text-gradient-cyan">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-3 gap-8 md:gap-16">
      <StatItem value={250} label="Colleges Served" suffix="+" delay={500} />
      <StatItem value={1200} label="Reports Generated" suffix="+" delay={800} />
      <StatItem value={85} label="Time Saved" suffix="%" delay={1100} />
    </div>
  );
}
