export type MissionCategory = 'story' | 'riddle' | 'question' | 'creative'

export interface Mission {
  id: string
  title: string
  description: string
  category: MissionCategory
  prompt: string // AI에게 보낼 시스템 프롬프트
  exampleUserPrompt: string // 아이에게 보여줄 예시
  tips: string[] // 프롬프트 작성 팁
}

export const MISSIONS: Mission[] = [
  // 스토리 만들기
  {
    id: 'story-1',
    title: '내 글의 다음 이야기',
    description: '오늘 쓴 글의 주인공으로 새로운 이야기를 만들어달라고 해봐!',
    category: 'story',
    prompt: `아이가 쓴 글을 바탕으로 창의적인 후속 이야기를 짧게 만들어줘.
아이가 작성한 프롬프트의 요청을 반영해서 이야기를 만들어.
친근한 반말로, 200자 이내로 짧게 써줘.
아이의 글 원문은 참고용이고, 아이의 프롬프트 요청에 맞춰 이야기를 만들어.`,
    exampleUserPrompt: '주인공이 우주로 여행가는 이야기 만들어줘!',
    tips: [
      '어디로 가면 좋을지 말해봐',
      '누구를 만나면 좋겠어?',
      '어떤 일이 생기면 재밌을까?',
    ],
  },
  {
    id: 'story-2',
    title: '만약에 이야기',
    description: '오늘 쓴 글에서 "만약에~"로 시작하는 상상 이야기를 만들어봐!',
    category: 'story',
    prompt: `아이의 "만약에" 상상을 바탕으로 재미있는 짧은 이야기를 만들어줘.
친근한 반말로, 200자 이내로 써줘.
아이의 상상력을 칭찬하고 이야기를 풍성하게 만들어줘.`,
    exampleUserPrompt: '만약에 내가 새가 될 수 있다면 어떤 일이 생길까?',
    tips: [
      '"만약에"로 시작해봐',
      '불가능한 것도 상상해봐',
      '재미있는 상황을 생각해봐',
    ],
  },

  // 수수께끼
  {
    id: 'riddle-1',
    title: '단어로 수수께끼 만들기',
    description: '오늘 배운 단어로 수수께끼를 만들어달라고 해봐!',
    category: 'riddle',
    prompt: `아이가 요청한 단어로 재미있는 수수께끼를 만들어줘.
수수께끼는 초등학생이 맞출 수 있는 난이도로 만들어.
힌트도 하나 함께 줘.
친근한 반말로 써줘.`,
    exampleUserPrompt: '"호기심"으로 수수께끼 만들어줘!',
    tips: [
      '오늘 배운 단어를 써봐',
      '재미있는 단어를 골라봐',
      '친구들이 맞출 수 있을까?',
    ],
  },
  {
    id: 'riddle-2',
    title: '거꾸로 수수께끼',
    description: '답을 먼저 말하고, AI한테 수수께끼 문제를 만들어달라고 해봐!',
    category: 'riddle',
    prompt: `아이가 말한 답에 맞는 수수께끼 문제를 만들어줘.
초등학생 수준의 재미있는 수수께끼로 만들어.
친근한 반말로 써줘.`,
    exampleUserPrompt: '답이 "무지개"인 수수께끼 만들어줘!',
    tips: [
      '좋아하는 것을 답으로 해봐',
      '주변에 있는 물건도 좋아',
      '동물이나 음식도 재밌어!',
    ],
  },

  // 질문하기
  {
    id: 'question-1',
    title: '궁금한 거 물어보기',
    description: '오늘 쓴 글과 관련해서 궁금한 걸 물어봐!',
    category: 'question',
    prompt: `아이의 질문에 친절하고 쉽게 대답해줘.
초등학생이 이해할 수 있는 수준으로 설명해.
너무 길지 않게, 150자 이내로 답해줘.
친근한 반말로 써줘.`,
    exampleUserPrompt: '왜 하늘은 파란색이야?',
    tips: [
      '"왜"로 시작하는 질문 해봐',
      '"어떻게"도 좋아',
      '진짜 궁금한 걸 물어봐!',
    ],
  },
  {
    id: 'question-2',
    title: '인터뷰하기',
    description: '오늘 쓴 글의 주인공이나 등장인물에게 질문해봐!',
    category: 'question',
    prompt: `아이가 쓴 글의 등장인물이 되어서 아이의 질문에 답해줘.
캐릭터의 입장에서 재미있게 대답해.
친근한 반말로, 100자 이내로 짧게 답해줘.`,
    exampleUserPrompt: '강아지야, 산책할 때 뭐가 제일 좋아?',
    tips: [
      '글에 나온 인물에게 물어봐',
      '동물이나 물건에게도 물어볼 수 있어',
      '재미있는 질문을 생각해봐!',
    ],
  },

  // 창의적 활동
  {
    id: 'creative-1',
    title: '내 글 요약하기',
    description: 'AI한테 내 글을 한 문장으로 요약해달라고 해봐!',
    category: 'creative',
    prompt: `아이가 쓴 글을 한 문장으로 재미있게 요약해줘.
글의 핵심을 잘 담아서 요약해.
"네 글은 ~한 이야기야!" 형식으로 친근하게 말해줘.`,
    exampleUserPrompt: '내 글을 한 문장으로 요약해줘!',
    tips: [
      '간단하게 요청해봐',
      '재미있게 해달라고 해봐',
      '이모지를 넣어달라고 해도 돼!',
    ],
  },
  {
    id: 'creative-2',
    title: '제목 만들어주기',
    description: '오늘 쓴 글에 어울리는 제목을 만들어달라고 해봐!',
    category: 'creative',
    prompt: `아이가 쓴 글에 어울리는 창의적인 제목을 3개 제안해줘.
재미있고 글의 내용을 잘 담은 제목으로 만들어.
친근한 반말로 써줘.`,
    exampleUserPrompt: '내 글에 어울리는 재미있는 제목 만들어줘!',
    tips: [
      '어떤 느낌의 제목을 원하는지 말해봐',
      '웃긴 제목? 멋진 제목?',
      '구체적으로 요청하면 더 좋아!',
    ],
  },
  {
    id: 'creative-3',
    title: '이모지로 표현하기',
    description: '내 글을 이모지로 표현해달라고 해봐!',
    category: 'creative',
    prompt: `아이가 쓴 글의 내용을 이모지 5-7개로 표현해줘.
각 이모지가 왜 그 글을 나타내는지도 간단히 설명해줘.
친근한 반말로 써줘.`,
    exampleUserPrompt: '내 글을 이모지로 표현해줘!',
    tips: [
      '몇 개의 이모지로 할지 말해봐',
      '특정 장면을 이모지로 해달라고 해도 돼',
    ],
  },
  {
    id: 'creative-4',
    title: '끝말잇기 하기',
    description: '오늘 배운 단어로 끝말잇기를 해봐!',
    category: 'creative',
    prompt: `아이와 끝말잇기를 해줘.
아이가 말한 단어의 끝 글자로 시작하는 단어를 말해줘.
단어의 뜻도 간단히 알려주면 좋아.
친근한 반말로 써줘.`,
    exampleUserPrompt: '끝말잇기 하자! 내가 먼저 - 사과!',
    tips: [
      '아는 단어로 시작해봐',
      '어려운 단어에 도전해봐',
      '새로운 단어를 배울 수 있어!',
    ],
  },
]

// 카테고리별 이모지
export const MISSION_CATEGORY_INFO: Record<
  MissionCategory,
  { emoji: string; label: string }
> = {
  story: { emoji: '📖', label: '이야기' },
  riddle: { emoji: '🧩', label: '수수께끼' },
  question: { emoji: '❓', label: '질문' },
  creative: { emoji: '🎨', label: '창의' },
}

// 오늘의 미션 가져오기 (랜덤 3개)
export function getTodayMissions(count = 3): Mission[] {
  const shuffled = [...MISSIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 카테고리별 미션 가져오기
export function getMissionsByCategory(category: MissionCategory): Mission[] {
  return MISSIONS.filter((m) => m.category === category)
}
