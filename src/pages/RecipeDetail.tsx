import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import QRCode from "qrcode";
import { ArrowLeft, Leaf, Share2, ExternalLink, Printer, ChevronDown } from "lucide-react";
import { supermarketLogos } from "@/lib/supermarket-logos";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { categoryLabels, categoryToSlug } from "@/lib/recipe-utils";
import { scaleIngredients, scaleIngredientsSmart } from "@/lib/ingredient-scaler";
import { buildSeoTitle, buildSeoDescription, buildServingSuggestion } from "@/lib/seo";
import { buildRecipeJsonLd } from "@/lib/recipe-schema";
import { recipeFAQs } from "@/lib/recipe-faqs";
import RecipeFAQ from "@/components/RecipeFAQ";
import { optimisedImage, responsiveSrcSet, pinterestImage } from "@/lib/image-utils";
import { buildRecipeAltText } from "@/lib/seo";
import IngredientList from "@/components/IngredientList";
import { isSectionHeader } from "@/lib/ingredient-utils";
import ServingScaler from "@/components/ServingScaler";
import Breadcrumbs from "@/components/Breadcrumbs";
import RecipeRating from "@/components/RecipeRating";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MobileTab = "ingredients" | "method" | "shop";

const normaliseIngredientText = (ingredient: unknown): string => {
  if (typeof ingredient === "string") return ingredient.trim();

  if (ingredient && typeof ingredient === "object") {
    const obj = ingredient as { text?: unknown; item?: unknown; amount?: unknown };
    if (typeof obj.text === "string" && obj.text.trim()) return obj.text.trim();

    const amount = obj.amount == null ? "" : String(obj.amount).trim();
    const item = typeof obj.item === "string" ? obj.item.trim() : "";
    return `${amount} ${item}`.trim();
  }

  return "";
};

const normaliseIngredients = (ingredients: unknown[] | null | undefined): string[] =>
  (ingredients ?? []).map(normaliseIngredientText).filter(Boolean);

