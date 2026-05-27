
-- First, verify the current recipe state
DO $$
DECLARE
    v_recipe_id UUID := '412b227e-dcb6-4401-afe1-8187096298f2';
    v_current_ingredients JSONB;
    v_current_instructions JSONB;
    v_items_to_move JSONB;
    v_new_ingredients JSONB;
    v_new_instructions JSONB;
BEGIN
    SELECT ingredients, instructions INTO v_current_ingredients, v_current_instructions
    FROM public.recipes WHERE id = v_recipe_id;

    -- Extract items 1-4 from instructions (indices 1-4 since JSONB arrays are 0-indexed, but ordinality gives 1-based)
    SELECT jsonb_agg(elem ORDER BY ord) INTO v_items_to_move
    FROM jsonb_array_elements(v_current_instructions) WITH ORDINALITY AS t(elem, ord)
    WHERE ord BETWEEN 1 AND 4;

    -- Build new ingredients: existing + moved items (with "To Serve" bolded)
    SELECT jsonb_agg(
        CASE 
            WHEN elem = '"To Serve"' THEN '"**To Serve**"'::jsonb
            ELSE elem
        END ORDER BY ord
    ) INTO v_items_to_move
    FROM jsonb_array_elements(v_items_to_move) WITH ORDINALITY AS t(elem, ord);

    v_new_ingredients := v_current_ingredients || v_items_to_move;

    -- Build new instructions: remove items 1-4
    SELECT jsonb_agg(elem ORDER BY ord) INTO v_new_instructions
    FROM jsonb_array_elements(v_current_instructions) WITH ORDINALITY AS t(elem, ord)
    WHERE ord > 4;

    UPDATE public.recipes
    SET ingredients = v_new_ingredients,
        instructions = v_new_instructions,
        updated_at = now()
    WHERE id = v_recipe_id;
END $$;
