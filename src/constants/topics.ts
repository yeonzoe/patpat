import type { TopicCategory, WritingType } from '@/types/database'

export interface Topic {
  id: string
  title: string
  category: TopicCategory
  season?: 'spring' | 'summer' | 'fall' | 'winter'
  gradeRange: ('elementary' | 'middle' | 'high')[]
  prompts?: Partial<Record<WritingType, string>>
}

export const TOPICS: Topic[] = [
  // 학교
  {
    id: 'school-1',
    title: '오늘 학교에서 있었던 일',
    category: 'school',
    gradeRange: ['elementary', 'middle', 'high'],
    prompts: {
      pressure: '오늘 학교에서 기억나는 거 아무거나 써봐. 뭐든 좋아!',
      structure: '오늘 학교에서 뭐 했어? 한 가지만 골라서 써보자.',
      topic: '수업 시간? 쉬는 시간? 급식? 뭐가 제일 기억나?',
      expression: '오늘 학교에서 어떤 기분이었어?',
    },
  },
  {
    id: 'school-2',
    title: '내가 좋아하는 선생님',
    category: 'school',
    gradeRange: ['elementary', 'middle'],
    prompts: {
      topic: '어떤 선생님이 좋아? 왜 좋아?',
      expression: '그 선생님이랑 있으면 어떤 기분이야?',
    },
  },
  {
    id: 'school-3',
    title: '학교에서 제일 좋아하는 시간',
    category: 'school',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'school-4',
    title: '급식 메뉴 중 최고는?',
    category: 'school',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'school-5',
    title: '우리 반 소개',
    category: 'school',
    gradeRange: ['elementary', 'middle'],
  },

  // 가족
  {
    id: 'family-1',
    title: '우리 가족 소개',
    category: 'family',
    gradeRange: ['elementary', 'middle', 'high'],
    prompts: {
      structure: '가족이 몇 명이야? 한 명씩 소개해볼까?',
      topic: '누구부터 소개해볼까? 엄마? 아빠? 형제?',
    },
  },
  {
    id: 'family-2',
    title: '가족과 함께한 주말',
    category: 'family',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'family-3',
    title: '엄마(아빠)에게 하고 싶은 말',
    category: 'family',
    gradeRange: ['elementary', 'middle', 'high'],
    prompts: {
      pressure: '평소에 못했던 말 있어? 뭐든 써봐.',
      expression: '고마운 점? 미안한 점? 부탁하고 싶은 거?',
    },
  },
  {
    id: 'family-4',
    title: '우리 집 반려동물',
    category: 'family',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'family-5',
    title: '가족 여행 이야기',
    category: 'family',
    gradeRange: ['elementary', 'middle', 'high'],
  },

  // 친구
  {
    id: 'friend-1',
    title: '내 단짝 친구',
    category: 'friend',
    gradeRange: ['elementary', 'middle', 'high'],
    prompts: {
      structure: '그 친구 이름이 뭐야? 어떻게 친해졌어?',
      expression: '그 친구랑 같이 있으면 어떤 기분이야?',
    },
  },
  {
    id: 'friend-2',
    title: '친구와 놀았던 날',
    category: 'friend',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'friend-3',
    title: '친구와 다퉜던 이야기',
    category: 'friend',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'friend-4',
    title: '친구에게 미안했던 일',
    category: 'friend',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'friend-5',
    title: '새 친구 사귀기',
    category: 'friend',
    gradeRange: ['elementary', 'middle'],
  },

  // 계절
  {
    id: 'season-spring-1',
    title: '봄에 하고 싶은 것',
    category: 'season',
    season: 'spring',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'season-spring-2',
    title: '벚꽃 구경',
    category: 'season',
    season: 'spring',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'season-summer-1',
    title: '여름 방학 계획',
    category: 'season',
    season: 'summer',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'season-summer-2',
    title: '수영장/바다 이야기',
    category: 'season',
    season: 'summer',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'season-fall-1',
    title: '가을 소풍',
    category: 'season',
    season: 'fall',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'season-fall-2',
    title: '단풍 구경',
    category: 'season',
    season: 'fall',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'season-winter-1',
    title: '겨울 방학 계획',
    category: 'season',
    season: 'winter',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'season-winter-2',
    title: '눈 오는 날',
    category: 'season',
    season: 'winter',
    gradeRange: ['elementary', 'middle'],
  },

  // 일상
  {
    id: 'daily-1',
    title: '오늘 내 기분',
    category: 'daily',
    gradeRange: ['elementary', 'middle', 'high'],
    prompts: {
      pressure: '기분 좋아도, 안 좋아도 괜찮아. 솔직하게 써봐.',
      topic: '오늘 기분이 어때? 왜 그런 기분이야?',
      expression: '그 기분을 색깔로 표현하면? 날씨로 표현하면?',
    },
  },
  {
    id: 'daily-2',
    title: '내가 좋아하는 음식',
    category: 'daily',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'daily-3',
    title: '요즘 빠진 것 (게임, 유튜브, 책 등)',
    category: 'daily',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'daily-4',
    title: '내 방 소개',
    category: 'daily',
    gradeRange: ['elementary', 'middle'],
  },
  {
    id: 'daily-5',
    title: '꿈에서 있었던 일',
    category: 'daily',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'daily-6',
    title: '만약에 소원이 이루어진다면',
    category: 'daily',
    gradeRange: ['elementary', 'middle', 'high'],
    prompts: {
      topic: '뭘 하고 싶어? 뭘 갖고 싶어? 어디 가고 싶어?',
      structure: '소원이 뭐야? 왜 그걸 원해? 이루어지면 어떨 것 같아?',
    },
  },
  {
    id: 'daily-7',
    title: '10년 후의 나',
    category: 'daily',
    gradeRange: ['elementary', 'middle', 'high'],
  },
  {
    id: 'daily-8',
    title: '감사한 것 세 가지',
    category: 'daily',
    gradeRange: ['elementary', 'middle', 'high'],
  },
]

// 현재 시즌 가져오기
export function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

// 학년 범위 가져오기
export function getGradeLevel(
  grade: string
): 'elementary' | 'middle' | 'high' {
  if (grade.startsWith('elementary')) return 'elementary'
  if (grade.startsWith('middle')) return 'middle'
  return 'high'
}

// 추천 주제 가져오기
export function getRecommendedTopics(grade: string, limit = 5): Topic[] {
  const gradeLevel = getGradeLevel(grade)
  const season = getCurrentSeason()

  // 해당 학년에 맞는 주제 필터링
  const filtered = TOPICS.filter((t) => t.gradeRange.includes(gradeLevel))

  // 현재 시즌 주제 우선
  const seasonTopics = filtered.filter((t) => t.season === season)
  const otherTopics = filtered.filter((t) => !t.season || t.season !== season)

  // 랜덤 섞기
  const shuffled = [...seasonTopics, ...otherTopics].sort(
    () => Math.random() - 0.5
  )

  return shuffled.slice(0, limit)
}

// 카테고리별 주제 가져오기
export function getTopicsByCategory(
  category: TopicCategory,
  grade: string
): Topic[] {
  const gradeLevel = getGradeLevel(grade)
  return TOPICS.filter(
    (t) => t.category === category && t.gradeRange.includes(gradeLevel)
  )
}
