import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import TypewriterText from "@/components/hero/TypewriterText";
import StatsCounter from "@/components/hero/StatsCounter";
import FeatureCards from "@/components/hero/FeatureCards";
import HeroGlobe from "@/components/3d/HeroGlobe";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[sidebar-primary-foreground] text-primary bg-[#e9259b]/80">
      {/* 3D Globe Background */}
      <Suspense fallback={null}>
        <HeroGlobe />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-4">
          <div className="font-heading text-lg font-bold text-gradient-cyan">
            AccredAI
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => navigate("/dashboard")}>
            
            Dashboard
          </Button>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-4">
            
            <p className="text-xs md:text-sm font-heading uppercase tracking-[0.3em] text-primary/70">
              Accreditation Intelligence Platform
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              <TypewriterText
                text="From 6 Months to 2 Weeks"
                delay={40} />
              
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-Powered Accreditation for NAAC, NBA & ABET compliance.
              Automate your entire SAR preparation process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3">
            
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-sm gap-2 px-8"
              onClick={() => navigate("/dashboard")}>
              
              Start New Cycle <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary/40 text-secondary hover:bg-secondary/10 font-heading text-sm gap-2 px-8"
              onClick={() => navigate("/dashboard")}>
              
              <Play className="h-4 w-4" /> View Dashboard
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}>
            
            <StatsCounter />
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 px-6 md:px-12 pb-12">
          <FeatureCards />
        </div>
      </div>
    </div>);

}