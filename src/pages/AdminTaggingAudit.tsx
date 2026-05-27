import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil, Sparkles, AlertTriangle, Check, Wand2 } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  suggestTags,
  TILE_CATEGORIES,
  TILE_CATEGORY_LABELS,
  REGION_TAGS,
  MEAL_TYPE_TAGS,
  type TileCategory,
  type RegionTag,
  type MealTypeTag,
} from "@/lib/recipeTagSuggestions";

const labelForCategory = (cat: string | null | undefined): string => {
  if (!cat) return "—";
  return (TILE_CATEGORY_LABELS as Record<string, string>)[cat] ?? cat;
};

type Recipe = Tables<"recipes">;

const TILE_CATEGORY_SET = new Set<string>(TILE_CATEGORIES);
const VALID_REGION_SET = new Set<string>(REGION_TAGS);
const VALID_MEAL_SET = new Set<string>(MEAL_TYPE_TAGS);

type Status = "complete" | "partial" | "missing";

const classify = (r: Recipe): { status: Status; reasons: string[] } => {
  const reasons: string[] = [];
  const cats = (r.categories ?? []) as string[];
  const hasTileCategory = cats.some((c) => TILE_CATEGORY_SET.has(c));
  const regionTags = (r.cuisine_region ? [r.cuisine_region] : []).filter(
    (t) => VALID_REGION_SET.has(t),
  );
  const hasRegion = regionTags.length > 0;
  const mealTags = (((r as { meal_types?: string[] | null }).meal_types) ?? []).filter(
    (t) => VALID_MEAL_SET.has(t),
  );
  const hasMeal = mealTags.length > 0;

  if (!hasTileCategory) reasons.push("No tile category");
  if (!hasRegion) reasons.push("No cuisine region");
  if (!hasMeal) reasons.push("No meal type");

  const present = [hasTileCategory, hasRegion, hasMeal].filter(Boolean).length;
  if (present === 0) return { status: "missing", reasons };
  if (present < 3) return { status: "partial", reasons };
  return { status: "complete", reasons };
};

// Cross-tag consistency rules. Returns a list of human-readable issues.
const checkConsistency = (r: Recipe): string[] => {
  const issues: string[] = [];
  const categories = (r.categories ?? []) as string[];
  const regions = (r.cuisine_region ? [r.cuisine_region] : []).filter((t) =>
    VALID_REGION_SET.has(t),
  );
  const collections = ((r.collections as string[] | null) ?? []).map((c) =>
    c.toLowerCase(),
  );

  // Rule 1: spicy must have a cuisine region
  if (categories.includes("spicy") && regions.length === 0) {
    issues.push('Tagged "spicy" but has no cuisine region');
  }

  // Rule 2: pasta must include italian or asian
  if (categories.includes("pasta")) {
    const ok = regions.includes("italian") || regions.includes("asian");
    if (!ok) {
      issues.push(
        'Tagged "pasta" but cuisine region is not "italian" or "asian"',
      );
    }
  }

  // Rule 3: "Sweets & Desserts" collection should include category "sweets"
  const inDessertCollection = collections.includes("sweets & desserts");
  if (inDessertCollection && !categories.includes("sweets")) {
    issues.push(
      'In "Sweets & Desserts" collection but category is not "sweets"',
    );
  }

  return issues;
};

const STATUS_STYLES: Record<Status, string> = {
  complete: "border-l-4 border-l-green-600 bg-green-50 dark:bg-green-950/20",
  partial: "border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20",
  missing: "border-l-4 border-l-red-600 bg-red-50 dark:bg-red-950/20",
};

const STATUS_LABEL: Record<Status, string> = {
  complete: "Complete",
  partial: "Partial",
  missing: "Missing",
};

const STATUS_BADGE: Record<Status, string> = {
  complete: "bg-green-600 text-white",
  partial: "bg-amber-500 text-white",
  missing: "bg-red-600 text-white",
};

type QuickMealRow = {
  id: string;
  slug: string;
  title: string;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  collections: string[] | null;
};

