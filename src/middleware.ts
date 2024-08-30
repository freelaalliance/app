import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (!request.cookies.has('sessionUser')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: '/modulo/:path*',
}
