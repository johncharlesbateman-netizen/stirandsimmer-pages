-- Explicit deny-all for client access; the is_admin() function uses SECURITY DEFINER to bypass these
CREATE POLICY "Deny all select on admin_emails"
ON public.admin_emails
FOR SELECT
TO authenticated, anon
USING (false);

CREATE POLICY "Deny all insert on admin_emails"
ON public.admin_emails
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "Deny all update on admin_emails"
ON public.admin_emails
FOR UPDATE
TO authenticated, anon
USING (false);

CREATE POLICY "Deny all delete on admin_emails"
ON public.admin_emails
FOR DELETE
TO authenticated, anon
USING (false);