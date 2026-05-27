/**
 * Merge duplicate ingredients across multiple recipe ingredient lists,
 * combining quantities where possible.
 */

const UNIT_ALIASES: Record<string, string> = {
  tbsp: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
  tsp: "tsp", teaspoon: "tsp", teaspoons: "tsp",
  g: "g", gram: "g", grams: "g",
  kg: "kg", kilogram: "kg", kilograms: "kg",
  ml: "ml", millilitre: "ml", millilitres: "ml",
  l: "l", litre: "l", litres: "l",
  cup: "cup", cups: "cup",
  oz: "oz", ounce: "oz", ounces: "oz",
  lb: "lb", pound: "lb", pounds: "lb",
};

interface ParsedIngredient {
  qty: number | null;
  unit: string;
  name: string;
  original: string;
}

function parseIngredient(raw: string): ParsedIngredient {
  const trimmed = raw.trim();

  // Match leading number (decimal, fraction chars)
  const fracChars = "½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞";
  const fracMap: Record<string, number> = {
    "½": 0.5, "⅓": 1/3, "⅔": 2/3, "¼": 0.25, "¾": 0.75,
    "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
    "⅙": 1/6, "⅚": 5/6, "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
  };

  const qtyRe = new RegExp(`^(\\d+(?:\\.\\d+)?)?\\s*([${fracChars}])?\\s*`);
  const m = trimmed.match(qtyRe);
  let qty: number | null = null;
  let rest = trimmed;

  if (m && (m[1] || m[2])) {
    const whole = m[1] ? parseFloat(m[1]) : 0;
    const frac = m[2] ? (fracMap[m[2]] || 0) : 0;
    qty = whole + frac;
    rest = trimmed.slice(m[0].length).trim();
  }

  // Try to extract unit
  const unitRe = /^(tbsp|tablespoons?|tsp|teaspoons?|g|grams?|kg|kilograms?|ml|millilitres?|l|litres?|cups?|oz|ounces?|lb|pounds?|bunch|handful|pinch|cloves?|slices?|rashers?|sheets?|sprigs?|stalks?|pieces?|tin|tins|can|cans|pack|packs?|packets?)\b/i;
  const unitMatch = rest.match(unitRe);
  let unit = "";
  let name = rest;

  if (unitMatch) {
    unit = UNIT_ALIASES[unitMatch[1].toLowerCase()] || unitMatch[1].toLowerCase();
    name = rest.slice(unitMatch[0].length).trim();
  }

  // Clean up name
  name = name.replace(/^(of\s+)/i, "").trim();

  return { qty, unit, name, original: raw };
}

function normaliseKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[,()\[\]]/g, "")
    .replace(/\b(fresh|freshly|ground|chopped|diced|sliced|peeled|minced|finely|roughly|dried|large|medium|small|good quality|organic|free-range|optional)\b/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function mergeIngredients(allIngredients: string[][]): string[] {
  const merged = new Map<string, { qty: number | null; unit: string; displayName: string }>();

  for (const list of allIngredients) {
    for (const raw of list) {
      const parsed = parseIngredient(raw);
      const key = `${normaliseKey(parsed.name)}::${parsed.unit}`;

      if (merged.has(key)) {
        const existing = merged.get(key)!;
        if (existing.qty !== null && parsed.qty !== null) {
          existing.qty += parsed.qty;
        }
      } else {
        merged.set(key, {
          qty: parsed.qty,
          unit: parsed.unit,
          displayName: parsed.name || parsed.original,
        });
      }
    }
  }

  return Array.from(merged.values()).map(({ qty, unit, displayName }) => {
    const parts: string[] = [];
    if (qty !== null) {
      parts.push(qty % 1 === 0 ? `${qty}` : `${+qty.toFixed(2)}`);
    }
    if (unit) parts.push(unit);
    parts.push(displayName);
    return parts.join(" ");
  });
}
