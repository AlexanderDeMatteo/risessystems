import type { PlatformPlan, SubscriptionInfo } from '@/lib/types/platform-plans'

/**
 * Returns the tier that applies to the given active user count.
 * Tiers are sorted by min_active_users desc so the highest matching tier is chosen.
 */
export function getPlanForActiveCount(
  activeCount: number,
  tiers: PlatformPlan[]
): PlatformPlan | null {
  const activeTiers = tiers.filter(t => t.is_active)
  const sorted = [...activeTiers].sort((a, b) => b.min_active_users - a.min_active_users)
  return sorted.find(
    t =>
      activeCount >= t.min_active_users &&
      (t.max_active_users === null || activeCount <= t.max_active_users)
  ) ?? null
}

/**
 * Overage: when active users exceed overage_threshold, add (activeCount - overage_threshold) * overage_price_per_user.
 */
export function getMonthlyPriceBreakdown(
  plan: PlatformPlan,
  activeCount: number
): { base: number; overage: number; total: number } {
  const base = plan.price_monthly
  const threshold = plan.overage_threshold ?? null
  const pricePerUser = plan.overage_price_per_user ?? 0
  const overage =
    threshold != null && activeCount > threshold && pricePerUser > 0
      ? (activeCount - threshold) * pricePerUser
      : 0
  return { base, overage, total: base + overage }
}

export function getMonthlyPrice(plan: PlatformPlan, activeCount: number): number {
  return getMonthlyPriceBreakdown(plan, activeCount).total
}

/** Mock platform tiers. Replace with API call later. */
export function getPlatformPlans(): PlatformPlan[] {
  return MOCK_PLATFORM_PLANS
}

/** Mock subscription for current gym owner. Replace with API call later. */
export function getMySubscription(): SubscriptionInfo {
  const plans = MOCK_PLATFORM_PLANS
  const plan = getPlanForActiveCount(MOCK_SUBSCRIPTION.activeMembersCount, plans)
  const priceMonthly = plan
    ? getMonthlyPrice(plan, MOCK_SUBSCRIPTION.activeMembersCount)
    : MOCK_SUBSCRIPTION.priceMonthly
  const breakdown =
    plan &&
    plan.overage_threshold != null &&
    MOCK_SUBSCRIPTION.activeMembersCount > plan.overage_threshold
      ? getMonthlyPriceBreakdown(plan, MOCK_SUBSCRIPTION.activeMembersCount)
      : undefined
  return {
    ...MOCK_SUBSCRIPTION,
    planName: plan?.name ?? MOCK_SUBSCRIPTION.planName,
    priceMonthly,
    priceBreakdown: breakdown
      ? { base: breakdown.base, overage: breakdown.overage }
      : undefined,
  }
}

const MOCK_PLATFORM_PLANS: PlatformPlan[] = [
  {
    id: 1,
    name: 'Starter',
    min_active_users: 0,
    max_active_users: 50,
    price_monthly: 49,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 2,
    name: 'Growth',
    min_active_users: 51,
    max_active_users: 200,
    price_monthly: 99,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 3,
    name: 'Enterprise',
    min_active_users: 201,
    max_active_users: null,
    price_monthly: 199,
    is_active: true,
    sort_order: 3,
    overage_threshold: 300,
    overage_price_per_user: 1,
  },
]

const MOCK_SUBSCRIPTION: SubscriptionInfo = {
  planName: 'Enterprise',
  priceMonthly: 199,
  nextBillingDate: 'March 15, 2025',
  activeMembersCount: 350,
}
