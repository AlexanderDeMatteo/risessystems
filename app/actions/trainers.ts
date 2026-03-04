'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'

export type TrainerRow = {
  id: number
  name: string
  email: string
  phone: string | null
  specialties: string | null
  branch_id: number | null
  status: string
  is_primary: boolean
  hire_date: string | null
  avatar_url: string | null
}

export type GetTrainersResult =
  | { trainers: TrainerRow[]; error: null }
  | { trainers: TrainerRow[]; error: string }

export async function getTrainers(): Promise<GetTrainersResult> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { trainers: [], error: 'Not authenticated' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trainers')
    .select('id, name, email, phone, specialties, branch_id, status, is_primary, hire_date, avatar_url')
    .eq('user_id', userId)
    .order('id', { ascending: true })
  if (error) return { trainers: [], error: error.message }
  const trainers = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    specialties: r.specialties ?? null,
    branch_id: r.branch_id ?? null,
    status: r.status,
    is_primary: r.is_primary ?? false,
    hire_date: r.hire_date ?? null,
    avatar_url: r.avatar_url ?? null,
  }))
  return { trainers, error: null }
}

export type CreateTrainerInput = {
  name: string
  email: string
  phone?: string
  specialties?: string
  branch_id?: number
  is_primary?: boolean
  hire_date?: string
}

export async function createTrainer(input: CreateTrainerInput): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trainers')
    .insert({
      user_id: userId,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      specialties: input.specialties || null,
      branch_id: input.branch_id || null,
      status: 'active',
      is_primary: input.is_primary ?? false,
      hire_date: input.hire_date || null,
    })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/trainers')
  return { ok: true, id: data.id }
}

export async function updateTrainer(id: number, input: Partial<CreateTrainerInput>): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const payload: Record<string, unknown> = {}
  if (input.name !== undefined) payload.name = input.name
  if (input.email !== undefined) payload.email = input.email
  if (input.phone !== undefined) payload.phone = input.phone || null
  if (input.specialties !== undefined) payload.specialties = input.specialties || null
  if (input.branch_id !== undefined) payload.branch_id = input.branch_id || null
  if (input.is_primary !== undefined) payload.is_primary = input.is_primary
  if (input.hire_date !== undefined) payload.hire_date = input.hire_date || null
  const { error } = await supabase.from('trainers').update(payload).eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/trainers')
  return { ok: true }
}

export async function deleteTrainer(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: 'Not authenticated' }
  const supabase = await createClient()
  const { error } = await supabase.from('trainers').delete().eq('id', id).eq('user_id', userId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/trainers')
  return { ok: true }
}