const normaliseIngredientForMatch = (ingredient: unknown): string =>
  normaliseIngredientText(ingredient).toLowerCase().replace(/[^a-z\s]/g, "").trim();

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [servings, setServings] = useState<number | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<MobileTab>("ingredients");
  const [printWithImage, setPrintWithImage] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showJumpToRecipe, setShowJumpToRecipe] = useState(false);
  const recipeCardRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top and reset state when navigating to a new recipe
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setServings(null);
    setCheckedIngredients(new Set());
    setActiveTab("ingredients");
  }, [slug]);

  // Generate QR code for the print view linking back to this recipe
  useEffect(() => {
    if (!slug) return;
    const url = `https://stirandsimmer.co.uk/recipes/${slug}`;
    QRCode.toDataURL(url, { margin: 1, width: 240 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [slug]);

  // Show "Jump to Recipe" pill on mobile after the user scrolls past the hero,
  // and hide it once the recipe card is in view.
  useEffect(() => {
    const onScroll = () => {
      const el = recipeCardRef.current;
      if (!el) {
        setShowJumpToRecipe(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      const scrolled = window.scrollY > 280;
      const cardInView = rect.top < window.innerHeight * 0.6;
      setShowJumpToRecipe(scrolled && !cardInView);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  const jumpToRecipe = () => {
    recipeCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Related recipes: same primary category first, fall back to other recipes
  const primaryCategory = recipe?.categories?.[0] ?? null;
  const { data: relatedRecipes = [] } = useQuery({
    queryKey: ["related-recipes", recipe?.id, primaryCategory],
    queryFn: async () => {
      if (!recipe) return [];
      const { data: sameCat } = primaryCategory
        ? await supabase
            .from("recipes")
            .select("*")
            .eq("published", true)
            .contains("categories", [primaryCategory])
            .neq("id", recipe.id)
            .limit(6)
        : { data: [] as Array<typeof recipe> };

      let pool = sameCat ?? [];

      if (pool.length < 3) {
        const { data: others } = await supabase
          .from("recipes")
          .select("*")
          .eq("published", true)
          .neq("id", recipe.id)
          .limit(6);
        const existingIds = new Set(pool.map((r) => r.id));
        pool = [...pool, ...((others ?? []).filter((r) => !existingIds.has(r.id)))];
      }

      const baseIngredients = new Set(
        ((recipe.ingredients as unknown[]) ?? []).map(normaliseIngredientForMatch).filter(Boolean),
      );
      const scored = pool.map((r) => {
        const ings = ((r.ingredients as unknown[]) ?? []).map(normaliseIngredientForMatch).filter(Boolean);
        const overlap = ings.filter((i) =>
          [...baseIngredients].some((b) => b && i && (b.includes(i) || i.includes(b))),
        ).length;
        return { recipe: r, score: overlap };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 3).map((s) => s.recipe);
    },
    enabled: !!recipe,
  });

  // Aggregate rating for JSON-LD. Component below fetches the full list,
  // but this lightweight head-of-page query keeps the schema in sync without
  // depending on render order.
  const { data: ratingAggregate } = useQuery({
    queryKey: ["recipe-rating-aggregate", recipe?.id],
    queryFn: async () => {
      if (!recipe?.id) return { average: 0, count: 0 };
      const { data, error } = await supabase
        .from("recipe_ratings")
        .select("rating")
        .eq("recipe_id", recipe.id);
      if (error) throw error;
      const rows = data ?? [];
      const count = rows.length;
      const average = count ? rows.reduce((s, r) => s + r.rating, 0) / count : 0;
      return { average, count };
    },
    enabled: !!recipe?.id,
  });


  const baseServings = recipe?.servings || 2;
  const currentServings = servings ?? baseServings;
  const scaleFactor = currentServings / baseServings;

  const ingredients = normaliseIngredients(recipe?.ingredients as unknown[] | null | undefined);
  const instructions: string[] = (((recipe?.instructions as unknown[]) || [])
    .map((s) => {
      if (typeof s === "string") return s;
      if (s && typeof s === "object") {
        const o = s as { text?: unknown; step?: unknown; instruction?: unknown };
        return String(o.text ?? o.step ?? o.instruction ?? "");
      }
      return String(s ?? "");
    })
    .filter((s) => s.trim().length > 0));
  const scaledIngredients = scaleIngredients(ingredients, baseServings, currentServings);
  const smartScaledIngredients = scaleIngredientsSmart(ingredients, baseServings, currentServings);
  const isScaled = currentServings !== baseServings;

  if (isLoading) {
    return (
      <Layout hideNewsletter>
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-10 w-2/3 bg-muted rounded" />
            <div className="aspect-[16/9] bg-muted" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout hideNewsletter>
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-20 text-center">
          <h1 className="heading-editorial mb-4">Recipe not found</h1>
          <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back to recipes
          </Link>
        </div>
      </Layout>
    );
  }

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  const seoTitle = buildSeoTitle(
    (recipe as { seo_title?: string | null }).seo_title,
    recipe.title,
    totalTime,
  );
  const seoDescription = buildSeoDescription(
    (recipe as { seo_description?: string | null }).seo_description,
    recipe.title,
    recipe.description,
    ingredients,
    totalTime,
    primaryCategory ?? "",
    recipe.servings,
  );
  // Richer description used for structured data (not constrained to 155 chars).
  const structuredDescription = recipe.description;
  const imageAlt = buildRecipeAltText(recipe.title, ingredients);

  const pageUrl = `https://stirandsimmer.co.uk/recipes/${recipe.slug}`;
  const shareUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-recipe?slug=${recipe.slug}`;

  // Build keywords from category + first few key ingredients (de-duplicated, lowercase).
  const keywordParts = [
    primaryCategory ? categoryLabels[primaryCategory] : "",
    ...ingredients
      .slice(0, 6)
      .map((i) =>
        i
          .replace(
            /^[\d\s/.,⅓½¼¾⅔⅛⅜⅝⅞-]+\s*(g|kg|ml|l|tsp|tbsp|cup|cups|oz|lb|pinch|clove|cloves|slice|slices)?\s*/i,
            "",
          )
          .split(",")[0]
          .trim()
          .toLowerCase(),
      ),
  ].filter(Boolean);
  const keywords = Array.from(new Set(keywordParts)).slice(0, 8).join(", ");

  const jsonLd = buildRecipeJsonLd({
    title: recipe.title,
    slug: recipe.slug,
    description: structuredDescription,
    imageUrl: recipe.image_url,
    category: primaryCategory ?? "",
    ingredients,
    instructions,
    prepMinutes: recipe.prep_time_minutes,
    cookMinutes: recipe.cook_time_minutes,
    servings: recipe.servings,
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
    keywords,
    aggregateRating:
      ratingAggregate && ratingAggregate.count > 0
        ? { ratingValue: ratingAggregate.average, ratingCount: ratingAggregate.count }
        : null,
  });

  const faqs = recipeFAQs[recipe.slug] ?? [];
  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;




  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied!", description: "Share this link on social media for a rich preview." });
    } catch {
      toast({ title: "Couldn't copy", description: shareUrl, variant: "destructive" });
    }
  };

  const handlePrint = (withImage: boolean) => {
    setPrintWithImage(withImage);
    setTimeout(() => window.print(), 50);
  };

  return (
    <Layout hideNewsletter>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Stir & Simmer" />
        {recipe.image_url && <meta property="og:image" content={recipe.image_url} />}
        {recipe.image_url && <meta property="og:image:alt" content={imageAlt} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {recipe.image_url && <meta name="twitter:image" content={recipe.image_url} />}
        {recipe.image_url && <meta name="pinterest:image" content={pinterestImage(recipe.image_url)} />}
        {recipe.image_url && <meta name="pinterest:description" content={seoDescription} />}

        <link rel="canonical" href={pageUrl} />
        {recipe.image_url && (
          <link
            rel="preload"
            as="image"
            href={optimisedImage(recipe.image_url, { width: 1600 })}
            imageSrcSet={responsiveSrcSet(recipe.image_url, [800, 1200, 1600, 2000])}
            imageSizes="(max-width: 1024px) 100vw, 1024px"
            fetchPriority="high"
          />
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        {faqJsonLd && (
          <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        )}
      </Helmet>

      {/* Sticky "Jump to Recipe" — mobile only, appears after scrolling past hero */}
      <button
        type="button"
        onClick={jumpToRecipe}
        aria-label="Jump to recipe"
        className={`no-print md:hidden fixed left-1/2 -translate-x-1/2 bottom-6 z-40 inline-flex items-center justify-center min-h-[36px] min-w-[36px] px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-medium shadow-lg transition-all duration-200 ${
          showJumpToRecipe ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        Jump to Recipe ↓
      </button>

      {/* Back Link & Share */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 pt-8 flex items-center justify-between gap-4 flex-wrap">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 min-h-[44px] py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipes
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 min-h-[44px] px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
              <Printer className="w-4 h-4" />
              Print Recipe
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem onClick={() => handlePrint(false)}>
                Print without image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrint(true)}>
                Print with image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 min-h-[44px] px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          {isAdmin && (
            <Link
              to={`/admin/recipes/${recipe.slug}/edit`}
              className="inline-flex items-center gap-2 min-h-[44px] px-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl">
            <Breadcrumbs
              className="mb-6 no-print"
              items={[
                { label: "Home", href: "/" },
                { label: "Recipes", href: "/recipes" },
                ...(primaryCategory
                  ? [{
                      label: categoryLabels[primaryCategory],
                      href: `/recipes/category/${categoryToSlug[primaryCategory]}`,
                    }]
                  : []),
                { label: recipe.title },
              ]}
            />
            <h1 className="heading-display mb-6">{recipe.title}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              {recipe.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {recipe.prep_time_minutes ? (
                <span><strong className="text-foreground font-medium">Prep</strong> {recipe.prep_time_minutes} min</span>
              ) : null}
              {recipe.cook_time_minutes ? (
                <span><strong className="text-foreground font-medium">Cook</strong> {recipe.cook_time_minutes} min</span>
              ) : null}
              {totalTime > 0 ? (
                <span><strong className="text-foreground font-medium">Total</strong> {totalTime} min</span>
              ) : null}
              {recipe.servings ? (
                <span><strong className="text-foreground font-medium">Serves</strong> {recipe.servings}</span>
              ) : null}
              {recipe.is_seasonal && (
                <span className="flex items-center gap-2 text-accent">
                  <Leaf className="w-4 h-4" />
                  Seasonal
                </span>
              )}
            </div>

            <div className="mt-6">
              <RecipeRating recipeId={recipe.id} />
            </div>



            <button
              type="button"
              onClick={jumpToRecipe}
              className="no-print mt-8 inline-flex items-center gap-2 px-5 py-2 bg-foreground text-background text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-opacity"
            >
              Jump to Recipe ↓
            </button>
          </div>
        </div>
      </section>

      {/* Image */}
      {recipe.image_url && (
        <section className="pb-6 md:pb-8">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={optimisedImage(recipe.image_url, { width: 1600 })}
                srcSet={responsiveSrcSet(recipe.image_url, [800, 1200, 1600, 2000])}
                sizes="(max-width: 1024px) 100vw, 1024px"
                alt={imageAlt}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1600}
                height={900}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Hidden Pinterest-optimised portrait (2:3, 1000x1500). Picked up by
          the Pinterest browser button via data-pin-media so pinned cards
          use the tall variant rather than the landscape hero. */}
      {recipe.image_url && (
        <img
          src={pinterestImage(recipe.image_url)}
          alt={imageAlt}
          width={1000}
          height={1500}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          data-pin-media={pinterestImage(recipe.image_url)}
          data-pin-description={seoDescription}
          data-pin-url={pageUrl}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", left: -9999, top: "auto" }}
        />
      )}


      {/* Content */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Mobile tab bar */}
          <div className="mb-8 flex max-w-4xl border-b border-border md:hidden">
            {([
              { key: "ingredients" as MobileTab, label: "Ingredients" },
              { key: "method" as MobileTab, label: "Method" },
              { key: "shop" as MobileTab, label: "Shop" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-h-[44px] py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div ref={recipeCardRef} id="recipe-card" className="scroll-mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 max-w-4xl">
            {/* Ingredients — order-2 on mobile (after image+info), order-1 on md */}
            <div className={`order-1 ${activeTab === "ingredients" ? "block" : "hidden"} md:col-span-4 md:order-1 md:block`}>
              <h2 className="heading-section mb-6 pb-4 border-b border-border hidden md:block">
                Ingredients
              </h2>
              <ServingScaler
                servings={currentServings}
                baseServings={baseServings}
                onChange={setServings}
              />
              <IngredientList
                ingredients={smartScaledIngredients}
                checkedIngredients={checkedIngredients}
                onToggle={toggleIngredient}
              />
              {isScaled && (
                <p className="mt-6 text-xs text-muted-foreground border-l-2 border-accent/40 pl-3 leading-relaxed">
                  <strong className="text-foreground">Cooking time may vary</strong> — check
                  your dish rather than relying on the original times when scaling
                  servings.
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className={`order-2 ${activeTab === "method" ? "block" : "hidden"} md:col-span-8 md:order-2 md:block`}>
              <h2 className="heading-section mb-6 pb-4 border-b border-border hidden md:block">
                Method
              </h2>
              <ol className="space-y-6">
                {(() => {
                  let stepNum = 0;
                  return instructions.map((step, i) => {
                    const isHeader = isSectionHeader(step);
                    if (isHeader) {
                      return (
                        <li key={i} className="pt-4 first:pt-0">
                          <span className="text-base font-semibold text-foreground">
                            {step.replace(/:$/, "")}
                          </span>
                        </li>
                      );
                    }
                    stepNum++;
                    return (
                      <li key={i} className="flex gap-4">
                        <span className="font-display text-2xl text-muted-foreground/40 flex-shrink-0 w-8">
                          {stepNum}
                        </span>
                        <p className="text-muted-foreground leading-relaxed pt-1">
                          {step}
                        </p>
                      </li>
                    );
                  });
                })()}
              </ol>

              {/* Tips */}
              {recipe.tips && (
                <div className="mt-12 p-6 bg-secondary border border-border">
                  <h2 className="micro-caption mb-3">Chef's Tips</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recipe.tips}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Serving Suggestions — adds unique on-page text for SEO */}
          <div className="max-w-4xl mt-10 pt-8 border-t border-border">
            <h2 className="heading-section mb-4">Serving Suggestions</h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              {buildServingSuggestion(recipe.title, recipe.categories?.[0])}
            </p>
          </div>

          {faqs.length > 0 && <RecipeFAQ faqs={faqs} />}

        </div>
      </section>

      {/* You Might Also Like */}
      {relatedRecipes.length > 0 && (
        <section className="no-print pb-10 md:pb-14 border-t border-border">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 pt-10 md:pt-14">
            <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
              <h2 className="heading-section">You Might Also Like</h2>
              <Link
                to={`/recipes/category/${categoryToSlug[recipe.categories?.[0]]}`}
                className="inline-flex items-center gap-2 min-h-[44px] py-2 text-sm text-muted-foreground hover:text-foreground transition-colors editorial-link"
              >
                More {categoryLabels[recipe.categories?.[0]]} recipes →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {relatedRecipes.map((r) => {
                const rPrep = r.prep_time_minutes || 0;
                return (
                  <Link
                    key={r.id}
                    to={`/recipes/${r.slug}`}
                    className="group block"
                  >
                    <article className="space-y-4">
                      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                        <img
                          src={r.image_url ? optimisedImage(r.image_url, { width: 800 }) : "/placeholder.svg"}
                          srcSet={r.image_url ? responsiveSrcSet(r.image_url, [400, 600, 800, 1200]) : undefined}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          alt={buildRecipeAltText(r.title, normaliseIngredients(r.ingredients as unknown[] | null | undefined))}
                          loading="lazy"
                          decoding="async"
                          width={800}
                          height={600}
                          className="w-full h-full object-cover editorial-image"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
                      </div>
                      <div className="space-y-2">
                        <p className="micro-caption">{categoryLabels[r.categories?.[0]]}</p>
                        <h3 className="font-display text-xl md:text-2xl group-hover:text-accent transition-colors">
                          {r.title}
                        </h3>
                        {r.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {r.description}
                          </p>
                        )}
                        {rPrep > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Prep {rPrep} min
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Supermarket Cards */}
      <section className={`no-print py-8 md:py-10 ${activeTab === "shop" ? "block" : "hidden"} md:block`}>
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl">
            <h2 className="heading-section mb-4 pb-3 border-b border-border">
              Shop the Ingredients
            </h2>
            <div className="grid grid-cols-9 gap-1.5 md:gap-2">
              {([
                { name: "Tesco", id: "tesco" as const, url: "https://www.tesco.com/" },
                { name: "Sainsbury's", id: "sainsburys" as const, url: "https://www.sainsburys.co.uk/" },
                { name: "ASDA", id: "asda" as const, url: "https://www.asda.com/" },
                { name: "Waitrose", id: "waitrose" as const, url: "https://www.waitrose.com/" },
                { name: "Morrisons", id: "morrisons" as const, url: "https://www.morrisons.com/" },
                { name: "Aldi", id: "aldi" as const, url: "https://www.aldi.co.uk/" },
                { name: "Lidl", id: "lidl" as const, url: "https://www.lidl.co.uk/" },
                { name: "Booths", id: "booths" as const, url: "https://www.booths.co.uk/" },
                { name: "Ocado", id: "ocado" as const, url: "https://www.ocado.com/" },
              ]).map((market) => (
                <a
                  key={market.name}
                  href={market.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Shop at ${market.name}`}
                  aria-label={`Shop at ${market.name}`}
                  className="flex items-center justify-center p-2 md:p-2.5 border border-border hover:border-muted-foreground/40 hover:bg-secondary hover:shadow-sm transition-all duration-200 group"
                >
                  <img src={supermarketLogos[market.id]} alt={market.name} className="w-7 h-7 md:w-9 md:h-9 object-contain group-hover:scale-110 transition-transform duration-200" loading="lazy" width={36} height={36} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Print-only recipe card */}
      <div
        className={`print-recipe-card ${printWithImage ? "" : "print-no-image"}`}
        aria-hidden="true"
      >
        <div className="print-section">
          <h2 className="print-title">{recipe.title}</h2>
          {recipe.description && <p className="print-description">{recipe.description}</p>}
          {recipe.image_url && (
            <img src={recipe.image_url} alt={imageAlt} className="print-image" loading="lazy" decoding="async" />
          )}
          <div className="print-meta">
            {recipe.prep_time_minutes ? (
              <div><strong>Prep</strong>{recipe.prep_time_minutes} min</div>
            ) : null}
            {recipe.cook_time_minutes ? (
              <div><strong>Cook</strong>{recipe.cook_time_minutes} min</div>
            ) : null}
            {totalTime > 0 ? (
              <div><strong>Total</strong>{totalTime} min</div>
            ) : null}
            {recipe.servings ? (
              <div><strong>Servings</strong>{currentServings}</div>
            ) : null}
          </div>
        </div>

        <section className="print-section">
          <h2>Ingredients</h2>
          <ul className="print-ingredients">
            {scaledIngredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Method</h2>
          <ol className="print-instructions">
            {instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {recipe.tips && (
          <section className="print-section">
            <h2>Chef's Tips</h2>
            <p>{recipe.tips}</p>
          </section>
        )}

        {qrDataUrl && (
          <div className="print-qr">
            <img src={qrDataUrl} alt="Scan to view recipe online" loading="lazy" decoding="async" width={120} height={120} />
            <p>
              Scan to view this recipe online
              <span>{pageUrl}</span>
            </p>
          </div>
        )}

      <div className="print-footer">stirandsimmer.co.uk</div>
      </div>
    </Layout>
  );
};

export default RecipeDetail;
