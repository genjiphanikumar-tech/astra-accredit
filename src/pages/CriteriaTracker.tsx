import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, AlertTriangle, XCircle, Clock, FileText, Trash2, Loader2 } from "lucide-react";
import { useInstitution } from "@/hooks/useInstitution";
import { useCriteria } from "@/hooks/useCriteria";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<string, { icon: typeof CheckCircle; class: string; label: string }> = {
  compliant: { icon: CheckCircle, class: "status-compliant", label: "Compliant" },
  partial: { icon: AlertTriangle, class: "status-partial", label: "Partial" },
  gap: { icon: XCircle, class: "status-gap", label: "Gap" },
  not_started: { icon: Clock, class: "status-not-started", label: "Not Started" },
};

function getStatus(pct: number) {
  if (pct >= 75) return "compliant";
  if (pct >= 40) return "partial";
  if (pct > 0) return "gap";
  return "not_started";
}

export default function CriteriaTracker() {
  const { user } = useAuth();
  const { data: institution } = useInstitution();
  const { data: criteria, isLoading: criteriaLoading } = useCriteria(institution?.id);
  const [active, setActive] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const activeCriterion = criteria?.find(c => c.criterion_number === active);

  // Fetch evidence files for active criterion
  const { data: evidenceFiles, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", activeCriterion?.id],
    enabled: !!activeCriterion?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evidence_files")
        .select("*")
        .eq("criteria_id", activeCriterion!.id)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      if (!activeCriterion || !user) throw new Error("Missing context");

      const uploaded = [];
      for (const file of Array.from(files)) {
        const filePath = `${institution!.id}/${activeCriterion.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("accreditation-evidence")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("accreditation-evidence")
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from("evidence_files")
          .insert({
            criteria_id: activeCriterion.id,
            uploaded_by: user.id,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_type: file.type || "application/octet-stream",
          });
        if (insertError) throw insertError;
        uploaded.push(file.name);
      }

      // Update evidence count on criteria
      const newCount = (activeCriterion.evidence_count ?? 0) + uploaded.length;
      const newPct = activeCriterion.required_evidence_count
        ? Math.min(100, Math.round((newCount / activeCriterion.required_evidence_count) * 100))
        : 0;

      await supabase
        .from("criteria")
        .update({
          evidence_count: newCount,
          completion_percentage: newPct,
          status: getStatus(newPct),
        })
        .eq("id", activeCriterion.id);

      return uploaded;
    },
    onSuccess: (names) => {
      toast.success(`Uploaded ${names.length} file(s): ${names.join(", ")}`);
      queryClient.invalidateQueries({ queryKey: ["evidence", activeCriterion?.id] });
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    },
    onError: (err: any) => {
      toast.error(`Upload failed: ${err.message}`);
    },
  });

  // Delete evidence mutation
  const deleteMutation = useMutation({
    mutationFn: async (evidenceId: string) => {
      const { error } = await supabase
        .from("evidence_files")
        .delete()
        .eq("id", evidenceId);
      if (error) throw error;

      // Update count
      if (activeCriterion) {
        const newCount = Math.max(0, (activeCriterion.evidence_count ?? 1) - 1);
        const newPct = activeCriterion.required_evidence_count
          ? Math.min(100, Math.round((newCount / activeCriterion.required_evidence_count) * 100))
          : 0;
        await supabase
          .from("criteria")
          .update({
            evidence_count: newCount,
            completion_percentage: newPct,
            status: getStatus(newPct),
          })
          .eq("id", activeCriterion.id);
      }
    },
    onSuccess: () => {
      toast.success("Evidence deleted");
      queryClient.invalidateQueries({ queryKey: ["evidence", activeCriterion?.id] });
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadMutation.mutate(e.target.files);
      e.target.value = "";
    }
  };

  if (criteriaLoading) {
    return (
      <DashboardLayout title="NAAC Criteria Tracker">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!criteria || criteria.length === 0) {
    return (
      <DashboardLayout title="NAAC Criteria Tracker">
        <div className="glass-card p-8 text-center text-muted-foreground">
          No criteria found. Please set up your institution first.
        </div>
      </DashboardLayout>
    );
  }

  const pct = Number(activeCriterion?.completion_percentage ?? 0);
  const statusKey = getStatus(pct);
  const st = statusConfig[statusKey];

  return (
    <DashboardLayout title="NAAC Criteria Tracker">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {criteria.map(c => (
            <Button
              key={c.criterion_number}
              size="sm"
              variant={active === c.criterion_number ? "default" : "outline"}
              className={active === c.criterion_number
                ? "bg-primary text-primary-foreground shrink-0"
                : "border-border text-muted-foreground shrink-0 hover:border-primary/30"
              }
              onClick={() => setActive(c.criterion_number)}
            >
              C{c.criterion_number}
            </Button>
          ))}
        </div>

        {activeCriterion && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-5"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-heading text-lg font-bold">
                Criterion {activeCriterion.criterion_number}: {activeCriterion.criterion_name}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${st.class}`}>
                <st.icon className="h-3 w-3" /> {st.label}
              </span>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completion</span>
                <span className="font-heading">{pct}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8 }}
                  style={{
                    background: pct >= 75 ? "hsl(142,76%,50%)" : pct >= 50 ? "hsl(40,100%,55%)" : "hsl(0,84%,60%)",
                  }}
                />
              </div>
            </div>

            {/* Evidence count + upload */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Evidence: {activeCriterion.evidence_count ?? 0} / {activeCriterion.required_evidence_count ?? 0}
              </span>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                  {uploadMutation.isPending ? "Uploading..." : "Upload Evidence"}
                </Button>
              </div>
            </div>

            {/* Evidence files list */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Uploaded Evidence</h3>
              {evidenceLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : !evidenceFiles || evidenceFiles.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No evidence uploaded yet for this criterion.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {evidenceFiles.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-foreground hover:text-primary truncate block"
                          >
                            {file.file_name}
                          </a>
                          <p className="text-xs text-muted-foreground">
                            {new Date(file.uploaded_at).toLocaleDateString()}
                            {file.verified && " • ✅ Verified"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(file.id)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
