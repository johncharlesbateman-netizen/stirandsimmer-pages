// Regenerates sitemap index + per-section sitemaps from the live database.
// Runs automatically at build time via the Vite plugin in vite.config.ts.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://stirandsimmer.co.uk";

const STATIC_URLS = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/recipes", changefreq: "daily", priority: "0.9" },
  { path: "/collections", changefreq: "weekly", priority: "0.8" },
  { path: "/meal-planner", changefreq: "monthly", priority: "0.6" },
  { path: "/guides", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.4" },
];

const CATEGORY_SLUGS = [
  "chicken", "beef", "lamb", "pork", "spicy",
  "seafood", "pasta", "lunch-suggestions", "sweets",
];

const COLLECTION_SLUGS = [
  "weeknight-suppers", "italian-meals", "romantic-meals", "fish-and-seafood",
  "sweets-and-desserts", "quick-and-easy", "baking-and-bread", "healthy-eating",
];

const toDate = (s) => (s ? new Date(s).toISOString().split("T")[0] : null);

const urlEntry = (loc, lastmod, freq, pri) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`;

const wrapUrlset = (parts) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts.join("\n")}\n</urlset>\n`;

const wrapIndex = (entries) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(
      (e) =>
        `  <sitemap>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </sitemap>`,
    )
    .join("\n")}\n</sitemapindex>\n`;

export async function generateSitemap() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn("[sitemap] Missing Supabase env vars — skipping regeneration.");
    return;
  }

  const supabase = createClient(url, key);
  const [{ data: recipes, error }, { data: guides, error: guidesError }] = await Promise.all([
    supabase
      .from("recipes")
      .select("slug, updated_at")
      .eq("published", true)
      .order("updated_at", { ascending: false }),
    supabase
      .from("guides")
      .select("slug, updated_at, last_updated_at")
      .eq("published", true),
  ]);

  if (error) {
    console.error("[sitemap] DB query failed:", error.message);
    return;
  }
  if (guidesError) {
    console.error("[sitemap] Guides query failed:", guidesError.message);
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  // sitemap-pages.xml — static pages, category and collection landing pages
  const pageParts = [];
  for (const u of STATIC_URLS) pageParts.push(urlEntry(SITE + u.path, today, u.changefreq, u.priority));
  for (const slug of CATEGORY_SLUGS) pageParts.push(urlEntry(`${SITE}/recipes/category/${slug}`, today, "weekly", "0.8"));
  for (const slug of COLLECTION_SLUGS) pageParts.push(urlEntry(`${SITE}/collections/${slug}`, today, "weekly", "0.7"));

  // sitemap-recipes.xml
  const recipeParts = (recipes ?? []).map((r) =>
    urlEntry(`${SITE}/recipes/${r.slug}`, toDate(r.updated_at) ?? today, "weekly", "0.7"),
  );
  const recipesLastmod =
    (recipes ?? [])
      .map((r) => toDate(r.updated_at))
      .filter(Boolean)
      .sort()
      .pop() ?? today;

  // sitemap-guides.xml
  const guideParts = (guides ?? []).map((g) =>
    urlEntry(
      `${SITE}/guides/${g.slug}`,
      toDate(g.last_updated_at ?? g.updated_at) ?? today,
      "monthly",
      "0.7",
    ),
  );
  const guidesLastmod =
    (guides ?? [])
      .map((g) => toDate(g.last_updated_at ?? g.updated_at))
      .filter(Boolean)
      .sort()
      .pop() ?? today;

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const publicDir = resolve(__dirname, "../public");
  mkdirSync(publicDir, { recursive: true });

  writeFileSync(resolve(publicDir, "sitemap-pages.xml"), wrapUrlset(pageParts), "utf-8");
  writeFileSync(resolve(publicDir, "sitemap-recipes.xml"), wrapUrlset(recipeParts), "utf-8");
  writeFileSync(resolve(publicDir, "sitemap-guides.xml"), wrapUrlset(guideParts), "utf-8");

  const indexXml = wrapIndex([
    { loc: `${SITE}/sitemap-pages.xml`, lastmod: today },
    { loc: `${SITE}/sitemap-recipes.xml`, lastmod: recipesLastmod },
    { loc: `${SITE}/sitemap-guides.xml`, lastmod: guidesLastmod },
  ]);
  writeFileSync(resolve(publicDir, "sitemap.xml"), indexXml, "utf-8");

  console.log(
    `[sitemap] Wrote index + ${recipes?.length ?? 0} recipes, ${guides?.length ?? 0} guides, ${pageParts.length} pages`,
  );
}

// Allow running standalone: `node scripts/generate-sitemap.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap().catch((e) => { console.error(e); process.exit(1); });
}
