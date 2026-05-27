-- Allow public inserts on recipes (admin page is unauthenticated)
CREATE POLICY "Anyone can insert recipes"
ON public.recipes
FOR INSERT
WITH CHECK (true);

-- Storage policies for recipe-images bucket
CREATE POLICY "Anyone can upload recipe images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can view recipe images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can update recipe images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can delete recipe images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'recipe-images');