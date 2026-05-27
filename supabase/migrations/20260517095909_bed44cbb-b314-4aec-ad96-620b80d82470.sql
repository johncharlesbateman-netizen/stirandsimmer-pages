ALTER TABLE public.recipes
  ADD COLUMN published boolean NOT NULL DEFAULT true;

CREATE INDEX idx_recipes_published ON public.recipes (published);