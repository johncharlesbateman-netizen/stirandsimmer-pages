ALTER TABLE public.recipes
ADD COLUMN IF NOT EXISTS cuisine_region text[] NOT NULL DEFAULT ARRAY[]::text[];

CREATE INDEX IF NOT EXISTS idx_recipes_cuisine_region
ON public.recipes USING GIN (cuisine_region);