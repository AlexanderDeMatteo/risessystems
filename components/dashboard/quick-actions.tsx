'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, QrCode, Users, CreditCard } from 'lucide-react'

const actions = [
  {
    icon: Plus,
    label: 'Add Member',
    description: 'Register a new member',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: QrCode,
    label: 'QR Scanner',
    description: 'Scan member access',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: CreditCard,
    label: 'Process Payment',
    description: 'Record a transaction',
    color: 'bg-purple-500/10 text-purple-400',
  },
  {
    icon: Users,
    label: 'View Reports',
    description: 'Access analytics',
    color: 'bg-amber-500/10 text-amber-400',
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors bg-transparent"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
