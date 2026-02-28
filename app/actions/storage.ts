'use server'

import { createClient } from '@/lib/supabase/server'

const AVATARS_BUCKET = 'avatars'
const EXERCISES_BUCKET = 'exercises'
const PROGRESS_PHOTOS_BUCKET = 'progress-photos'

export type UploadResult = { ok: true; path: string; url: string } | { ok: false; error: string }

function getExtension(filename: string): string {
  const i = filename.lastIndexOf('.')
  return i >= 0 ? filename.slice(i + 1).toLowerCase() : 'jpg'
}

/** Upload avatar for the current user. Path: {auth.uid()}/{uuid}.{ext}. Returns public URL. */
export async function uploadAvatar(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file || !(file instanceof File)) return { ok: false, error: 'No file' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }
  const ext = getExtension(file.name)
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(AVATARS_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return { ok: false, error: error.message }
  const { data: urlData } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path)
  return { ok: true, path, url: urlData.publicUrl }
}

/** Upload exercise media. Path: {auth.uid()}/{uuid}.{ext}. */
export async function uploadExerciseFile(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file || !(file instanceof File)) return { ok: false, error: 'No file' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }
  const ext = getExtension(file.name)
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(EXERCISES_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return { ok: false, error: error.message }
  const { data: urlData } = supabase.storage.from(EXERCISES_BUCKET).getPublicUrl(path)
  return { ok: true, path, url: urlData.publicUrl }
}

/** Upload progress photo. Path: {auth.uid()}/{uuid}.{ext}. */
export async function uploadProgressPhoto(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file || !(file instanceof File)) return { ok: false, error: 'No file' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }
  const ext = getExtension(file.name)
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(PROGRESS_PHOTOS_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return { ok: false, error: error.message }
  const { data: urlData } = supabase.storage.from(PROGRESS_PHOTOS_BUCKET).getPublicUrl(path)
  return { ok: true, path, url: urlData.publicUrl }
}

/** Delete a file by path (must be in the current user's folder). */
export async function deleteStorageFile(bucket: string, path: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }
  if (!path.startsWith(`${user.id}/`)) return { ok: false, error: 'Access denied' }
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
