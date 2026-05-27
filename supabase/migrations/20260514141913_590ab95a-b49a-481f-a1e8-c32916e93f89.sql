-- Add new categories array column
ALTER TABLE public.recipes
  ADD COLUMN categories public.recipe_category[] NOT NULL DEFAULT ARRAY[]::public.recipe_category[];

-- Backfill from existing single category
UPDATE public.recipes
   SET categories = ARRAY[category]::public.recipe_category[];

-- Drop old single category column
ALTER TABLE public.recipes DROP COLUMN category;

-- Add new single cuisine_region column (temp name)
ALTER TABLE public.recipes ADD COLUMN cuisine_region_single text;

-- Backfill: prefer a real region over flavour tags like spicy/comfort/seasonal
UPDATE public.recipes
   SET cuisine_region_single = COALESCE(
     (SELECT r FROM unnest(cuisine_region) AS r
       WHERE r IN ('italian','french','british','indian','asian','mexican')
       LIMIT 1),
     (SELECT r FROM unnest(cuisine_region) AS r LIMIT 1)
   );

-- Replace the array column
ALTER TABLE public.recipes DROP COLUMN cuisine_region;
ALTER TABLE public.recipes RENAME COLUMN cuisine_region_single TO cuisine_region;