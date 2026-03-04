import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CreditCard } from 'lucide-react'

export default function PendingPaymentPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center rounded-lg bg-primary p-3 neon-glow-sm">
            <CreditCard className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Subscription pending</h1>
          <p className="text-sm text-muted-foreground">
            Your gym account is not active yet. Once the platform admin records your subscription
            payment, you&apos;ll be able to access the dashboard.
          </p>
        </div>

        <Card className="bg-card border-border card-cyber">
          <CardHeader>
            <CardTitle className="text-lg">Why am I seeing this?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-secondary/40 border-border">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Account inactive</AlertTitle>
              <AlertDescription>
                Your gym owner account was created successfully but is currently marked as inactive
                until the monthly subscription is paid.
              </AlertDescription>
            </Alert>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Contact the platform administrator to complete your subscription payment.</li>
              <li>Once the payment is confirmed, your account will be activated automatically.</li>
            </ul>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                If you believe this is a mistake, please reach out to support.
              </span>
              <Button asChild variant="outline" size="sm" className="border-border/60">
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

