'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RevenueStats } from '@/components/accounting/revenue-stats'
import { PaymentsTable, type Payment } from '@/components/accounting/payments-table'
import { AddPaymentDialog, type PaymentFormData, type MemberOption, type PreselectedMember, type PlanOption } from '@/components/accounting/add-payment-dialog'
import { RenewalsTable } from '@/components/accounting/renewals-table'
import { PendingActivationTable } from '@/components/accounting/pending-activation-table'
import { RevenueChart } from '@/components/accounting/revenue-chart'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createPayment } from '@/app/actions/payments'
import type { Member } from '@/components/members/members-table'
import type { AccountingStats } from '@/app/actions/payments'

interface AccountingPageClientProps {
  initialPayments: Payment[]
  memberOptions: MemberOption[]
  planOptions: PlanOption[]
  inactiveMembers: Member[]
  membersForRenewals: Member[]
  revenueChartData?: { name: string; memberships: number; training: number; other: number }[]
  accountingStats: AccountingStats
  activeMembersCount: number
  paymentMethodPercents: { cash: number; card: number; bank_transfer: number }
  statsError?: string | null
  paymentsError?: string
  plansError?: string
}

export function AccountingPageClient({
  initialPayments,
  memberOptions,
  planOptions,
  inactiveMembers,
  membersForRenewals,
  revenueChartData = [],
  accountingStats,
  activeMembersCount,
  paymentMethodPercents,
  statsError = null,
  paymentsError,
  plansError,
}: AccountingPageClientProps) {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [preselectedMember, setPreselectedMember] = useState<PreselectedMember | null>(null)

  useEffect(() => {
    setPayments(initialPayments)
  }, [initialPayments])

  const handlePaymentAdded = useCallback(
    async (data: PaymentFormData) => {
      const memberId = parseInt(data.memberId, 10)
      if (Number.isNaN(memberId)) return
      const amount = parseFloat(data.amount) || 0
      const paymentType = data.planId ? 'membership' : 'other'
      const result = await createPayment({
        member_id: memberId,
        amount,
        payment_type: paymentType,
        payment_method: data.payment_method,
        description: data.description ?? undefined,
        update_member:
          data.new_expiry_date || data.member_status_update
            ? {
                status: data.member_status_update,
                new_expiry_date: data.new_expiry_date,
              }
            : undefined,
      })
      if (result.ok) {
        setPreselectedMember(null)
        setIsPaymentDialogOpen(false)
        router.refresh()
      }
    },
    [router]
  )

  const openDialogForMember = useCallback((member: Member) => {
    setPreselectedMember({
      id: member.id,
      name: member.name,
      membership_type: member.membership_type,
      status: member.status,
      expiry_date: member.expiry_date,
    })
    setIsPaymentDialogOpen(true)
  }, [])

  const openDialogForAnyMember = useCallback(() => {
    setPreselectedMember(null)
    setIsPaymentDialogOpen(true)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setPreselectedMember(null)
    setIsPaymentDialogOpen(open)
  }, [])

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {statsError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Could not load accounting stats: {statsError}</AlertDescription>
          </Alert>
        )}
        {paymentsError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Could not load payments: {paymentsError}</AlertDescription>
          </Alert>
        )}
        {plansError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Could not load plans: {plansError}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
            <p className="text-muted-foreground mt-1">Track revenue and payments</p>
          </div>
          <Button onClick={openDialogForAnyMember} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Record payment (any member)
          </Button>
        </div>

        <RevenueStats
          stats={accountingStats}
          activeMembersCount={activeMembersCount}
        />

        {inactiveMembers.length > 0 && (
          <PendingActivationTable
            members={inactiveMembers}
            onActivate={openDialogForMember}
          />
        )}

        <RenewalsTable
          members={membersForRenewals}
          defaultFilter="30"
          onRecordPayment={openDialogForMember}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueChartData} />
          </div>
          <Card className="bg-card border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cash</span>
                <span className="font-medium text-foreground">{paymentMethodPercents.cash}%</span>
              </div>
              <div className="bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${paymentMethodPercents.cash}%` }} />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Card</span>
                <span className="font-medium text-foreground">{paymentMethodPercents.card}%</span>
              </div>
              <div className="bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: `${paymentMethodPercents.card}%` }} />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Bank Transfer</span>
                <span className="font-medium text-foreground">{paymentMethodPercents.bank_transfer}%</span>
              </div>
              <div className="bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-chart-2 h-full" style={{ width: `${paymentMethodPercents.bank_transfer}%` }} />
              </div>
            </div>
          </Card>
        </div>

        <PaymentsTable payments={payments} />

        <AddPaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={handleOpenChange}
          members={memberOptions}
          plans={planOptions}
          preselectedMember={preselectedMember}
          onPaymentAdded={handlePaymentAdded}
        />
      </div>
    </main>
  )
}
