'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAppUserId } from '@/lib/supabase/get-app-user-id'
import { format, addMonths } from 'date-fns'
import { getPlanForActiveCount, getMonthlyPriceBreakdown } from '@/lib/mocks/platform-plans'
import type { SubscriptionInfo, PlatformPlan } from '@/lib/types/platform-plans'

type SubscriptionRow = {
  id: number
  status: string
  started_at: string
}

type PaymentRow = {
  period_end: string
}

type PlanRow = {
  id: number
  name: string
  min_active_users: number
  max_active_users: number | null
  price_monthly: number
  is_active: boolean
  sort_order: number
  overage_threshold: number | null
  overage_price_per_user: number | null
}

export async function getMySubscriptionInfo(
  activeMembersCount: number
): Promise<SubscriptionInfo> {
  const userId = await getCurrentAppUserId()
  
  const fallback: SubscriptionInfo = {
    planName: 'No subscription',
    priceMonthly: 0,
    nextBillingDate: '—',
    activeMembersCount,
  }
  
  if (!userId) return fallback
  
  const supabase = await createClient()
  
  const { data: subscription } = await supabase
    .from('platform_subscriptions')
    .select('id, status, started_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()
  
  if (!subscription) return fallback
  
  const { data: plansData } = await supabase
    .from('platform_plans')
    .select('id, name, min_active_users, max_active_users, price_monthly, is_active, sort_order, overage_threshold, overage_price_per_user')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  if (!plansData || plansData.length === 0) return fallback
  
  const plans: PlatformPlan[] = (plansData as PlanRow[]).map(p => ({
    id: p.id,
    name: p.name,
    min_active_users: p.min_active_users,
    max_active_users: p.max_active_users,
    price_monthly: p.price_monthly,
    is_active: p.is_active,
    sort_order: p.sort_order,
    overage_threshold: p.overage_threshold,
    overage_price_per_user: p.overage_price_per_user ?? undefined,
  }))
  
  const calculatedPlan = getPlanForActiveCount(activeMembersCount, plans)
  
  if (!calculatedPlan) return fallback
  
  const breakdown = getMonthlyPriceBreakdown(calculatedPlan, activeMembersCount)
  
  const row = subscription as SubscriptionRow
  
  const { data: lastPayment } = await supabase
    .from('platform_payments')
    .select('period_end')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .order('period_end', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  let nextBillingDate = '—'
  if (lastPayment) {
    const payment = lastPayment as PaymentRow
    const nextDate = addMonths(new Date(payment.period_end), 1)
    nextBillingDate = format(nextDate, 'MMMM d, yyyy')
  } else {
    const startDate = addMonths(new Date(row.started_at), 1)
    nextBillingDate = format(startDate, 'MMMM d, yyyy')
  }
  
  return {
    planName: calculatedPlan.name,
    priceMonthly: breakdown.total,
    nextBillingDate,
    activeMembersCount,
    priceBreakdown: breakdown.overage > 0 ? { base: breakdown.base, overage: breakdown.overage } : undefined,
  }
}
