import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";

export function useDashboardStats(institutionId?: string, submissionDeadline?: string | null) {
  const gapsQuery = useQuery({
    queryKey: ["gaps-count", institutionId],
    enabled: !!institutionId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("gaps")
        .select("*", { count: "exact", head: true })
        .eq("institution_id", institutionId!)
        .eq("status", "open");
      if (error) throw error;
      return count ?? 0;
    },
  });

  const evidenceQuery = useQuery({
    queryKey: ["evidence-count", institutionId],
    enabled: !!institutionId,
    queryFn: async () => {
      // Get criteria IDs for this institution first
      const { data: criteria } = await supabase
        .from("criteria")
        .select("id")
        .eq("institution_id", institutionId!);
      if (!criteria?.length) return 0;
      const { count, error } = await supabase
        .from("evidence_files")
        .select("*", { count: "exact", head: true })
        .in("criteria_id", criteria.map(c => c.id));
      if (error) throw error;
      return count ?? 0;
    },
  });

  const daysToDeadline = submissionDeadline
    ? Math.max(0, differenceInDays(new Date(submissionDeadline), new Date()))
    : null;

  return {
    gapsCount: gapsQuery.data ?? 0,
    evidenceCount: evidenceQuery.data ?? 0,
    daysToDeadline,
    isLoading: gapsQuery.isLoading || evidenceQuery.isLoading,
  };
}
