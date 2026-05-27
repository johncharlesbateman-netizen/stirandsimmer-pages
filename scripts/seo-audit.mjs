#!/usr/bin/env node
/**
 * SEO audit for /recipes/:slug pages.
 *
 * Validates that every recipe in the database has the data required to
 * render a complete JSON-LD Recipe schema (name, description, image,
 * prepTime, cookTime, totalTime, recipeYield, recipeIngredient,
 * recipeInstructions) plus a valid meta title (<60 chars) and meta
 * description (<155 chars).
 *
 * Mirrors the logic in src/lib/seo.ts and src/pages/RecipeDetail.tsx so
 * the audit reflects exactly what users/Google see.
 *
 * Usage:
 *   node scripts/seo-audit.mjs            # human-readable report
 *   node scripts/seo-audit.mjs --json     # JSON output for CI
 *   node scripts/seo-audit.mjs --fail     # exit 1 if any issues found
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ----- read SUPABASE_URL + anon key from .env -----
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, "../.env"), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env");
  process.exit(2);
}

const TITLE_LIMIT = 60;
const DESC_LIMIT = 155;

// ----- fetch all recipes -----
async function fetchAllRecipes() {
  const all = [];
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/recipes?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Range: `${from}-${from + pageSize - 1}`,
          "Range-Unit": "items",
          Prefer: "count=exact",
        },
      },
    );
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

// ----- mirror of src/lib/seo.ts helpers -----
const SITE_SUFFIX = " | Stir & Simmer";
const truncate = (text, limit) => {
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = lastSpace > limit * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return trimmed.replace(/[,;:.\-\s]+$/, "") + "…";
};
const stripQuantity = (i) =>
  i.replace(
    /^[\d\s\/.,⅓½¼¾⅔⅛⅜⅝⅞-]+\s*(g|kg|ml|l|tsp|tbsp|cup|cups|oz|lb|pinch|clove|cloves|slice|slices)?\s*/i,
    "",
  ).split(",")[0].trim();
const getKeyIngredients = (ings, max = 3) =>
  ings
    .filter((i) => typeof i === "string" && i.trim())
    .filter((i) => !/^(for the |for |the )/i.test(i.trim()))
    .slice(0, max).map(stripQuantity).filter(Boolean);

const buildSeoTitle = (custom, title, totalMin) => {
  if (custom?.trim()) return truncate(custom.trim(), TITLE_LIMIT);
  const base = title.trim();
  if (totalMin > 0) {
    const wt = `${base} (${totalMin} min)${SITE_SUFFIX}`;
    if (wt.length <= TITLE_LIMIT) return wt;
  }
  const ws = `${base}${SITE_SUFFIX}`;
  if (ws.length <= TITLE_LIMIT) return ws;
  return truncate(base, TITLE_LIMIT);
};
const buildSeoDescription = (custom, _title, desc, ings, totalMin) => {
  if (custom?.trim()) return truncate(custom.trim(), DESC_LIMIT);
  const key = getKeyIngredients(ings);
  const parts = [desc.trim()];
  if (key.length) parts.push(`Made with ${key.join(", ")}.`);
  if (totalMin > 0) parts.push(`Ready in ${totalMin} min.`);
  return truncate(parts.join(" "), DESC_LIMIT);
};

// ----- DB column → JSON-LD property mapping --------------------------
// Each JSON-LD property lists the DB column names it may live under, in
// priority order. Override with SCHEMA_FIELD_MAP env var (JSON), e.g.:
//   SCHEMA_FIELD_MAP='{"prepTime":["prep_minutes","prep"]}'
// to support schemas where columns are named differently.
const DEFAULT_FIELD_MAP = {
  name: ["title", "name", "recipe_name"],
  description: ["description", "summary"],
  image: ["image_url", "image", "hero_image", "photo_url", "cover_image"],
  prepTime: ["prep_time_minutes", "prep_minutes", "prep_time", "prepTime", "prep"],
  cookTime: ["cook_time_minutes", "cook_minutes", "cook_time", "cookTime", "cook"],
  totalTime: ["total_time_minutes", "total_minutes", "total_time", "totalTime"],
  recipeYield: ["servings", "yield", "serves", "recipe_yield"],
  recipeIngredient: ["ingredients", "ingredient_list", "recipe_ingredient"],
  recipeInstructions: ["instructions", "steps", "method", "directions", "recipe_instructions"],
};

function loadFieldMap() {
  const merged = { ...DEFAULT_FIELD_MAP };
  if (process.env.SCHEMA_FIELD_MAP) {
    try {
      const overrides = JSON.parse(process.env.SCHEMA_FIELD_MAP);
      for (const [k, v] of Object.entries(overrides)) {
        merged[k] = [...(Array.isArray(v) ? v : [v]), ...(merged[k] || [])];
      }
    } catch (e) {
      console.warn(`Ignoring invalid SCHEMA_FIELD_MAP: ${e.message}`);
    }
  }
  return merged;
}
const FIELD_MAP = loadFieldMap();

const pickFirst = (row, candidates) => {
  for (const key of candidates) {
    const v = row?.[key];
    if (v == null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    return v;
  }
  return null;
};

const toMinutes = (v) => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    // Accept "PT45M", "PT1H30M", "45 min", "45"
    const iso = v.match(/^PT(?:(\d+)H)?(?:(\d+)M)?/i);
    if (iso) return (Number(iso[1] || 0) * 60) + Number(iso[2] || 0);
    const num = parseInt(v, 10);
    if (!isNaN(num)) return num;
  }
  return 0;
};

