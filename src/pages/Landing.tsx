import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import TypewriterText from "@/components/hero/TypewriterText";
import StatsCounter from "@/components/hero/StatsCounter";
import FeatureCards from "@/components/hero/FeatureCards";
import { Suspense, lazy } from "react";

const Hero3DScene = lazy(() => import("@/components/hero/Hero3DScene"));

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d0805] text-foreground">
      {/* 3D Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#0d0805]" />}>
        <Hero3DScene />
      </Suspense>

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0805]/50 via-transparent to-[#0d0805]/80 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0805]/30 via-transparent to-[#0d0805]/30 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
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
          >
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10 backdrop-blur-sm"
              onClick={() => navigate("/auth")}
            >
              Dashboard
            </Button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
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
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            >
              AI-Powered Accreditation for NAAC, NBA & ABET compliance.
              Automate your entire SAR preparation process.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-sm gap-2 px-10 py-6 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.3)]"
              onClick={() => navigate("/auth")}
            >
              Start New Cycle <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white/80 hover:bg-white/5 hover:text-white font-heading text-sm gap-2 px-10 py-6 rounded-full backdrop-blur-sm"
              onClick={() => navigate("/auth")}
            >
              <Play className="h-4 w-4" /> View Dashboard
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <StatsCounter />
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="relative z-10 px-6 md:px-12 pb-16"
        >
          <FeatureCards />
        </motion.div>
      </div>
    </div>
  );
}
