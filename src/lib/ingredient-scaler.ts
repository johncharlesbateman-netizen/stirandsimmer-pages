/**
 * Scale the numeric quantities in an ingredient string by a multiplier.
 *
 * Some ingredients do not scale linearly:
 *   - Seasonings (salt, pepper, spices) → reduced rate (75% of linear) + "adjust to taste" note
 *   - Leavening agents (baking powder/soda, yeast) → linear scale + warning to verify
 *   - Garnishes (to garnish, to serve, to decorate) → "adjust to taste" instead of a scaled amount
 */

/** Unicode fraction map */
const FRAC_TO_NUM: Record<string, number> = {
  "½": 0.5, "⅓": 1 / 3, "⅔": 2 / 3,
  "¼": 0.25, "¾": 0.75, "⅕": 0.2,
  "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
  "⅙": 1 / 6, "⅚": 5 / 6, "⅛": 0.125,
  "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};

const NUM_TO_FRAC: [number, string][] = [
  [0.125, "⅛"], [0.25, "¼"], [1 / 3, "⅓"], [0.375, "⅜"],
  [0.5, "½"], [0.625, "⅝"], [2 / 3, "⅔"], [0.75, "¾"],
  [0.875, "⅞"],
];

export type ScalingKind = "linear" | "seasoning" | "leavening" | "garnish";

export interface ScaledIngredient {
  text: string;
  kind: ScalingKind;
  /** Optional advisory note shown next to the ingredient. */
  note?: string;
}

/** Reduced-scale factor applied to seasonings instead of the full multiplier. */
const SEASONING_SCALE_DAMPING = 0.75;

/** Seasoning keywords (whole-word match, case-insensitive). */
const SEASONING_KEYWORDS = [
  "salt", "pepper", "peppercorn", "peppercorns",
  "chilli", "chili", "cayenne", "paprika", "smoked paprika",
  "cumin", "coriander seed", "ground coriander",
  "cinnamon", "nutmeg", "clove", "cloves", "allspice",
  "cardamom", "turmeric", "ginger powder", "ground ginger",
  "garlic powder", "onion powder",
  "oregano", "thyme", "rosemary", "sage", "tarragon",
  "bay leaf", "bay leaves",
  "garam masala", "curry powder", "five spice", "ras el hanout",
  "mustard powder", "white pepper", "black pepper",
  "vanilla extract", "vanilla essence",
  "saffron", "sumac", "fennel seeds", "fenugreek",
  "msg", "stock cube", "stock cubes",
];

/** Leavening agents (whole-word match). */
const LEAVENING_KEYWORDS = [
  "baking powder", "baking soda", "bicarbonate of soda",
  "bicarb", "yeast", "dried yeast", "fresh yeast", "active dry yeast",
  "self-raising", "self raising",
];

/** Garnish phrases — these usually appear as suffixes ("...to garnish"). */
const GARNISH_PHRASES = [
  "to garnish", "for garnish", "to serve", "for serving",
  "to decorate", "for decoration", "to taste",
];

function matchesKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    return re.test(lower);
  });
}

function matchesPhrase(text: string, phrases: string[]): boolean {
  const lower = text.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}

export function classifyIngredient(ingredient: string): ScalingKind {
  // Garnish/serving suffixes take precedence — quantity is decorative.
  if (matchesPhrase(ingredient, GARNISH_PHRASES)) return "garnish";
  if (matchesKeyword(ingredient, LEAVENING_KEYWORDS)) return "leavening";
  if (matchesKeyword(ingredient, SEASONING_KEYWORDS)) return "seasoning";
  return "linear";
}

function toFraction(n: number): string {
  if (n <= 0) return "";
  const whole = Math.floor(n);
  const remainder = n - whole;

  if (remainder < 0.05) return whole === 0 ? "" : `${whole}`;

  let bestFrac = "";
  let bestDiff = Infinity;
  for (const [val, sym] of NUM_TO_FRAC) {
    const diff = Math.abs(remainder - val);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestFrac = sym;
    }
  }

  if (bestDiff > 0.08) {
    return n % 1 === 0 ? `${n}` : `${+n.toFixed(2)}`;
  }

  if (whole === 0) return bestFrac;
  return `${whole} ${bestFrac}`;
}

