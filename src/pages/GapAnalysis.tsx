import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Brain, Plus, Loader2, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useInstitution } from "@/hooks/useInstitution";
import { useCriteria } from "@/hooks/useCriteria";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const severityColors: Record<string, string> = {
  critical: "status-gap",
  moderate: "status-partial",
  minor: "status-not-started",
};

export default function GapAnalysis() {
  const { user } = useAuth();
  const { data: institution } = useInstitution();
  const { data: criteria } = useCriteria(institution?.id);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    gap_description: "",
    severity: "moderate",
    assigned_department: "",
    criteria_id: "",
  });

  // Fetch gaps
  const { data: gaps, isLoading } = useQuery({
    queryKey: ["gaps", institution?.id],
    enabled: !!institution?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gaps")
        .select("*, criteria(criterion_number, criterion_name)")
        .eq("institution_id", institution!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = filter === "all"
    ? gaps
    : gaps?.filter(g => g.severity === filter);

  // Create gap mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("gaps").insert({
        institution_id: institution!.id,
        gap_description: form.gap_description,
        severity: form.severity,
        assigned_department: form.assigned_department || null,
        criteria_id: form.criteria_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gap added successfully");
      queryClient.invalidateQueries({ queryKey: ["gaps"] });
      setAddOpen(false);
      setForm({ gap_description: "", severity: "moderate", assigned_department: "", criteria_id: "" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Resolve gap mutation
  const resolveMutation = useMutation({
    mutationFn: async (gapId: string) => {
      const { error } = await supabase
        .from("gaps")
        .update({ status: "resolved" })
        .eq("id", gapId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gap resolved");
      queryClient.invalidateQueries({ queryKey: ["gaps"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Delete gap mutation
  const deleteMutation = useMutation({
    mutationFn: async (gapId: string) => {
      const { error } = await supabase.from("gaps").delete().eq("id", gapId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gap deleted");
      queryClient.invalidateQueries({ queryKey: ["gaps"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // AI gap analysis mutation
  const aiAnalysisMutation = useMutation({
    mutationFn: async () => {
      if (!criteria || !institution) throw new Error("No criteria data");

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-gaps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            criteriaData: criteria.map(c => ({
              criterion_number: c.criterion_number,
              criterion_name: c.criterion_name,
              completion_percentage: c.completion_percentage,
              evidence_count: c.evidence_count,
              required_evidence_count: c.required_evidence_count,
              status: c.status,
            })),
            institutionName: institution.name,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "AI analysis failed" }));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }

      const { gaps: aiGaps } = await resp.json();

      // Insert AI-generated gaps into DB
      if (aiGaps && aiGaps.length > 0) {
        const criteriaMap = new Map(
          criteria.map(c => [c.criterion_number, c.id])
        );

        const rows = aiGaps.map((g: any) => ({
          institution_id: institution.id,
          gap_description: g.gap_description,
          severity: g.severity,
          ai_suggested_action: g.ai_suggested_action,
          assigned_department: g.assigned_department,
          criteria_id: criteriaMap.get(g.criterion_number) || null,
        }));

        const { error } = await supabase.from("gaps").insert(rows);
        if (error) throw error;
        return aiGaps.length;
      }
      return 0;
    },
    onSuccess: (count) => {
      toast.success(`AI identified ${count} gap(s) and saved them`);
      queryClient.invalidateQueries({ queryKey: ["gaps"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <DashboardLayout title="Gap Analysis">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {["all", "critical", "moderate", "minor"].map(f => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                className={filter === f ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground"}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-secondary text-secondary-foreground gap-2"
              onClick={() => aiAnalysisMutation.mutate()}
              disabled={aiAnalysisMutation.isPending}
            >
              {aiAnalysisMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Brain className="h-3 w-3" />
              )}
              {aiAnalysisMutation.isPending ? "Analyzing..." : "Run AI Gap Analysis"}
            </Button>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-border text-muted-foreground gap-2">
                  <Plus className="h-3 w-3" /> Add Gap
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Gap</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={form.gap_description}
                      onChange={e => setForm(p => ({ ...p, gap_description: e.target.value }))}
                      placeholder="Describe the compliance gap..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Severity</label>
                      <Select value={form.severity} onValueChange={v => setForm(p => ({ ...p, severity: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="minor">Minor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Criterion</label>
                      <Select value={form.criteria_id} onValueChange={v => setForm(p => ({ ...p, criteria_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {criteria?.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              C{c.criterion_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      value={form.assigned_department}
                      onChange={e => setForm(p => ({ ...p, assigned_department: e.target.value }))}
                      placeholder="e.g. IQAC, Academics, Research"
                    />
                  </div>
                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={!form.gap_description || createMutation.isPending}
                    className="w-full"
                  >
                    {createMutation.isPending ? "Saving..." : "Add Gap"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>No gaps found. Run AI Gap Analysis to scan your criteria data.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((gap, i) => {
              const criteriaInfo = gap.criteria as any;
              return (
                <motion.div
                  key={gap.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-5 space-y-3 ${gap.status === "resolved" ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">{gap.gap_description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {criteriaInfo?.criterion_number ? `Criterion C${criteriaInfo.criterion_number}` : "Unlinked"}
                          {gap.assigned_department && ` • Dept: ${gap.assigned_department}`}
                          {gap.status === "resolved" && " • ✅ Resolved"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border ${severityColors[gap.severity ?? "moderate"]}`}>
                        {gap.severity}
                      </span>
                      {gap.status !== "resolved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resolveMutation.mutate(gap.id)}
                          title="Mark resolved"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(gap.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {gap.ai_suggested_action && (
                    <div className="pl-8 text-xs text-primary">
                      💡 Suggested: {gap.ai_suggested_action}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
