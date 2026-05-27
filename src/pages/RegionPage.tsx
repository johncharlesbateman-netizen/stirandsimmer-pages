import { useParams, Navigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/Layout";
import RecipeCard from "@/components/RecipeCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { MealType, isMealType } from "@/lib/meal-types";

type Recipe = Tables<"recipes">;

type RegionDef = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  regionTags: string[];
  /** Adjective form used in section headings, e.g. "British". */
  adjective: string;
  seoTitle: string;
  seoDescription: string;
};

type SectionKey = MealType | "quick";


const SECTION_PLURAL: Record<SectionKey, string> = {
  mains: "mains",
  quick: "quick meals",
  lunch: "lunches",
  dessert: "desserts and sweets",
  snack: "snacks",
};

// Order in which sections render on the page.
const SECTION_ORDER: SectionKey[] = ["quick", "mains", "dessert", "lunch"];

const isSectionKey = (v: unknown): v is SectionKey =>
  v === "quick" || isMealType(v);

const MEAL_SECTION_MIN = 1;
const SECTION_PREVIEW_LIMIT = 10;

const totalTime = (r: Recipe) =>
  (r.prep_time_minutes ?? 0) + (r.cook_time_minutes ?? 0);

const isQuickMeal = (r: Recipe) => {
  const t = totalTime(r);
  return t > 0 && t <= 35;
};

const REGIONS: Record<string, RegionDef> = {
  uk: {
    id: "uk",
    name: "United Kingdom",
    emoji: "🇬🇧",
    description:
      "Honest, seasonal and deeply comforting British cooking — pies, roasts, puddings and the foundation of everything.",
    regionTags: ["british"],
    adjective: "British",
    seoTitle: "British recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "British recipes from The Kitchen Atlas — honest, seasonal and deeply comforting. Pies, roasts, puddings and more.",
  },
  italy: {
    id: "italy",
    name: "Italy",
    emoji: "🇮🇹",
    description:
      "Pasta, sauces and the art of simplicity. Italian cooking that feeds the soul.",
    regionTags: ["italian"],
    adjective: "Italian",
    seoTitle: "Italian recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Italian recipes from The Kitchen Atlas — pasta, risotto, sauces and the art of simplicity. Tried and tested in a real kitchen.",
  },
  france: {
    id: "france",
    name: "France",
    emoji: "🇫🇷",
    description:
      "Classical techniques that underpin all of western cooking — sauces, braises, patisserie and bistro classics.",
    regionTags: ["french"],
    adjective: "French",
    seoTitle: "French recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "French recipes from The Kitchen Atlas — classical techniques, mother sauces, braises, patisserie and bistro classics.",
  },
  spain: {
    id: "spain",
    name: "Spain",
    emoji: "🇪🇸",
    description:
      "Bold flavours, beautiful simplicity and the art of sharing — paella, tapas, chorizo and the soul of Spanish cooking.",
    regionTags: ["spanish"],
    adjective: "Spanish",
    seoTitle: "Spanish recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Spanish recipes from The Kitchen Atlas — paella, tapas, chorizo and the bold, generous flavours of Spain. Tried and tested in a real kitchen.",
  },
  india: {
    id: "india",
    name: "India",
    emoji: "🇮🇳",
    description:
      "Bold spices, fragrant herbs and layers of warmth and depth — curries, dals and slow-simmered classics from across India.",
    regionTags: ["indian"],
    adjective: "Indian",
    seoTitle:
      "Indian recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Indian recipes from The Kitchen Atlas — curries, dals, tandoori and bold, fragrant cooking from across India.",
  },
  mexico: {
    id: "mexico",
    name: "Mexico",
    emoji: "🇲🇽",
    description:
      "Vibrant, smoky and deeply satisfying — tacos, salsas and the bold, layered flavours of Mexican cooking.",
    regionTags: ["mexican"],
    adjective: "Mexican",
    seoTitle: "Mexican recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Mexican recipes from The Kitchen Atlas — tacos, salsas and the bold, smoky flavours of Mexico. Tried and tested in a real kitchen.",
  },
  thailand: {
    id: "thailand",
    name: "Thailand",
    emoji: "🇹🇭",
    description:
      "Fragrant, fiery and beautifully balanced — the sweet, sour, salty, spicy heart of Thai cooking.",
    regionTags: ["thai"],
    adjective: "Thai",
    seoTitle: "Thai recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Thai recipes from The Kitchen Atlas — curries, stir fries and the fragrant, balanced cooking of Thailand.",
  },
  japan: {
    id: "japan",
    name: "Japan",
    emoji: "🇯🇵",
    description:
      "Precision, balance and the art of umami — Japanese cooking at its finest.",
    regionTags: ["japanese"],
    adjective: "Japanese",
    seoTitle: "Japanese recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Japanese recipes from The Kitchen Atlas — ramen, katsu, sushi and the precision of Japanese cooking.",
  },
  mediterranean: {
    id: "mediterranean",
    name: "Mediterranean",
    emoji: "🌊",
    description:
      "The shared table around one sea — olive oil, vegetables, fish and herbs from southern Europe and North Africa.",
    regionTags: ["mediterranean"],
    adjective: "Mediterranean",
    seoTitle: "Mediterranean recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Mediterranean recipes from The Kitchen Atlas — olive oil, vegetables, fish and herbs from across the Mediterranean.",
  },
  middleeast: {
    id: "middleeast",
    name: "Middle East",
    emoji: "🥙",
    description:
      "Warm spices, slow-cooked meats, fresh herbs and the deep hospitality of Middle Eastern cooking.",
    regionTags: ["middle-eastern"],
    adjective: "Middle Eastern",
    seoTitle: "Middle Eastern recipes — The Kitchen Atlas | Stir & Simmer",
    seoDescription:
      "Middle Eastern recipes from The Kitchen Atlas — kofta, mezze, flatbreads and the warm hospitality of Middle Eastern cooking.",
  },
};

