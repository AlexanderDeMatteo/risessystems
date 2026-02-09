'use client'

import { useState, useCallback } from 'react'
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
import { getInitialMembers } from '@/lib/initial-members'
import { MOCK_PLANS } from '@/components/plans/plans-table'

const initialPayments: Payment[] = [
  { id: 1, name: 'John Smith', amount: 150, payment_method: 'card', status: 'completed', payment_date: new Date().toISOString() },
  { id: 2, name: 'Sarah Johnson', amount: 500, payment_method: 'cash', status: 'completed', payment_date: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, name: 'Mike Davis', amount: 75, payment_method: 'bank_transfer', status: 'pending', payment_date: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, name: 'Emma Wilson', amount: 300, payment_method: 'card', status: 'completed', payment_date: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, name: 'David Brown', amount: 200, payment_method: 'card', status: 'completed', payment_date: new Date(Date.now() - 345600000).toISOString() },
]

export default function AccountingPage() {
  const membersForRenewals = getInitialMembers()
  const membersForSelect: MemberOption[] = membersForRenewals.map((m) => ({
    id: m.id,
    name: m.name,
    membership_type: m.membership_type,
  }))
  const plansForSelect: PlanOption[] = MOCK_PLANS.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    is_active: p.is_active,
  }))

  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [preselectedMember, setPreselectedMember] = useState<PreselectedMember | null>(null)
  const [renewalFilter, setRenewalFilter] = useState<RenewalFilter>('30')

  const handlePaymentAdded = useCallback((data: PaymentFormData) => {
    setPayments((prev) => {
      const nextId = Math.max(0, ...prev.map((p) => p.id)) + 1
      const newPayment: Payment = {
        id: nextId,
        name: data.memberName,
        amount: parseFloat(data.amount) || 0,
        payment_method: data.payment_method,
        status: 'completed',
        payment_date: new Date().toISOString(),
      }
      return [...prev, newPayment]
    })
    setPreselectedMember(null)
  }, [])

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
          {/* Header */}
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

          {/* Pending renewals */}
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

          {/* Revenue stats */}
          <RevenueStats />

          {/* Charts and tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            {/* Payment methods breakdown */}
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

          {/* Payments table */}
          <PaymentsTable payments={payments} />

          <AddPaymentDialog
            open={isPaymentDialogOpen}
            onOpenChange={handleOpenChange}
            members={membersForSelect}
            plans={plansForSelect}
            preselectedMember={preselectedMember}
            onPaymentAdded={handlePaymentAdded}
          />
        </div>
    </main>
  )
}
