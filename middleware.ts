import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // The auth check will be handled client-side by the auth context
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 