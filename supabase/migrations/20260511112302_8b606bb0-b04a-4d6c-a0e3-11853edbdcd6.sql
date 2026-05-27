
-- Dessert: sweets category OR sweet-sounding titles
UPDATE public.recipes
SET meal_types = ARRAY['dessert']::text[]
WHERE (cardinality(meal_types) = 0)
  AND (
    category::text = 'sweets'
    OR title ~* '(cake|pavlova|pudding|ice cream|biscotti|gingerbread|panna cotta|simnel|fruit scone)'
  );

-- Lunch: sandwich-style and light savoury items
UPDATE public.recipes
SET meal_types = ARRAY['lunch']::text[]
WHERE (cardinality(meal_types) = 0)
  AND title ~* '(sandwich|wrap|butty|baguette|toast|crumpet|ploughman|club|cheese scone)';

-- Mains: everything else still untagged
UPDATE public.recipes
SET meal_types = ARRAY['mains']::text[]
WHERE cardinality(meal_types) = 0;
