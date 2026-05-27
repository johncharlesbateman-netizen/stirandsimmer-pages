// Heuristic tag suggestion engine for recipes.
// Deterministic, transparent — based on keyword matching against
// title, description and collections. Used by the admin
// tagging audit page to surface suggestions for manual review.

export type TileCategory =
  | "chicken"
  | "beef"
  | "lamb"
  | "pork"
  | "seafood"
  | "spicy"
  | "pasta"
  | "sweets"
  | "lunch_suggestions";

export type RegionTag = "british" | "italian" | "french" | "indian" | "asian";

export const TILE_CATEGORIES: TileCategory[] = [
  "chicken",
  "beef",
  "lamb",
  "pork",
  "seafood",
  "spicy",
  "pasta",
  "sweets",
  "lunch_suggestions",
];

// Display labels matching the public tile slugs used in the navigation.
export const TILE_CATEGORY_LABELS: Record<TileCategory, string> = {
  chicken: "chicken",
  beef: "beef",
  lamb: "lamb",
  pork: "pork",
  seafood: "fish-and-seafood",
  spicy: "spicy",
  pasta: "pasta-and-rice",
  sweets: "puddings-and-desserts",
  lunch_suggestions: "quick-meals",
};

export const REGION_TAGS: RegionTag[] = [
  "british",
  "italian",
  "french",
  "indian",
  "asian",
];

// Word-boundary keyword sets. Each match contributes to confidence.
const REGION_KEYWORDS: Record<RegionTag, string[]> = {
  british: [
    "british", "english", "scottish", "welsh", "irish", "scouse",
    "shepherd's pie", "shepherds pie", "cottage pie", "sunday roast",
    "yorkshire pudding", "bangers and mash", "toad in the hole",
    "bubble and squeak", "fish and chips", "fish & chips",
    "fish finger", "chip butty", "cider battered", "ploughman",
    "trifle", "eton mess", "scone", "scones", "crumble",
    "spotted dick", "treacle", "victoria sponge", "battenberg",
    "cornish pasty", "haggis", "black pudding", "full english",
    "welsh rarebit",
  ],
  italian: [
    "italian", "italy", "tuscan", "sicilian", "neapolitan",
    "pasta", "spaghetti", "penne", "lasagne", "lasagna", "ravioli",
    "gnocchi", "linguine", "fettuccine", "tagliatelle", "rigatoni",
    "orzo", "macaroni", "tortellini", "cannelloni", "pappardelle",
    "pizza", "focaccia", "ciabatta", "calzone", "bruschetta",
    "risotto", "polenta", "carbonara", "bolognese", "ragu", "ragù",
    "amatriciana", "puttanesca", "arrabbiata", "marinara", "pesto",
    "parmesan", "parmigiano", "pecorino", "mozzarella", "burrata",
    "prosciutto", "pancetta", "salami", "tiramisu", "panna cotta",
    "cannoli", "biscotti", "gelato", "limoncello",
    "saltimbocca", "osso buco", "minestrone", "caprese",
  ],
  french: [
    "french", "france", "provençal", "provencal", "parisian", "lyonnaise",
    "ratatouille", "coq au vin", "boeuf bourguignon", "bourguignon",
    "bouillabaisse", "cassoulet", "confit", "tartiflette", "gratin",
    "croissant", "baguette", "brioche", "pain au chocolat",
    "quiche", "soufflé", "souffle", "crêpe", "crepe", "galette",
    "crème brûlée", "creme brulee", "crème caramel", "creme caramel",
    "tarte tatin", "madeleine", "macaron", "éclair", "eclair",
    "profiterole", "mille-feuille", "clafoutis",
    "beurre blanc", "hollandaise", "béarnaise", "bearnaise",
    "dijon", "vinaigrette", "remoulade", "rémoulade",
    "duck à l'orange", "steak frites", "salade niçoise", "nicoise",
  ],
  indian: [
    "indian", "india", "punjabi", "kerala", "goan", "bengali",
    "curry", "masala", "tikka", "biryani", "naan", "roti", "paratha",
    "dal", "dahl", "paneer", "vindaloo", "korma", "rogan josh",
    "samosa", "pakora", "bhaji", "tandoori", "garam masala",
    "chana", "saag", "aloo", "jalfrezi", "madras", "balti",
    "raita", "chutney", "lassi", "gulab jamun", "kheer",
  ],
  asian: [
    "thai", "chinese", "vietnamese", "japanese", "korean",
    "malaysian", "indonesian", "filipino", "singaporean", "burmese",
    "ramen", "sushi", "sashimi", "tempura", "teriyaki", "yakitori",
    "miso", "udon", "soba", "donburi", "katsu", "gyoza",
    "pho", "banh mi", "bánh mì", "bun cha",
    "pad thai", "tom yum", "tom kha", "som tam", "massaman",
    "stir fry", "stir-fry", "fried rice", "noodle", "chow mein",
    "lo mein", "wonton", "dumpling", "dim sum", "char siu",
    "kung pao", "mapo tofu", "general tso", "sweet and sour",
    "kimchi", "bibimbap", "bulgogi", "japchae", "tteokbokki",
    "satay", "rendang", "laksa", "nasi", "mee goreng",
    "soy sauce", "fish sauce", "hoisin", "sriracha",
    "lemongrass", "galangal", "kaffir lime",
  ],
};

