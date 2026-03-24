'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { AdminPlatformPayment, PlatformPlan } from '@/app/actions/admin'
import { AddPlatformPaymentDialog, type PlatformClientOption } from './add-platform-payment-dialog'

interface PlatformPaymentsTableProps {
  payments: AdminPlatformPayment[]
  clients: PlatformClientOption[]
  plans: PlatformPlan[]
  clientActiveUsers: Record<number, number>
}

export function PlatformPaymentsTable({ payments, clients, plans, clientActiveUsers }: PlatformPaymentsTableProps) {
  const t = useTranslations('admin')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-900 text-green-100">{t('completed')}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-900 text-yellow-100">{t('pending')}</Badge>
      case 'failed':
        return <Badge className="bg-red-900 text-red-100">{t('failed')}</Badge>
      default:
        return <Badge>{t('unknown')}</Badge>
    }
  }

  const formatPeriod = (start: string, end: string) => {
    if (!start || !end) return '—'
    try {
      return `${new Date(start).toLocaleDateString()} – ${new Date(end).toLocaleDateString()}`
    } catch {
      return `${start} – ${end}`
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return '—'
    }
  }

  return (
    <>
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground">{t('platformPayments')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('paymentsSubtitle')}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleOpenDialog}
            disabled={clients.length === 0}
          >
            <Plus className="w-4 h-4" />
            {t('chargeClient')}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>{t('gymClient')}</TableHead>
                <TableHead>{t('amount')}</TableHead>
                <TableHead>{t('period')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-medium">{payment.clientName}</TableCell>
                    <TableCell className="font-medium text-primary">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(payment.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatPeriod(payment.periodStart, payment.periodEnd)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(payment.paymentDate)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('noPaymentsFound')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AddPlatformPaymentDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        clients={clients}
        plans={plans}
        clientActiveUsers={clientActiveUsers}
      />
    </>
  )
}
