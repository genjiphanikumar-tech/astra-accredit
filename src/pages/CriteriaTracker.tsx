import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, AlertTriangle, XCircle, Clock, FileText, Trash2, Loader2, ChevronDown, ChevronRight, Settings2 } from "lucide-react";
import { useInstitution } from "@/hooks/useInstitution";
import { useCriteria } from "@/hooks/useCriteria";
import { useKeyIndicators } from "@/hooks/useKeyIndicators";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

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

function getStatusColor(pct: number) {
  if (pct >= 75) return "hsl(142,76%,50%)";
  if (pct >= 40) return "hsl(40,100%,55%)";
  if (pct > 0) return "hsl(0,84%,60%)";
  return "hsl(var(--muted-foreground))";
}

// Validation schema
const requiredEvidenceSchema = z.number().int().min(1, "Must be at least 1").max(100, "Must be at most 100");

export default function CriteriaTracker() {
  const { user, role } = useAuth();
  const { data: institution } = useInstitution();
  const { data: criteria, isLoading: criteriaLoading } = useCriteria(institution?.id);
  const [active, setActive] = useState(1);
  const [expandedKIs, setExpandedKIs] = useState<Set<string>>(new Set());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [requiredCount, setRequiredCount] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kiFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingKiId, setUploadingKiId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const activeCriterion = criteria?.find(c => c.criterion_number === active);
  const canEdit = role === "admin" || role === "editor";
  
  // Fetch key indicators for active criterion
  const { data: keyIndicators, isLoading: kiLoading } = useKeyIndicators(activeCriterion?.id);

  // Fetch evidence files for active criterion (all, including per-KI)
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

  // Helper: get evidence files for a specific KI
  const getKiEvidence = (kiId: string) =>
    evidenceFiles?.filter((f: any) => f.key_indicator_id === kiId) ?? [];

  const toggleKI = (kiId: string) => {
    setExpandedKIs(prev => {
      const next = new Set(prev);
      if (next.has(kiId)) next.delete(kiId);
      else next.add(kiId);
      return next;
    });
  };

  const openSettings = () => {
    setRequiredCount(String(activeCriterion?.required_evidence_count ?? 10));
    setSettingsError("");
    setSettingsOpen(true);
  };

  // Update required evidence mutation
  const updateRequiredMutation = useMutation({
    mutationFn: async (newRequired: number) => {
      if (!activeCriterion) throw new Error("No criterion selected");
      
      const currentEvidence = activeCriterion.evidence_count ?? 0;
      const newPct = Math.min(100, Math.round((currentEvidence / newRequired) * 100));
      
      const { error } = await supabase
        .from("criteria")
        .update({
          required_evidence_count: newRequired,
          completion_percentage: newPct,
          status: getStatus(newPct),
        })
        .eq("id", activeCriterion.id);
      
      if (error) throw error;
      return newRequired;
    },
    onSuccess: (newRequired) => {
      toast.success(`Required evidence updated to ${newRequired}`);
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setSettingsOpen(false);
    },
    onError: (err: any) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      if (!activeCriterion || !user) throw new Error("Missing context: criterion=" + !!activeCriterion + " user=" + !!user);
      if (!institution) throw new Error("No institution found");

      console.log("Starting upload for", files.length, "files to criterion", activeCriterion.id);

      const uploaded = [];
      for (const file of Array.from(files)) {
        const filePath = `${institution.id}/${activeCriterion.id}/${Date.now()}_${file.name}`;
        console.log("Uploading to storage:", filePath);
        
        const { error: uploadError } = await supabase.storage
          .from("accreditation-evidence")
          .upload(filePath, file);
        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("accreditation-evidence")
          .getPublicUrl(filePath);

        console.log("Inserting evidence_files record");
        const { error: insertError } = await supabase
          .from("evidence_files")
          .insert({
            criteria_id: activeCriterion.id,
            uploaded_by: user.id,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_type: file.type || "application/octet-stream",
          });
        if (insertError) {
          console.error("Insert evidence error:", insertError);
          throw insertError;
        }
        uploaded.push(file.name);
      }

      // Update evidence count on criteria
      const newCount = (activeCriterion.evidence_count ?? 0) + uploaded.length;
      const newPct = activeCriterion.required_evidence_count
        ? Math.min(100, Math.round((newCount / activeCriterion.required_evidence_count) * 100))
        : 0;

      const { error: updateError } = await supabase
        .from("criteria")
        .update({
          evidence_count: newCount,
          completion_percentage: newPct,
          status: getStatus(newPct),
        })
        .eq("id", activeCriterion.id);
      
      if (updateError) {
        console.error("Criteria update error:", updateError);
      }

      return uploaded;
    },
    onSuccess: (names) => {
      toast.success(`Uploaded ${names.length} file(s): ${names.join(", ")}`);
      queryClient.invalidateQueries({ queryKey: ["evidence", activeCriterion?.id] });
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
    },
    onError: (err: any) => {
      console.error("Upload mutation error:", err);
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
            className="space-y-4"
          >
            {/* Main criterion card */}
            <div className="glass-card p-6 space-y-5">
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
                  <span>Overall Completion</span>
                  <span className="font-heading">{pct}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                    style={{ background: getStatusColor(pct) }}
                  />
                </div>
              </div>

              {/* Evidence count + upload */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Evidence: {activeCriterion.evidence_count ?? 0} / {activeCriterion.required_evidence_count ?? 0}
                  </span>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                      onClick={openSettings}
                      title="Configure required evidence"
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
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
            </div>

            {/* Key Indicators Section */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-heading text-base font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Key Indicators
              </h3>
              
              {kiLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : !keyIndicators || keyIndicators.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No key indicators found for this criterion.</p>
              ) : (
                <div className="space-y-3">
                  {keyIndicators.map((ki) => {
                    const kiPct = Number(ki.completion_percentage ?? 0);
                    const kiStatus = getStatus(kiPct);
                    const KiIcon = statusConfig[kiStatus].icon;
                    const isExpanded = expandedKIs.has(ki.id);

                    return (
                      <Collapsible key={ki.id} open={isExpanded} onOpenChange={() => toggleKI(ki.id)}>
                        <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                          <CollapsibleTrigger asChild>
                            <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left">
                              <div className="shrink-0">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-sm font-semibold text-primary">
                                    {ki.indicator_code}
                                  </span>
                                  <span className="text-sm font-medium truncate">
                                    {ki.indicator_name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-xs">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{ 
                                        width: `${kiPct}%`,
                                        background: getStatusColor(kiPct)
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground shrink-0 w-10">
                                    {kiPct}%
                                  </span>
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  Wt: {ki.weightage}%
                                </span>
                                <KiIcon className="h-4 w-4" style={{ color: getStatusColor(kiPct) }} />
                              </div>
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4 pt-0 border-t border-border/50">
                              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Evidence:</span>
                                  <span className="ml-2 font-medium">
                                    {ki.evidence_count ?? 0} / {ki.required_evidence_count ?? 5}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className={`ml-2 font-medium capitalize ${statusConfig[kiStatus].class}`}>
                                    {statusConfig[kiStatus].label}
                                  </span>
                                </div>
                              </div>
                              <p className="mt-3 text-xs text-muted-foreground">
                                Upload evidence specifically for this key indicator to track detailed progress.
                              </p>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Evidence files list */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-heading text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Uploaded Evidence
              </h3>
              {evidenceLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : !evidenceFiles || evidenceFiles.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No evidence uploaded yet for this criterion.</p>
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

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Criterion</DialogTitle>
            <DialogDescription>
              Set the required evidence count for Criterion {activeCriterion?.criterion_number}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requiredCount">Required Evidence Count</Label>
              <Input
                id="requiredCount"
                type="number"
                min={1}
                max={100}
                value={requiredCount}
                onChange={(e) => {
                  setRequiredCount(e.target.value);
                  setSettingsError("");
                }}
                placeholder="e.g., 10"
              />
              {settingsError && (
                <p className="text-xs text-destructive">{settingsError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                The progress percentage will be calculated based on this target.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const parsed = requiredEvidenceSchema.safeParse(Number(requiredCount));
                if (!parsed.success) {
                  setSettingsError(parsed.error.errors[0]?.message || "Invalid value");
                  return;
                }
                updateRequiredMutation.mutate(parsed.data);
              }}
              disabled={updateRequiredMutation.isPending}
            >
              {updateRequiredMutation.isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
