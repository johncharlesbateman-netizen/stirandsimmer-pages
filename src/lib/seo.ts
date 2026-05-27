// SEO helpers for recipe pages.
// Generates concise, unique meta titles (<60 chars) and descriptions (<155 chars)
// when an admin hasn't supplied custom values.

const SITE_SUFFIX = " | Stir & Simmer";
const TITLE_LIMIT = 60;
const DESC_MIN = 140;
const DESC_MAX = 155;
const CTA = " Get the full recipe at Stir & Simmer.";

const truncate = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = lastSpace > limit * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return trimmed.replace(/[,;:.\-\s]+$/, "") + "…";
};

const stripQuantity = (ingredient: string): string =>
  ingredient
    .replace(
      /^[\d\s\/.,⅓½¼¾⅔⅛⅜⅝⅞-]+\s*(g|kg|ml|l|tsp|tbsp|cup|cups|oz|lb|pinch|clove|cloves|slice|slices)?\s*/i,
      "",
    )
    .split(",")[0]
    .trim();

const normaliseIngredient = (i: unknown): string => {
  if (typeof i === "string") return i;
  if (i && typeof i === "object") {
    const obj = i as { item?: unknown; amount?: unknown };
    const amount = typeof obj.amount === "string" ? obj.amount : "";
    const item = typeof obj.item === "string" ? obj.item : "";
    return `${amount} ${item}`.trim();
  }
  return "";
};

const getKeyIngredients = (ingredients: unknown[], max = 3): string[] =>
  (ingredients ?? [])
    .map(normaliseIngredient)
    .filter((i) => i && !/^(for the |for |the )/i.test(i.trim()))
    .slice(0, max)
    .map(stripQuantity)
    .filter(Boolean);

/**
 * Build descriptive alt text for a recipe image, e.g.
 *   "Homemade beef lasagne with beef mince, tomato passata and mozzarella"
 * Falls back to just the title when no usable ingredients are present.
 * Kept under ~125 chars so it works well with screen readers.
 */
export const buildRecipeAltText = (
  title: string,
  ingredients: string[] = [],
): string => {
  const cleanTitle = title.trim();
  const key = getKeyIngredients(ingredients, 3)
    .map((i) => i.toLowerCase())
    // Filter out anything already mentioned in the title.
    .filter((i) => !cleanTitle.toLowerCase().includes(i.split(" ")[0]));

  if (!key.length) return cleanTitle;

  const list =
    key.length === 1
      ? key[0]
      : `${key.slice(0, -1).join(", ")} and ${key[key.length - 1]}`;

  const alt = `${cleanTitle} with ${list}`;
  return alt.length > 125 ? alt.slice(0, 122).replace(/[,;\s]+$/, "") + "…" : alt;
};

/**
 * Builds a unique <title> in the format:
 *   "[Recipe Name] Recipe | Stir & Simmer"
 * Falls back to a truncated form if the full title would exceed 60 chars.
 * Admin-supplied seo_title still wins.
 */
export const buildSeoTitle = (
  customTitle: string | null | undefined,
  recipeTitle: string,
  _totalMinutes: number,
): string => {
  if (customTitle?.trim()) return truncate(customTitle.trim(), TITLE_LIMIT);

  const base = recipeTitle.trim().replace(/\s+recipe$/i, "");
  const full = `${base} Recipe${SITE_SUFFIX}`;
  if (full.length <= TITLE_LIMIT) return full;

  const noSuffix = `${base} Recipe`;
  if (noSuffix.length <= TITLE_LIMIT) return noSuffix;

  return truncate(noSuffix, TITLE_LIMIT);
};

const audienceForCategory = (category: string): string => {
  const cat = (category || "").toLowerCase();
  const map: Record<string, string> = {
    chicken: "perfect for a family midweek dinner",
    beef: "ideal for a hearty weekend meal",
    lamb: "great for a special Sunday lunch",
    pork: "perfect for a comforting family dinner",
    spicy: "ideal for spice lovers and weeknight dinners",
    seafood: "perfect for a light, fresh dinner",
    pasta: "ideal for a quick, satisfying weeknight meal",
    lunch_suggestions: "perfect for an easy midweek lunch",
    sweets: "ideal for a special treat or weekend baking",
    desserts: "perfect for entertaining or a weekend treat",
    starters: "ideal for dinner parties and special occasions",
    sides: "perfect alongside roasts and grilled mains",
    salads: "ideal for a fresh, light lunch",
    soups: "perfect for a cosy lunch or starter",
    cakes: "ideal for afternoon tea or celebrations",
    breakfast: "perfect for a relaxed weekend brunch",
    drinks: "ideal for entertaining or a quiet evening in",
    sandwiches: "perfect for lunchboxes and quick meals",
    mains: "perfect for a family dinner",
  };
  return map[cat] || "perfect for any occasion";
};

/**
 * Builds a meta description targeting 140–160 characters that mentions the
 * dish, key ingredients, total time and intended audience. Admin-supplied
 * seo_description still wins.
 */
