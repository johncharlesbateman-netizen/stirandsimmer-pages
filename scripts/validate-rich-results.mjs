#!/usr/bin/env node
/**
 * Rich Results-style validator for live recipe pages.
 *
 * Loads a sample of /recipes/:slug URLs in a headless browser (so React
 * has a chance to inject the JSON-LD <script>), then checks each page
 * has a Recipe schema with all required fields plus valid meta title
 * and meta description.
 *
 * Exits non-zero on any failure — designed for CI.
 *
 * Usage:
 *   node scripts/validate-rich-results.mjs                   # default site, 10 sampled URLs
 *   SITE_URL=https://staging.example.com node scripts/...    # override origin
 *   SAMPLE_SIZE=20 node scripts/validate-rich-results.mjs    # check more URLs
 *   node scripts/validate-rich-results.mjs --all             # check every recipe
 *   node scripts/validate-rich-results.mjs --slugs a,b,c     # check specific slugs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = (process.env.SITE_URL || "https://stirandsimmer.co.uk").replace(/\/$/, "");
const SAMPLE_SIZE = Number(process.env.SAMPLE_SIZE || 10);
const TIMEOUT_MS = Number(process.env.PAGE_TIMEOUT_MS || 20000);

const REQUIRED_SCHEMA_FIELDS = [
  "name", "description", "image", "prepTime", "cookTime",
  "totalTime", "recipeYield", "recipeIngredient", "recipeInstructions",
];
const TITLE_LIMIT = 60;
const DESC_LIMIT = 155;

// ---- read .env so we can hit Supabase to enumerate slugs ----
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, "../.env"), "utf8")
    .split("\n").filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

async function fetchAllSlugs() {
  const url = `${env.VITE_SUPABASE_URL}/rest/v1/recipes?select=slug&order=updated_at.desc`;
  const res = await fetch(url, {
    headers: {
      apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return (await res.json()).map((r) => r.slug);
}

function pickSample(arr, n) {
  if (n >= arr.length) return arr;
  // Deterministic sample: first, last, and evenly-spaced in between.
  const out = [];
  const step = (arr.length - 1) / (n - 1);
  for (let i = 0; i < n; i++) out.push(arr[Math.round(i * step)]);
  return [...new Set(out)];
}

// ---- per-page validation ----
async function validatePage(page, slug) {
  const url = `${SITE_URL}/recipes/${slug}`;
  const issues = [];
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT_MS });
    // Wait for the JSON-LD script the recipe page injects.
    await page.waitForSelector('script[type="application/ld+json"]', { timeout: TIMEOUT_MS })
      .catch(() => null);

    const data = await page.evaluate(() => {
      const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
      let recipe = null;
      for (const s of scripts) {
        try {
          const parsed = JSON.parse(s.textContent || "{}");
          const candidates = Array.isArray(parsed) ? parsed : [parsed];
          for (const c of candidates) {
            if (c && (c["@type"] === "Recipe" || (Array.isArray(c["@type"]) && c["@type"].includes("Recipe")))) {
              recipe = c;
              break;
            }
          }
          if (recipe) break;
        } catch { /* ignore malformed */ }
      }
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
        recipe,
      };
    });

    if (!data.recipe) {
      issues.push("No Recipe JSON-LD found on page");
    } else {
      for (const f of REQUIRED_SCHEMA_FIELDS) {
        const v = data.recipe[f];
        const empty = v == null || v === "" || (Array.isArray(v) && v.length === 0);
        if (empty) issues.push(`schema.${f} missing`);
      }
      // ISO 8601 duration sanity check
      for (const f of ["prepTime", "cookTime", "totalTime"]) {
        const v = data.recipe[f];
        if (v && !/^P(T\d+[HMS])+/.test(String(v))) issues.push(`schema.${f} not ISO 8601 (got "${v}")`);
      }
    }

    if (!data.title) issues.push("meta title empty");
    else if (data.title.length > TITLE_LIMIT) issues.push(`meta title ${data.title.length} > ${TITLE_LIMIT}`);
    if (!data.description) issues.push("meta description empty");
    else if (data.description.length > DESC_LIMIT) issues.push(`meta description ${data.description.length} > ${DESC_LIMIT}`);

    return { url, ok: issues.length === 0, issues, title: data.title };
  } catch (err) {
    return { url, ok: false, issues: [`page load failed: ${err.message}`] };
  }
}

// ---- main ----
const args = process.argv.slice(2);
const slugsArg = args.find((a) => a.startsWith("--slugs="));
const all = args.includes("--all");

let slugs;
if (slugsArg) {
  slugs = slugsArg.replace("--slugs=", "").split(",").filter(Boolean);
} else {
  const allSlugs = await fetchAllSlugs();
  slugs = all ? allSlugs : pickSample(allSlugs, SAMPLE_SIZE);
}

console.log(`Validating ${slugs.length} recipe URLs against ${SITE_URL}\n`);

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: "LovableRichResultsBot/1.0" });
const page = await context.newPage();

const results = [];
for (const slug of slugs) {
  const r = await validatePage(page, slug);
  results.push(r);
  const mark = r.ok ? "✓" : "✗";
  console.log(`${mark} ${r.url}`);
  for (const i of r.issues) console.log(`    - ${i}`);
}
await browser.close();

const failing = results.filter((r) => !r.ok);
console.log(`\n${results.length - failing.length}/${results.length} passing`);

if (failing.length) {
  console.error(`\n${failing.length} URL(s) failed Rich Results validation`);
  process.exit(1);
}
