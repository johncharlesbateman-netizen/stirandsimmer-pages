// Cuisine regions used to tag recipes. Each recipe belongs to a single
// cuisine region. Region slugs map directly to challenge regions in
// The Daily Pass app — keep the slugs identical.

export const CUISINE_REGIONS = [
  "italian",
  "french",
  "british",
  "spanish",
  "indian",
  "asian",
  "mexican",
  "thai",
  "japanese",
  "mediterranean",
  "middle-eastern",
] as const;

export type CuisineRegion = (typeof CUISINE_REGIONS)[number];

export const cuisineRegionLabels: Record<CuisineRegion, string> = {
  italian: "Italian",
  french: "French",
  british: "British",
  spanish: "Spanish",
  indian: "Indian",
  asian: "Asian",
  mexican: "Mexican",
  thai: "Thai",
  japanese: "Japanese",
  mediterranean: "Mediterranean",
  "middle-eastern": "Middle Eastern",
};

export const isCuisineRegion = (v: unknown): v is CuisineRegion =>
  typeof v === "string" && (CUISINE_REGIONS as readonly string[]).includes(v);

/** Coerce arbitrary input into a single CuisineRegion or null. Accepts either
 * a string or an array (legacy data) — returns the first valid region. */
export const sanitiseCuisineRegion = (input: unknown): CuisineRegion | null => {
  if (isCuisineRegion(input)) return input;
  if (Array.isArray(input)) {
    const found = input.find(isCuisineRegion);
    return found ?? null;
  }
  return null;
};
