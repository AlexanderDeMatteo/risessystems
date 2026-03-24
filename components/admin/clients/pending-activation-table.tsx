'use client'

import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Zap } from 'lucide-react'
import type { AdminClient } from '@/app/actions/admin'

interface PendingActivationTableProps {
  clients: AdminClient[]
  onActivate: (client: AdminClient) => void
}

export function PendingActivationTable({ clients, onActivate }: PendingActivationTableProps) {
  const t = useTranslations('admin')

  if (clients.length === 0) return null

  return (
    <Card className="bg-card border-border">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">
            {t('pendingActivation')}
            <span className="ml-2 font-normal text-muted-foreground">({clients.length})</span>
          </h3>
          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40">
            {t('awaitingFirstPayment')}
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('gymName')}</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('email')}</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('activeMembers')}</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-muted-foreground">{t('joined')}</TableHead>
                <TableHead className="text-right uppercase text-xs tracking-wider text-muted-foreground">{t('action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="border-border hover:bg-secondary/30 bg-amber-500/5">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{client.email || '—'}</TableCell>
                  <TableCell className="font-medium text-primary">{client.activeUsers}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{client.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                      onClick={() => onActivate(client)}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {t('activateAndCharge')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
