'use client'

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

export interface Payment {
  id: number
  name: string
  amount: number
  payment_method: string
  status: string
  payment_date: string
}

interface PaymentsTableProps {
  payments: Payment[]
}

function formatPaymentMethod(method: string): string {
  if (method === 'bank_transfer') return 'Bank Transfer'
  return method.charAt(0).toUpperCase() + method.slice(1)
}

export function PaymentsTable({ payments }: PaymentsTableProps) {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-900 text-green-100">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-900 text-yellow-100">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-900 text-red-100">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card className="bg-card border-border">
      <div className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Payments</h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-medium">{payment.name}</TableCell>
                    <TableCell className="font-medium text-primary">${payment.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{formatPaymentMethod(payment.payment_method)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