function parseLeadingQty(text: string): [number | null, string] {
  const fracChars = Object.keys(FRAC_TO_NUM).join("");
  const re = new RegExp(
    `^(\\d+(?:\\.\\d+)?)?\\s*([${fracChars}])|^(\\d+(?:\\.\\d+)?)\\s*[/⁄]\\s*(\\d+(?:\\.\\d+)?)|^(\\d+(?:\\.\\d+)?)\\s+(\\d+)\\s*[/⁄]\\s*(\\d+)|^(\\d+(?:\\.\\d+)?)`
  );

  const m = text.match(re);
  if (!m) return [null, text];

  let value: number;
  const matchLen = m[0].length;

  if (m[1] !== undefined || m[2] !== undefined) {
    const whole = m[1] ? parseFloat(m[1]) : 0;
    const frac = m[2] ? FRAC_TO_NUM[m[2]] || 0 : 0;
    value = whole + frac;
  } else if (m[3] !== undefined && m[4] !== undefined) {
    value = parseFloat(m[3]) / parseFloat(m[4]);
  } else if (m[5] !== undefined && m[6] !== undefined && m[7] !== undefined) {
    value = parseFloat(m[5]) + parseFloat(m[6]) / parseFloat(m[7]);
  } else if (m[8] !== undefined) {
    value = parseFloat(m[8]);
  } else {
    return [null, text];
  }

  const rest = text.slice(matchLen).replace(/^\s+/, "");
  return [value, rest];
}

export function scaleIngredient(ingredient: string, multiplier: number): string {
  if (multiplier === 1) return ingredient;

  const trimmed = ingredient.trim();
  const [qty, rest] = parseLeadingQty(trimmed);
  if (qty === null) return ingredient;

  const scaled = qty * multiplier;
  const formatted = toFraction(scaled);
  return formatted ? `${formatted} ${rest}` : rest;
}

/**
 * Scale a single ingredient with classification awareness.
 * - garnish: do not scale numerically; replace amount with "to taste".
 * - seasoning: scale at SEASONING_SCALE_DAMPING of the linear multiplier; add "adjust to taste".
 * - leavening: scale linearly but warn — leavening doesn't always scale predictably.
 * - linear: standard scale.
 */
export function scaleIngredientSmart(
  ingredient: string,
  multiplier: number,
): ScaledIngredient {
  const kind = classifyIngredient(ingredient);

  if (multiplier === 1) {
    return {
      text: ingredient,
      kind,
      note:
        kind === "seasoning"
          ? "adjust to taste"
          : kind === "leavening"
            ? "verify when scaling"
            : kind === "garnish"
              ? "to taste"
              : undefined,
    };
  }

  if (kind === "garnish") {
    // Strip leading quantity if any and present as "to taste".
    const [qty, rest] = parseLeadingQty(ingredient.trim());
    const body = qty !== null ? rest : ingredient;
    return { text: body, kind, note: "adjust to taste" };
  }

  const effectiveMultiplier =
    kind === "seasoning"
      ? 1 + (multiplier - 1) * SEASONING_SCALE_DAMPING
      : multiplier;

  const text = scaleIngredient(ingredient, effectiveMultiplier);

  return {
    text,
    kind,
    note:
      kind === "seasoning"
        ? "adjust to taste"
        : kind === "leavening"
          ? "scaled — verify before baking"
          : undefined,
  };
}

export function scaleIngredients(
  ingredients: string[],
  baseServings: number,
  targetServings: number,
): string[] {
  if (baseServings <= 0 || targetServings <= 0) return ingredients;
  const multiplier = targetServings / baseServings;
  return ingredients.map((ing) => scaleIngredient(ing, multiplier));
}

/** Smart scaler returning kind + note metadata for each ingredient. */
export function scaleIngredientsSmart(
  ingredients: unknown[],
  baseServings: number,
  targetServings: number,
): ScaledIngredient[] {
  const safeBase = baseServings > 0 ? baseServings : 1;
  const safeTarget = targetServings > 0 ? targetServings : safeBase;
  const multiplier = safeTarget / safeBase;
  return (ingredients ?? []).map((ing) => {
    const str =
      typeof ing === "string"
        ? ing
        : ing && typeof ing === "object"
          ? `${(ing as { amount?: unknown }).amount ?? ""} ${(ing as { item?: unknown }).item ?? ""}`.trim()
          : String(ing ?? "");
    return scaleIngredientSmart(str, multiplier);
  });
}
