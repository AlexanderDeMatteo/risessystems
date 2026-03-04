'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <Alert variant="destructive" className="border-destructive/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          {error.message || 'An error occurred loading this page.'}
        </AlertDescription>
      </Alert>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  )
}
