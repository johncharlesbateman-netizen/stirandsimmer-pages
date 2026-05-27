import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RecipeRatingProps {
  recipeId: string;
}

interface RatingRow {
  rating: number;
  user_id: string;
}

/** Renders a row of 5 stars filled to `value` (0–5, fractional allowed). */
const StarRow = ({
  value,
  size = 18,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) => {
  const pct = Math.max(0, Math.min(5, value)) / 5;
  return (
    <span
      className={cn("relative inline-flex", className)}
      aria-hidden="true"
      style={{ width: size * 5 + 4 * 2 }}
    >
      <span className="flex gap-0.5 text-muted-foreground/40">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} width={size} height={size} strokeWidth={1.5} />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden flex gap-0.5 text-accent"
        style={{ width: `${pct * 100}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            strokeWidth={1.5}
            className="fill-current"
          />
        ))}
      </span>
    </span>
  );
};

const RecipeRating = ({ recipeId }: RecipeRatingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { data: ratings = [] } = useQuery<RatingRow[]>({
    queryKey: ["recipe-ratings", recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipe_ratings")
        .select("rating, user_id")
        .eq("recipe_id", recipeId);
      if (error) throw error;
      return (data ?? []) as RatingRow[];
    },
    enabled: !!recipeId,
  });

  const { average, count, userRating } = useMemo(() => {
    const c = ratings.length;
    const avg = c ? ratings.reduce((s, r) => s + r.rating, 0) / c : 0;
    const own = user ? ratings.find((r) => r.user_id === user.id)?.rating ?? 0 : 0;
    return { average: avg, count: c, userRating: own };
  }, [ratings, user]);

  const submit = async (value: number) => {
    if (!user || submitting) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("recipe_ratings")
      .upsert(
        { recipe_id: recipeId, user_id: user.id, rating: value },
        { onConflict: "recipe_id,user_id" },
      );
    setSubmitting(false);
    if (error) {
      toast({
        title: "Couldn't save rating",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Thanks for rating!", description: `You rated this ${value} out of 5.` });
    queryClient.invalidateQueries({ queryKey: ["recipe-ratings", recipeId] });
  };

  const display = hover || userRating || Math.round(average);

  return (
    <div
      className="no-print flex flex-wrap items-center gap-x-4 gap-y-2"
      itemProp="aggregateRating"
      itemScope
      itemType="https://schema.org/AggregateRating"
    >
      <div className="flex items-center gap-2">
        <StarRow value={average} />
        <span className="text-sm text-muted-foreground">
          {count > 0 ? (
            <>
              <span itemProp="ratingValue" className="font-medium text-foreground">
                {average.toFixed(1)}
              </span>
              <span className="mx-1">·</span>
              <span itemProp="ratingCount">{count}</span> {count === 1 ? "rating" : "ratings"}
            </>
          ) : (
            <span className="italic">No ratings yet</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHover(0)}
            role="radiogroup"
            aria-label="Rate this recipe"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={userRating === n}
                aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                disabled={submitting}
                onMouseEnter={() => setHover(n)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(0)}
                onClick={() => submit(n)}
                className="p-1 -m-1 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <Star
                  width={22}
                  height={22}
                  strokeWidth={1.5}
                  className={cn(
                    "transition-colors",
                    n <= display
                      ? "text-accent fill-current"
                      : "text-muted-foreground/50",
                  )}
                />
              </button>
            ))}
            {userRating > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                Your rating: {userRating}
              </span>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Sign in to rate
          </Link>
        )}
      </div>
    </div>
  );
};

export default RecipeRating;