const QuickMealsTimeAudit = () => {
  const queryClient = useQueryClient();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [bulkRemoving, setBulkRemoving] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-quick-meals-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, slug, title, prep_time_minutes, cook_time_minutes, collections")
        .contains("collections", ["Quick & Easy"]);
      if (error) throw error;
      return ((data ?? []) as QuickMealRow[])
        .map((r) => ({
          ...r,
          total: (r.prep_time_minutes ?? 0) + (r.cook_time_minutes ?? 0),
        }))
        .filter((r) => r.total > 30)
        .sort((a, b) => b.total - a.total);
    },
  });

  const removeTag = async (row: QuickMealRow) => {
    setRemovingId(row.id);
    try {
      const next = (row.collections ?? []).filter((c) => c !== "Quick & Easy");
      const { error } = await supabase
        .from("recipes")
        .update({ collections: next })
        .eq("id", row.id);
      if (error) throw error;
      toast.success(`Removed "Quick & Easy" from "${row.title}"`);
      await queryClient.invalidateQueries({ queryKey: ["admin-quick-meals-audit"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-tagging-audit"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to remove tag");
    } finally {
      setRemovingId(null);
    }
  };

  const removeAll = async () => {
    if (rows.length === 0) return;
    if (!window.confirm(`Remove "Quick & Easy" from ${rows.length} recipes over 30 minutes?`)) return;
    setBulkRemoving(true);
    let ok = 0;
    let failed = 0;
    for (const row of rows) {
      try {
        const next = (row.collections ?? []).filter((c) => c !== "Quick & Easy");
        const { error } = await supabase
          .from("recipes")
          .update({ collections: next })
          .eq("id", row.id);
        if (error) throw error;
        ok++;
      } catch {
        failed++;
      }
    }
    setBulkRemoving(false);
    await queryClient.invalidateQueries({ queryKey: ["admin-quick-meals-audit"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-tagging-audit"] });
    if (failed === 0) toast.success(`Removed tag from ${ok} recipes`);
    else toast.error(`Removed ${ok}, failed ${failed}`);
  };

  return (
    <section className="py-8 md:py-12 border-b border-border bg-amber-50/50 dark:bg-amber-950/10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h2 className="font-display text-xl md:text-2xl mb-1">
              Quick Meals time audit
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Recipes tagged "Quick &amp; Easy" whose total time (prep + cook)
              exceeds 30 minutes. Remove the tag to keep the Quick Meals
              category honest.
            </p>
          </div>
          {rows.length > 0 && (
            <Button
              size="sm"
              variant="default"
              onClick={removeAll}
              disabled={bulkRemoving}
              className="h-8 text-xs"
            >
              {bulkRemoving ? "Removing…" : `Remove tag from all (${rows.length})`}
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            ✓ No quick-meals recipes exceed 30 minutes.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Title</th>
                  <th className="text-right px-3 py-2">Prep</th>
                  <th className="text-right px-3 py-2">Cook</th>
                  <th className="text-right px-3 py-2">Total</th>
                  <th className="text-right px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-3 py-2">
                      <Link
                        to={`/admin/recipes/${row.slug}/edit`}
                        className="text-foreground hover:underline"
                      >
                        {row.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {row.prep_time_minutes ?? 0}m
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {row.cook_time_minutes ?? 0}m
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-red-700 dark:text-red-300">
                      {row.total}m
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={removingId === row.id || bulkRemoving}
                        onClick={() => removeTag(row)}
                        className="h-7 text-xs"
                      >
                        {removingId === row.id ? "Removing…" : "Remove tag"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Regional mismatch audit ---------------------------------------------
// Surfaces recipes whose tagged cuisine region has no obvious keyword match in
// the title or description — a signal that the tag may be wrong.

const REGION_KEYWORDS: Record<string, string[]> = {
  italian: [
    "pasta", "spaghetti", "linguine", "penne", "fettuccine", "tagliatelle",
    "lasagne", "lasagna", "rigatoni", "orecchiette", "pappardelle", "gnocchi",
    "risotto", "cacio", "pepe", "biscotti", "panna cotta", "tiramisu",
    "milanese", "bolognese", "primavera", "ragu", "ragù", "carbonara",
    "parmesan", "parmigiano", "pecorino", "mozzarella", "focaccia",
    "bruschetta", "pesto", "polenta", "minestrone", "amatriciana",
    "puttanesca", "arrabbiata", "italian", "sicilian", "tuscan",
  ],
  french: [
    "coq au vin", "bourguignon", "ratatouille", "crème", "creme brulee",
    "soufflé", "souffle", "bisque", "velouté", "veloute", "beurre blanc",
    "provençal", "provencal", "tarte", "gratin", "baguette", "quiche",
    "cassoulet", "mornay", "hollandaise", "bouillabaisse", "confit",
    "duxelles", "morel", "french", "parisian", "lyonnaise", "niçoise", "nicoise",
  ],
  british: [
    "shepherd's pie", "shepherds pie", "cottage pie", "fish and chips",
    "yorkshire", "bangers", "mash", "scone", "trifle", "crumble", "custard",
    "sunday roast", "steak and ale", "toad in the hole", "ploughman",
    "welsh rarebit", "sticky toffee", "eton mess", "cornish pasty",
    "bubble and squeak", "british", "english", "irish", "scottish", "welsh",
  ],
  indian: [
    "curry", "masala", "tikka", "tandoori", "biryani", "dal", "naan",
    "paneer", "jalfrezi", "balti", "korma", "vindaloo", "rogan josh", "saag",
    "bhuna", "madras", "dosa", "chana", "chaat", "chutney", "ghee",
    "garam masala", "indian", "punjabi", "bengali", "kerala", "goan",
  ],
  asian: [
    "stir fry", "stir-fry", "stir fried", "wok", "soy sauce", "sesame",
    "lemongrass", "thai", "chinese", "vietnamese", "japanese", "korean",
    "pad thai", "pho", "ramen", "udon", "teriyaki", "kimchi", "satay",
    "sushi", "laksa", "massaman", "char siu", "bao", "dumpling", "miso",
    "gochujang", "sriracha", "hoisin", "asian", "szechuan", "sichuan",
  ],
};

const REGION_LABEL: Record<string, string> = {
  italian: "Italian",
  french: "French",
  british: "British",
  indian: "Indian",
  asian: "Asian",
};

const countKeywordMatches = (text: string, keywords: string[]): string[] => {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const kw of keywords) {
    if (lower.includes(kw)) hits.push(kw);
  }
  return hits;
};

type RegionMismatchRow = {
  recipe: Recipe;
  taggedRegion: string;
  rivalRegion: string | null;
  rivalMatches: string[];
};

const RegionalMismatchAudit = ({ recipes }: { recipes: Recipe[] }) => {
  const queryClient = useQueryClient();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const rows: RegionMismatchRow[] = useMemo(() => {
    const out: RegionMismatchRow[] = [];
    for (const r of recipes) {
      const regions = (r.cuisine_region ? [r.cuisine_region] : []).filter(
        (t) => REGION_KEYWORDS[t],
      );
      if (regions.length === 0) continue;
      const text = [r.title, r.description].join(" ");
      for (const region of regions) {
        const ownMatches = countKeywordMatches(text, REGION_KEYWORDS[region]);
        if (ownMatches.length > 0) continue;
        // No own-keyword match — look for a rival region with stronger signal.
        let bestRival: { region: string; matches: string[] } | null = null;
        for (const [other, kws] of Object.entries(REGION_KEYWORDS)) {
          if (other === region) continue;
          if (regions.includes(other)) continue; // already tagged with rival
          const m = countKeywordMatches(text, kws);
          if (m.length > 0 && (!bestRival || m.length > bestRival.matches.length)) {
            bestRival = { region: other, matches: m };
          }
        }
        out.push({
          recipe: r,
          taggedRegion: region,
          rivalRegion: bestRival?.region ?? null,
          rivalMatches: bestRival?.matches ?? [],
        });
      }
    }
    return out.sort((a, b) =>
      a.taggedRegion === b.taggedRegion
        ? a.recipe.title.localeCompare(b.recipe.title)
        : a.taggedRegion.localeCompare(b.taggedRegion),
    );
  }, [recipes]);

  const removeRegion = async (row: RegionMismatchRow) => {
    setRemovingId(row.recipe.id);
    try {
      const { error } = await supabase
        .from("recipes")
        .update({ cuisine_region: null })
        .eq("id", row.recipe.id);
      if (error) throw error;
      toast.success(
        `Removed "${REGION_LABEL[row.taggedRegion] ?? row.taggedRegion}" from "${row.recipe.title}"`,
      );
      await queryClient.invalidateQueries({ queryKey: ["admin-tagging-audit"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="py-8 md:py-12 border-b border-border bg-purple-50/50 dark:bg-purple-950/10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-4">
          <h2 className="font-display text-xl md:text-2xl mb-1">
            Regional mismatch review
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Recipes tagged with a cuisine region whose title and description
            contain no obvious keywords for that region. Where another
            region's signature words appear instead, that region is shown as a
            possible better fit. Review and remove or reassign as needed.
          </p>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            ✓ No regional mismatches detected.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Recipe</th>
                  <th className="text-left px-3 py-2">Tagged as</th>
                  <th className="text-left px-3 py-2">Possible better fit</th>
                  <th className="text-right px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.recipe.id}-${row.taggedRegion}`}
                    className="border-t border-border align-top"
                  >
                    <td className="px-3 py-2">
                      <Link
                        to={`/admin/recipes/${row.recipe.slug}/edit`}
                        className="text-foreground hover:underline font-medium"
                      >
                        {row.recipe.title}
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {row.recipe.description}
                      </p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 font-mono text-xs">
                        {REGION_LABEL[row.taggedRegion] ?? row.taggedRegion}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {row.rivalRegion ? (
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 rounded bg-blue-600/15 text-blue-800 dark:text-blue-200 font-mono text-xs w-fit">
                            {REGION_LABEL[row.rivalRegion] ?? row.rivalRegion}
                          </span>
                          <span
                            className="text-[11px] text-muted-foreground italic"
                            title={row.rivalMatches.join(", ")}
                          >
                            matched: {row.rivalMatches.slice(0, 3).join(", ")}
                            {row.rivalMatches.length > 3 ? "…" : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          no clear signal
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={removingId === row.recipe.id}
                          onClick={() => removeRegion(row)}
                          className="h-7 text-xs"
                          title={`Remove the "${REGION_LABEL[row.taggedRegion]}" tag`}
                        >
                          {removingId === row.recipe.id
                            ? "Removing…"
                            : `Remove ${REGION_LABEL[row.taggedRegion] ?? row.taggedRegion}`}
                        </Button>
                        <Link
                          to={`/admin/recipes/${row.recipe.slug}/edit`}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-foreground text-background hover:opacity-90"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

const AdminTaggingAudit = () => {
  const queryClient = useQueryClient();
  const [applying, setApplying] = useState<string | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [bulkApplying, setBulkApplying] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);

  const toggleApproved = (id: string) => {
    setApproved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ["admin-tagging-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, slug, title, description, categories, cuisine_region, meal_types, collections")
        .order("title");
      if (error) throw error;
      return (data ?? []) as Recipe[];
    },
  });

  const rows = useMemo(
    () =>
      recipes.map((r) => {
        const { status, reasons } = classify(r);
        const suggestion = suggestTags({
          title: r.title,
          description: r.description,
          collections: (r.collections as string[] | null) ?? [],
        });

        const currentCategories = (r.categories ?? []) as string[];
        const currentCategory = currentCategories.find((c) => TILE_CATEGORY_SET.has(c)) ?? currentCategories[0] ?? null;
        const currentRegions = (r.cuisine_region ? [r.cuisine_region] : []).filter(
          (t) => VALID_REGION_SET.has(t),
        );
        const currentMealTypes = (
          ((r as { meal_types?: string[] | null }).meal_types) ?? []
        ).filter((t) => VALID_MEAL_SET.has(t)) as MealTypeTag[];

        const categoryNeedsFix =
          !currentCategory || !TILE_CATEGORY_SET.has(currentCategory);
        const showCategorySuggestion =
          categoryNeedsFix &&
          suggestion.suggestedCategory !== null &&
          suggestion.suggestedCategory !== currentCategory;

        const newRegionSuggestions = suggestion.suggestedRegions.filter(
          (r) => !currentRegions.includes(r),
        );
        const showRegionSuggestion =
          (currentRegions.length === 0 || newRegionSuggestions.length > 0) &&
          newRegionSuggestions.length > 0;

        const newMealTypeSuggestions = suggestion.suggestedMealTypes.filter(
          (m) => !currentMealTypes.includes(m),
        );
        const showMealTypeSuggestion =
          currentMealTypes.length === 0 && newMealTypeSuggestions.length > 0;

        const hasAnyApplicableSuggestion =
          showCategorySuggestion || showRegionSuggestion || showMealTypeSuggestion;

        const lowConfidence =
          status !== "complete" &&
          !hasAnyApplicableSuggestion;

        const consistencyIssues = checkConsistency(r);

        return {
          recipe: r,
          status,
          reasons,
          suggestion,
          currentCategory,
          currentRegions,
          currentMealTypes,
          showCategorySuggestion,
          showRegionSuggestion,
          showMealTypeSuggestion,
          newRegionSuggestions,
          newMealTypeSuggestions,
          hasAnyApplicableSuggestion,
          lowConfidence,
          consistencyIssues,
        };
      }),
    [recipes],
  );

  const counts = useMemo(() => {
    const c = {
      complete: 0,
      partial: 0,
      missing: 0,
      total: rows.length,
      withSuggestions: 0,
      needsManualReview: 0,
      inconsistencies: 0,
    };
    for (const row of rows) {
      c[row.status]++;
      if (row.hasAnyApplicableSuggestion) c.withSuggestions++;
      if (row.lowConfidence) c.needsManualReview++;
      if (row.consistencyIssues.length > 0) c.inconsistencies++;
    }
    return c;
  }, [rows]);

  const applySuggestion = async (
    recipe: Recipe,
    nextCategory: TileCategory | null,
    nextRegions: RegionTag[],
    nextMealTypes: MealTypeTag[] = [],
  ) => {
    setApplying(recipe.id);
    try {
      const update: {
        categories?: string[];
        cuisine_region?: string;
        meal_types?: string[];
      } = {};
      if (nextCategory) {
        const existingCats = ((recipe.categories ?? []) as string[]);
        update.categories = Array.from(new Set([...existingCats, nextCategory]));
      }
      if (nextRegions.length > 0 && !recipe.cuisine_region) {
        update.cuisine_region = nextRegions[0];
      }
      if (nextMealTypes.length > 0) {
        const existing = (
          ((recipe as { meal_types?: string[] | null }).meal_types) ?? []
        ).filter((t) => VALID_MEAL_SET.has(t));
        update.meal_types = Array.from(new Set([...existing, ...nextMealTypes]));
      }
      if (Object.keys(update).length === 0) return;

      const { error } = await supabase
        .from("recipes")
        .update(update as never)
        .eq("id", recipe.id);
      if (error) throw error;

      toast.success(`Updated tags for "${recipe.title}"`);
      await queryClient.invalidateQueries({ queryKey: ["admin-tagging-audit"] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      toast.error(msg);
    } finally {
      setApplying(null);
    }
  };

  // Rows that currently have an applicable suggestion.
  const suggestableRows = useMemo(
    () => rows.filter((r) => r.hasAnyApplicableSuggestion),
    [rows],
  );

  // Drop approvals for rows that no longer have a pending suggestion (e.g. after refetch).
  useEffect(() => {
    setApproved((prev) => {
      const validIds = new Set(suggestableRows.map((r) => r.recipe.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (validIds.has(id)) next.add(id);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [suggestableRows]);

  const approveAllVisible = () => {
    setApproved(new Set(suggestableRows.map((r) => r.recipe.id)));
  };
  const clearApprovals = () => setApproved(new Set());

  // Apply a list of row payloads in series. Returns count of successes/failures.
  const applyRowsInSeries = async (
    targets: Array<{
      recipe: Recipe;
      nextCategory: TileCategory | null;
      nextRegions: RegionTag[];
      nextMealTypes: MealTypeTag[];
    }>,
  ) => {
    if (targets.length === 0) return;
    setBulkApplying(true);
    setBulkProgress({ done: 0, total: targets.length });
    let ok = 0;
    let failed = 0;
    for (let i = 0; i < targets.length; i++) {
      const { recipe, nextCategory, nextRegions, nextMealTypes } = targets[i];
      try {
        const update: {
          categories?: string[];
          cuisine_region?: string;
          meal_types?: string[];
        } = {};
        if (nextCategory) {
          const existingCats = ((recipe.categories ?? []) as string[]);
          update.categories = Array.from(new Set([...existingCats, nextCategory]));
        }
        if (nextRegions.length > 0 && !recipe.cuisine_region) {
          update.cuisine_region = nextRegions[0];
        }
        if (nextMealTypes.length > 0) {
          const existing = (
            ((recipe as { meal_types?: string[] | null }).meal_types) ?? []
          ).filter((t) => VALID_MEAL_SET.has(t));
          update.meal_types = Array.from(new Set([...existing, ...nextMealTypes]));
        }
        if (Object.keys(update).length > 0) {
          const { error } = await supabase
            .from("recipes")
            .update(update as never)
            .eq("id", recipe.id);
          if (error) throw error;
        }
        ok++;
      } catch (e) {
        failed++;
        console.error("Failed to apply tags for", recipe.title, e);
      }
      setBulkProgress({ done: i + 1, total: targets.length });
    }
    setBulkApplying(false);
    setBulkProgress(null);
    setApproved(new Set());
    await queryClient.invalidateQueries({ queryKey: ["admin-tagging-audit"] });
    if (failed === 0) {
      toast.success(`Applied tags to ${ok} recipe${ok === 1 ? "" : "s"}`);
    } else {
      toast.error(`Applied ${ok}, failed ${failed}. Check console for details.`);
    }
  };

  const applyApproved = () => {
    const targets = suggestableRows
      .filter((r) => approved.has(r.recipe.id))
      .map((r) => ({
        recipe: r.recipe,
        nextCategory: r.showCategorySuggestion ? r.suggestion.suggestedCategory : null,
        nextRegions: r.showRegionSuggestion ? r.newRegionSuggestions : [],
        nextMealTypes: r.showMealTypeSuggestion ? r.newMealTypeSuggestions : [],
      }));
    return applyRowsInSeries(targets);
  };

  const applyAllSuggestions = () => {
    const targets = suggestableRows.map((r) => ({
      recipe: r.recipe,
      nextCategory: r.showCategorySuggestion ? r.suggestion.suggestedCategory : null,
      nextRegions: r.showRegionSuggestion ? r.newRegionSuggestions : [],
      nextMealTypes: r.showMealTypeSuggestion ? r.newMealTypeSuggestions : [],
    }));
    if (targets.length === 0) {
      toast.info("No suggestions to apply.");
      return;
    }
    if (!window.confirm(`Apply suggested tags to all ${targets.length} recipes with suggestions?`)) {
      return;
    }
    return applyRowsInSeries(targets);
  };

  return (
    <Layout>
      <Helmet>
        <title>Recipe tagging audit | Admin | Stir & Simmer</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="py-10 md:py-14 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <p className="micro-caption mb-2 text-muted-foreground">Admin</p>
          <h1 className="heading-display mb-4">Recipe tagging audit</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Every recipe in the database with its tile category and cuisine
            region tags. Suggestions are generated from the title, description
            and collections — review and apply them manually.
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-md bg-secondary text-foreground">
              Total: <strong>{counts.total}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-md bg-green-600 text-white">
              Complete: <strong>{counts.complete}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-md bg-amber-500 text-white">
              Partial: <strong>{counts.partial}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-md bg-red-600 text-white">
              Missing: <strong>{counts.missing}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-md bg-blue-600 text-white inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> With suggestions:{" "}
              <strong>{counts.withSuggestions}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-md bg-orange-600 text-white inline-flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Needs manual review:{" "}
              <strong>{counts.needsManualReview}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-md bg-purple-600 text-white inline-flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Inconsistencies:{" "}
              <strong>{counts.inconsistencies}</strong>
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 p-3 rounded-md bg-muted/40 border border-border">
            <span className="text-sm font-medium mr-2">
              Bulk actions:
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={approveAllVisible}
              disabled={bulkApplying || suggestableRows.length === 0}
              className="h-8 text-xs"
            >
              Approve all suggestions ({suggestableRows.length})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearApprovals}
              disabled={bulkApplying || approved.size === 0}
              className="h-8 text-xs"
            >
              Clear approvals
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={applyApproved}
              disabled={bulkApplying || approved.size === 0}
              className="h-8 text-xs gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Apply approved tags ({approved.size})
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={applyAllSuggestions}
              disabled={bulkApplying || suggestableRows.length === 0}
              className="h-8 text-xs gap-1"
              title="Apply every suggested tag in one go — useful when suggestions are clearly correct (e.g. all pasta recipes → italian + pasta-and-rice)"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Apply to all ({suggestableRows.length})
            </Button>
            {bulkProgress && (
              <span className="text-xs text-muted-foreground ml-2">
                Applying… {bulkProgress.done} / {bulkProgress.total}
              </span>
            )}
          </div>
        </div>
      </section>

      <QuickMealsTimeAudit />
      <RegionalMismatchAudit recipes={recipes} />

      <section className="py-8 md:py-12">

        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {isLoading ? (
            <p className="text-muted-foreground">Loading recipes…</p>
          ) : (
            <div className="space-y-2">
              {rows.map(
                ({
                  recipe,
                  status,
                  reasons,
                  suggestion,
                  currentRegions,
                  showCategorySuggestion,
                  showRegionSuggestion,
                  newRegionSuggestions,
                  hasAnyApplicableSuggestion,
                  lowConfidence,
                  consistencyIssues,
                }) => {
                  const allRegions =
                    (recipe.cuisine_region ? [recipe.cuisine_region] : []);
                  const recipeCats = ((recipe.categories ?? []) as string[]);
                  const primaryCat = recipeCats.find((c) => TILE_CATEGORY_SET.has(c)) ?? recipeCats[0] ?? null;
                  const hasInconsistency = consistencyIssues.length > 0;
                  return (
                    <div
                      key={recipe.id}
                      className={`rounded-md p-4 ${STATUS_STYLES[status]} ${hasInconsistency ? "ring-2 ring-purple-500" : ""}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_BADGE[status]}`}
                            >
                              {STATUS_LABEL[status]}
                            </span>
                            {lowConfidence && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-600 text-white inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Needs manual review
                              </span>
                            )}
                            {hasInconsistency && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-600 text-white inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Inconsistency
                              </span>
                            )}
                            <h2 className="font-display text-base md:text-lg text-foreground truncate">
                              {recipe.title}
                            </h2>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="text-muted-foreground">Category:</span>
                              {primaryCat &&
                              TILE_CATEGORY_SET.has(primaryCat) ? (
                                <span className="px-2 py-0.5 rounded bg-foreground/10 text-foreground font-mono">
                                  {labelForCategory(primaryCat)}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-red-600/15 text-red-700 dark:text-red-300 font-mono">
                                  {primaryCat ? labelForCategory(primaryCat) : "—"}
                                </span>
                              )}
                            </span>

                            <span className="inline-flex items-center gap-1.5 flex-wrap">
                              <span className="text-muted-foreground">Regions:</span>
                              {allRegions.length === 0 ? (
                                <span className="px-2 py-0.5 rounded bg-red-600/15 text-red-700 dark:text-red-300 font-mono">
                                  none
                                </span>
                              ) : (
                                allRegions.map((tag) => {
                                  const valid = VALID_REGION_SET.has(tag);
                                  return (
                                    <span
                                      key={tag}
                                      className={`px-2 py-0.5 rounded font-mono ${
                                        valid
                                          ? "bg-foreground/10 text-foreground"
                                          : "bg-amber-500/20 text-amber-800 dark:text-amber-200"
                                      }`}
                                    >
                                      {tag}
                                    </span>
                                  );
                                })
                              )}
                            </span>
                          </div>

                          {hasAnyApplicableSuggestion && (
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider text-[10px]">
                                <Sparkles className="w-3 h-3" /> Suggested
                              </span>
                              {showCategorySuggestion && (
                                <span className="inline-flex items-center gap-1.5">
                                  <span className="text-muted-foreground">Category:</span>
                                  <span className="px-2 py-0.5 rounded bg-blue-600/15 text-blue-800 dark:text-blue-200 font-mono">
                                    {labelForCategory(suggestion.suggestedCategory)}
                                  </span>
                                </span>
                              )}
                              {showRegionSuggestion && (
                                <span className="inline-flex items-center gap-1.5 flex-wrap">
                                  <span className="text-muted-foreground">Regions:</span>
                                  {newRegionSuggestions.map((r) => (
                                    <span
                                      key={r}
                                      className="px-2 py-0.5 rounded bg-blue-600/15 text-blue-800 dark:text-blue-200 font-mono"
                                    >
                                      +{r}
                                    </span>
                                  ))}
                                </span>
                              )}
                              {(suggestion.categoryMatches.length > 0 ||
                                suggestion.suggestedRegions.length > 0) && (
                                <span
                                  className="text-muted-foreground italic"
                                  title={[
                                    suggestion.categoryMatches.length > 0
                                      ? `Category matched: ${suggestion.categoryMatches.join(", ")}`
                                      : "",
                                    ...suggestion.suggestedRegions.map(
                                      (r) =>
                                        `${r} matched: ${suggestion.regionMatches[r].join(", ")}`,
                                    ),
                                  ]
                                    .filter(Boolean)
                                    .join(" · ")}
                                >
                                  (hover for matched keywords)
                                </span>
                              )}
                              <label className="ml-auto inline-flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-medium text-foreground">
                                <Checkbox
                                  checked={approved.has(recipe.id)}
                                  onCheckedChange={() => toggleApproved(recipe.id)}
                                  disabled={bulkApplying}
                                  aria-label={`Approve suggestion for ${recipe.title}`}
                                />
                                Approve suggestion
                              </label>
                            </div>
                          )}

                          {reasons.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {reasons.join(" · ")}
                            </p>
                          )}

                          {hasInconsistency && (
                            <ul className="mt-2 space-y-1">
                              {consistencyIssues.map((issue) => (
                                <li
                                  key={issue}
                                  className="text-xs text-purple-800 dark:text-purple-200 inline-flex items-start gap-1.5"
                                >
                                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                  <span>{issue}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {hasAnyApplicableSuggestion && (
                            <Button
                              size="sm"
                              variant="default"
                              disabled={applying === recipe.id}
                              onClick={() =>
                                applySuggestion(
                                  recipe,
                                  showCategorySuggestion
                                    ? suggestion.suggestedCategory
                                    : null,
                                  showRegionSuggestion ? newRegionSuggestions : [],
                                )
                              }
                              className="h-8 text-xs gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              {applying === recipe.id ? "Applying…" : "Apply"}
                            </Button>
                          )}
                          <Link
                            to={`/recipes/${recipe.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View
                          </Link>
                          <Link
                            to={`/admin/recipes/${recipe.slug}/edit`}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-foreground text-background hover:opacity-90"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminTaggingAudit;
