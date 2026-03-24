import { Link } from '@/i18n/routing'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CreditCard } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function PendingPaymentPage() {
  const t = await getTranslations('auth')
  const tCommon = await getTranslations('common')

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center rounded-lg bg-primary p-3 neon-glow-sm">
            <CreditCard className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t('pendingPaymentTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('pendingPaymentSubtitle')}
          </p>
        </div>

        <Card className="bg-card border-border card-cyber">
          <CardHeader>
            <CardTitle className="text-lg">{t('pendingPaymentWhyTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-secondary/40 border-border">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('pendingPaymentAlertTitle')}</AlertTitle>
              <AlertDescription>
                {t('pendingPaymentAlertDescription')}
              </AlertDescription>
            </Alert>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>{t('pendingPaymentStep1')}</li>
              <li>{t('pendingPaymentStep2')}</li>
            </ul>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {t('pendingPaymentSupportNote')}
              </span>
              <Button asChild variant="outline" size="sm" className="border-border/60">
                <Link href="/login">{tCommon('backToLogin')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

