import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// 인증이 필요한 경로
const protectedRoutes = [
  '/select-profile',
  '/profiles',
  '/diagnosis',
  '/topics',
  '/write',
  '/writings',
  '/vocabulary',
  '/prompt-play',
  '/settings',
]

// 로그인한 사용자가 접근하면 안 되는 경로
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  const { pathname } = request.nextUrl

  // 세션 쿠키 확인
  const supabaseAuthToken = request.cookies.getAll().find(
    (cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
  )
  const isLoggedIn = !!supabaseAuthToken

  // 보호된 경로에 비로그인 접근
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // 로그인 상태로 auth 페이지 접근
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = '/select-profile'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
