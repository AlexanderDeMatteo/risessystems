'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'

export type UserSettings = {
  colorScheme: string
  notifyExpiring: boolean
  notifyPayments: boolean
  notifyCheckins: boolean
  notifyNewMembers: boolean
  currency: string
  timezone: string
  exchangeRate: number | null
  referenceCurrency: string
  locale: string
}

const DEFAULT_SETTINGS: UserSettings = {
  colorScheme: 'neon-acid',
  notifyExpiring: true,
  notifyPayments: true,
  notifyCheckins: true,
  notifyNewMembers: true,
  currency: 'USD',
  timezone: 'America/Mexico_City',
  exchangeRate: null,
  referenceCurrency: 'USD',
  locale: 'en',
}

export async function getUserSettings(): Promise<UserSettings> {
  const userId = await getCurrentAppUserId()
  if (!userId) return DEFAULT_SETTINGS

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_settings')
    .select('color_scheme, notify_expiring, notify_payments, notify_checkins, notify_new_members, currency, timezone, exchange_rate, reference_currency, locale')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data) return DEFAULT_SETTINGS

  return {
    colorScheme: data.color_scheme ?? DEFAULT_SETTINGS.colorScheme,
    notifyExpiring: data.notify_expiring ?? DEFAULT_SETTINGS.notifyExpiring,
    notifyPayments: data.notify_payments ?? DEFAULT_SETTINGS.notifyPayments,
    notifyCheckins: data.notify_checkins ?? DEFAULT_SETTINGS.notifyCheckins,
    notifyNewMembers: data.notify_new_members ?? DEFAULT_SETTINGS.notifyNewMembers,
    currency: data.currency ?? DEFAULT_SETTINGS.currency,
    timezone: data.timezone ?? DEFAULT_SETTINGS.timezone,
    exchangeRate: data.exchange_rate != null ? Number(data.exchange_rate) : null,
    referenceCurrency: data.reference_currency ?? DEFAULT_SETTINGS.referenceCurrency,
    locale: data.locale ?? DEFAULT_SETTINGS.locale,
  }
}

export type UpdateSettingsInput = Partial<{
  colorScheme: string
  notifyExpiring: boolean
  notifyPayments: boolean
  notifyCheckins: boolean
  notifyNewMembers: boolean
  currency: string
  timezone: string
  exchangeRate: number | null
  referenceCurrency: string
  locale: string
}>

export async function updateUserSettings(
  input: UpdateSettingsInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = await getTranslations('errors')
  const userId = await getCurrentAppUserId()
  if (!userId) return { ok: false, error: t('notAuthenticated') }

  const payload: Record<string, unknown> = {}
  if (input.colorScheme !== undefined) payload.color_scheme = input.colorScheme
  if (input.notifyExpiring !== undefined) payload.notify_expiring = input.notifyExpiring
  if (input.notifyPayments !== undefined) payload.notify_payments = input.notifyPayments
  if (input.notifyCheckins !== undefined) payload.notify_checkins = input.notifyCheckins
  if (input.notifyNewMembers !== undefined) payload.notify_new_members = input.notifyNewMembers
  if (input.currency !== undefined) payload.currency = input.currency
  if (input.timezone !== undefined) payload.timezone = input.timezone
  if (input.exchangeRate !== undefined) payload.exchange_rate = input.exchangeRate
  if (input.referenceCurrency !== undefined) payload.reference_currency = input.referenceCurrency
  if (input.locale !== undefined) payload.locale = input.locale

  if (Object.keys(payload).length === 0) return { ok: true }

  payload.updated_at = new Date().toISOString()

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('user_settings')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('user_settings')
      .update(payload)
      .eq('user_id', userId)
    if (error) return { ok: false, error: error.message }
  } else {
    const { error } = await supabase
      .from('user_settings')
      .insert({ user_id: userId, ...payload })
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/admin/settings')
  return { ok: true }
}
