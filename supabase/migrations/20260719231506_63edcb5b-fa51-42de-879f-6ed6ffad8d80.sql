-- Restrict deletes on user-owned tables to their owners, block modifications to the audit log,
-- and add an explicit public read policy for avatars so bucket access is policy-driven.

-- pyramid_choices: only owner can delete
CREATE POLICY "Users can delete their own pyramid choices"
ON public.pyramid_choices FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- pyramid_progress: only owner can delete
CREATE POLICY "Users can delete their own pyramid progress"
ON public.pyramid_progress FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- natal_chart_deletions: audit log — explicitly deny UPDATE and DELETE
CREATE POLICY "No updates on deletion audit log"
ON public.natal_chart_deletions FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No deletes on deletion audit log"
ON public.natal_chart_deletions FOR DELETE
TO authenticated
USING (false);

-- avatars bucket: explicit public SELECT policy on storage.objects
CREATE POLICY "Public read access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
