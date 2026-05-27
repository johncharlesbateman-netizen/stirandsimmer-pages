-- Step 1: clear existing assignments for the two collections
UPDATE public.recipes
SET collections = array_remove(collections, 'Quick & Easy')
WHERE 'Quick & Easy' = ANY(collections);

UPDATE public.recipes
SET collections = array_remove(collections, 'Healthy Eating')
WHERE 'Healthy Eating' = ANY(collections);

-- Step 2: re-assign Quick & Easy
UPDATE public.recipes
SET collections = array_append(collections, 'Quick & Easy')
WHERE slug IN (
  'asian-style-ham-baguette',
  'avocado-and-chorizo-toast',
  'crab-cucumber-crumpets',
  'fish-finger-butty-with-lemon-mayonnaise',
  'piri-piri-chicken-wholemeal-wrap',
  'prawn-avocado-and-mango-salad',
  'spicy-tuna-and-avocado-wrap'
)
AND NOT ('Quick & Easy' = ANY(collections));

-- Step 3: re-assign Healthy Eating
UPDATE public.recipes
SET collections = array_append(collections, 'Healthy Eating')
WHERE slug IN (
  'achari-tikka-with-mixed-vegetable-masala',
  'asian-prawn-ginger-spring-onion-stir-fry',
  'chicken-with-fenugreek-leaves',
  'fillet-of-beef-with-woodland-mushrooms',
  'pork-chow-mein',
  'savoury-rice',
  'scallops-with-apple-fennel-and-celeriac-salad',
  'spiced-fillet-of-lamb-with-cannellini-beans',
  'spiced-salmon-with-sweetcorn-avocado-pepper-salsa-salad',
  'steak-kebabs',
  'tandoori-chicken-tikka-and-mint-yoghurt',
  'tuna-linguine-with-tomatoes-olives',
  'warm-beef-salad'
)
AND NOT ('Healthy Eating' = ANY(collections));