import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCriteria(institutionId?: string) {
  return useQuery({
    queryKey: ["criteria", institutionId],
    enabled: !!institutionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("criteria")
        .select("*")
        .eq("institution_id", institutionId!)
        .order("criterion_number");
      if (error) throw error;
      return data ?? [];
    },
  });
}
