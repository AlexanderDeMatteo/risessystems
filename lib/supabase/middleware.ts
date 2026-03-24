import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getRedirectPathForCurrentUser } from '@/lib/supabase/get-redirect-path'

const LOCALES = ['en', 'es']

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/')
  if (segments.length > 1 && LOCALES.includes(segments[1])) {
    return segments[1]
  }
  return null
}

function getPathWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname)
  if (locale) {
    return pathname.replace(`/${locale}`, '') || '/'
  }
  return pathname
}

function addLocaleToPath(pathname: string, locale: string): string {
  if (pathname.startsWith(`/${locale}`)) {
    return pathname
  }
  return `/${locale}${pathname === '/' ? '' : pathname}`
}

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

  const pathname = request.nextUrl.pathname
  const locale = getLocaleFromPath(pathname) || 'en'
  const pathWithoutLocale = getPathWithoutLocale(pathname)

  const isProtected =
    pathWithoutLocale.startsWith('/dashboard') ||
    pathWithoutLocale.startsWith('/admin')
  const isAuthRoute =
    pathWithoutLocale.startsWith('/login') ||
    pathWithoutLocale.startsWith('/register')
  const isAdminRoute = pathWithoutLocale.startsWith('/admin')

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = addLocaleToPath('/login', locale)
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) =>
      redirect.cookies.set(c.name, c.value)
    )
    return redirect
  }

  if (user && isAuthRoute) {
    const path = await getRedirectPathForCurrentUser(supabase)
    const url = request.nextUrl.clone()
    url.pathname = addLocaleToPath(path, locale)
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
      url.pathname = addLocaleToPath(path === '/pending-payment' ? '/pending-payment' : '/dashboard', locale)
      const redirect = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) =>
        redirect.cookies.set(c.name, c.value)
      )
      return redirect
    }
  }

  if (user && pathWithoutLocale.startsWith('/dashboard')) {
    const path = await getRedirectPathForCurrentUser(supabase)
    if (path === '/pending-payment') {
      const url = request.nextUrl.clone()
      url.pathname = addLocaleToPath('/pending-payment', locale)
      const redirect = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((c) =>
        redirect.cookies.set(c.name, c.value)
      )
      return redirect
    }
  }

  return supabaseResponse
}
