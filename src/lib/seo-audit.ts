// Shared SEO audit logic used by:
//   - scripts/seo-audit.mjs   (Node CI script)
//   - src/pages/AdminSeoStatus.tsx  (in-app admin dashboard)
//
// Mirrors the JSON-LD that src/pages/RecipeDetail.tsx renders, so a
// recipe that "passes" here will produce a complete Recipe schema for
// Google.

import { buildSeoTitle, buildSeoDescription } from "@/lib/seo";

export const TITLE_LIMIT = 60;
export const DESC_LIMIT = 155;

export const REQUIRED_SCHEMA_FIELDS = [
  "name",
  "description",
  "image",
  "prepTime",
  "cookTime",
  "totalTime",
  "recipeYield",
  "recipeIngredient",
  "recipeInstructions",
] as const;

export type SchemaField = (typeof REQUIRED_SCHEMA_FIELDS)[number];

export interface AuditableRecipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number | null;
  ingredients: unknown;
  instructions: unknown;
  seo_title: string | null;
  seo_description: string | null;
}

export interface AuditResult {
  id: string;
  slug: string;
  title: string;
  category: string;
  url: string;
  ok: boolean;
  issues: string[];
  schemaPresent: SchemaField[];
  schemaMissing: SchemaField[];
  seoTitle: string;
  seoTitleLen: number;
  seoDesc: string;
  seoDescLen: number;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  hasImage: boolean;
  ingredientCount: number;
  instructionCount: number;
}

export function auditRecipe(r: AuditableRecipe): AuditResult {
  const ingredients = Array.isArray(r.ingredients) ? (r.ingredients as string[]) : [];
  const instructions = Array.isArray(r.instructions) ? (r.instructions as string[]) : [];
  const prep = r.prep_time_minutes ?? 0;
  const cook = r.cook_time_minutes ?? 0;
  const total = prep + cook;

  const schema: Record<SchemaField, unknown> = {
    name: r.title,
    description: r.description,
    image: r.image_url ? [r.image_url] : null,
    prepTime: prep ? `PT${prep}M` : null,
    cookTime: cook ? `PT${cook}M` : null,
    totalTime: total ? `PT${total}M` : null,
    recipeYield: r.servings ? `${r.servings} servings` : null,
    recipeIngredient: ingredients.length ? ingredients : null,
    recipeInstructions: instructions.length ? instructions : null,
  };

  const isEmpty = (v: unknown) =>
    v == null || v === "" || (Array.isArray(v) && v.length === 0);

  const schemaMissing = REQUIRED_SCHEMA_FIELDS.filter((f) => isEmpty(schema[f]));
  const schemaPresent = REQUIRED_SCHEMA_FIELDS.filter((f) => !isEmpty(schema[f]));

  const issues: string[] = schemaMissing.map((f) => `schema.${f} missing`);

  const seoTitle = buildSeoTitle(r.seo_title, r.title, total);
  const seoDesc = buildSeoDescription(
    r.seo_description,
    r.title,
    r.description,
    ingredients,
    total,
  );

  if (!seoTitle) issues.push("meta title empty");
  else if (seoTitle.length > TITLE_LIMIT)
    issues.push(`meta title ${seoTitle.length} > ${TITLE_LIMIT}`);
  if (!seoDesc) issues.push("meta description empty");
  else if (seoDesc.length > DESC_LIMIT)
    issues.push(`meta description ${seoDesc.length} > ${DESC_LIMIT}`);

  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    url: `/recipes/${r.slug}`,
    ok: issues.length === 0,
    issues,
    schemaPresent,
    schemaMissing,
    seoTitle,
    seoTitleLen: seoTitle.length,
    seoDesc,
    seoDescLen: seoDesc.length,
    prepMinutes: prep,
    cookMinutes: cook,
    totalMinutes: total,
    hasImage: !!r.image_url,
    ingredientCount: ingredients.length,
    instructionCount: instructions.length,
  };
}

export function findDuplicates(results: AuditResult[]) {
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  for (const r of results) {
    if (r.seoTitle) {
      if (!titleMap.has(r.seoTitle)) titleMap.set(r.seoTitle, []);
      titleMap.get(r.seoTitle)!.push(r.slug);
    }
    if (r.seoDesc) {
      if (!descMap.has(r.seoDesc)) descMap.set(r.seoDesc, []);
      descMap.get(r.seoDesc)!.push(r.slug);
    }
  }
  const dupTitles = new Set<string>();
  const dupDescs = new Set<string>();
  for (const [, slugs] of titleMap) if (slugs.length > 1) slugs.forEach((s) => dupTitles.add(s));
  for (const [, slugs] of descMap) if (slugs.length > 1) slugs.forEach((s) => dupDescs.add(s));
  return { dupTitles, dupDescs };
}
