-- Admin allow-list table
CREATE TABLE public.admin_emails (
  email text PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- No one can read/write the allow-list from the client
-- (only used by the security definer function below)

-- Security definer function: is the current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_emails ae
    JOIN auth.users u ON lower(u.email) = lower(ae.email)
    WHERE u.id = auth.uid()
  );
$$;

-- Tighten recipes RLS: drop old open INSERT, add admin-only write policies
DROP POLICY IF EXISTS "Anyone can insert recipes" ON public.recipes;

CREATE POLICY "Admins can insert recipes"
ON public.recipes
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update recipes"
ON public.recipes
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete recipes"
ON public.recipes
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Tighten storage: only admins can write to recipe-images bucket
-- (public read remains via the bucket being public)
CREATE POLICY "Admins can upload recipe images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images' AND public.is_admin());

CREATE POLICY "Admins can update recipe images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'recipe-images' AND public.is_admin());

CREATE POLICY "Admins can delete recipe images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'recipe-images' AND public.is_admin());