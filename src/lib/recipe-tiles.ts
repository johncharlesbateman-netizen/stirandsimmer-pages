import { Tables } from "@/integrations/supabase/types";

type Recipe = Tables<"recipes">;

export type RecipeTile = {
  slug: string; // URL slug, e.g. "chicken"
  label: string; // Tile + page heading title (without trailing "recipes")
  emoji: string;
  description: string; // One-line page subtitle
  seoTitle: string;
  seoDescription: string;
  /** Pure filter applied to a Recipe to decide if it belongs to this tile. */
  filter: (r: Recipe) => boolean;
};

const hasRegion = (r: Recipe, regions: string[]) => {
  const tag = (r.cuisine_region ?? "").toLowerCase();
  return tag.length > 0 && regions.includes(tag);
};

const hasCategory = (r: Recipe, cat: string) =>
  (r.categories ?? []).includes(cat as Recipe["categories"][number]);

const titleMatches = (r: Recipe, words: string[]) => {
  const hay = `${r.title} ${r.description ?? ""}`.toLowerCase();
  return words.some((w) => hay.includes(w));
};

const totalTime = (r: Recipe) =>
  (r.prep_time_minutes ?? 0) + (r.cook_time_minutes ?? 0);

export const RECIPE_TILES: RecipeTile[] = [
  {
    slug: "all",
    label: "All Recipes",
    emoji: "🍽️",
    description: "Every recipe on Stir & Simmer in one place.",
    seoTitle: "All recipes | Stir & Simmer",
    seoDescription:
      "Browse every recipe on Stir & Simmer — chicken, beef, lamb, fish, pasta, vegetarian and more. All free, all tried and tested.",
    filter: () => true,
  },
  {
    slug: "chicken",
    label: "Chicken",
    emoji: "🍗",
    description:
      "From quick weeknight dinners to slow roasted showpieces — our best chicken recipes.",
    seoTitle: "Chicken recipes — easy and delicious | Stir & Simmer",
    seoDescription:
      "Discover our collection of tried and tested chicken recipes — from quick weeknight dinners to impressive weekend dishes. All free to browse.",
    filter: (r) => hasCategory(r, "chicken"),
  },
  {
    slug: "beef",
    label: "Beef",
    emoji: "🥩",
    description:
      "Hearty beef recipes — slow braises, roasts, ragùs and more.",
    seoTitle: "Beef recipes | Stir & Simmer",
    seoDescription:
      "Hearty beef recipes for every occasion — slow braises, roasts, ragùs and more. Tried and tested in a real kitchen.",
    filter: (r) => hasCategory(r, "beef"),
  },
  {
    slug: "lamb",
    label: "Lamb",
    emoji: "🐑",
    description:
      "Tender lamb recipes — slow roasts, fragrant curries and Mediterranean braises.",
    seoTitle: "Lamb recipes | Stir & Simmer",
    seoDescription:
      "Tender lamb recipes — slow roasts, fragrant curries and Mediterranean braises. Tried and tested in a real kitchen.",
    filter: (r) => hasCategory(r, "lamb"),
  },
  {
    slug: "fish-and-seafood",
    label: "Fish and Seafood",
    emoji: "🐟",
    description:
      "Fresh and flavourful fish and seafood — from simple weeknight salmon to dinner-party showpieces.",
    seoTitle: "Fish and seafood recipes | Stir & Simmer",
    seoDescription:
      "Fresh and flavourful fish and seafood recipes from Stir & Simmer. From simple weeknight salmon to impressive dinner party dishes.",
    filter: (r) => hasCategory(r, "seafood"),
  },
  {
    slug: "pork",
    label: "Pork",
    emoji: "🥓",
    description:
      "Glazed fillets, crackling roasts, fragrant stir-fries and slow braises.",
    seoTitle: "Pork recipes | Stir & Simmer",
    seoDescription:
      "Tried and tested pork recipes — from glazed fillets and crackling roasts to fragrant stir-fries and slow-braised casseroles.",
    filter: (r) => hasCategory(r, "pork"),
  },
  {
    slug: "quick-meals",
    label: "Quick Meals",
    emoji: "⚡",
    description:
      "On the table in 30 minutes or less. Fast, flavourful and fuss-free — perfect for busy weeknights.",
    seoTitle:
      "Quick meal recipes — ready in 30 minutes or less | Stir & Simmer",
    seoDescription:
      "Fast, flavourful and fuss-free — our quick meal recipes are ready in 30 minutes or less. Perfect for busy weeknights.",
    filter: (r) => totalTime(r) > 0 && totalTime(r) <= 30,
  },
  {
    slug: "spicy",
    label: "Spicy",
    emoji: "🌶️",
    description:
      "Bold, fiery and full of flavour — for those who like a little heat.",
    seoTitle: "Spicy recipes for heat lovers | Stir & Simmer",
    seoDescription:
      "Bold, fiery and full of flavour — our spicy recipe collection for those who like a little heat in the kitchen.",
    filter: (r) =>
      hasCategory(r, "spicy") || hasRegion(r, ["spicy", "indian"]),
  },
  {
    slug: "pasta-and-rice",
    label: "Pasta and Rice",
    emoji: "🍝",
    description:
      "Comforting bowls of pasta and fragrant rice dishes from around the world.",
    seoTitle: "Pasta and rice recipes | Stir & Simmer",
    seoDescription:
      "Comforting pasta and rice recipes — from rich ragùs and silky carbonara to fragrant pilafs and biryanis.",
    filter: (r) =>
      hasCategory(r, "pasta") ||
      titleMatches(r, ["rice", "risotto", "pilaf", "biryani", "paella"]),
  },
  {
    slug: "puddings-and-desserts",
    label: "Puddings and Desserts",
    emoji: "🍰",
    description:
      "Velvety crème brûlée, light soufflés, buttery scones and decadent cakes.",
    seoTitle: "Pudding and dessert recipes | Stir & Simmer",
    seoDescription:
      "Velvety crème brûlée, light soufflés, buttery scones and decadent chocolate cakes — sweet recipes for every occasion.",
    filter: (r) => hasCategory(r, "sweets"),
  },
];

export const TILES_BY_SLUG: Record<string, RecipeTile> = Object.fromEntries(
  RECIPE_TILES.map((t) => [t.slug, t]),
);

export const getTileBySlug = (slug?: string): RecipeTile | undefined =>
  slug ? TILES_BY_SLUG[slug] : undefined;
