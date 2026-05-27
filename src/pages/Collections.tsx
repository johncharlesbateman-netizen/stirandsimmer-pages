import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import RecipeCard from "@/components/RecipeCard";
import CollectionTiles from "@/components/CollectionTiles";
import { supabase } from "@/integrations/supabase/client";
import {
  collections,
  collectionBySlug,
  isCollectionSlug,
} from "@/lib/collections";

const Collections = () => {
  const { slug } = useParams<{ slug?: string }>();

  // /collections/:slug — single collection view
  if (slug) {
    if (!isCollectionSlug(slug)) {
      return (
        <Layout>
          <div className="container mx-auto px-6 md:px-12 lg:px-20 py-20 text-center">
            <h1 className="heading-display mb-4">Meal idea not found</h1>
            <p className="text-muted-foreground mb-8">
              We don't have a meal idea at this address.
            </p>
            <Link
              to="/collections"
              className="text-sm tracking-wider uppercase underline underline-offset-4"
            >
              Browse all meal ideas
            </Link>
          </div>
        </Layout>
      );
    }
    return <CollectionDetail slug={slug} />;
  }

  // /collections — index
  return <CollectionsIndex />;
};

const CollectionsIndex = () => {
  // Pull recipe counts per collection so each tile can show how many.
  const { data: counts } = useQuery({
    queryKey: ["collection-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("collections")
        .eq("published", true);
      if (error) throw error;
      const tally: Record<string, number> = {};
      for (const row of data ?? []) {
        for (const name of row.collections ?? []) {
          tally[name] = (tally[name] ?? 0) + 1;
        }
      }
      return tally;
    },
  });

  return (
    <Layout>
      <Helmet>
        <title>Meal Ideas | Stir & Simmer</title>
        <meta
          name="description"
          content="Browse our handpicked meal ideas — Weeknight Suppers, Italian Meals, Romantic Meals, Sunday Roasts and more. Recipe collections for every occasion."
        />
        <link rel="canonical" href="https://stirandsimmer.co.uk/collections" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stirandsimmer.co.uk/collections" />
        <meta property="og:title" content="Meal Ideas | Stir & Simmer" />
        <meta property="og:description" content="Browse our handpicked meal ideas — Weeknight Suppers, Italian Meals, Romantic Meals, Sunday Roasts and more. Recipe collections for every occasion." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meal Ideas | Stir & Simmer" />
        <meta name="twitter:description" content="Browse our handpicked meal ideas — Weeknight Suppers, Italian Meals, Romantic Meals, Sunday Roasts and more. Recipe collections for every occasion." />
      </Helmet>

      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <p className="micro-caption mb-4">Meal Ideas</p>
          <h1 className="heading-display mb-6">Meal Ideas</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Curated groups of recipes for every kind of meal. Pick a meal idea
            to see the recipes inside.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {collections.map((c) => {
              const count = counts?.[c.name] ?? 0;
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  to={`/collections/${c.slug}`}
                  aria-label={`${c.title} collection — ${count} ${count === 1 ? "recipe" : "recipes"}`}
                  className="group relative block overflow-hidden border border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 min-h-[340px]"
                >
                  <img
                    src={c.image}
                    alt={`${c.title} recipe collection`}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/55"
                  />
                  <div className="relative p-7 md:p-8 flex flex-col h-full min-h-[340px] text-white">
                    <div className="flex items-start justify-between mb-auto">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/25">
                        <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                      </div>
                      <span className="text-[10px] tracking-[0.2em] uppercase opacity-90 mt-1">
                        {count} {count === 1 ? "recipe" : "recipes"}
                      </span>
                    </div>
                    <div className="mt-6">
                      <h2 className="font-display text-2xl md:text-3xl mb-3 leading-tight transition-transform duration-500 group-hover:translate-x-1">
                        {c.title}
                      </h2>
                      <p className="text-sm md:text-base opacity-85 leading-relaxed mb-6">
                        {c.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase opacity-90 group-hover:opacity-100 transition-opacity">
                        View meal idea
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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

const CollectionDetail = ({ slug }: { slug: keyof typeof collectionBySlug }) => {
  const def = collectionBySlug[slug];

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", "collection", def.name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .contains("collections", [def.name])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const otherCollections = useMemo(
    () => collections.filter((c) => c.slug !== def.slug).slice(0, 3),
    [def.slug],
  );

  return (
    <Layout>
      <Helmet>
        <title>{`${def.title} | Stir & Simmer`}</title>
        <meta name="description" content={def.description} />
        <link
          rel="canonical"
          href={`https://stirandsimmer.co.uk/collections/${def.slug}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://stirandsimmer.co.uk/collections/${def.slug}`} />
        <meta property="og:title" content={`${def.title} | Stir & Simmer`} />
        <meta property="og:description" content={def.description} />
        {def.image && <meta property="og:image" content={def.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${def.title} | Stir & Simmer`} />
        <meta name="twitter:description" content={def.description} />
        {def.image && <meta name="twitter:image" content={def.image} />}
      </Helmet>

      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <Link
            to="/collections"
            className="micro-caption mb-4 inline-block hover:opacity-70 transition-opacity"
          >
            ← All Meal Ideas
          </Link>
          <h1 className="heading-display mb-6">{def.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {def.description}
          </p>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-6 w-3/4 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : recipes && recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {recipes.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} floatDelay={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="heading-section text-muted-foreground mb-4">
                No recipes in this meal idea yet
              </p>
              <p className="text-muted-foreground">
                Check back soon — we're always adding new dishes.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Other collections */}
      <section className="py-16 md:py-20 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-10 md:mb-12">
            <p className="micro-caption mb-3">Keep Exploring</p>
            <h2 className="heading-editorial">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherCollections.map((c) => (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                style={{ height: "250px" }}
                className="group relative block overflow-hidden"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                  <h3 className="font-display text-2xl mb-2">{c.title}</h3>
                  <p className="text-sm text-primary-foreground/85 leading-relaxed">
                    {c.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
