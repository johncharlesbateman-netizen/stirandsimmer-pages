import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Last known published recipe count. Used as a graceful fallback when the
 * live count query is still loading or fails (network error, timeout, etc.)
 * so the number is never invisible to the user. Bump this when adding a
 * batch of recipes so the fallback stays close to reality.
 */
const FALLBACK_RECIPE_COUNT = 118;

/**
 * Single source of truth for the displayed recipe count.
 * Always returns a number — the live count when available, otherwise the
 * cached fallback. Callers can render it unconditionally.
 */
export function useRecipeCount(): number {
  const { data } = useQuery({
    queryKey: ["recipes", "count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("recipes")
        .select("*", { count: "exact", head: true })
        .eq("published", true);
      if (error) throw error;
      return typeof count === "number" ? count : FALLBACK_RECIPE_COUNT;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: FALLBACK_RECIPE_COUNT,
  });
  return data ?? FALLBACK_RECIPE_COUNT;
}
