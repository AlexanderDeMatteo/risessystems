import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getRedirectPathForCurrentUser } from '@/lib/supabase/get-redirect-path'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) =>
      redirect.cookies.set(c.name, c.value)
    )
    return redirect
  }

  if (user && isAuthRoute) {
    const path = await getRedirectPathForCurrentUser(supabase)
    const url = request.nextUrl.clone()
    url.pathname = path
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) =>
      redirect.cookies.set(c.name, c.value)
    )
    return redirect
  }

  if (user && isAdminRoute) {
    const path = await getRedirectPathForCurrentUser(supabase)
    if (path !== '/admin') {
      const url = request.nextUrl.clone()
      url.pathname = path === '/pending-payment' ? '/pending-payment' : '/dashboard'
      const redirect = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) =>
        redirect.cookies.set(c.name, c.value)
      )
      return redirect
    }
  }

  // Inactive gym owners should not access /dashboard; send them to pending-payment
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const path = await getRedirectPathForCurrentUser(supabase)
    if (path === '/pending-payment') {
      const url = request.nextUrl.clone()
      url.pathname = '/pending-payment'
      const redirect = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) =>
        redirect.cookies.set(c.name, c.value)
      )
      return redirect
    }
  }

  return supabaseResponse
}