// Resolve every required property from the row using the field map.
function mapRowToSchema(r) {
  const ingredients = pickFirst(r, FIELD_MAP.recipeIngredient) || [];
  const instructions = pickFirst(r, FIELD_MAP.recipeInstructions) || [];
  const image = pickFirst(r, FIELD_MAP.image);
  const servings = pickFirst(r, FIELD_MAP.recipeYield);
  const prep = toMinutes(pickFirst(r, FIELD_MAP.prepTime));
  const cook = toMinutes(pickFirst(r, FIELD_MAP.cookTime));
  const explicitTotal = toMinutes(pickFirst(r, FIELD_MAP.totalTime));
  const total = explicitTotal || (prep + cook);

  return {
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    instructions: Array.isArray(instructions) ? instructions : [],
    prep, cook, total,
    schema: {
      name: pickFirst(r, FIELD_MAP.name),
      description: pickFirst(r, FIELD_MAP.description),
      image: image ? (Array.isArray(image) ? image : [image]) : null,
      prepTime: prep ? `PT${prep}M` : null,
      cookTime: cook ? `PT${cook}M` : null,
      totalTime: total ? `PT${total}M` : null,
      recipeYield: servings ? (typeof servings === "string" ? servings : `${servings} servings`) : null,
      recipeIngredient: Array.isArray(ingredients) && ingredients.length ? ingredients : null,
      recipeInstructions: Array.isArray(instructions) && instructions.length ? instructions : null,
    },
  };
}

// ----- audit a single recipe -----
const REQUIRED_SCHEMA_FIELDS = [
  "name", "description", "image", "prepTime", "cookTime",
  "totalTime", "recipeYield", "recipeIngredient", "recipeInstructions",
];

function auditRecipe(r) {
  const issues = [];
  const { ingredients, instructions, total, schema } = mapRowToSchema(r);

  for (const f of REQUIRED_SCHEMA_FIELDS) {
    if (!schema[f]) issues.push(`schema.${f} missing`);
  }

  const titleSrc = schema.name || r.title || "";
  const descSrc = schema.description || r.description || "";
  const seoTitle = buildSeoTitle(r.seo_title, titleSrc, total);
  const seoDesc = buildSeoDescription(r.seo_description, titleSrc, descSrc, ingredients, total);

  if (!seoTitle) issues.push("meta title empty");
  else if (seoTitle.length > TITLE_LIMIT) issues.push(`meta title ${seoTitle.length} > ${TITLE_LIMIT}`);
  if (!seoDesc) issues.push("meta description empty");
  else if (seoDesc.length > DESC_LIMIT) issues.push(`meta description ${seoDesc.length} > ${DESC_LIMIT}`);

  return {
    slug: r.slug,
    title: titleSrc,
    url: `/recipes/${r.slug}`,
    seoTitle, seoTitleLen: seoTitle?.length ?? 0,
    seoDesc, seoDescLen: seoDesc?.length ?? 0,
    schemaPresent: REQUIRED_SCHEMA_FIELDS.filter((f) => schema[f]),
    schemaMissing: REQUIRED_SCHEMA_FIELDS.filter((f) => !schema[f]),
    issues,
    ok: issues.length === 0,
  };
}

// ----- duplicate detection -----
function findDuplicates(results) {
  const titleMap = new Map();
  const descMap = new Map();
  for (const r of results) {
    if (r.seoTitle) (titleMap.get(r.seoTitle) || titleMap.set(r.seoTitle, []).get(r.seoTitle)).push(r.slug);
    if (r.seoDesc) (descMap.get(r.seoDesc) || descMap.set(r.seoDesc, []).get(r.seoDesc)).push(r.slug);
  }
  return {
    titles: [...titleMap.entries()].filter(([, s]) => s.length > 1),
    descs: [...descMap.entries()].filter(([, s]) => s.length > 1),
  };
}

// ----- main -----
const args = new Set(process.argv.slice(2));
const recipes = await fetchAllRecipes();
const results = recipes.map(auditRecipe);
const failing = results.filter((r) => !r.ok);
const dups = findDuplicates(results);

if (args.has("--json")) {
  console.log(JSON.stringify({
    total: results.length,
    failing: failing.length,
    duplicateTitles: dups.titles.length,
    duplicateDescriptions: dups.descs.length,
    results,
    duplicates: dups,
  }, null, 2));
} else {
  console.log(`\nSEO audit — ${results.length} recipes\n${"=".repeat(50)}`);
  console.log(`✓ Passing: ${results.length - failing.length}`);
  console.log(`✗ Failing: ${failing.length}`);
  console.log(`⚠ Duplicate titles: ${dups.titles.length}`);
  console.log(`⚠ Duplicate descriptions: ${dups.descs.length}\n`);

  if (failing.length) {
    console.log("Issues:");
    for (const r of failing) {
      console.log(`\n  ${r.url}  (${r.title})`);
      for (const i of r.issues) console.log(`    - ${i}`);
    }
  }
  if (dups.titles.length) {
    console.log("\nDuplicate meta titles:");
    for (const [t, slugs] of dups.titles) console.log(`  "${t}" → ${slugs.join(", ")}`);
  }
  if (dups.descs.length) {
    console.log("\nDuplicate meta descriptions:");
    for (const [d, slugs] of dups.descs) console.log(`  "${d.slice(0, 80)}…" → ${slugs.join(", ")}`);
  }
  console.log();
}

if (args.has("--fail") && (failing.length || dups.titles.length || dups.descs.length)) {
  process.exit(1);
}
