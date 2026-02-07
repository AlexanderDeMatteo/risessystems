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

const mockPayments = [
  { id: 1, clientName: 'FitZone Gym', amount: 2500, paymentMethod: 'Card', status: 'completed', paymentDate: new Date().toISOString() },
  { id: 2, clientName: "Gold's Fitness", amount: 5000, paymentMethod: 'Bank Transfer', status: 'completed', paymentDate: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, clientName: 'BodyPower Gym', amount: 1500, paymentMethod: 'Card', status: 'pending', paymentDate: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, clientName: 'Elite Sports Club', amount: 3200, paymentMethod: 'Bank Transfer', status: 'completed', paymentDate: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, clientName: 'CrossFit HQ', amount: 800, paymentMethod: 'Card', status: 'completed', paymentDate: new Date(Date.now() - 345600000).toISOString() },
]

export function PaymentsTable() {
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
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Payments</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Gym Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPayments.map(payment => (
              <TableRow key={payment.id} className="border-border hover:bg-secondary/50">
                <TableCell className="font-medium">{payment.clientName}</TableCell>
                <TableCell className="font-medium text-primary">${payment.amount}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{payment.paymentMethod}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
