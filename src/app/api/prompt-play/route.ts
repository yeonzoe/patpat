import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MISSIONS } from '@/constants/missions'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function POST(request: Request) {
  try {
    const { missionId, userPrompt, writingContent, childName } =
      await request.json()

    if (!missionId || !userPrompt) {
      return NextResponse.json(
        { error: '미션 ID와 프롬프트가 필요해요' },
        { status: 400 }
      )
    }

    const mission = MISSIONS.find((m) => m.id === missionId)
    if (!mission) {
      return NextResponse.json(
        { error: '미션을 찾을 수 없어요' },
        { status: 404 }
      )
    }

    // 시스템 프롬프트 구성
    let systemPrompt = mission.prompt

    // 아이가 쓴 글이 있으면 참고용으로 추가
    if (writingContent) {
      systemPrompt += `\n\n[참고] 아이(${childName})가 쓴 글:\n${writingContent}`
    }

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\n아이의 요청: ${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.9,
      },
    })

    const aiResponse = result.response.text()

    // 프롬프트 피드백 생성
    let feedback = ''
    if (userPrompt.length < 10) {
      feedback = '💡 더 구체적으로 말해보면 AI가 더 재밌는 답을 줄 수 있어!'
    } else if (!userPrompt.includes('?') && !userPrompt.includes('!') && !userPrompt.includes('해줘')) {
      feedback = '💡 "~해줘", "~할까?" 같이 요청하는 말을 넣으면 더 좋아!'
    } else if (userPrompt.length > 50) {
      feedback = '✨ 와, 정말 자세하게 요청했네! 잘했어!'
    }

    return NextResponse.json({
      response: aiResponse,
      feedback,
    })
  } catch (error) {
    console.error('Prompt play error:', error)
    return NextResponse.json(
      { error: '응답 생성에 실패했어요. 다시 시도해볼까?' },
      { status: 500 }
    )
  }
}
