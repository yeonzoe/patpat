import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/select-profile'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // 가족 레코드가 없으면 생성
      const { data: family } = await supabase
        .from('families')
        .select('id')
        .eq('parent_id', data.user.id)
        .single()

      if (!family) {
        await supabase.from('families').insert({
          parent_id: data.user.id,
        })
        // 신규 가입자는 프로필 추가 페이지로
        return NextResponse.redirect(`${origin}/profiles`)
      }

      // 아이 프로필이 있는지 확인
      const { data: children } = await supabase
        .from('children')
        .select('id')
        .eq('family_id', family.id)
        .limit(1)

      if (!children || children.length === 0) {
        // 아이 프로필이 없으면 프로필 추가 페이지로
        return NextResponse.redirect(`${origin}/profiles`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 에러 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/login?error=인증에 실패했어요`)
}
