UPDATE public.recipes
SET instructions = (
  SELECT jsonb_agg(elem ORDER BY ord)
  FROM (
    SELECT elem, ord
    FROM jsonb_array_elements(instructions) WITH ORDINALITY AS t(elem, ord)
    WHERE ord <= 25
    UNION ALL
    SELECT to_jsonb('For the Lamb'::text), 25.3
    UNION ALL
    SELECT to_jsonb('Place the lamb fillets in a tray and drizzle a little Olive Oil over each'::text), 25.6
    UNION ALL
    SELECT elem, ord
    FROM jsonb_array_elements(instructions) WITH ORDINALITY AS t(elem, ord)
    WHERE ord > 25
  ) s
)
WHERE slug = 'fillet-of-lamb-with-courgettes-provenale-pommes-boulangre';