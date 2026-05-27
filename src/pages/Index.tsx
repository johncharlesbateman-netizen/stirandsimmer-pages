import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { BookOpen, Map, CalendarDays, UtensilsCrossed, ArrowRight } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { collections } from "@/lib/collections";
import { Tables } from "@/integrations/supabase/types";
import { useRecipeCount } from "@/hooks/useRecipeCount";

import { supabase } from "@/integrations/supabase/client";

const FEATURED_SLUGS = [
  "butter-chicken",
  "spaghetti-bolognese",
  "best-coq-au-vin",
  "pan-fried-salmon-with-pea-citrus-crush",
  "panna-cotta-with-raspberry-compote",
  "prawn-and-chorizo-rice",
];

// Self-hosted hero — emitted to /public/hero/ as same-origin WebP. Avoids
// the third-party DNS+TLS+CDN render hop that was costing ~1 s of LCP.
const heroImage = "/hero/hero-1280.webp";
const heroImageSrcSet = [480, 768, 1024, 1280, 1600]
  .map((w) => `/hero/hero-${w}.webp ${w}w`)
  .join(", ");
const heroImageSizes = "100vw";

const Index = () => {
  const recipeCount = useRecipeCount();
  const [featured, setFeatured] = useState<Tables<"recipes">[]>([]);
  // True when the prerender has injected an <img id="lcp-hero"> + overlay
  // into the static HTML. In that case React must NOT render its own hero
  // <img>, otherwise the browser swaps LCP candidates once we mount and we
  // lose the early paint. In dev (no prerender) this stays false and the
  // React img renders as a fallback.
  const [hasBootstrapHero] = useState(
    () => typeof document !== "undefined" && !!document.getElementById("lcp-hero"),
  );

  useEffect(() => {
    if (!hasBootstrapHero) return;
    // After hydration, drop the bootstrap from `fixed` to `absolute` height:100vh
    // so it scrolls away with the hero section rather than covering content below.
    document.documentElement.classList.add("lcp-hero-dismissed");
  }, [hasBootstrapHero]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .in("slug", FEATURED_SLUGS);
      if (!cancelled && !error && data) {
        const ordered = FEATURED_SLUGS
          .map((s) => data.find((r) => r.slug === s))
          .filter((r): r is Tables<"recipes"> => Boolean(r));
        setFeatured(ordered);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const collectionCount = collections.length;

  return (
    <Layout>
      <Helmet>
        <title>Stir & Simmer | Real Recipes for UK Home Cooks</title>
        <link rel="preload" as="image" href={heroImage} imageSrcSet={heroImageSrcSet} imageSizes="100vw" fetchPriority="high" />
        <meta name="description" content={`${recipeCount ? `Over ${recipeCount} ` : ""}tried-and-tested recipes for UK home cooks. No cheffy techniques, no obscure ingredients — just honest food that works. Grams, Celsius, supermarket ingredients.`} />
        <meta name="keywords" content="recipes, easy recipes, dinner recipes, dessert recipes, quick meals" />
        <link rel="canonical" href="https://stirandsimmer.co.uk/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/" />
        <meta property="og:title" content="Stir & Simmer | Real Recipes for UK Home Cooks" />
        <meta property="og:description" content={`${recipeCount ? `Over ${recipeCount} ` : ""}tried-and-tested recipes for UK home cooks. No cheffy techniques, no obscure ingredients — just honest food that works. Grams, Celsius, supermarket ingredients.`} />
        <meta property="og:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stir & Simmer | Real Recipes for UK Home Cooks" />
        <meta name="twitter:description" content={`${recipeCount ? `Over ${recipeCount} ` : ""}tried-and-tested recipes for UK home cooks. No cheffy techniques, no obscure ingredients — just honest food that works. Grams, Celsius, supermarket ingredients.`} />
        <meta name="twitter:image" content="https://stirandsimmer.co.uk/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Stir & Simmer",
          "url": "https://stirandsimmer.co.uk",
          "description": "Curated recipes crafted with fresh ingredients, bold flavours, and a whole lot of love.",
          "publisher": {
            "@type": "Organization",
            "name": "Stir & Simmer",
            "url": "https://stirandsimmer.co.uk"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://stirandsimmer.co.uk/recipes?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Stir & Simmer",
          "url": "https://stirandsimmer.co.uk",
          "description": "A UK recipe site built for people who love good food but live real lives",
          "sameAs": ["https://www.instagram.com/stirandsimmeruk"]
        })}</script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" style={{ marginTop: '-5rem' }}>
        {/* Background image — only rendered when the prerendered bootstrap
            hero isn't present (i.e. dev / local). In production the static
            <img id="lcp-hero"> + overlay injected by scripts/prerender.mjs
            already cover the viewport, and re-rendering them here would
            cause Chrome to re-pick the LCP candidate. */}
        {!hasBootstrapHero && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              srcSet={heroImageSrcSet}
              sizes="100vw"
              alt="Rustic table laid with freshly cooked dishes, herbs and warm natural light"
              fetchPriority="high"
              decoding="async"
              width={1600}
              height={1067}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center text-primary-foreground px-6 max-w-4xl">
          <p 
            className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Stir & Simmer
          </p>
          <h1 
            className="font-display mb-6 opacity-0 animate-fade-in leading-tight"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards", fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Your kitchen. The world's cuisines.
          </h1>
          <div
            className="mt-10 flex flex-col items-center gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            <Link
              to="/recipes"
              className="group inline-flex items-center gap-2 tracking-[0.2em] uppercase text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              style={{ fontSize: "13px" }}
            >
              <span className="underline-offset-4 group-hover:underline">
                Browse {recipeCount ? `all ${recipeCount} ` : ""}tried-and-tested recipes
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div aria-hidden className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in z-10" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
          <div className="w-px h-16 bg-primary-foreground/50 animate-pulse" />
        </div>

        {/* Bottom blend into warm dark section below */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none bg-gradient-to-b from-warm-dark/0 via-warm-dark/60 to-warm-dark"
        />
      </section>

      {/* Editorial intro */}
      <section className="pt-16 md:pt-24 pb-4 md:pb-8 bg-warm-dark text-warm-dark-foreground">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <p className="max-w-2xl mx-auto text-center font-display text-lg md:text-xl leading-relaxed text-warm-dark-foreground/90">
            Stir &amp; Simmer is a UK recipe site built for people who love good food but live real lives. Every recipe is tested in a real kitchen, written in grams and Celsius, and made with ingredients you'll find at your local supermarket. No cheffy techniques. No obscure ingredients. Just honest food that works.
          </p>
          <div aria-hidden className="mx-auto mt-8 h-px w-12 bg-warm-dark-foreground/25" />
        </div>
      </section>

      {/* Featured Recipes */}
      {featured.length > 0 && (
        <section
          className="py-16 md:py-24 bg-warm-dark text-warm-dark-foreground"
          aria-labelledby="featured-recipes-heading"
        >
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="text-center mb-12 md:mb-16">
              <p className="micro-caption mb-4 text-warm-amber">Featured</p>
              <h2
                id="featured-recipes-heading"
                className="heading-editorial text-warm-dark-foreground"
              >
                Recipes worth making
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 [&_h3]:text-warm-dark-foreground [&_.micro-caption]:text-warm-amber [&_p]:text-warm-dark-foreground/75">
              {featured.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} floatDelay={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="h-px bg-border" aria-hidden />

      {/* Explore the site */}
      <section
        className="py-16 md:py-24 bg-warm-dark text-warm-dark-foreground"
        aria-labelledby="explore-heading"
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-12 md:mb-16">
            <p className="micro-caption mb-4 text-warm-amber">Explore</p>
            <h2 id="explore-heading" className="heading-editorial text-warm-dark-foreground">
              Find your way around
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                to: "/recipes",
                icon: UtensilsCrossed,
                title: "Recipes",
                desc: "Browse every tried-and-tested recipe on the site.",
                imageId: 1640777,
                alt: "Rustic table laid with cooked dishes",
              },
              {
                to: "/meal-planner",
                icon: CalendarDays,
                title: "Meal Planner",
                desc: "Plan your week and build a shopping list in minutes.",
                imageId: 1640772,
                alt: "Notebook and fresh ingredients on a wooden surface",
              },
              {
                to: "/guides",
                icon: BookOpen,
                title: "Guides",
                desc: "Master the techniques behind the recipes you love.",
                imageId: 1640773,
                alt: "Overhead view of a fresh prepared dish",
              },
              {
                to: "/kitchen-atlas",
                icon: Map,
                title: "Kitchen Atlas",
                desc: "Travel the world's cuisines from your own kitchen.",
                imageId: 1640774,
                alt: "Overhead view of a colourful plated dish",
              },
            ].map(({ to, icon: Icon, title, desc, imageId, alt }) => {
              const base = `https://images.pexels.com/photos/${imageId}/pexels-photo-${imageId}.jpeg?auto=compress&cs=tinysrgb&fm=webp`;
              const srcSet = [400, 600, 800, 1200].map((w) => `${base}&w=${w} ${w}w`).join(", ");
              return (
                <Link
                  key={to}
                  to={to}
                  className="group relative block overflow-hidden min-h-[340px] md:min-h-[380px] border border-warm-dark-foreground/15 text-warm-dark-foreground transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                >
                  <img
                    src={`${base}&w=800`}
                    srcSet={srcSet}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    style={{ filter: "brightness(1.15) saturate(0.85) sepia(0.15)" }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-warm-dark/90 via-warm-dark/60 to-warm-dark/30"
                  />
                  <div className="relative p-6 md:p-7 flex flex-col h-full min-h-[340px] md:min-h-[380px]">
                    <Icon className="w-7 h-7 mb-auto text-warm-amber" strokeWidth={1.5} />
                    <div className="mt-6">
                      <h3 className="font-display text-2xl mb-2 transition-transform duration-500 group-hover:translate-x-1 text-warm-dark-foreground">
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5 line-clamp-2 min-h-[2.75rem] text-warm-dark-foreground/85">
                        {desc}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-warm-amber">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Index;
