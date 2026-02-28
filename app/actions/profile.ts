'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { format } from 'date-fns'

export type ProfileUser = {
  name: string
  email: string
  gymName: string | null
  joinDate: string
  phone?: string | null
  location?: string | null
}

export async function getCurrentUserProfile(): Promise<ProfileUser | null> {
  const userId = await getCurrentAppUserId()
  if (!userId) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, gym_name, created_at')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  const row = data as { name: string; email: string; gym_name: string | null; created_at: string }
  return {
    name: row.name ?? '',
    email: row.email ?? '',
    gymName: row.gym_name ?? null,
    joinDate: row.created_at
      ? format(new Date(row.created_at), 'MMMM d, yyyy')
      : '',
    phone: null,
    location: null,
  }
}
