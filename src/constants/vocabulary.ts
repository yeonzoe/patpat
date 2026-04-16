import type { Grade } from '@/types/database'

export interface VocabularyItem {
  id: string
  word: string
  meaning: string
  hanja?: string
  hanjaMeaning?: string
  examples: string[]
  grade: Grade
  category: string
}

// 초등 저학년 (1-2학년) 어휘
const ELEMENTARY_LOW: VocabularyItem[] = [
  {
    id: 'el-1',
    word: '기쁘다',
    meaning: '마음이 즐겁고 흐뭇하다',
    examples: ['생일 선물을 받아서 기뻐요.', '친구를 만나니 기쁘다.'],
    grade: 'elementary-1',
    category: '감정',
  },
  {
    id: 'el-2',
    word: '슬프다',
    meaning: '마음이 아프고 괴롭다',
    examples: ['강아지가 아파서 슬퍼요.', '이별은 슬픈 일이야.'],
    grade: 'elementary-1',
    category: '감정',
  },
  {
    id: 'el-3',
    word: '신나다',
    meaning: '흥이 나서 기분이 들뜨다',
    examples: ['놀이공원에 가니 신나요!', '춤을 추니 신난다.'],
    grade: 'elementary-1',
    category: '감정',
  },
  {
    id: 'el-4',
    word: '두근두근',
    meaning: '가슴이 세게 뛰는 모양',
    examples: ['발표할 때 두근두근해요.', '심장이 두근두근 뛴다.'],
    grade: 'elementary-2',
    category: '의태어',
  },
  {
    id: 'el-5',
    word: '반짝반짝',
    meaning: '빛이 자꾸 번쩍이는 모양',
    examples: ['별이 반짝반짝 빛나요.', '눈이 반짝반짝해.'],
    grade: 'elementary-1',
    category: '의태어',
  },
]

// 초등 중학년 (3-4학년) 어휘
const ELEMENTARY_MID: VocabularyItem[] = [
  {
    id: 'em-1',
    word: '호기심',
    meaning: '새롭고 신기한 것을 알고 싶어하는 마음',
    hanja: '好奇心',
    hanjaMeaning: '좋아할 호, 기이할 기, 마음 심',
    examples: ['호기심이 많은 아이', '호기심으로 가득 찬 눈'],
    grade: 'elementary-3',
    category: '마음',
  },
  {
    id: 'em-2',
    word: '용기',
    meaning: '씩씩하고 굳센 기운',
    hanja: '勇氣',
    hanjaMeaning: '날랠 용, 기운 기',
    examples: ['용기를 내서 말했어요.', '용기 있는 행동이야.'],
    grade: 'elementary-3',
    category: '마음',
  },
  {
    id: 'em-3',
    word: '정성',
    meaning: '온 마음을 다하는 참된 마음',
    hanja: '精誠',
    hanjaMeaning: '정할 정, 정성 성',
    examples: ['정성껏 만든 선물', '정성을 다해 돌봤어요.'],
    grade: 'elementary-4',
    category: '마음',
  },
  {
    id: 'em-4',
    word: '노력',
    meaning: '힘을 들여 애씀',
    hanja: '努力',
    hanjaMeaning: '힘쓸 노, 힘 력',
    examples: ['노력한 만큼 결과가 나와요.', '꾸준히 노력했어요.'],
    grade: 'elementary-3',
    category: '행동',
  },
  {
    id: 'em-5',
    word: '협동',
    meaning: '마음과 힘을 하나로 합함',
    hanja: '協同',
    hanjaMeaning: '화합할 협, 한가지 동',
    examples: ['협동해서 문제를 풀었어요.', '협동심이 중요해.'],
    grade: 'elementary-4',
    category: '행동',
  },
  {
    id: 'em-6',
    word: '감사',
    meaning: '고마움을 느낌',
    hanja: '感謝',
    hanjaMeaning: '느낄 감, 사례할 사',
    examples: ['감사한 마음을 전해요.', '도와주셔서 감사합니다.'],
    grade: 'elementary-3',
    category: '마음',
  },
]

// 초등 고학년 (5-6학년) 어휘
const ELEMENTARY_HIGH: VocabularyItem[] = [
  {
    id: 'eh-1',
    word: '성취',
    meaning: '목적한 것을 이룸',
    hanja: '成就',
    hanjaMeaning: '이룰 성, 이룰 취',
    examples: ['목표를 성취했어요.', '성취감을 느꼈어.'],
    grade: 'elementary-5',
    category: '결과',
  },
  {
    id: 'eh-2',
    word: '책임',
    meaning: '맡아서 해야 할 임무',
    hanja: '責任',
    hanjaMeaning: '꾸짖을 책, 맡길 임',
    examples: ['책임감 있는 행동', '책임을 다했어요.'],
    grade: 'elementary-5',
    category: '덕목',
  },
  {
    id: 'eh-3',
    word: '존중',
    meaning: '높이어 귀중히 여김',
    hanja: '尊重',
    hanjaMeaning: '높을 존, 무거울 중',
    examples: ['서로 존중해요.', '의견을 존중합니다.'],
    grade: 'elementary-6',
    category: '덕목',
  },
  {
    id: 'eh-4',
    word: '공감',
    meaning: '남의 감정을 함께 느낌',
    hanja: '共感',
    hanjaMeaning: '함께 공, 느낄 감',
    examples: ['친구의 마음에 공감해요.', '공감 능력이 뛰어나.'],
    grade: 'elementary-5',
    category: '마음',
  },
  {
    id: 'eh-5',
    word: '배려',
    meaning: '도와주거나 보살펴 주려고 마음을 씀',
    hanja: '配慮',
    hanjaMeaning: '나눌 배, 생각할 려',
    examples: ['배려심이 깊어요.', '서로 배려하면 좋겠어.'],
    grade: 'elementary-6',
    category: '덕목',
  },
]

