'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getDaysRemaining } from '@/components/members/members-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface PaymentFormData {
  memberId: string
  memberName: string
  amount: string
  payment_method: 'cash' | 'card' | 'bank_transfer'
  /** Plan id from Plans (membership plans) */
  planId?: string
  planName?: string
  description?: string
  /** Computed when selecting plan (activation or renewal) */
  new_expiry_date?: string
  member_status_update?: 'active' | 'inactive' | 'suspended'
}

export interface MemberOption {
  id: number
  name: string
  membership_type?: string
}

export interface PreselectedMember {
  id: number
  name: string
  membership_type?: string
  status?: string
  expiry_date?: string
}

export interface PlanOption {
  id: number
  name: string
  price?: number
  duration_days?: number
  is_active?: boolean
}

interface AddPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: MemberOption[]
  /** Plans from dashboard Plans (active plans for the Plan dropdown) */
  plans: PlanOption[]
  /** When set, member is fixed and form only asks amount + method (e.g. from renewal row) */
  preselectedMember?: PreselectedMember | null
  onPaymentAdded?: (data: PaymentFormData) => void
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function computeNewExpiry(member: PreselectedMember, plan: PlanOption): string | undefined {
  const duration = plan.duration_days
  if (duration == null) return undefined
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isInactive = member.status === 'inactive'
  const noExpiry = !member.expiry_date
  const daysRemaining = getDaysRemaining(member.expiry_date)
  const isExpired = daysRemaining !== null && daysRemaining < 0
  let baseDate: Date
  if (isInactive || noExpiry || isExpired) {
    baseDate = today
  } else {
    baseDate = new Date(member.expiry_date!)
    baseDate.setHours(0, 0, 0, 0)
  }
  return toISODate(addDays(baseDate, duration))
}

function formatExpiryDisplay(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const emptyFormData: {
  memberId: string
  memberName: string
  amount: string
  payment_method: 'cash' | 'card' | 'bank_transfer'
  planId: string
  planName: string
  description: string
  new_expiry_date?: string
  member_status_update?: 'active' | 'inactive' | 'suspended'
} = {
  memberId: '',
  memberName: '',
  amount: '',
  payment_method: 'card',
  planId: '',
  planName: '',
  description: '',
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  members,
  plans,
  preselectedMember,
  onPaymentAdded,
}: AddPaymentDialogProps) {
  const [formData, setFormData] = useState(emptyFormData)

  const activePlans = plans.filter((p) => p.is_active !== false)

  useEffect(() => {
    if (open && preselectedMember) {
      const activePlansList = plans.filter((p) => p.is_active !== false)
      const matchingPlan =
        activePlansList.find(
          (p) => p.name?.toLowerCase() === preselectedMember.membership_type?.toLowerCase()
        ) ?? activePlansList[0]
      const newExpiry = matchingPlan ? computeNewExpiry(preselectedMember, matchingPlan) : undefined
      const statusUpdate =
        preselectedMember.status === 'inactive' ? ('active' as const) : undefined
      setFormData({
        ...emptyFormData,
        memberId: String(preselectedMember.id),
        memberName: preselectedMember.name,
        planId: matchingPlan ? String(matchingPlan.id) : '',
        planName: matchingPlan?.name ?? '',
        amount: matchingPlan?.price != null ? String(matchingPlan.price) : '',
        new_expiry_date: newExpiry,
        member_status_update: statusUpdate,
      })
    } else if (open && !preselectedMember) {
      setFormData(emptyFormData)
    }
  }, [open, preselectedMember, plans])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const memberName = preselectedMember?.name ?? formData.memberName ?? members.find((m) => String(m.id) === formData.memberId)?.name ?? ''
    const selectedPlan = activePlans.find((p) => String(p.id) === formData.planId)
    onPaymentAdded?.({
      ...formData,
      memberName,
      planId: formData.planId || undefined,
      planName: selectedPlan?.name ?? formData.planName,
      new_expiry_date: formData.new_expiry_date,
      member_status_update: formData.member_status_update,
    })
    onOpenChange(false)
    setFormData(emptyFormData)
  }

  const isPreselected = Boolean(preselectedMember)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Record Payment</DialogTitle>
          <DialogDescription>
            {isPreselected
              ? 'Enter amount and payment method for this member'
              : 'Register a payment from a member and select the payment method'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isPreselected ? (
            <div className="space-y-2 rounded-md border border-border/50 bg-secondary/20 p-3">
              <p className="text-sm text-muted-foreground">Member</p>
              <p className="font-medium text-foreground">{preselectedMember!.name}</p>
              {preselectedMember!.membership_type && (
                <p className="text-xs text-muted-foreground capitalize">
                  Plan: {preselectedMember!.membership_type}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="member">Member</Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => {
                  const m = members.find((mb) => String(mb.id) === value)
                  setFormData((prev) => ({ ...prev, memberId: value, memberName: m?.name ?? '' }))
                }}
                required
              >
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {members.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              required
              className="bg-secondary/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value: PaymentFormData['payment_method']) =>
                setFormData((prev) => ({ ...prev, payment_method: value }))
              }
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Plan</Label>
            <Select
              value={formData.planId || (activePlans[0] ? String(activePlans[0].id) : '')}
              onValueChange={(value) => {
                const plan = activePlans.find((p) => String(p.id) === value)
                const next: typeof formData = {
                  ...formData,
                  planId: value,
                  planName: plan?.name ?? '',
                }
                if (preselectedMember && plan) {
                  next.new_expiry_date = computeNewExpiry(preselectedMember, plan)
                  next.member_status_update =
                    preselectedMember.status === 'inactive' ? 'active' : formData.member_status_update
                }
                setFormData(next)
              }}
              required
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {activePlans.map((plan) => (
                  <SelectItem key={plan.id} value={String(plan.id)}>
                    {plan.name}
                    {plan.price != null ? ` — $${plan.price.toFixed(2)}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Membership plan this payment applies to</p>
            {isPreselected && formData.new_expiry_date && (
              <p className="text-xs text-muted-foreground">
                New expiry: {formatExpiryDisplay(formData.new_expiry_date)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g. Monthly fee January"
              value={formData.description ?? ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Record payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
