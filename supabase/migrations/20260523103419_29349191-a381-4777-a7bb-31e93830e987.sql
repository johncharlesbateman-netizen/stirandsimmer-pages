CREATE POLICY "Own progress delete"
ON public.challenge_progress
FOR DELETE
TO authenticated
USING (
  (auth.uid() = user_id)
  AND (((auth.jwt() ->> 'is_anonymous'::text))::boolean IS NOT TRUE)
);