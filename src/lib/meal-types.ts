// Meal type tags used as a third axis alongside category + cuisine region.

export const MEAL_TYPES = ["mains", "lunch", "dessert", "snack"] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export const mealTypeLabels: Record<MealType, string> = {
  mains: "Mains",
  lunch: "Lunch",
  dessert: "Dessert",
  snack: "Snack",
};

export const isMealType = (v: unknown): v is MealType =>
  typeof v === "string" && (MEAL_TYPES as readonly string[]).includes(v);

export const sanitiseMealTypes = (input: unknown): MealType[] => {
  if (!Array.isArray(input)) return [];
  return Array.from(new Set(input.filter(isMealType)));
};
