import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Brain, Shield, Zap, Database, GraduationCap, BookOpen, BarChart3, FileText } from "lucide-react";
import TypewriterText from "@/components/hero/TypewriterText";
import StatsCounter from "@/components/hero/StatsCounter";
import { Suspense, lazy, useEffect, useState, useRef } from "react";

const Hero3DScene = lazy(() => import("@/components/hero/Hero3DScene"));

/* ─── Custom Gold Cursor ─── */
function GoldCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTrail(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }));
    });
    return () => cancelAnimationFrame(id);
  }, [pos]);

  return (
    <>
      <div
        className="fixed w-3 h-3 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: pos.x - 6,
          top: pos.y - 6,
          background: "hsl(var(--amber))",
          transition: "transform 0.05s",
        }}
      />
      <div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[9998] border-2 mix-blend-difference"
        style={{
          left: trail.x - 16,
          top: trail.y - 16,
          borderColor: "hsl(var(--amber))",
          transition: "width 0.2s, height 0.2s",
        }}
      />
    </>
  );
}

/* ─── Feature Cards with Hover Sweep ─── */
const features = [
  { icon: Brain, title: "AI-Powered Drafting", desc: "Auto-generate SAR sections with contextual AI that understands NAAC criteria" },
  { icon: Shield, title: "Gap Analysis", desc: "Identify compliance gaps instantly with automated criterion matching" },
  { icon: Zap, title: "Real-Time Sync", desc: "Connect LMS, ERP & more for live data synchronization" },
  { icon: Database, title: "Evidence Vault", desc: "Centralized document management with smart categorization" },
  { icon: GraduationCap, title: "Criterion Mapping", desc: "Map every document to specific NAAC/NBA criterion automatically" },
  { icon: BookOpen, title: "SAR Generation", desc: "One-click complete Self Assessment Report generation" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time progress tracking across all 7 criteria" },
  { icon: FileText, title: "Compliance Reports", desc: "Generate audit-ready compliance reports in minutes" },
];

function FeatureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} className="relative z-10 px-6 md:px-16 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-4 font-heading">What We Offer</p>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
          Everything You Need for{" "}
          <span className="text-gradient-amber">Accreditation</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden glass-card p-6 hover:border-primary/40 transition-all duration-500 cursor-pointer"
          >
            {/* Hover sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
            <div className="relative z-10">
              <f.icon className="h-9 w-9 text-primary mb-4 group-hover:drop-shadow-[0_0_12px_hsl(20,100%,60%,0.5)] transition-all duration-300" />
              <h3 className="font-heading text-sm font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Stats Strip ─── */
function StatsStrip() {
  return (
    <section className="relative z-10 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 md:p-12">
          <StatsCounter />
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─── */
function FinalCTA({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section className="relative z-10 py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-foreground">
          Ready to Transform Your{" "}
          <span className="text-gradient-cyan">Accreditation Journey</span>?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join 250+ institutions already using AccredAI to streamline their NAAC, NBA & ABET compliance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-sm gap-2 px-12 py-6 rounded-full shadow-[0_0_40px_hsl(var(--amber)/0.3)]"
            onClick={onNavigate}
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-accent font-heading text-sm gap-2 px-12 py-6 rounded-full"
            onClick={onNavigate}
          >
            Schedule Demo
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/30 px-6 md:px-16 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-heading text-lg font-bold text-gradient-cyan mb-4">AccredAI</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI-powered accreditation intelligence for higher education institutions.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-3 text-foreground">Product</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="hover:text-primary transition-colors cursor-pointer">SAR Generator</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Gap Analysis</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Evidence Vault</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Analytics</li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-3 text-foreground">Resources</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
            <li className="hover:text-primary transition-colors cursor-pointer">API Reference</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Blog</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Support</li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold mb-3 text-foreground">Company</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="hover:text-primary transition-colors cursor-pointer">About</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Careers</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Privacy</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Terms</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border/20 text-center">
        <p className="text-xs text-muted-foreground">© 2026 AccredAI. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ─── Main Landing ─── */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#120a20] text-foreground cursor-none">
      <GoldCursor />

      {/* 3D Background (hero only) */}
      <div className="relative h-screen">
        <Suspense fallback={<div className="absolute inset-0 bg-[#120a20]" />}>
          <Hero3DScene />
        </Suspense>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#120a20]/30 via-transparent to-[#120a20]/90 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120a20]/20 via-transparent to-[#120a20]/20 z-[1]" />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-xl font-bold text-gradient-cyan"
          >
            AccredAI
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground font-heading text-xs hidden md:inline-flex"
              onClick={() => navigate("/docs")}
            >
              Docs
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-xs px-6 rounded-full shadow-[0_0_20px_hsl(var(--amber)/0.3)]"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6 max-w-4xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xs md:text-sm font-heading uppercase tracking-[0.4em] text-primary/80"
            >
              Accreditation Intelligence Platform
            </motion.p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1]">
              <TypewriterText text="From 6 Months to 2 Weeks" delay={40} />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              AI-Powered Accreditation for NAAC, NBA & ABET compliance.
              Automate your entire SAR preparation process.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-sm gap-2 px-10 py-6 rounded-full shadow-[0_0_30px_hsl(var(--amber)/0.3)]"
              onClick={() => navigate("/auth")}
            >
              Start New Cycle <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/30 text-foreground hover:bg-accent/10 font-heading text-sm gap-2 px-10 py-6 rounded-full backdrop-blur-sm"
              onClick={() => navigate("/auth")}
            >
              <Play className="h-4 w-4" /> View Dashboard
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Sections below hero */}
      <div className="relative z-10 bg-gradient-to-b from-[#120a20] via-[#0f0818] to-[#120a20]">
        <FeatureSection />
        <StatsStrip />
        <FinalCTA onNavigate={() => navigate("/auth")} />
        <Footer />
      </div>
    </div>
  );
}
