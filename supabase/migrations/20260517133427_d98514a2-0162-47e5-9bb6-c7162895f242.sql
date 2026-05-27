UPDATE public.recipes
SET
  description = 'Jersey Royals are one of the heroes of springtime and need to be embraced when you see them. This dish makes double use of a delicious wild garlic pesto alongside seasonal British asparagus and silky butter-crushed potatoes.',
  prep_time_minutes = 15,
  cook_time_minutes = 25,
  servings = 2,
  ingredients = '["2x 200g salmon fillets", "400g Jersey Royal potatoes", "6 spring onions, finely sliced", "50g unsalted butter", "50g roasted pine nuts", "40g wild garlic leaves", "3 tbsp rapeseed oil", "25g Parmesan, finely grated", "8 spears of asparagus, woody ends trimmed", "10g mint", "Sea salt and freshly ground black pepper"]'::jsonb,
  instructions = '["Preheat the oven to 180°C (fan 160°C / gas mark 4).", "Cook the Jersey Royals in salted water until tender, about 20 minutes. Add the mint for the last few minutes and let them sit for 10 minutes off the heat to infuse.", "Drain the potatoes, reserving a little of the cooking water. Crush with a fork, then stir through the butter and enough cooking water to create a rich, glossy mix. Fold in the spring onions, season and keep warm.", "Blend the wild garlic leaves, pine nuts, Parmesan and rapeseed oil to a coarse pesto. Season to taste.", "Season the salmon and place each fillet on a square of loose foil with a knob of butter. Wrap loosely, set on a baking tray and roast for around 15–20 minutes until just cooked through.", "Pour a little of the salmon cooking juices into a small frying pan, add a generous spoon of pesto and warm gently for 1 minute, stirring to form a sauce.", "Cook the asparagus in lightly salted water for around 4 minutes until just tender.", "Divide the crushed potatoes between two warm plates and flatten slightly with the back of a spoon. Top with the asparagus, then the salmon, and spoon over the warm pesto sauce to serve."]'::jsonb,
  tips = 'Wild garlic has a short spring season — if you can''t find it, swap in baby spinach with a small clove of raw garlic blitzed into the pesto. The pesto keeps in the fridge for up to 3 days under a thin layer of oil and is brilliant stirred through pasta the next day.',
  categories = ARRAY['seafood']::recipe_category[],
  cuisine_region = 'british',
  meal_types = ARRAY['mains']::text[],
  seo_title = 'Salmon with Wild Garlic Pesto & Jersey Royals',
  seo_description = 'Spring salmon with wild garlic pesto, crushed Jersey Royal potatoes and British asparagus. A simple, seasonal supper for two in under 45 minutes.',
  image_url = 'https://xlekynbjvcfbfqycjnpj.supabase.co/storage/v1/object/public/recipe-images/salmon-garlic-leaf-pesto-jersey-royals.jpeg',
  published = true,
  updated_at = now()
WHERE slug = 'salmon-with-garlic-leaf-pesto-crushed-jersey-royal-potatoes-and-seasonal-british-mp9tcasx';