const CATEGORY_KEYWORDS: Record<TileCategory, string[]> = {
  chicken: ["chicken", "poussin", "coq au vin", "yakitori", "tikka", "katsu"],
  beef: [
    "beef", "steak", "brisket", "sirloin", "ribeye", "rib eye",
    "fillet steak", "rump", "oxtail", "bourguignon", "bolognese",
    "shepherd's pie",  // technically lamb traditionally, but cottage pie uses beef
    "cottage pie", "stroganoff", "carpaccio", "bulgogi",
  ],
  lamb: [
    "lamb", "mutton", "rogan josh", "shepherd's pie", "shepherds pie",
    "shawarma", "kebab", "haggis",
  ],
  pork: [
    "pork", "bacon", "sausage", "bangers", "ham", "gammon",
    "chorizo", "pancetta", "prosciutto", "salami", "char siu",
    "carnitas", "porchetta", "saltimbocca",
  ],
  seafood: [
    "fish", "prawn", "shrimp", "salmon", "cod", "tuna", "trout",
    "haddock", "mackerel", "sea bass", "sardine", "anchovy",
    "crab", "lobster", "mussel", "clam", "scallop", "oyster",
    "squid", "calamari", "octopus", "seafood", "fish finger",
    "fish and chips", "fish & chips", "bouillabaisse", "sushi",
    "sashimi", "ceviche", "kedgeree", "paella",
  ],
  spicy: [
    "curry", "chilli", "chili", "spicy", "hot ",
    "jalapeño", "jalapeno", "sriracha", "harissa", "vindaloo",
    "madras", "tom yum", "kimchi", "kung pao", "mapo",
    "arrabbiata", "puttanesca", "diavola",
  ],
  pasta: [
    "pasta", "spaghetti", "penne", "lasagne", "lasagna", "ravioli",
    "gnocchi", "linguine", "fettuccine", "tagliatelle", "rigatoni",
    "orzo", "macaroni", "tortellini", "cannelloni", "pappardelle",
    "carbonara", "bolognese", "amatriciana", "puttanesca",
    "alfredo", "cacio e pepe",
  ],
  sweets: [
    "cake", "cookie", "biscuit", "biscotti", "dessert", "pudding",
    "brownie", "tart", "cheesecake", "ice cream", "sorbet", "gelato",
    "mousse", "chocolate", "caramel", "custard", "trifle", "crumble",
    "muffin", "scone", "scones", "tiramisu", "panna cotta", "cannoli",
    "macaron", "éclair", "eclair", "profiterole", "mille-feuille",
    "crème brûlée", "creme brulee", "tarte tatin", "spotted dick",
    "victoria sponge", "battenberg", "eton mess", "treacle",
    "pavlova", "fudge", "toffee", "meringue", "panna",
  ],
  lunch_suggestions: [
    "lunch", "sandwich", "toastie", "toasted sandwich", "wrap",
    "baguette", "panini", "ciabatta sandwich", "salad bowl",
    "quick lunch", "midweek lunch", "light lunch", "packed lunch",
    "ploughman", "soup", "frittata", "omelette", "quiche",
  ],
};

const COLLECTION_REGION_HINTS: Record<string, RegionTag> = {
  british: "british",
  english: "british",
  uk: "british",
  italian: "italian",
  italy: "italian",
  french: "french",
  france: "french",
  indian: "indian",
  india: "indian",
  asian: "asian",
  thai: "asian",
  chinese: "asian",
  japanese: "asian",
  korean: "asian",
  vietnamese: "asian",
};

