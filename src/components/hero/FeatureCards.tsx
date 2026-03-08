import { motion } from "framer-motion";
import { Brain, Shield, Zap, Database } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Drafting", desc: "Auto-generate SAR sections with AI" },
  { icon: Shield, title: "Gap Analysis", desc: "Identify compliance gaps instantly" },
  { icon: Zap, title: "Real-Time Sync", desc: "Connect LMS, ERP & more live" },
  { icon: Database, title: "Evidence Vault", desc: "Centralized document management" },
];

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
          className="glass-card p-5 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
          style={{ animation: `float ${3 + i * 0.5}s ease-in-out infinite` }}
        >
          <f.icon className="h-8 w-8 text-primary mb-3 group-hover:drop-shadow-[0_0_8px_hsl(168,100%,50%,0.5)] transition-all" />
          <h3 className="font-heading text-sm font-semibold mb-1">{f.title}</h3>
          <p className="text-xs text-muted-foreground">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
