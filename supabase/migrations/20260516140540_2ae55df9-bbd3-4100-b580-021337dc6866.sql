-- Helper expression: (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
-- excludes anonymous-sign-in sessions while still allowing real authenticated users.

-- ============================================================
-- profiles
-- ============================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE)
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

-- ============================================================
-- challenge_progress
-- ============================================================
DROP POLICY IF EXISTS "Own progress select" ON public.challenge_progress;
DROP POLICY IF EXISTS "Own progress update" ON public.challenge_progress;
DROP POLICY IF EXISTS "Own progress insert" ON public.challenge_progress;

CREATE POLICY "Own progress select"
ON public.challenge_progress FOR SELECT TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Own progress update"
ON public.challenge_progress FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE)
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Own progress insert"
ON public.challenge_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

-- ============================================================
-- cooked_dishes
-- ============================================================
DROP POLICY IF EXISTS "Users view own cooked dishes" ON public.cooked_dishes;
DROP POLICY IF EXISTS "Users delete own cooked dishes" ON public.cooked_dishes;
DROP POLICY IF EXISTS "Users insert own cooked dishes" ON public.cooked_dishes;

CREATE POLICY "Users view own cooked dishes"
ON public.cooked_dishes FOR SELECT TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Users delete own cooked dishes"
ON public.cooked_dishes FOR DELETE TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Users insert own cooked dishes"
ON public.cooked_dishes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

-- ============================================================
-- recipe_ratings (public SELECT preserved; mutations tightened)
-- ============================================================
DROP POLICY IF EXISTS "Users can update their own rating" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can delete their own rating" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Authenticated users can insert their own rating" ON public.recipe_ratings;

CREATE POLICY "Users can update their own rating"
ON public.recipe_ratings FOR UPDATE TO authenticated
USING (((auth.uid() = user_id) OR is_admin()) AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE)
WITH CHECK (((auth.uid() = user_id) OR is_admin()) AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Users can delete their own rating"
ON public.recipe_ratings FOR DELETE TO authenticated
USING (((auth.uid() = user_id) OR is_admin()) AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Authenticated users can insert their own rating"
ON public.recipe_ratings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

-- ============================================================
-- unlocked_secrets
-- ============================================================
DROP POLICY IF EXISTS "Own unlocks select" ON public.unlocked_secrets;
DROP POLICY IF EXISTS "Own unlocks insert" ON public.unlocked_secrets;

CREATE POLICY "Own unlocks select"
ON public.unlocked_secrets FOR SELECT TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Own unlocks insert"
ON public.unlocked_secrets FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

-- ============================================================
-- verifications
-- ============================================================
DROP POLICY IF EXISTS "Own verifications select" ON public.verifications;
DROP POLICY IF EXISTS "Own verifications insert" ON public.verifications;

CREATE POLICY "Own verifications select"
ON public.verifications FOR SELECT TO authenticated
USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "Own verifications insert"
ON public.verifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

-- ============================================================
-- storage.objects — dish-photo policies
-- (Admin recipe-image policies left as-is; is_admin() already
--  fails for anonymous-sign-in users, but we tighten dish ones.)
-- ============================================================
DROP POLICY IF EXISTS "Pass: read own dish photos" ON storage.objects;
DROP POLICY IF EXISTS "Users view own dish photos" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own dish photos" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own dish photos" ON storage.objects;
DROP POLICY IF EXISTS "Users insert own dish photos" ON storage.objects;

CREATE POLICY "Users view own dish photos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id IN ('dish-photos', 'dish-verifications')
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
);

CREATE POLICY "Users insert own dish photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('dish-photos', 'dish-verifications')
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
);

CREATE POLICY "Users delete own dish photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('dish-photos', 'dish-verifications')
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
);