const RegionPage = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const [searchParams] = useSearchParams();
  const mealParamRaw = searchParams.get("meal");
  const sectionFilter: SectionKey | null = isSectionKey(mealParamRaw)
    ? mealParamRaw
    : null;
  const region = regionId ? REGIONS[regionId] : undefined;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", "region-page"],
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

  if (!region) {
    return <Navigate to="/kitchen-atlas" replace />;
  }

  const filtered = (recipes ?? []).filter((r) => {
    const tag = r.cuisine_region;
    return tag ? region.regionTags.includes(tag) : false;
  });

  const recipesBySection: Record<SectionKey, Recipe[]> = {
    mains: [],
    quick: [],
    lunch: [],
    dessert: [],
    snack: [],
  };
  for (const r of filtered) {
    const mts = ((r.meal_types as string[] | null) ?? []).filter(isMealType);
    if (mts.length > 0) {
      // Recipe is classified by meal type — assign there exclusively.
      for (const mt of mts) recipesBySection[mt].push(r);
    } else if (isQuickMeal(r)) {
      // Only untagged short recipes fall into Quick Meals.
      recipesBySection.quick.push(r);
    }
  }

  // Sections actually rendered (>= MEAL_SECTION_MIN recipes), in fixed order.
  const renderedSections: { key: SectionKey; recipes: Recipe[] }[] =
    SECTION_ORDER.map((k) => ({ key: k, recipes: recipesBySection[k] })).filter(
      (s) => s.recipes.length >= MEAL_SECTION_MIN,
    );

  // "More recipes" = recipes with no meal_type tag at all.
  const generalRecipes = filtered.filter((r) => {
    const mts = ((r.meal_types as string[] | null) ?? []).filter(isMealType);
    return mts.length === 0 && !isQuickMeal(r);
  });

  // When ?meal=… is set, render a single flat grid filtered by that section.
  const sectionFiltered = sectionFilter
    ? sectionFilter === "quick"
      ? filtered.filter((r) => {
          const mts = ((r.meal_types as string[] | null) ?? []).filter(isMealType);
          return mts.length === 0 && isQuickMeal(r);
        })
      : filtered.filter((r) =>
          ((r.meal_types as string[] | null) ?? []).includes(sectionFilter),
        )
    : null;

  const canonicalUrl = `https://stirandsimmer.co.uk/recipes/region/${region.id}`;

  return (
    <Layout>
      <Helmet>
        <title>{region.seoTitle}</title>
        <meta name="description" content={region.seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:site_name" content="Stir & Simmer" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={region.seoTitle} />
        <meta property="og:description" content={region.seoDescription} />
        <meta property="og:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${region.adjective} recipes — Stir & Simmer`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={region.seoTitle} />
        <meta name="twitter:description" content={region.seoDescription} />
        <meta name="twitter:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: region.seoTitle,
          description: region.seoDescription,
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

      <section className="py-10 md:py-14 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <Breadcrumbs
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: "Kitchen Atlas", href: "/kitchen-atlas" },
              { label: region.name },
            ]}
          />
          <Link
            to="/kitchen-atlas"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Kitchen Atlas
          </Link>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl md:text-4xl">{region.emoji}</span>
            <h1 className="heading-display">{region.name} recipes</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {region.description}
          </p>
        </div>
      </section>

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
            sectionFiltered && sectionFilter ? (
              <>
                <Link
                  to={`/recipes/region/${region.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" /> All {region.adjective} recipes
                </Link>
                <h2 className="heading-section mb-2">
                  {region.adjective} {SECTION_PLURAL[sectionFilter]}
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  {sectionFiltered.length}{" "}
                  {sectionFiltered.length === 1 ? "recipe" : "recipes"}
                </p>
                {sectionFiltered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {sectionFiltered.map((recipe, index) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        floatDelay={index}
                        showMeta
                        showCategory={false}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No {region.adjective} {SECTION_PLURAL[sectionFilter]} yet.
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-10">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "recipe" : "recipes"}
                </p>
                {renderedSections.map((section) => {
                  const isExpanded = expandedSections[section.key] ?? false;
                  const visible = isExpanded
                    ? section.recipes
                    : section.recipes.slice(0, SECTION_PREVIEW_LIMIT);
                  const hasMore = section.recipes.length > SECTION_PREVIEW_LIMIT;
                  return (
                    <div key={section.key} className="mb-14 md:mb-20">
                      <h2 className="heading-section mb-6 md:mb-8">
                        {region.adjective} {SECTION_PLURAL[section.key]}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {visible.map((recipe, index) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            floatDelay={index}
                            showMeta
                            showCategory={false}
                          />
                        ))}
                      </div>
                      {hasMore && (
                        <div className="mt-6 flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSection(section.key)}
                            className="gap-1.5"
                          >
                            {isExpanded ? (
                              <>
                                Show Less <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Show More <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {generalRecipes.length > 0 && (
                  <div className="mb-14 md:mb-20">
                    {renderedSections.length > 0 && (
                      <h2 className="heading-section mb-6 md:mb-8">
                        More {region.adjective} recipes
                      </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                      {(expandedSections["general"] ? generalRecipes : generalRecipes.slice(0, SECTION_PREVIEW_LIMIT)).map((recipe, index) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          floatDelay={index}
                          showMeta
                          showCategory={false}
                        />
                      ))}
                    </div>
                    {generalRecipes.length > SECTION_PREVIEW_LIMIT && (
                      <div className="mt-6 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSection("general")}
                          className="gap-1.5"
                        >
                          {expandedSections["general"] ? (
                            <>
                              Show Less <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Show More <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )
          ) : (
            <div className="text-center py-16">
              <p className="heading-section text-muted-foreground mb-3">
                No recipes here yet
              </p>
              <p className="text-muted-foreground mb-6">
                We're adding new {region.name} recipes all the time — check
                back soon.
              </p>
              <Link
                to="/kitchen-atlas"
                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                ← Back to The Kitchen Atlas
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default RegionPage;
