/**
 * Detects whether an ingredient line is a section header (e.g. "For the Sauce").
 * Shared across IngredientList and MealPlanner.
 */
export const isSectionHeader = (text: string): boolean => {
  const trimmed = text.trim();
  // Matches lines starting with a number, fraction, or common unit abbreviation
  const startsWithQuantity = /^(\d|½|¼|¾|⅓|⅔|⅛|⅜|⅝|⅞|\.)/i.test(trimmed);
  if (startsWithQuantity) return false;

  // Common header patterns. The `to <word>` clause catches "To Serve", "To Decorate",
  // "To Pane", "To Top", "To Garnish", "To Finish", etc. — restricted to short phrases
  // so it doesn't grab ingredient lines like "Lemon juice, to taste".
  const headerPatterns = /^(for the |for |the |to [a-z]+\b|sauce|salad|marinade|dressing|garnish|topping|filling|glaze|batter|pastry|crust|base|assembly)/i;
  if (headerPatterns.test(trimmed) && trimmed.split(" ").length <= 8) return true;

  // If the line ends with a colon, treat as header
  if (trimmed.endsWith(":")) return true;

  // Check it doesn't start with common ingredient words that have no quantity
  const hasNoQuantity = !/^(a |an |some |fresh |large |small |medium |pinch|handful|bunch|splash|drizzle|dash|knob)/i.test(trimmed);
  const isShortPhrase = trimmed.split(" ").length <= 5;

  // Lines that look like "For the X" or similar short label without measurement
  if (hasNoQuantity && isShortPhrase && !/^(salt|pepper|oil|butter|sugar|flour|egg|water|milk|cream|garlic|onion|lemon|lime|vinegar|honey|mustard|stock|broth)/i.test(trimmed)) {
    const looksLikeLabel = /^(for |the )/i.test(trimmed);
    if (looksLikeLabel) return true;
  }

  return false;
};