const COLLECTION_CATEGORY_HINTS: Record<string, TileCategory> = {
  chicken: "chicken",
  beef: "beef",
  lamb: "lamb",
  pork: "pork",
  seafood: "seafood",
  fish: "seafood",
  spicy: "spicy",
  pasta: "pasta",
  sweets: "sweets",
  desserts: "sweets",
  dessert: "sweets",
  baking: "sweets",
};

export type MealTypeTag = "mains" | "lunch" | "dessert" | "snack";

export const MEAL_TYPE_TAGS: MealTypeTag[] = ["mains", "lunch", "dessert", "snack"];

const MEAL_TYPE_KEYWORDS: Record<MealTypeTag, string[]> = {
  mains: [
    "main", "mains", "main course", "dinner", "supper", "roast",
    "curry", "stew", "casserole", "risotto", "lasagne", "lasagna",
    "pie", "ragu", "ragù", "bolognese", "carbonara",
  ],
  lunch: [
    "lunch", "sandwich", "toastie", "toasted sandwich", "wrap",
    "panini", "ploughman", "salad bowl", "quick lunch", "midweek lunch",
    "light lunch", "packed lunch", "soup", "frittata", "omelette",
    "quiche", "baguette",
  ],
  dessert: [
    "dessert", "pudding", "cake", "tart", "cheesecake", "brownie",
    "cookie", "biscuit", "biscotti", "ice cream", "sorbet", "gelato",
    "mousse", "trifle", "crumble", "tiramisu", "panna cotta", "cannoli",
    "macaron", "éclair", "eclair", "profiterole", "mille-feuille",
    "crème brûlée", "creme brulee", "tarte tatin", "spotted dick",
    "victoria sponge", "battenberg", "eton mess", "pavlova",
    "meringue", "custard", "clafoutis",
  ],
  snack: [
    "snack", "snacks", "nibbles", "canapé", "canape", "bite-size",
    "bites", "crisps", "popcorn", "trail mix", "samosa", "pakora",
    "bhaji", "spring roll", "dim sum", "scone", "scones",
    "muffin", "muffins",
  ],
};

const COLLECTION_MEAL_HINTS: Record<string, MealTypeTag> = {
  mains: "mains",
  dinner: "mains",
  lunch: "lunch",
  lunches: "lunch",
  "lunch suggestions": "lunch",
  desserts: "dessert",
  dessert: "dessert",
  "sweets & desserts": "dessert",
  sweets: "dessert",
  baking: "dessert",
  snacks: "snack",
  snack: "snack",
};

export type Suggestion = {
  suggestedCategory: TileCategory | null;
  categoryConfidence: number;
  categoryMatches: string[];
  suggestedRegions: RegionTag[];
  regionConfidence: Record<RegionTag, number>;
  regionMatches: Record<RegionTag, string[]>;
  suggestedMealTypes: MealTypeTag[];
  mealTypeMatches: Record<MealTypeTag, string[]>;
  needsManualReview: boolean;
};

type RecipeInput = {
  title?: string | null;
  description?: string | null;
  
  collections?: string[] | null;
};

const containsKeyword = (haystack: string, keyword: string): boolean => {
  // Lowercase haystack expected.
  const k = keyword.toLowerCase();
  // Use word-boundary-ish matching for short tokens, substring for phrases.
  if (k.includes(" ") || /[^a-z]/.test(k)) {
    return haystack.includes(k);
  }
  const re = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
  return re.test(haystack);
};

