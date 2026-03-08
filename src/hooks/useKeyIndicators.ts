import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useKeyIndicators(criteriaId?: string) {
  return useQuery({
    queryKey: ["key_indicators", criteriaId],
    enabled: !!criteriaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("key_indicators")
        .select("*")
        .eq("criteria_id", criteriaId!)
        .order("indicator_code");
      if (error) throw error;
      return data ?? [];
    },
  });
}
