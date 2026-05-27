import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import FloatingMealPlannerButton from "@/components/FloatingMealPlannerButton";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { RECIPE_TILES } from "@/lib/recipe-tiles";
import { useRecipeCount } from "@/hooks/useRecipeCount";

type Recipe = Tables<"recipes">;

const Recipes = () => {
  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes", "search-and-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(
          "id, slug, categories, cuisine_region, prep_time_minutes, cook_time_minutes, title, description"
        )
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Recipe[];
    },
  });

  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (trimmed.length < 2) return [];
    return recipes
      .filter((r) => {
        const hay = `${r.title} ${r.description ?? ""}`.toLowerCase();
        return hay.includes(trimmed);
      })
      .slice(0, 30);
  }, [recipes, trimmed]);

  const counts: Record<string, number> = {};
  for (const tile of RECIPE_TILES) {
    counts[tile.slug] = recipes.filter(tile.filter).length;
  }
  const total = useRecipeCount();
  const allTile = RECIPE_TILES[0]; // "all"
  const otherTiles = RECIPE_TILES.slice(1);

  return (
    <Layout>
      <Helmet>
        <title>All recipes — browse by category | Stir & Simmer</title>
        <meta
          name="description"
          content={`Browse ${total ? `over ${total} ` : ""}tried-and-tested recipes for UK home cooks. From quick weeknight dinners to impressive weekend cooking — all in grams, Celsius and supermarket ingredients.`}
        />
        <link rel="canonical" href="https://stirandsimmer.co.uk/recipes" />
        <meta property="og:site_name" content="Stir & Simmer" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/recipes" />
        <meta property="og:title" content="All recipes — browse by category | Stir & Simmer" />
        <meta property="og:description" content={`Browse ${total ? `over ${total} ` : ""}tried-and-tested recipes for UK home cooks. From quick weeknight dinners to impressive weekend cooking — all in grams, Celsius and supermarket ingredients.`} />
        <meta property="og:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Stir & Simmer — recipes for UK home cooks" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All recipes — browse by category | Stir & Simmer" />
        <meta name="twitter:description" content={`Browse ${total ? `over ${total} ` : ""}tried-and-tested recipes for UK home cooks. From quick weeknight dinners to impressive weekend cooking — all in grams, Celsius and supermarket ingredients.`} />
        <meta name="twitter:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "All recipes — browse by category",
          url: "https://stirandsimmer.co.uk/recipes",
          inLanguage: "en-GB",
          isPartOf: { "@type": "WebSite", name: "Stir & Simmer", url: "https://stirandsimmer.co.uk" },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: RECIPE_TILES.slice(1).map((tile, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${tile.label} recipes`,
              url: `https://stirandsimmer.co.uk/recipes/${tile.slug}`,
            })),
          },
        })}</script>
      </Helmet>

      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <p className="micro-caption mb-4">Free Recipes</p>
          <h1 className="heading-display mb-6">Recipes</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Pick a category to dive in.{total ? ` Over ${total} free recipes` : " Free recipes"}{" "}
            using local and seasonal produce — from quick lunches to indulgent
            sweets.
          </p>

          {/* Search */}
          <div className="max-w-xl">
            <label htmlFor="recipe-search" className="sr-only">
              Search recipes
            </label>
            <div className="relative flex items-center rounded-xl overflow-hidden bg-warm-dark">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-amber"
                aria-hidden
              />
              <input
                id="recipe-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes by name or ingredient…"
                className="w-full h-14 pl-12 pr-28 text-base md:text-lg bg-warm-dark text-warm-dark-foreground placeholder:text-warm-amber/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-amber"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-2 rounded-full text-warm-amber hover:bg-warm-dark-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-amber"
                >
                  <X className="w-4 h-4" aria-hidden />
                </button>
              )}
              <button
                type="button"
                aria-label="Search recipes"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-lg font-display text-sm font-medium bg-warm-dark-foreground text-warm-dark transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-amber"
                onClick={() => {
                  const el = document.getElementById("recipe-search");
                  el?.focus();
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search results */}
      {trimmed.length >= 2 && (
        <section className="py-10 md:py-14 border-b border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <h2 className="heading-md mb-6">
              {results.length === 0
                ? `No recipes match “${query}”`
                : `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`}
            </h2>
            {results.length > 0 && (
              <ul className="divide-y divide-border border-y border-border">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/recipe/${r.slug}`}
                      className="group flex items-start justify-between gap-4 py-4 hover:bg-secondary/40 transition-colors px-2 -mx-2 rounded-md"
                    >
                      <div className="min-w-0">
                        <div className="font-display text-lg leading-tight">
                          {r.title}
                        </div>
                        {r.description && (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {r.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight
                        className="w-4 h-4 mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Tile grid */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Featured "All Recipes" banner tile */}
          <Link
            to={`/recipes/${allTile.slug}`}
            className="group block rounded-xl p-6 md:p-8 mb-4 md:mb-6 bg-warm-dark text-warm-dark-foreground transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 md:gap-5">
                <span className="text-3xl md:text-4xl" aria-hidden>
                  {allTile.emoji}
                </span>
                <div>
                  <div className="font-display text-xl md:text-2xl leading-tight">
                    Browse {total ? `all ${total} ` : ""}recipes
                  </div>
                  <div className="text-sm md:text-base opacity-80 mt-1">
                    Every recipe in one place — newest first.
                  </div>
                </div>
              </div>
              <ArrowRight
                className="w-5 h-5 md:w-6 md:h-6 shrink-0 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </div>
          </Link>

          {/* Category tiles — 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {otherTiles.map((tile) => {
              const count = counts[tile.slug] ?? 0;
              return (
                <Link
                  key={tile.slug}
                  to={`/recipes/${tile.slug}`}
                  className="group rounded-xl p-5 md:p-6 min-h-[140px] md:min-h-[170px] flex flex-col items-center justify-center text-center bg-warm-dark text-warm-dark-foreground transition-transform hover:-translate-y-0.5"
                >
                  <span
                    className="text-3xl md:text-4xl mb-3"
                    aria-hidden
                  >
                    {tile.emoji}
                  </span>
                  <div className="font-display text-base md:text-lg leading-tight">
                    {tile.label}
                  </div>
                  <div className="text-xs md:text-sm mt-2 text-warm-amber">
                    {count === 0
                      ? "Coming soon"
                      : `${count} ${count === 1 ? "recipe" : "recipes"}`}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FloatingMealPlannerButton />
    </Layout>
  );
};

export default Recipes;
