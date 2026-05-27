DO $$
DECLARE
  v_recipe_id UUID := '4ad7f57f-c02c-4418-a5c4-1d701e53afef';
  v_current_ingredients JSONB;
  v_current_instructions JSONB;
  v_items_to_move JSONB;
BEGIN
  -- Fetch current arrays
  SELECT ingredients, instructions
    INTO v_current_ingredients, v_current_instructions
    FROM public.recipes WHERE id = v_recipe_id;

  -- Extract first 2 instructions items to move
  v_items_to_move := (
    SELECT jsonb_agg(elem ORDER BY ord)
    FROM jsonb_array_elements(v_current_instructions) WITH ORDINALITY AS t(elem, ord)
    WHERE ord <= 2
  );

  -- Append to ingredients
  UPDATE public.recipes
     SET ingredients = v_current_ingredients || v_items_to_move
   WHERE id = v_recipe_id;

  -- Remove first 2 from instructions
  UPDATE public.recipes
     SET instructions = (
       SELECT jsonb_agg(elem ORDER BY ord)
       FROM jsonb_array_elements(instructions) WITH ORDINALITY AS t(elem, ord)
       WHERE ord > 2
     )
   WHERE id = v_recipe_id;
END $$;