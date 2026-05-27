-- Create enum for recipe categories
CREATE TYPE public.recipe_category AS ENUM (
  'chicken',
  'beef',
  'lamb',
  'pork',
  'spicy',
  'seafood',
  'lunch_suggestions',
  'sweets'
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category recipe_category NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  tips TEXT,
  is_seasonal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Everyone can read recipes (free access)
CREATE POLICY "Recipes are viewable by everyone"
  ON public.recipes FOR SELECT
  USING (true);

-- Create indexes
CREATE INDEX idx_recipes_category ON public.recipes(category);
CREATE INDEX idx_recipes_slug ON public.recipes(slug);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();