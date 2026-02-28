-- Storage RLS: allow authenticated users to manage their own files in each bucket.
-- Create the buckets first in Supabase Dashboard: Storage → New bucket → avatars, exercises, progress-photos.
-- Make "avatars" public if you want direct image URLs; keep others private and use signed URLs.

-- Avatars: users can only read/write files under their own folder (auth.uid())
CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "avatars_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- Exercises: same pattern (gym owner uploads under their auth.uid() folder)
CREATE POLICY "exercises_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "exercises_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "exercises_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "exercises_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'exercises' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- Progress photos: same pattern
CREATE POLICY "progress_photos_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "progress_photos_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "progress_photos_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "progress_photos_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = (auth.uid())::text);
