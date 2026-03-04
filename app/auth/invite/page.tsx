'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ensureUserProfile, getRedirectPathAfterLogin } from '@/app/actions/auth'
import { Loader2 } from 'lucide-react'

/**
 * Landing page for invite magic links.
 * Supabase redirects here after the user clicks the invite link.
 * The URL may contain tokens in the hash. The Supabase client will pick them up.
 */
export default function AuthInvitePage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let mounted = true
    async function handleInvite() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session && mounted) {
        setStatus('redirecting')
        await ensureUserProfile()
        const path = await getRedirectPathAfterLogin()
        router.replace(path)
        return
      }
      // If no session, the URL might have tokens in the hash - Supabase client
      // exchanges them asynchronously. Wait a bit and check again.
      await new Promise((r) => setTimeout(r, 1500))
      const { data: { session: session2 } } = await supabase.auth.getSession()
      if (session2 && mounted) {
        setStatus('redirecting')
        await ensureUserProfile()
        const path = await getRedirectPathAfterLogin()
        router.replace(path)
        return
      }
      if (mounted) {
        setStatus('error')
        setErrorMsg('Could not complete sign-in. The link may have expired.')
      }
    }
    handleInvite()
    return () => { mounted = false }
  }, [router])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-destructive">{errorMsg}</p>
          <a href="/login" className="text-primary hover:underline">
            Return to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          {status === 'redirecting' ? 'Redirecting...' : 'Completing sign-in...'}
        </p>
      </div>
    </div>
  )
}
