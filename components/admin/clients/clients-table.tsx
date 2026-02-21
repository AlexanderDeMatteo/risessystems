'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'
import { MOCK_CLIENTS } from '@/lib/mocks/clients'

export function ClientsTable() {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Gym Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Branches</TableHead>
              <TableHead>Active Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CLIENTS.map(client => (
              <TableRow key={client.id} className="border-border hover:bg-secondary/50">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{client.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-900/30 text-blue-200 border-blue-700">
                    {client.branches}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-primary">{client.activeUsers}</TableCell>
                <TableCell>
                  <Badge className={client.status === 'active' ? 'bg-green-900 text-green-100' : 'bg-gray-700 text-gray-100'}>
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{client.joinDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-secondary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-destructive/20 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
