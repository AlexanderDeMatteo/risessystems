'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
}

export interface PlanOption {
  id: number
  name: string
  price?: number
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

const emptyFormData = {
  memberId: '',
  memberName: '',
  amount: '',
  payment_method: 'card' as const,
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
      const firstPlan = plans.filter((p) => p.is_active !== false)[0]
      setFormData({
        ...emptyFormData,
        memberId: String(preselectedMember.id),
        memberName: preselectedMember.name,
        planId: firstPlan ? String(firstPlan.id) : '',
        planName: firstPlan?.name ?? '',
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
                setFormData((prev) => ({ ...prev, planId: value, planName: plan?.name ?? '' }))
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
