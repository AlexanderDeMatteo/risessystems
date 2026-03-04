import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getRedirectPathForCurrentUser } from '@/lib/supabase/get-redirect-path'

/**
 * OAuth callback: Supabase redirects here with ?code=... after Google sign-in.
 * We exchange the code for a session (JWT + refresh token), set cookies on the
 * redirect response, then send the user to /admin or /dashboard based on their role.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const redirectResponse = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            redirectResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // Ensure public.users has a row for this auth user (so getCurrentAppUserId() and profile work)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()
    if (!existing) {
      const name =
        (user.user_metadata?.full_name as string) ||
        (user.user_metadata?.name as string) ||
        user.email?.split('@')[0] ||
        'User'
      const gymName = (user.user_metadata?.gym_name as string) || null
      await supabase.from('users').insert({
        auth_user_id: user.id,
        email: user.email ?? '',
        name,
        gym_name: gymName,
        role: 'owner',
        is_active: false,
      })
    }
  }

  const path = await getRedirectPathForCurrentUser(supabase)
  redirectResponse.headers.set('Location', `${origin}${path}`)

  return redirectResponse
}
