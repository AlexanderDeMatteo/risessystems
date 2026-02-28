import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env' },
      { status: 500 }
    )
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, details: 'Auth/session check failed' },
        { status: 502 }
      )
    }
    return NextResponse.json({
      ok: true,
      message: 'Connected to Supabase',
      session: data.session ? 'active' : 'no session',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { ok: false, error: message },
      { status: 502 }
    )
  }
}
