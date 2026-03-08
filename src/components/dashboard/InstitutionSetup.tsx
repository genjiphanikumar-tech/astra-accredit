import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function InstitutionSetup() {
  const [name, setName] = useState("");
  const [naacId, setNaacId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase.rpc("setup_institution", {
      _name: name,
      _naac_id: naacId || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Institution created", description: "Your institution is ready with 7 NAAC criteria seeded." });
      queryClient.invalidateQueries({ queryKey: ["institution"] });
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto mt-12"
    >
      <div className="glass-card-glow p-8">
        <h2 className="font-heading text-xl font-bold mb-2">Welcome to AccredAI</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Set up your institution to get started with NAAC accreditation tracking.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inst-name">Institution Name</Label>
            <Input id="inst-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. XYZ College of Engineering" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="naac-id">NAAC ID (optional)</Label>
            <Input id="naac-id" value={naacId} onChange={(e) => setNaacId(e.target.value)} placeholder="e.g. MH-2024-001" />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Setting up…" : "Set Up Institution"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
