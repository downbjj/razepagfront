import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function decodeJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const payload = decodeJwt(token)
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'OWNER')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect non-activated USER accounts to profile (server-side = no black flash)
    if (!pathname.startsWith('/dashboard/profile')) {
      const payload = decodeJwt(token)
      if (payload && payload.role === 'USER' && payload.accountActivated === false) {
        return NextResponse.redirect(new URL('/dashboard/profile', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
