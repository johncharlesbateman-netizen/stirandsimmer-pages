import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import RecipeCard from "@/components/RecipeCard";

type Recipe = Tables<"recipes">;

/**
 * Per-guide filter spec. A recipe is included if it matches ANY of the
 * provided criteria. Keep this in one place so the relevance mapping is easy
 * to scan and tweak.
 */
type GuideFilterSpec = {
  categories?: string[];
  cuisines?: string[];
  /** Lowercased substrings tested against the recipe title. */
  titleIncludes?: string[];
  /** Pull from is_seasonal=true. */
  seasonalOnly?: boolean;
};

const GUIDE_FILTERS: Record<string, GuideFilterSpec> = {
  "mother-sauces": {
    cuisines: ["french"],
    titleIncludes: ["sauce", "hollandaise", "béchamel", "bechamel", "velouté", "veloute"],
  },
  "french-techniques": {
    cuisines: ["french"],
  },
  "garam-masala": {
    cuisines: ["indian"],
  },
  "how-to-use-spices": {
    categories: ["spicy"],
    cuisines: ["indian", "thai", "mexican"],
  },
  "proper-stock": {
    titleIncludes: ["risotto", "ragu", "stew", "soup", "coq au vin", "stroganoff", "chasseur"],
  },
  "proper-sauce": {
    cuisines: ["french"],
    titleIncludes: ["sauce", "ragu", "gravy"],
  },
  "choosing-pans": {
    titleIncludes: ["pan fried", "pan-fried", "risotto", "steak", "omelette", "stir fry"],
  },
  "kitchen-knives": {
    titleIncludes: ["salad", "stir fry", "ratatouille", "julienne", "chiffonade", "tartare"],
  },
  "understanding-olive-oil": {
    cuisines: ["italian", "mediterranean", "spanish", "greek"],
  },
  "how-to-cook-pasta": {
    categories: ["pasta"],
  },
  "how-to-make-bread": {
    titleIncludes: ["scone", "bread", "baguette", "wrap", "sandwich", "crumpet"],
  },
  "what-to-cook-in-summer": {
    seasonalOnly: true,
    titleIncludes: ["salad", "tomato", "summer", "prawn", "ceviche", "tartare"],
  },
};

const matches = (r: Recipe, spec: GuideFilterSpec): boolean => {
  const cats = (r.categories as string[] | null) ?? [];
  if (spec.categories?.some((c) => cats.includes(c))) return true;
  if (spec.cuisines?.includes((r.cuisine_region ?? "").toLowerCase())) return true;
  const title = r.title.toLowerCase();
  if (spec.titleIncludes?.some((s) => title.includes(s))) return true;
  if (spec.seasonalOnly && r.is_seasonal) return true;
  return false;
};

interface Props {
  /** Guide slug, e.g. "mother-sauces". */
  guideSlug: string;
  /** Max number of recipes to show. Defaults to 6. */
  limit?: number;
  /** Optional heading override. */
  heading?: string;
}

const GuideRelatedRecipes = ({
  guideSlug,
  limit = 6,
  heading = "Recipes that use this technique",
}: Props) => {
  const spec = GUIDE_FILTERS[guideSlug];

  const { data: recipes = [] } = useQuery({
    queryKey: ["guide-related-recipes", guideSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Recipe[];
    },
    enabled: !!spec,
  });

  if (!spec) return null;
  const filtered = recipes.filter((r) => matches(r, spec)).slice(0, limit);
  if (filtered.length === 0) return null;

  return (
    <section className="border-t border-border py-12 md:py-16 mt-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
          <h2 className="heading-section">{heading}</h2>
          <Link
            to="/recipes"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors editorial-link"
          >
            Browse all recipes →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} floatDelay={i} showMeta />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuideRelatedRecipes;
