-- Restrict secrets_pass so reward content is only readable by users who have unlocked it (or admins).
DROP POLICY IF EXISTS "Secrets readable by all" ON public.secrets_pass;

CREATE POLICY "Users can view secrets they have unlocked"
ON public.secrets_pass
FOR SELECT
TO authenticated
USING (
  ((auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE)
  AND (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM public.unlocked_secrets us
      WHERE us.secret_id = secrets_pass.id
        AND us.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can view all secrets"
ON public.secrets_pass
FOR SELECT
TO authenticated
USING (is_admin());
