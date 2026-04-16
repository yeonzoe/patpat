import { NextResponse } from 'next/server'
import { generateFeedback } from '@/lib/gemini/client'

export async function POST(request: Request) {
  try {
    const { content, writingType, childName } = await request.json()

    if (!content || !writingType || !childName) {
      return NextResponse.json(
        { error: '필수 정보가 없습니다' },
        { status: 400 }
      )
    }

    // 너무 짧은 글은 피드백 생성 안 함
    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: '글이 너무 짧아요. 조금 더 써볼까?' },
        { status: 400 }
      )
    }

    const feedback = await generateFeedback(content, writingType, childName)

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Feedback generation error:', error)
    return NextResponse.json(
      { error: '피드백 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
