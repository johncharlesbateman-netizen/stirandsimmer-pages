-- Update Lamb with Courgette, Figs, Beetroot, Tomatoes and Tahini Dressing recipe
-- Move first 5 instructions items to end of ingredients

WITH recipe AS (
  SELECT id, ingredients, instructions
  FROM public.recipes
  WHERE id = 'f17c3a63-0184-4bad-afa1-40586d880103'
),
items_to_move AS (
  SELECT value AS item, ordinality AS idx
  FROM recipe,
  LATERAL jsonb_array_elements(instructions) WITH ORDINALITY AS t(value, ordinality)
  WHERE ordinality <= 5
),
new_ingredients AS (
  SELECT r.id, r.ingredients || jsonb_agg(itm.item ORDER BY itm.idx) AS ingredients
  FROM recipe r
  CROSS JOIN items_to_move itm
  GROUP BY r.id, r.ingredients
),
new_instructions AS (
  SELECT r.id, jsonb_agg(value ORDER BY ordinality) AS instructions
  FROM recipe r,
  LATERAL jsonb_array_elements(r.instructions) WITH ORDINALITY AS t(value, ordinality)
  WHERE ordinality > 5
  GROUP BY r.id
)
UPDATE public.recipes
SET ingredients = ng.ingredients,
    instructions = ni.instructions
FROM new_ingredients ng, new_instructions ni
WHERE public.recipes.id = ng.id AND public.recipes.id = ni.id;