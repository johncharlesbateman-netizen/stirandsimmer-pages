UPDATE recipes
SET ingredients = (
  SELECT jsonb_agg(
    CASE
      WHEN elem = '"Potato Cakes"'::jsonb THEN '"For the Potato Cakes"'::jsonb
      WHEN elem = '"Chicken"'::jsonb THEN '"For the Chicken"'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(ingredients) AS elem
)
WHERE id = '79aebedd-db6b-4ee1-b4ad-9f27092f317f';