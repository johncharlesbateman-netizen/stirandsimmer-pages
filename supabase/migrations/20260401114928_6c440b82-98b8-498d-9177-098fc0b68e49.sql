INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for recipe images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated upload for recipe images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images');