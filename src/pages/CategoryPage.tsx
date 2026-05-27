import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import RecipeCard from "@/components/RecipeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { getTileBySlug } from "@/lib/recipe-tiles";
import { MealType, isMealType } from "@/lib/meal-types";

type Recipe = Tables<"recipes">;

type SectionKey = MealType | "quick";

const SECTION_PLURAL: Record<SectionKey, string> = {
  mains: "Mains",
  quick: "Quick meals",
  lunch: "Lunches",
  dessert: "Desserts and sweets",
  snack: "Snacks",
};

const SECTION_ORDER: SectionKey[] = ["dessert", "mains", "lunch", "snack", "quick"];

const totalTime = (r: Recipe) =>
  (r.prep_time_minutes ?? 0) + (r.cook_time_minutes ?? 0);

const isQuickMeal = (r: Recipe) => {
  const t = totalTime(r);
  return t > 0 && t <= 35;
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tile = getTileBySlug(slug);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", "tile", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Recipe[];
    },
  });

  if (!tile) {
    return <Navigate to="/recipes" replace />;
  }

  const filtered = (recipes ?? []).filter(tile.filter);
  const canonicalUrl = `https://stirandsimmer.co.uk/recipes/category/${tile.slug}`;

  return (
    <Layout>
      <Helmet>
        <title>{tile.seoTitle}</title>
        <meta name="description" content={tile.seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:site_name" content="Stir & Simmer" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={tile.seoTitle} />
        <meta property="og:description" content={tile.seoDescription} />
        <meta property="og:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${tile.label} recipes — Stir & Simmer`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tile.seoTitle} />
        <meta name="twitter:description" content={tile.seoDescription} />
        <meta name="twitter:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: tile.seoTitle,
          description: tile.seoDescription,
          url: canonicalUrl,
          inLanguage: "en-GB",
          isPartOf: { "@type": "WebSite", name: "Stir & Simmer", url: "https://stirandsimmer.co.uk" },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: filtered.length,
            itemListElement: filtered.slice(0, 30).map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://stirandsimmer.co.uk/recipe/${r.slug}`,
              name: r.title,
            })),
          },
        })}</script>
      </Helmet>

      {/* Header */}
      <section className="py-10 md:py-14 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <Breadcrumbs
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: "Recipes", href: "/recipes" },
              { label: tile.label },
            ]}
          />
          <Link
            to="/recipes"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all categories
          </Link>
          <h1 className="heading-display mb-4">
            {tile.slug === "all" ? "All recipes" : `${tile.label} recipes`}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {tile.description}
          </p>
        </div>
      </section>

      {/* Recipe grid */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            (() => {
              const recipesBySection: Record<SectionKey, Recipe[]> = {
                mains: [], quick: [], lunch: [], dessert: [], snack: [],
              };
              // Each recipe appears in only the FIRST matching section (per SECTION_ORDER),
              // so multi-meal-type recipes aren't duplicated across sections.
              for (const r of filtered) {
                const mts = ((r.meal_types as string[] | null) ?? []).filter(isMealType);
                const candidates = new Set<SectionKey>(mts);
                if (isQuickMeal(r)) candidates.add("quick");
                const firstMatch = SECTION_ORDER.find((k) => candidates.has(k));
                if (firstMatch) recipesBySection[firstMatch].push(r);
              }
              const renderedSections = SECTION_ORDER
                .map((k) => ({ key: k, recipes: recipesBySection[k] }))
                .filter((s) => s.recipes.length > 0);
              const generalRecipes = filtered.filter((r) => {
                const mts = ((r.meal_types as string[] | null) ?? []).filter(isMealType);
                return mts.length === 0 && !isQuickMeal(r);
              });

              return (
                <>
                  <p className="text-sm text-muted-foreground mb-10">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "recipe" : "recipes"}
                  </p>
                  {renderedSections.map((section) => (
                    <div key={section.key} className="mb-14 md:mb-20">
                      <h2 className="heading-section mb-6 md:mb-8">
                        {SECTION_PLURAL[section.key]}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {section.recipes.map((recipe, index) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            floatDelay={index}
                            showMeta
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {generalRecipes.length > 0 && (
                    <div>
                      {renderedSections.length > 0 && (
                        <h2 className="heading-section mb-6 md:mb-8">
                          More recipes
                        </h2>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {generalRecipes.map((recipe, index) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            floatDelay={index}
                            showMeta
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            <div className="text-center py-16">
              <p className="heading-section text-muted-foreground mb-3">
                No recipes here yet
              </p>
              <p className="text-muted-foreground mb-6">
                We're adding new {tile.label.toLowerCase()} recipes all the
                time — check back soon.
              </p>
              <Link
                to="/recipes"
                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                ← Back to all categories
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
