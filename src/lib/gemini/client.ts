import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const gemini = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

export async function generateFeedback(
  content: string,
  writingType: string,
  childName: string
): Promise<string> {
  const typePrompts: Record<string, string> = {
    pressure: `
      이 아이는 정답을 맞춰야 한다는 부담감이 큰 편이야.
      칭찬을 많이 해주고, 발전 포인트는 최소화해줘.
      "틀려도 괜찮아", "네 생각이 중요해" 같은 메시지를 넣어줘.
    `,
    structure: `
      이 아이는 문장이나 글 구성이 어려운 편이야.
      글의 구조에 대해 부드럽게 질문해줘.
      "이 다음에 뭐가 일어났어?", "왜 그랬을까?" 같은 질문으로 유도해줘.
    `,
    topic: `
      이 아이는 주제를 잡는 게 어려운 편이야.
      선택한 주제에 대해 확장 질문을 해줘.
      "더 말해줄 거 있어?", "그때 뭘 봤어?" 같은 질문으로 주제를 풍부하게 해줘.
    `,
    expression: `
      이 아이는 표현력이 부족한 편이야.
      잘 쓴 표현을 칭찬해주고, 다양한 표현을 힌트로 제안해줘.
      "~라고 쓴 거 정말 좋다!", "~이런 말도 있어" 같이 알려줘.
    `,
  }

  const systemPrompt = `
너는 아이의 글쓰기를 도와주는 친구같은 선생님이야.

기본 규칙:
- 반말로 말해. 친구처럼 편하게.
- 먼저 칭찬해. "오 진짜 재밌다!", "와 이거 멋지다!" 같이.
- 잘한 점을 구체적으로 말해줘.
- 필요할 때만 질문해. 너무 많으면 부담스러워.
- 절대 완성된 문장을 대신 써주지 마. 힌트만 줘.

아이 이름: ${childName}

${typePrompts[writingType] || typePrompts.expression}
  `.trim()

  const result = await gemini.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemPrompt}\n\n아이가 쓴 글:\n${content}`,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.8,
    },
  })

  return result.response.text()
}
