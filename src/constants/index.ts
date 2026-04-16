import type { Grade, TopicCategory, WritingType } from '@/types/database'

export const GRADES: { value: Grade; label: string }[] = [
  { value: 'elementary-1', label: '초등 1학년' },
  { value: 'elementary-2', label: '초등 2학년' },
  { value: 'elementary-3', label: '초등 3학년' },
  { value: 'elementary-4', label: '초등 4학년' },
  { value: 'elementary-5', label: '초등 5학년' },
  { value: 'elementary-6', label: '초등 6학년' },
  { value: 'middle-1', label: '중등 1학년' },
  { value: 'middle-2', label: '중등 2학년' },
  { value: 'middle-3', label: '중등 3학년' },
  { value: 'high-1', label: '고등 1학년' },
  { value: 'high-2', label: '고등 2학년' },
  { value: 'high-3', label: '고등 3학년' },
]

export const WRITING_TYPES: { value: WritingType; label: string; description: string }[] = [
  {
    value: 'pressure',
    label: '부담감형',
    description: '정답을 맞춰야 한다는 부담감이 큰 편이에요',
  },
  {
    value: 'structure',
    label: '구성형',
    description: '문장이나 글 구성이 어려운 편이에요',
  },
  {
    value: 'topic',
    label: '주제형',
    description: '뭘 써야 할지 주제를 잡는 게 어려운 편이에요',
  },
  {
    value: 'expression',
    label: '표현형',
    description: '생각은 있는데 표현이 어려운 편이에요',
  },
]

export const TOPIC_CATEGORIES: { value: TopicCategory; label: string; emoji: string }[] = [
  { value: 'school', label: '학교', emoji: '🏫' },
  { value: 'family', label: '가족', emoji: '👨‍👩‍👧‍👦' },
  { value: 'friend', label: '친구', emoji: '👫' },
  { value: 'season', label: '계절', emoji: '🌸' },
  { value: 'daily', label: '일상', emoji: '📝' },
]

export const AVATARS = [
  { id: 'bear', emoji: '🐻', label: '곰돌이' },
  { id: 'rabbit', emoji: '🐰', label: '토끼' },
  { id: 'cat', emoji: '🐱', label: '고양이' },
  { id: 'dog', emoji: '🐶', label: '강아지' },
  { id: 'fox', emoji: '🦊', label: '여우' },
  { id: 'panda', emoji: '🐼', label: '판다' },
  { id: 'lion', emoji: '🦁', label: '사자' },
  { id: 'unicorn', emoji: '🦄', label: '유니콘' },
]
