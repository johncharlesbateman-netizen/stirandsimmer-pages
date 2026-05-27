#!/usr/bin/env node
/**
 * Backfill prep_time_minutes and cook_time_minutes for recipes that
 * don't have them set yet. Sensible category-based defaults, adjusted
 * slightly upward for recipes with more ingredients or more steps.
 *
 * Idempotent: only updates rows where the column is currently NULL.
 *
 * Usage:
 *   node scripts/backfill-recipe-times.mjs --dry-run   # preview only
 *   node scripts/backfill-recipe-times.mjs --apply     # actually update (needs service role)
 *
 * In CI / Lovable Cloud the equivalent SQL has already been applied via
 * the supabase insert tool — this script exists so the same logic can be
 * re-run safely if more recipes are imported in the future.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = Object.fromEntries(
  readFileSync(resolve(__dirname, "../.env"), "utf8")
    .split("\n").filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    }),
);

// Base cook time (minutes) per recipe category.
const COOK_DEFAULTS = {
  beef: 30,
  chicken: 30,
  lamb: 35,
  pork: 30,
  seafood: 15,
  spicy: 25,
  pasta: 20,
  sweets: 35,
  lunch_suggestions: 15,
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function deriveTimes(recipe) {
  const ings = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
  const steps = Array.isArray(recipe.instructions) ? recipe.instructions.length : 0;

  // Prep scales with ingredient count; min 10, max 30.
  const prep = clamp(10 + Math.floor(Math.max(0, ings - 6) * 1.5), 10, 30);

  // Cook starts from category default, +2 min for each step beyond 6 (cap at +20).
  const baseCook = COOK_DEFAULTS[recipe.category] ?? 25;
  const cook = clamp(baseCook + Math.min(20, Math.max(0, steps - 6) * 2), 10, 90);

  return { prep, cook };
}

async function fetchRecipesNeedingTimes() {
  const url = `${env.VITE_SUPABASE_URL}/rest/v1/recipes` +
    `?select=id,slug,title,category,ingredients,instructions,prep_time_minutes,cook_time_minutes` +
    `&or=(prep_time_minutes.is.null,cook_time_minutes.is.null)`;
  const res = await fetch(url, {
    headers: {
      apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const dryRun = args.has("--dry-run") || !apply;

const recipes = await fetchRecipesNeedingTimes();
console.log(`Found ${recipes.length} recipes needing prep/cook times\n`);

const updates = recipes.map((r) => {
  const { prep, cook } = deriveTimes(r);
  return {
    id: r.id,
    slug: r.slug,
    prep: r.prep_time_minutes ?? prep,
    cook: r.cook_time_minutes ?? cook,
  };
});

console.log("slug                                                          prep  cook");
console.log("─".repeat(78));
for (const u of updates.slice(0, 20)) {
  console.log(u.slug.padEnd(60), String(u.prep).padStart(4), String(u.cook).padStart(5));
}
if (updates.length > 20) console.log(`… and ${updates.length - 20} more`);

if (dryRun) {
  console.log("\nDry run — no changes written. Pass --apply to update.");
  process.exit(0);
}

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error("\n--apply requires SUPABASE_SERVICE_ROLE_KEY env var (RLS only allows admins to update recipes).");
  process.exit(2);
}

let ok = 0, fail = 0;
for (const u of updates) {
  const res = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/recipes?id=eq.${u.id}`,
    {
      method: "PATCH",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ prep_time_minutes: u.prep, cook_time_minutes: u.cook }),
    },
  );
  if (res.ok) ok++;
  else { fail++; console.error(`✗ ${u.slug}: ${res.status} ${await res.text()}`); }
}
console.log(`\nUpdated ${ok}/${updates.length} recipes (${fail} failed).`);
