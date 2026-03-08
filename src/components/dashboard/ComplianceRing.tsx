import { motion } from "framer-motion";

interface ComplianceRingProps {
  percentage: number;
  size?: number;
}

export default function ComplianceRing({ percentage, size = 180 }: ComplianceRingProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const color = percentage >= 75 ? "hsl(142, 76%, 50%)" : percentage >= 50 ? "hsl(40, 100%, 55%)" : "hsl(0, 84%, 60%)";

  return (
    <div className="glass-card p-6 flex flex-col items-center gap-3">
      <h3 className="font-heading text-xs tracking-wider text-muted-foreground uppercase">
        Overall Compliance
      </h3>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="hsl(240, 10%, 14%)" strokeWidth="8"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-heading font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">NAAC Score</span>
        </div>
      </div>
    </div>
  );
}
