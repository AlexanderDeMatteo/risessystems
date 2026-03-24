import type { PlatformPlan } from '@/lib/types/platform-plans'

/**
 * Returns the tier that applies to the given active user count.
 * Tiers are sorted by min_active_users desc so the highest matching tier is chosen.
 */
export function getPlanForActiveCount(
  activeCount: number,
  tiers: PlatformPlan[]
): PlatformPlan | null {
  const activeTiers = tiers.filter((t) => t.is_active)
  const sorted = [...activeTiers].sort((a, b) => b.min_active_users - a.min_active_users)
  return (
    sorted.find(
      (t) =>
        activeCount >= t.min_active_users &&
        (t.max_active_users === null || activeCount <= t.max_active_users)
    ) ?? null
  )
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
