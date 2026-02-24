import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 로그인 없이 접근 가능한 공개 경로
const PUBLIC_PATHS = ['/login', '/signup']

// 인증이 필요한 보호 경로 prefix
const PROTECTED_PREFIXES = ['/chat', '/planner', '/monitoring', '/auction', '/subscription']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 미들웨어에서는 localStorage 접근 불가 → 쿠키 기반 토큰 확인
  // 현재는 Zustand persist 스토리지가 localStorage이므로
  // 쿠키에 isAuthenticated 플래그를 저장하는 방식으로 처리
  const isAuthenticated = request.cookies.has('jibscan-auth-token')

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isPublicAuth = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // 비로그인 상태에서 보호 경로 접근 → 로그인으로 리다이렉트
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 로그인 상태에서 auth 페이지 접근 → 홈으로 리다이렉트
  if (isPublicAuth && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