// 중학생 어휘
const MIDDLE: VocabularyItem[] = [
  {
    id: 'm-1',
    word: '성찰',
    meaning: '자기의 마음을 반성하여 살핌',
    hanja: '省察',
    hanjaMeaning: '살필 성, 살필 찰',
    examples: ['자기 성찰의 시간', '행동을 성찰해 봤어요.'],
    grade: 'middle-1',
    category: '사고',
  },
  {
    id: 'm-2',
    word: '통찰',
    meaning: '예리한 관찰력으로 사물을 꿰뚫어 봄',
    hanja: '洞察',
    hanjaMeaning: '밝을 동, 살필 찰',
    examples: ['통찰력이 뛰어나다.', '문제의 본질을 통찰했어.'],
    grade: 'middle-2',
    category: '사고',
  },
  {
    id: 'm-3',
    word: '역경',
    meaning: '일이 순탄하게 진행되지 않는 어려운 처지',
    hanja: '逆境',
    hanjaMeaning: '거스를 역, 지경 경',
    examples: ['역경을 이겨냈어요.', '역경 속에서도 포기하지 않았어.'],
    grade: 'middle-1',
    category: '상황',
  },
  {
    id: 'm-4',
    word: '도전',
    meaning: '어려운 일에 맞서 싸움',
    hanja: '挑戰',
    hanjaMeaning: '도전할 도, 싸울 전',
    examples: ['새로운 도전을 시작했어요.', '도전 정신이 중요해.'],
    grade: 'middle-1',
    category: '행동',
  },
  {
    id: 'm-5',
    word: '영감',
    meaning: '창조적인 일의 계기가 되는 기발한 착상',
    hanja: '靈感',
    hanjaMeaning: '신령 령, 느낄 감',
    examples: ['영감을 받았어요.', '글쓰기 영감이 떠올랐어.'],
    grade: 'middle-2',
    category: '창작',
  },
]

// 고등학생 어휘
const HIGH: VocabularyItem[] = [
  {
    id: 'h-1',
    word: '사유',
    meaning: '깊이 생각하고 헤아림',
    hanja: '思惟',
    hanjaMeaning: '생각 사, 생각 유',
    examples: ['철학적 사유', '깊은 사유의 결과물'],
    grade: 'high-1',
    category: '사고',
  },
  {
    id: 'h-2',
    word: '성숙',
    meaning: '몸이나 마음이 자라서 어른스러워짐',
    hanja: '成熟',
    hanjaMeaning: '이룰 성, 익을 숙',
    examples: ['정서적 성숙', '성숙한 태도'],
    grade: 'high-1',
    category: '성장',
  },
  {
    id: 'h-3',
    word: '통합',
    meaning: '둘 이상의 것을 합쳐서 하나로 만듦',
    hanja: '統合',
    hanjaMeaning: '거느릴 통, 합할 합',
    examples: ['생각을 통합했어요.', '통합적 사고'],
    grade: 'high-2',
    category: '사고',
  },
]

// 전체 어휘 목록
export const ALL_VOCABULARY: VocabularyItem[] = [
  ...ELEMENTARY_LOW,
  ...ELEMENTARY_MID,
  ...ELEMENTARY_HIGH,
  ...MIDDLE,
  ...HIGH,
]

// 학년별 어휘 가져오기
export function getVocabularyByGrade(grade: Grade): VocabularyItem[] {
  const gradeLevel = grade.split('-')[0] // 'elementary', 'middle', 'high'
  const gradeNum = parseInt(grade.split('-')[1])

  return ALL_VOCABULARY.filter((v) => {
    const vLevel = v.grade.split('-')[0]
    const vNum = parseInt(v.grade.split('-')[1])

    // 같은 레벨이고 같거나 낮은 학년
    if (vLevel === gradeLevel && vNum <= gradeNum) return true

    // 이전 레벨의 고학년
    if (gradeLevel === 'middle' && vLevel === 'elementary' && vNum >= 5) return true
    if (gradeLevel === 'high' && vLevel === 'middle') return true

    return false
  })
}

// 카테고리 목록
export const VOCABULARY_CATEGORIES = [
  '감정',
  '마음',
  '행동',
  '덕목',
  '사고',
  '의태어',
  '결과',
  '상황',
  '성장',
  '창작',
]

// 랜덤 힌트 단어 가져오기
export function getHintWords(grade: Grade, count = 3): VocabularyItem[] {
  const available = getVocabularyByGrade(grade)
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
