UPDATE public.recipes
SET instructions = jsonb_build_array(
  'Heat the oil in a large frying pan or saucepan over a medium-low heat and fry the onion for 6-8 mins until softened but not golden. Tip in the beef mince and continue to fry until the beef has browned, about 5 mins. Stir in the garlic and cook for 1-2 mins before stirring in the oregano, cumin, paprika and chilli powder, if using. Cook for 1 min more.',
  'Add the tomato purée, tomatoes and black beans, including the liquid from the can of beans. Crumble in the stock cube. Stir well, then add half a can of water and bring to a simmer. Simmer for 30 mins until the sauce has thickened. Remove from the heat.',
  'Heat the oven to 200C/180C fan/gas 6. Spoon an eighth of the beef mixture down the centre of one of the tortillas, then fold the sides in to enclose the filling. Arrange seam-side down in a large ovenproof dish, and repeat until all the filling and tortillas have been used, tucking the enchiladas next to one another snugly. Scatter the cheese over the top and bake for 15-20 mins until the cheese has melted and the tortillas are golden. Scatter over the coriander leaves to serve.'
),
updated_at = now()
WHERE slug = 'beef-enchiladas';