export const buildSeoDescription = (
  customDescription: string | null | undefined,
  recipeTitle: string,
  description: string,
  ingredients: string[],
  totalMinutes: number,
  category: string = "",
  servings: number | null = null,
): string => {
  if (customDescription?.trim()) {
    return truncate(customDescription.trim(), DESC_MAX);
  }

  const cleanTitle = recipeTitle.trim().replace(/\s+recipe$/i, "");
  const key = getKeyIngredients(ingredients, 2);
  const keyIng = key[0]?.toLowerCase() || "";
  const audience = audienceForCategory(category);

  // Detail clause: prefer time, then servings, then a key ingredient
  const detail = totalMinutes > 0
    ? `Ready in just ${totalMinutes} minutes.`
    : servings
      ? `Serves ${servings}.`
      : keyIng
        ? `Made with ${keyIng}.`
        : "Easy to make at home.";

  // Lead: appetising one-liner. Use admin description if present, else generated.
  const desc = description.trim().replace(/\.$/, "");
  const leads: string[] = [];
  if (desc) leads.push(`${desc}.`);
  leads.push(`A ${cleanTitle} made from scratch — ${audience}.`);
  if (keyIng) leads.push(`A flavour-packed ${cleanTitle} built around ${keyIng}.`);

  // Try every lead with detail + CTA, pick first in 140–155 window.
  const candidates: string[] = [];
  for (const lead of leads) {
    candidates.push(`${lead} ${detail}${CTA}`);
    candidates.push(`${lead} ${detail} ${audience.charAt(0).toUpperCase() + audience.slice(1)}.${CTA}`);
  }

  for (const c of candidates) {
    if (c.length >= DESC_MIN && c.length <= DESC_MAX) return c;
  }
  // Pad shorter candidates with a brief tagline so they reach the 140-char minimum.
  const padPhrases = [
    " A real winner.",
    " Simple and satisfying.",
    " A weeknight favourite.",
    " A reliable midweek favourite.",
    " A weeknight winner from our kitchen.",
    " Tried, tested and family-approved.",
  ];
  for (const c of candidates) {
    if (c.length > DESC_MAX) continue;
    for (const p of padPhrases) {
      // Insert before the CTA so the soft CTA stays at the end.
      const padded = c.replace(CTA, p + CTA);
      if (padded.length >= DESC_MIN && padded.length <= DESC_MAX) return padded;
    }
  }
  // Fallback: pick the closest under the max (or truncate longest).
  const within = candidates.filter((c) => c.length <= DESC_MAX);
  if (within.length) return within.sort((a, b) => b.length - a.length)[0];
  return truncate(candidates[0], DESC_MAX);
};

/**
 * Build a short, unique introductory paragraph for a recipe page so the
 * visible content isn't just an ingredients list. Combines the recipe's own
 * description with key ingredients, timing, category, and a varied opening
 * line seeded from the title so each page reads differently.
 */
export const buildRecipeIntro = (
  title: string,
  description: string,
  ingredients: string[],
  category: string,
  totalMinutes: number,
  servings: number | null,
): string => {
  const key = getKeyIngredients(ingredients, 3);
  const cleanCat = (category || "dish").toLowerCase().replace(/_/g, " ");
  const seed = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const openers = [
    `This ${cleanCat} recipe brings together`,
    `Our take on ${title.toLowerCase()} pairs`,
    `A reliable ${cleanCat} you'll come back to, built around`,
    `If you're after a ${cleanCat} with character, try this combination of`,
  ];
  const opener = openers[seed % openers.length];
  const ingList = key.length
    ? `${key.slice(0, -1).join(", ")}${key.length > 1 ? " and " : ""}${key[key.length - 1]}`
    : "fresh, seasonal ingredients";
  const timing = totalMinutes > 0
    ? ` It comes together in around ${totalMinutes} minutes${servings ? ` and serves ${servings}` : ""}.`
    : servings ? ` Serves ${servings}.` : "";
  return `${opener} ${ingList}.${timing} ${description.trim()}`.trim();
};

/**
 * Build a short, varied serving-suggestion paragraph derived from the
 * recipe's category. Adds genuinely useful on-page text without requiring
 * per-recipe manual copy.
 */
export const buildServingSuggestion = (
  title: string,
  category: string,
): string => {
  const cat = (category || "").toLowerCase();
  const map: Record<string, string> = {
    mains: `Serve ${title} hot, straight from the pan, with a simple green salad or seasonal vegetables on the side. A glass of dry white or a light red works beautifully.`,
    starters: `Plate ${title} as a light first course before a main of roast meat or pasta. A wedge of lemon and a piece of crusty bread are all the company it needs.`,
    desserts: `Serve ${title} just slightly chilled with a small jug of cream, a scoop of vanilla ice cream, or a strong espresso to finish.`,
    sides: `${title} is the perfect partner for grilled meats, roast chicken or a hearty stew. Add a sprinkle of fresh herbs just before serving.`,
    sandwiches: `Pack ${title} for lunch with a handful of crisps, some pickles, and a piece of fruit — or serve it with a bowl of soup for a quick supper.`,
    salads: `Bring ${title} to the table as a light lunch on its own, or pair it with grilled fish or chicken for a more substantial meal.`,
    soups: `Ladle ${title} into warm bowls and serve with thick slices of buttered bread or a swirl of cream and cracked pepper on top.`,
    cakes: `Slice ${title} into generous wedges and serve with a pot of tea or strong coffee. Perfect for afternoons, birthdays, or any excuse really.`,
    breakfast: `${title} works just as well for a leisurely weekend brunch as it does for a quick weekday breakfast — add fruit, yoghurt, or a strong coffee.`,
    drinks: `Serve ${title} well chilled in your favourite glass, with plenty of ice and a garnish if the mood takes you.`,
  };
  return map[cat] ||
    `Serve ${title} as soon as it's ready, with whatever sides you fancy — a fresh salad, crusty bread, or seasonal vegetables all work well.`;
};
