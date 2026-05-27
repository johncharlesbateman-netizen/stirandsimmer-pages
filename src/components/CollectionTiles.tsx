import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { collections } from "@/lib/collections";
import { supabase } from "@/integrations/supabase/client";

// Build a responsive srcset for Pexels image URLs by replacing the `w=` param.
const pexelsSrcSet = (url: string): string | undefined => {
  if (!url.includes("images.pexels.com")) return undefined;
  return [400, 600, 800, 1200, 1600]
    .map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`)
    .join(", ");
};

interface CollectionTilesProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  asH1?: boolean;
}

const CollectionTiles = ({
  eyebrow = "Collections",
  heading = "Curated for the way you cook",
  intro = "Hand-picked groups of recipes for every kind of meal — from quick weeknight dinners to elegant dishes for two.",
  asH1 = false,
}: CollectionTilesProps) => {
  const HeadingTag = asH1 ? "h1" : "h2";

  const { data: counts } = useQuery({
    queryKey: ["collection-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("collections").eq("published", true);
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
    <section className="section-breathing border-t border-border">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {(eyebrow || heading || intro) && (
          <div className="max-w-2xl mb-12">
            {eyebrow && <p className="micro-caption mb-4">{eyebrow}</p>}
            {heading && <HeadingTag className="heading-editorial mb-4">{heading}</HeadingTag>}
            {intro && (
              <p className="text-muted-foreground text-lg leading-relaxed">{intro}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {collections.map((c) => {
            const Icon = c.icon;
            const count = counts?.[c.name] ?? 0;
            return (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                aria-label={`${c.title} collection — ${count} ${count === 1 ? "recipe" : "recipes"}`}
                className="group relative block overflow-hidden border border-border/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 min-h-[420px]"
              >
                {/* Background image */}
                <img
                  src={c.image}
                  srcSet={pexelsSrcSet(c.image)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  alt={`${c.title} recipe collection`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                {/* Dark gradient overlay for legibility */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/55"
                />

                <div className="relative p-6 md:p-7 flex flex-col h-full min-h-[420px] text-white">
                  <div className="flex items-start justify-between mb-auto">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/25">
                      <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                    </div>
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-90 mt-1">
                      {count} {count === 1 ? "recipe" : "recipes"}
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-xl md:text-2xl mb-2 leading-tight transition-transform duration-500 group-hover:translate-x-1">
                      {c.title}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-85 mb-5">
                      {c.tagline}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase opacity-90 group-hover:opacity-100 transition-opacity">
                      View collection
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
  );
};

export default CollectionTiles;
