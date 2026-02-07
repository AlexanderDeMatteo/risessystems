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

// Mock payments data
const mockPayments = [
  { id: 1, name: 'John Smith', amount: 150, payment_method: 'Card', status: 'completed', payment_date: new Date().toISOString() },
  { id: 2, name: 'Sarah Johnson', amount: 500, payment_method: 'Cash', status: 'completed', payment_date: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, name: 'Mike Davis', amount: 75, payment_method: 'Bank Transfer', status: 'pending', payment_date: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, name: 'Emma Wilson', amount: 300, payment_method: 'Card', status: 'completed', payment_date: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, name: 'David Brown', amount: 200, payment_method: 'Card', status: 'completed', payment_date: new Date(Date.now() - 345600000).toISOString() },
]

export function PaymentsTable() {
  const payments = mockPayments; // Declare the payments variable

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
              {mockPayments.length > 0 ? (
                mockPayments.map((payment: any) => (
                  <TableRow key={payment.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-medium">{payment.name}</TableCell>
                    <TableCell className="font-medium text-primary">${payment.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.payment_method}</TableCell>
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
