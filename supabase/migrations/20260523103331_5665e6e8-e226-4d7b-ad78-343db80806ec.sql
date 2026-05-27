-- Remove the overly permissive upload policy for recipe-images bucket
-- so only admin users (via the existing admin-restricted policy) can upload
DROP POLICY IF EXISTS "Authenticated upload for recipe images" ON storage.objects;