'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RevenueStats } from '@/components/accounting/revenue-stats'
import { PaymentsTable, type Payment } from '@/components/accounting/payments-table'
import { AddPaymentDialog, type PaymentFormData, type MemberOption, type PreselectedMember, type PlanOption } from '@/components/accounting/add-payment-dialog'
import { RenewalsTable, type RenewalFilter } from '@/components/accounting/renewals-table'
import { RevenueChart } from '@/components/accounting/revenue-chart'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { createPayment } from '@/app/actions/payments'
import type { Member } from '@/components/members/members-table'

interface AccountingPageClientProps {
  initialPayments: Payment[]
  memberOptions: MemberOption[]
  planOptions: PlanOption[]
  membersForRenewals: Member[]
  revenueChartData?: { name: string; memberships: number; training: number; other: number }[]
}

export function AccountingPageClient({
  initialPayments,
  memberOptions,
  planOptions,
  membersForRenewals,
  revenueChartData = [],
}: AccountingPageClientProps) {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [preselectedMember, setPreselectedMember] = useState<PreselectedMember | null>(null)
  const [renewalFilter, setRenewalFilter] = useState<RenewalFilter>('30')

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
      })
      if (result.ok) {
        setPreselectedMember(null)
        setIsPaymentDialogOpen(false)
        router.refresh()
      }
    },
    [router]
  )

  const openDialogForMember = useCallback((member: { id: number; name: string; membership_type?: string }) => {
    setPreselectedMember({ id: member.id, name: member.name, membership_type: member.membership_type })
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

        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label className="text-sm font-medium text-foreground">Show members to renew</Label>
            <Select value={renewalFilter} onValueChange={(v: RenewalFilter) => setRenewalFilter(v)}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expired">Expired only</SelectItem>
                <SelectItem value="7">Expiring in 7 days</SelectItem>
                <SelectItem value="14">Expiring in 14 days</SelectItem>
                <SelectItem value="30">Expiring in 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <RenewalsTable
            members={membersForRenewals}
            filter={renewalFilter}
            onRecordPayment={openDialogForMember}
          />
        </div>

        <RevenueStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueChartData} />
          </div>
          <Card className="bg-card border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cash</span>
                <span className="font-medium text-foreground">35%</span>
              </div>
              <div className="bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[35%]" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Card</span>
                <span className="font-medium text-foreground">55%</span>
              </div>
              <div className="bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-[55%]" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Bank Transfer</span>
                <span className="font-medium text-foreground">10%</span>
              </div>
              <div className="bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-chart-2 h-full w-[10%]" />
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
