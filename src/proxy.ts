import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

const protectedRoutes = [
  '/dashboard',
  '/arsip-surat',
  '/booking-admin',
  '/keuangan',
  '/pengunjung',
  '/laporan',
  '/pengaturan',
]

const publicRoutes = ['/login', '/booking', '/booking/status']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route))

  const cookie = req.cookies.get('si-mliwis-session')?.value
  const session = await decrypt(cookie)

  // Redirect ke login jika mengakses route yang dilindungi tanpa session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect ke dashboard jika sudah login dan mengakses halaman login
  if (path === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|uploads|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
}
