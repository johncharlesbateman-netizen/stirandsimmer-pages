UPDATE public.recipes
SET collections = array_remove(collections, 'Vegetarian Options')
WHERE 'Vegetarian Options' = ANY(collections);