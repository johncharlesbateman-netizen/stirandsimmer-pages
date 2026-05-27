// Dynamic sitemap.xml — pulls recipes and guides live from the database.
// Public endpoint, no JWT required.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://stirandsimmer.co.uk";

const toDate = (v: string | null | undefined): string => {
  if (!v) return new Date().toISOString().split("T")[0];
  return new Date(v).toISOString().split("T")[0];
};

const STATIC_URLS: Array<{ loc: string; changefreq: string; priority: string }> = [
  { loc: `${SITE}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE}/recipes`, changefreq: "daily", priority: "0.9" },
  { loc: `${SITE}/kitchen-atlas`, changefreq: "weekly", priority: "0.8" },
  { loc: `${SITE}/collections`, changefreq: "weekly", priority: "0.8" },
  { loc: `${SITE}/guides`, changefreq: "weekly", priority: "0.7" },
  { loc: `${SITE}/meal-planner`, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE}/about`, changefreq: "monthly", priority: "0.5" },
  { loc: `${SITE}/contact`, changefreq: "monthly", priority: "0.4" },
  { loc: `${SITE}/privacy`, changefreq: "yearly", priority: "0.3" },
];

// Tile category slugs — must match src/lib/recipe-tiles.ts and the
// /recipes/category/:slug route in src/App.tsx.
const CATEGORY_SLUGS = [
  "all",
  "chicken",
  "beef",
  "lamb",
  "fish-and-seafood",
  "pork",
  "quick-meals",
  "spicy",
  "pasta-and-rice",
  "puddings-and-desserts",
];

const COLLECTION_SLUGS = [
  "weeknight-suppers", "italian-meals", "romantic-meals", "fish-and-seafood",
  "sweets-and-desserts", "quick-and-easy", "baking-and-bread", "healthy-eating",
];

// Cuisine region IDs — match src/lib/cuisine-regions.ts and the
// /recipes/region/:regionId route.
const REGION_SLUGS = [
  "italian", "french", "british", "indian", "asian",
  "spicy", "seasonal", "comfort",
];

const buildUrl = (
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const [recipesRes, guidesRes] = await Promise.all([
      supabase
        .from("recipes")
        .select("slug, updated_at")
        .eq("published", true)
        .order("updated_at", { ascending: false }),
      supabase
        .from("guides")
        .select("slug, updated_at, last_updated_at, published")
        .eq("published", true),
    ]);

    if (recipesRes.error) throw recipesRes.error;
    if (guidesRes.error) throw guidesRes.error;

    const today = new Date().toISOString().split("T")[0];

    // lastmod for site-wide pages = newest recipe update (so search engines
    // know the catalogue moves even when static copy doesn't).
    const newestRecipeUpdate = recipesRes.data?.[0]?.updated_at
      ? toDate(recipesRes.data[0].updated_at)
      : today;

    const urls: string[] = [];

    for (const u of STATIC_URLS) {
      // Use the freshest signal we have for index/listing pages.
      const lastmod =
        u.loc === `${SITE}/` ||
        u.loc === `${SITE}/recipes` ||
        u.loc === `${SITE}/collections` ||
        u.loc === `${SITE}/kitchen-atlas`
          ? newestRecipeUpdate
          : today;
      urls.push(buildUrl(u.loc, lastmod, u.changefreq, u.priority));
    }

    for (const slug of CATEGORY_SLUGS) {
      urls.push(
        buildUrl(
          `${SITE}/recipes/category/${slug}`,
          newestRecipeUpdate,
          "weekly",
          "0.8",
        ),
      );
    }

    for (const slug of REGION_SLUGS) {
      urls.push(
        buildUrl(
          `${SITE}/recipes/region/${slug}`,
          newestRecipeUpdate,
          "weekly",
          "0.7",
        ),
      );
    }

    for (const slug of COLLECTION_SLUGS) {
      urls.push(
        buildUrl(
          `${SITE}/collections/${slug}`,
          newestRecipeUpdate,
          "weekly",
          "0.7",
        ),
      );
    }

    // Hard-coded guide pages (live React components) — included even if the
    // DB has no row for them yet.
    const STATIC_GUIDES = ["mother-sauces", "french-techniques"];
    const guideLastmodMap = new Map<string, string>();
    for (const g of guidesRes.data ?? []) {
      const stamp = g.last_updated_at ?? g.updated_at;
      if (g.slug) guideLastmodMap.set(g.slug, toDate(stamp));
    }
    for (const slug of STATIC_GUIDES) {
      urls.push(
        buildUrl(
          `${SITE}/guides/${slug}`,
          guideLastmodMap.get(slug) ?? today,
          "monthly",
          "0.7",
        ),
      );
      guideLastmodMap.delete(slug);
    }
    // Any additional published guides from the database.
    for (const [slug, lastmod] of guideLastmodMap) {
      urls.push(buildUrl(`${SITE}/guides/${slug}`, lastmod, "monthly", "0.7"));
    }

    for (const r of recipesRes.data ?? []) {
      urls.push(
        buildUrl(
          `${SITE}/recipes/${r.slug}`,
          toDate(r.updated_at),
          "weekly",
          "0.7",
        ),
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

    return new Response(xml, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  } catch (e) {
    return new Response(`Error generating sitemap: ${(e as Error).message}`, { status: 500 });
  }
});
