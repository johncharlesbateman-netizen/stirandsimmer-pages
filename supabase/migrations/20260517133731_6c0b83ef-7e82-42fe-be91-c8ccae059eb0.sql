UPDATE public.recipes
SET instructions = jsonb_set(
  instructions,
  '{0}',
  to_jsonb('Preheat the oven to 180°C (fan 160°C).'::text)
),
updated_at = now()
WHERE slug = 'salmon-with-garlic-leaf-pesto-crushed-jersey-royal-potatoes-and-seasonal-british-mp9tcasx';