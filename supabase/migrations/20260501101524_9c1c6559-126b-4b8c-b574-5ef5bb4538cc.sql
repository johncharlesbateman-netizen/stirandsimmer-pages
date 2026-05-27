ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS collections text[] NOT NULL DEFAULT ARRAY[]::text[];
CREATE INDEX IF NOT EXISTS idx_recipes_collections ON public.recipes USING GIN (collections);