export const suggestTags = (recipe: RecipeInput): Suggestion => {
  const text = [
    recipe.title ?? "",
    recipe.description ?? "",
  ]
    .join(" \n ")
    .toLowerCase();

  const collections = (recipe.collections ?? []).map((c) => c.toLowerCase());

  // ---- Region scoring ----
  const regionConfidence: Record<RegionTag, number> = {
    british: 0,
    italian: 0,
    french: 0,
    indian: 0,
    asian: 0,
  };
  const regionMatches: Record<RegionTag, string[]> = {
    british: [],
    italian: [],
    french: [],
    indian: [],
    asian: [],
  };

  for (const region of REGION_TAGS) {
    for (const kw of REGION_KEYWORDS[region]) {
      if (containsKeyword(text, kw)) {
        regionConfidence[region] += kw.split(" ").length > 1 ? 3 : 2;
        regionMatches[region].push(kw);
      }
    }
  }
  for (const c of collections) {
    const r = COLLECTION_REGION_HINTS[c];
    if (r) {
      regionConfidence[r] += 4;
      regionMatches[r].push(`collection:${c}`);
    }
  }

  // Pick regions with score >= 3 (one strong phrase or one collection or
  // multiple weak hits). Cap at 2 regions to avoid noise.
  const sortedRegions = REGION_TAGS
    .map((r) => ({ r, score: regionConfidence[r] }))
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score);
  const suggestedRegions = sortedRegions.slice(0, 2).map((x) => x.r);

  // ---- Category scoring ----
  const categoryScores: Record<TileCategory, number> = {
    chicken: 0,
    beef: 0,
    lamb: 0,
    pork: 0,
    seafood: 0,
    spicy: 0,
    pasta: 0,
    sweets: 0,
    lunch_suggestions: 0,
  };
  const categoryMatches: Record<TileCategory, string[]> = {
    chicken: [],
    beef: [],
    lamb: [],
    pork: [],
    seafood: [],
    spicy: [],
    pasta: [],
    sweets: [],
    lunch_suggestions: [],
  };

  for (const cat of TILE_CATEGORIES) {
    for (const kw of CATEGORY_KEYWORDS[cat]) {
      if (containsKeyword(text, kw)) {
        // Title matches weighted higher
        const inTitle = (recipe.title ?? "").toLowerCase().includes(kw.toLowerCase());
        categoryScores[cat] += inTitle ? 4 : 2;
        categoryMatches[cat].push(kw);
      }
    }
  }
  for (const c of collections) {
    const cat = COLLECTION_CATEGORY_HINTS[c];
    if (cat) {
      categoryScores[cat] += 5;
      categoryMatches[cat].push(`collection:${c}`);
    }
  }

  const sortedCats = TILE_CATEGORIES
    .map((c) => ({ c, score: categoryScores[c] }))
    .sort((a, b) => b.score - a.score);
  const top = sortedCats[0];
  const suggestedCategory =
    top && top.score >= 3 ? (top.c as TileCategory) : null;

  // ---- Meal type scoring ----
  const mealTypeScores: Record<MealTypeTag, number> = {
    mains: 0,
    lunch: 0,
    dessert: 0,
    snack: 0,
  };
  const mealTypeMatches: Record<MealTypeTag, string[]> = {
    mains: [],
    lunch: [],
    dessert: [],
    snack: [],
  };

  for (const mt of MEAL_TYPE_TAGS) {
    for (const kw of MEAL_TYPE_KEYWORDS[mt]) {
      if (containsKeyword(text, kw)) {
        const inTitle = (recipe.title ?? "").toLowerCase().includes(kw.toLowerCase());
        mealTypeScores[mt] += inTitle ? 4 : 2;
        mealTypeMatches[mt].push(kw);
      }
    }
  }
  for (const c of collections) {
    const mt = COLLECTION_MEAL_HINTS[c];
    if (mt) {
      mealTypeScores[mt] += 5;
      mealTypeMatches[mt].push(`collection:${c}`);
    }
  }

  // Strong category-based hints — the tile category often implies a meal type.
  if (suggestedCategory === "sweets") mealTypeScores.dessert += 6;
  if (suggestedCategory === "lunch_suggestions") mealTypeScores.lunch += 6;

  let suggestedMealTypes: MealTypeTag[] = MEAL_TYPE_TAGS
    .filter((mt) => mealTypeScores[mt] >= 3)
    .sort((a, b) => mealTypeScores[b] - mealTypeScores[a])
    .slice(0, 2);

  // Fall back to "mains" — every recipe must have at least one meal type and
  // most savoury dishes default to mains.
  if (suggestedMealTypes.length === 0) {
    suggestedMealTypes = ["mains"];
    mealTypeMatches.mains.push("default");
  }

  const needsManualReview =
    suggestedCategory === null && suggestedRegions.length === 0;

  return {
    suggestedCategory,
    categoryConfidence: top?.score ?? 0,
    categoryMatches: suggestedCategory ? categoryMatches[suggestedCategory] : [],
    suggestedRegions,
    regionConfidence,
    regionMatches,
    suggestedMealTypes,
    mealTypeMatches,
    needsManualReview,
  };
};
