
-- Replace "Weeknight Suppers" with "Quick & Easy" in all recipes (dedup)
UPDATE recipes
SET collections = (
  SELECT ARRAY(SELECT DISTINCT unnest(array_replace(collections, 'Weeknight Suppers', 'Quick & Easy')))
)
WHERE 'Weeknight Suppers' = ANY(collections);

-- For Healthy Eating recipes that don't already have a meaningful home, add Quick & Easy
UPDATE recipes
SET collections = (
  SELECT ARRAY(SELECT DISTINCT unnest(collections || ARRAY['Quick & Easy']::text[]))
)
WHERE 'Healthy Eating' = ANY(collections)
  AND NOT ('Fish & Seafood' = ANY(collections))
  AND NOT ('Romantic Meals' = ANY(collections));

-- Remove "Healthy Eating" from all recipes
UPDATE recipes
SET collections = array_remove(collections, 'Healthy Eating')
WHERE 'Healthy Eating' = ANY(collections);
