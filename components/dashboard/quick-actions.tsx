'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, QrCode, Users, CreditCard } from 'lucide-react'

const actions = [
  {
    icon: Plus,
    labelKey: 'addMember',
    descKey: 'addMemberDesc',
    color: 'bg-blue-500/10 text-blue-400',
    href: '/dashboard/members',
  },
  {
    icon: QrCode,
    labelKey: 'qrScanner',
    descKey: 'qrScannerDesc',
    color: 'bg-emerald-500/10 text-emerald-400',
    href: '/dashboard/qr-scanner',
  },
  {
    icon: CreditCard,
    labelKey: 'processPayment',
    descKey: 'processPaymentDesc',
    color: 'bg-purple-500/10 text-purple-400',
    href: '/dashboard/accounting',
  },
  {
    icon: Users,
    labelKey: 'viewReports',
    descKey: 'viewReportsDesc',
    color: 'bg-amber-500/10 text-amber-400',
    href: '/dashboard/accounting',
  },
]

export function QuickActions() {
  const t = useTranslations('quickActions')

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="h-24 w-full flex flex-col items-center justify-center gap-2 border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors bg-transparent"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{t(action.labelKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(action.descKey)}</p>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
