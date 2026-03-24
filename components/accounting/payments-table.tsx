'use client'

import { useState, useCallback } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2, Search } from 'lucide-react'
import { updatePayment, deletePayment } from '@/app/actions/payments'
import { formatMoney, getCurrencySymbol } from '@/lib/format-currency'

export interface Payment {
  id: number
  name: string
  amount: number
  payment_method: string
  payment_type?: string
  status: string
  payment_date: string
}

interface PaymentsTableProps {
  payments: Payment[]
  currency?: string
  exchangeRate?: number | null
}

function formatPaymentMethod(method: string): string {
  if (method === 'bank_transfer') return 'Bank Transfer'
  return method.charAt(0).toUpperCase() + method.slice(1)
}

const STATUS_OPTIONS = ['pending', 'completed', 'failed', 'refunded'] as const
const METHOD_OPTIONS = ['cash', 'card', 'bank_transfer'] as const

function formatPaymentType(type: string): string {
  if (type === 'membership') return 'Membership'
  if (type === 'personal_training') return 'Personal Training'
  return 'Other'
}

function getPaymentTypeBadge(type: string) {
  const label = formatPaymentType(type ?? 'other')
  if (type === 'membership') return <Badge className="bg-primary/20 text-primary border border-primary/50">{label}</Badge>
  if (type === 'personal_training') return <Badge className="bg-chart-2/20 text-chart-2 border border-chart-2/50">{label}</Badge>
  return <Badge variant="secondary">{label}</Badge>
}

export function PaymentsTable({ payments, currency = 'USD', exchangeRate }: PaymentsTableProps) {
  const t = useTranslations('accounting')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editPayment, setEditPayment] = useState<Payment | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editStatus, setEditStatus] = useState<string>('completed')
  const [editMethod, setEditMethod] = useState<string>('cash')
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [deletePaymentRow, setDeletePaymentRow] = useState<Payment | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openEdit = useCallback((p: Payment) => {
    setEditPayment(p)
    setEditAmount(String(p.amount))
    setEditStatus(p.status)
    setEditMethod(p.payment_method)
    setEditError(null)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editPayment) return
    setEditError(null)
    setSaving(true)
    const amount = parseFloat(editAmount)
    if (Number.isNaN(amount) || amount < 0) {
      setEditError('Enter a valid amount')
      setSaving(false)
      return
    }
    const result = await updatePayment(editPayment.id, {
      amount,
      status: editStatus as 'pending' | 'completed' | 'failed' | 'refunded',
      payment_method: editMethod as 'cash' | 'card' | 'bank_transfer',
    })
    setSaving(false)
    if (result.ok) {
      setEditPayment(null)
      router.refresh()
    } else {
      setEditError(result.error)
    }
  }, [editPayment, editAmount, editStatus, editMethod, router])

  const handleConfirmDelete = useCallback(async () => {
    if (!deletePaymentRow) return
    setDeleting(true)
    const result = await deletePayment(deletePaymentRow.id)
    setDeleting(false)
    if (result.ok) {
      setDeletePaymentRow(null)
      router.refresh()
    }
  }, [deletePaymentRow, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-900 text-green-100">{tCommon('completed')}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-900 text-yellow-100">{tCommon('pending')}</Badge>
      case 'failed':
        return <Badge className="bg-red-900 text-red-100">{tCommon('failed')}</Badge>
      case 'refunded':
        return <Badge className="bg-muted text-muted-foreground">{t('refunded')}</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const visibleTotal = filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-foreground">{t('recentPayments')}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by member name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tCommon('all')}</SelectItem>
                  <SelectItem value="completed">{tCommon('completed')}</SelectItem>
                  <SelectItem value="pending">{tCommon('pending')}</SelectItem>
                  <SelectItem value="failed">{tCommon('failed')}</SelectItem>
                  <SelectItem value="refunded">{t('refunded')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>{t('member')}</TableHead>
                  <TableHead>{t('amount')}</TableHead>
                  <TableHead>{t('paymentType')}</TableHead>
                  <TableHead>{t('paymentMethod')}</TableHead>
                  <TableHead>{tCommon('status')}</TableHead>
                  <TableHead>{t('paymentDate')}</TableHead>
                  <TableHead className="w-[100px]">{tCommon('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-border hover:bg-secondary/50">
                      <TableCell className="font-medium">{payment.name}</TableCell>
                      <TableCell className="font-medium text-primary">
                        {formatMoney({ amount: payment.amount, currency, exchangeRate })}
                      </TableCell>
                      <TableCell>{getPaymentTypeBadge(payment.payment_type ?? 'other')}</TableCell>
                      <TableCell className="text-muted-foreground">{formatPaymentMethod(payment.payment_method)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(payment)}
                            aria-label="Edit payment"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeletePaymentRow(payment)}
                            aria-label="Delete payment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {t('noPayments')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredPayments.length > 0 && (
            <p className="text-sm text-muted-foreground border-t border-border pt-3">
              {t('total')} ({filteredPayments.length}): <span className="font-medium text-foreground">{formatMoney({ amount: visibleTotal, currency, exchangeRate })}</span>
            </p>
          )}
        </div>
      </Card>

      <Dialog open={!!editPayment} onOpenChange={(open) => !open && setEditPayment(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t('editPayment')}</DialogTitle>
          </DialogHeader>
          {editPayment && (
            <div className="space-y-4 py-4">
              {editError && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{editError}</p>
              )}
              <p className="text-sm text-muted-foreground">{t('member')}: {editPayment.name}</p>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">{t('amount')} ({getCurrencySymbol(currency)})</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  min={0}
                  step={0.01}
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>{tCommon('status')}</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('paymentMethod')}</Label>
                <Select value={editMethod} onValueChange={setEditMethod}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHOD_OPTIONS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {formatPaymentMethod(m)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPayment(null)} disabled={saving}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? tCommon('saving') : tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePaymentRow} onOpenChange={(open) => !open && setDeletePaymentRow(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{t('deletePayment')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDelete')}
              {deletePaymentRow && (
                <span className="block mt-2 font-medium text-foreground">
                  {deletePaymentRow.name} — {formatMoney({ amount: deletePaymentRow.amount, currency, exchangeRate, showEquivalent: false })}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? tCommon('deleting') : tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
