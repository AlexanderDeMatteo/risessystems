'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
import { Loader2, CreditCard, Info } from 'lucide-react'
import { toast } from 'sonner'
import { createPlatformPayment, type CreatePlatformPaymentInput, type PlatformPlan } from '@/app/actions/admin'

export interface PlatformClientOption {
  id: number
  name: string
}

interface AddPlatformPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: PlatformClientOption[]
  plans: PlatformPlan[]
  clientActiveUsers?: Record<number, number>
  /** When set, the client is fixed and the select is replaced by a read-only block. */
  initialClientId?: number | null
  /** If set, this is a renewal for an existing subscription. */
  subscriptionId?: number | null
  /** Current period end date for renewals (ISO YYYY-MM-DD). */
  currentPeriodEnd?: string | null
  /** Pre-selected plan id */
  initialPlanId?: number | null
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export function AddPlatformPaymentDialog({
  open,
  onOpenChange,
  clients,
  plans,
  clientActiveUsers = {},
  initialClientId = null,
  subscriptionId = null,
  currentPeriodEnd = null,
  initialPlanId = null,
}: AddPlatformPaymentDialogProps) {
  const router = useRouter()
  const [clientId, setClientId] = useState<string>('')
  const [planId, setPlanId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [periodStart, setPeriodStart] = useState<string>('')
  const [periodEnd, setPeriodEnd] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer'>('cash')
  const [status, setStatus] = useState<'pending' | 'completed'>('completed')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [amountOverridden, setAmountOverridden] = useState(false)

  const isRenewal = subscriptionId != null
  const hasPreselectedClient = initialClientId != null
  const preselectedClient = hasPreselectedClient
    ? clients.find((c) => c.id === initialClientId) ?? null
    : null

  const selectedPlan = useMemo(
    () => plans.find((p) => String(p.id) === planId) ?? null,
    [plans, planId]
  )

  const resolvedClientId = hasPreselectedClient && preselectedClient
    ? preselectedClient.id
    : clientId ? parseInt(clientId, 10) : NaN

  const calculatedAmount = useMemo(() => {
    if (!selectedPlan) return ''
    const activeUsers = !isNaN(resolvedClientId) ? (clientActiveUsers[resolvedClientId] ?? 0) : 0
    const overage = selectedPlan.max_active_users != null
      ? Math.max(0, activeUsers - selectedPlan.max_active_users)
      : 0
    const total = selectedPlan.price_monthly + overage * (selectedPlan.overage_price_per_user ?? 0)
    return total.toFixed(2)
  }, [selectedPlan, resolvedClientId, clientActiveUsers])

  useEffect(() => {
    if (open) {
      setError(null)
      setAmountOverridden(false)
      setPaymentMethod('cash')
      setStatus('completed')

      if (hasPreselectedClient && preselectedClient) {
        setClientId(String(preselectedClient.id))
      } else {
        setClientId('')
      }

      const firstPlan = initialPlanId
        ? String(initialPlanId)
        : plans[0] ? String(plans[0].id) : ''
      setPlanId(firstPlan)

      if (isRenewal && currentPeriodEnd) {
        const start = addDays(currentPeriodEnd, 1)
        const end = addDays(currentPeriodEnd, 30)
        setPeriodStart(start)
        setPeriodEnd(end)
      } else {
        const today = todayISO()
        setPeriodStart(today)
        setPeriodEnd(addDays(today, 30))
      }
    }
  }, [open, hasPreselectedClient, preselectedClient, plans, initialPlanId, isRenewal, currentPeriodEnd])

  useEffect(() => {
    if (!amountOverridden) {
      setAmount(calculatedAmount)
    }
  }, [calculatedAmount, amountOverridden])

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setError(null)
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!resolvedClientId || Number.isNaN(resolvedClientId)) {
      setError('Please select a client.')
      return
    }
    const numericAmount = parseFloat(amount)
    if (!numericAmount || numericAmount <= 0) {
      setError('Amount must be greater than 0.')
      return
    }
    if (!periodStart || !periodEnd) {
      setError('Please provide a billing period.')
      return
    }

    const payload: CreatePlatformPaymentInput = {
      userId: resolvedClientId,
      amount: numericAmount,
      periodStart,
      periodEnd,
      status,
      paymentMethod,
      ...(planId ? { planId: parseInt(planId, 10) } : {}),
      ...(subscriptionId != null ? { subscriptionId } : {}),
    }

    setSubmitting(true)
    const result = await createPlatformPayment(payload)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    toast.success(isRenewal ? 'Subscription renewed.' : 'Client activated and payment recorded.')
    handleClose(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="w-4 h-4 text-primary" />
            {isRenewal ? 'Renew Subscription' : 'Activate & Charge Client'}
          </DialogTitle>
          <DialogDescription>
            {isRenewal
              ? 'Extend the subscription period and register the payment.'
              : 'Assign a plan, confirm the amount, and activate the gym client.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {hasPreselectedClient && preselectedClient ? (
            <div className="space-y-1 rounded-md border border-border/60 bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Client</p>
              <p className="font-medium text-foreground">{preselectedClient.name}</p>
              {!isNaN(resolvedClientId) && clientActiveUsers[resolvedClientId] != null && (
                <p className="text-xs text-muted-foreground">
                  {clientActiveUsers[resolvedClientId]} active members
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="client">Gym client</Label>
              <Select value={clientId} onValueChange={(v) => setClientId(v)} required>
                <SelectTrigger id="client" className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Select gym client" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={planId} onValueChange={(v) => { setPlanId(v); setAmountOverridden(false) }}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {plans.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name} — ${p.price_monthly.toFixed(2)}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPlan && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Up to {selectedPlan.max_active_users ?? '∞'} members
                {selectedPlan.overage_price_per_user
                  ? `, $${selectedPlan.overage_price_per_user}/extra`
                  : ''}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount (USD)
              {calculatedAmount && !amountOverridden && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">auto-calculated</span>
              )}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setAmountOverridden(true) }}
              className="bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Period start</Label>
              <Input
                id="periodStart"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="bg-secondary/50 border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Period end</Label>
              <Input
                id="periodEnd"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="bg-secondary/50 border-border"
                required
              />
            </div>
          </div>

          {periodStart && periodEnd && (
            <p className="text-xs text-muted-foreground bg-secondary/30 rounded-md px-3 py-2">
              Period: {formatDate(periodStart)} – {formatDate(periodEnd)}
            </p>
          )}

          <div className="space-y-2">
            <Label>Payment method</Label>
            <Select value={paymentMethod} onValueChange={(v: 'cash' | 'card' | 'bank_transfer') => setPaymentMethod(v)}>
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
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: 'pending' | 'completed') => setStatus(v)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || clients.length === 0}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                isRenewal ? 'Renew' : 'Activate & Charge'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
