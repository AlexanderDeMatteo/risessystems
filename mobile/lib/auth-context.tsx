import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type AppRole = 'member' | 'trainer' | 'owner' | 'admin'

export type AuthProfile = {
  role: AppRole
  ownerUserId?: number
  memberId?: number
  trainerId?: number
}

type AuthContextValue = {
  session: Session | null
  profile: AuthProfile | null
  role: AppRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function resolveProfile(userId: string): Promise<AuthProfile | null> {
  const { data: appUser } = await supabase
    .from('users')
    .select('id, role')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (appUser) {
    const row = appUser as { id: number; role: string }
    return {
      role: row.role === 'admin' ? 'admin' : 'owner',
      ownerUserId: row.id,
    }
  }

  const { data: trainer } = await supabase
    .from('trainers')
    .select('id')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (trainer) {
    return { role: 'trainer', trainerId: (trainer as { id: number }).id }
  }

  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (member) {
    return { role: 'member', memberId: (member as { id: number }).id }
  }

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    const uid = session?.user?.id
    if (!uid) {
      setProfile(null)
      return
    }
    const p = await resolveProfile(uid)
    setProfile(p)
  }, [session?.user?.id])

  useEffect(() => {
    let cancelled = false

    async function syncSession(s: Session | null) {
      setSession(s)
      if (s?.user?.id) {
        const p = await resolveProfile(s.user.id)
        if (!cancelled) setProfile(p)
      } else if (!cancelled) {
        setProfile(null)
      }
      if (!cancelled) setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!cancelled) void syncSession(s)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      void syncSession(s)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const role = profile?.role ?? null

  const value = useMemo(
    () => ({
      session,
      profile,
      role,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, profile, role, loading, signIn, signUp, signOut, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
