// 성장 지표 계산 유틸리티

export interface WritingStats {
  totalWritings: number
  completedWritings: number
  totalWords: number
  totalSentences: number
  avgWordsPerWriting: number
  avgSentencesPerWriting: number
  writingFrequency: number // 주당 글 수
  uniqueTopics: number
}

export interface GrowthData {
  currentPeriod: WritingStats
  previousPeriod: WritingStats | null
  growth: {
    writingsChange: number // 백분율
    wordsChange: number
    frequencyChange: number
  } | null
}

export interface ReportData {
  childName: string
  childGrade: string
  writingType: string
  periodStart: string
  periodEnd: string
  stats: WritingStats
  growth: GrowthData['growth']
  highlights: string[] // AI 분석 하이라이트
  recommendations: string[] // 다음 활동 추천
}

// 글 데이터에서 통계 계산
export function calculateStats(
  writings: Array<{
    content: string
    word_count: number | null
    sentence_count: number | null
    status: string
    topic_id: string | null
    custom_topic: string | null
    created_at: string
  }>,
  periodDays = 7
): WritingStats {
  const completed = writings.filter((w) => w.status === 'completed')

  const totalWords = completed.reduce((sum, w) => sum + (w.word_count || 0), 0)
  const totalSentences = completed.reduce(
    (sum, w) => sum + (w.sentence_count || 0),
    0
  )

  const uniqueTopics = new Set(
    completed.map((w) => w.topic_id || w.custom_topic).filter(Boolean)
  ).size

  return {
    totalWritings: writings.length,
    completedWritings: completed.length,
    totalWords,
    totalSentences,
    avgWordsPerWriting:
      completed.length > 0 ? Math.round(totalWords / completed.length) : 0,
    avgSentencesPerWriting:
      completed.length > 0 ? Math.round(totalSentences / completed.length) : 0,
    writingFrequency:
      periodDays > 0
        ? Math.round((completed.length / periodDays) * 7 * 10) / 10
        : 0,
    uniqueTopics,
  }
}

// 성장률 계산
export function calculateGrowth(
  current: WritingStats,
  previous: WritingStats | null
): GrowthData['growth'] {
  if (!previous || previous.completedWritings === 0) {
    return null
  }

  const calcChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0
    return Math.round(((curr - prev) / prev) * 100)
  }

  return {
    writingsChange: calcChange(
      current.completedWritings,
      previous.completedWritings
    ),
    wordsChange: calcChange(current.avgWordsPerWriting, previous.avgWordsPerWriting),
    frequencyChange: calcChange(
      current.writingFrequency,
      previous.writingFrequency
    ),
  }
}

// 날짜 범위 계산
export function getDateRange(
  periodType: 'weekly' | 'biweekly' | 'monthly'
): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()

  switch (periodType) {
    case 'weekly':
      start.setDate(end.getDate() - 7)
      break
    case 'biweekly':
      start.setDate(end.getDate() - 14)
      break
    case 'monthly':
      start.setMonth(end.getMonth() - 1)
      break
  }

  return { start, end }
}

// 날짜 포맷
export function formatDateRange(start: Date, end: Date): string {
  const format = (d: Date) =>
    `${d.getMonth() + 1}월 ${d.getDate()}일`
  return `${format(start)} ~ ${format(end)}`
}
