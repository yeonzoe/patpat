'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { WRITING_TYPE_RESULTS } from '@/constants/diagnosis'
import { GRADES } from '@/constants'
import {
  calculateStats,
  calculateGrowth,
  getDateRange,
  formatDateRange,
  type WritingStats,
} from '@/lib/utils/report'
import type { WritingType, Grade } from '@/types/database'

type PeriodType = 'weekly' | 'biweekly' | 'monthly'

interface ChildData {
  id: string
  name: string
  grade: Grade
  writing_type: WritingType | null
}

export default function ReportsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null)
  const [periodType, setPeriodType] = useState<PeriodType>('weekly')

  const [currentStats, setCurrentStats] = useState<WritingStats | null>(null)
  const [previousStats, setPreviousStats] = useState<WritingStats | null>(null)
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() })

  useEffect(() => {
    loadChildren()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      loadReport()
    }
  }, [selectedChild, periodType])

  const loadChildren = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: family } = await supabase
      .from('families')
      .select('id')
      .eq('parent_id', user.id)
      .single()

    if (!family) {
      router.push('/profiles')
      return
    }

    const { data: childrenData } = await supabase
      .from('children')
      .select('id, name, grade, writing_type')
      .eq('family_id', family.id)

    if (childrenData && childrenData.length > 0) {
      setChildren(childrenData as ChildData[])
      setSelectedChild(childrenData[0] as ChildData)
    }
    setLoading(false)
  }

  const loadReport = async () => {
    if (!selectedChild) return

    const range = getDateRange(periodType)
    setDateRange(range)

    // 현재 기간 글
    const { data: currentWritings } = await supabase
      .from('writings')
      .select('*')
      .eq('child_id', selectedChild.id)
      .gte('created_at', range.start.toISOString())
      .lte('created_at', range.end.toISOString())

    const periodDays = Math.ceil(
      (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
    )
    const current = calculateStats(currentWritings || [], periodDays)
    setCurrentStats(current)

    // 이전 기간 글 (비교용)
    const previousStart = new Date(range.start)
    const previousEnd = new Date(range.start)
    previousStart.setDate(previousStart.getDate() - periodDays)

    const { data: previousWritings } = await supabase
      .from('writings')
      .select('*')
      .eq('child_id', selectedChild.id)
      .gte('created_at', previousStart.toISOString())
      .lt('created_at', previousEnd.toISOString())

    if (previousWritings && previousWritings.length > 0) {
      const previous = calculateStats(previousWritings, periodDays)
      setPreviousStats(previous)
    } else {
      setPreviousStats(null)
    }
  }

  const growth = currentStats && previousStats
    ? calculateGrowth(currentStats, previousStats)
    : null

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getGrowthIcon = (value: number) => {
    if (value > 0) return '↑'
    if (value < 0) return '↓'
    return '→'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📊 성장 리포트</h1>
            <p className="text-gray-500 text-sm">아이의 글쓰기 성장을 확인해요</p>
          </div>
          <button
            onClick={() => router.push('/settings')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            설정 →
          </button>
        </div>

        {/* 아이 선택 */}
        {children.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedChild?.id === child.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-indigo-50'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}

        {/* 기간 선택 */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'weekly' as PeriodType, label: '주간' },
            { value: 'biweekly' as PeriodType, label: '격주' },
            { value: 'monthly' as PeriodType, label: '월간' },
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setPeriodType(period.value)}
              className={`px-4 py-2 rounded-xl text-sm transition ${
                periodType === period.value
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-indigo-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {selectedChild && currentStats && (
          <>
            {/* 아이 정보 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedChild.name}의 리포트
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDateRange(dateRange.start, dateRange.end)}
                  </p>
                </div>
                {selectedChild.writing_type && (
                  <div className="text-right">
                    <div className="text-2xl">
                      {WRITING_TYPE_RESULTS[selectedChild.writing_type].emoji}
                    </div>
                    <div className="text-xs text-gray-500">
                      {WRITING_TYPE_RESULTS[selectedChild.writing_type].title}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {GRADES.find((g) => g.value === selectedChild.grade)?.label}
              </div>
            </div>

            {/* 핵심 지표 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {currentStats.completedWritings}
                </div>
                <div className="text-sm text-gray-500">완료한 글</div>
                {growth && (
                  <div className={`text-xs mt-1 ${getGrowthColor(growth.writingsChange)}`}>
                    {getGrowthIcon(growth.writingsChange)} {Math.abs(growth.writingsChange)}%
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {currentStats.totalWords}
                </div>
                <div className="text-sm text-gray-500">총 글자 수</div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {currentStats.avgWordsPerWriting}
                </div>
                <div className="text-sm text-gray-500">평균 글자 수</div>
                {growth && (
                  <div className={`text-xs mt-1 ${getGrowthColor(growth.wordsChange)}`}>
                    {getGrowthIcon(growth.wordsChange)} {Math.abs(growth.wordsChange)}%
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {currentStats.writingFrequency}
                </div>
                <div className="text-sm text-gray-500">주당 글쓰기</div>
                {growth && (
                  <div className={`text-xs mt-1 ${getGrowthColor(growth.frequencyChange)}`}>
                    {getGrowthIcon(growth.frequencyChange)} {Math.abs(growth.frequencyChange)}%
                  </div>
                )}
              </div>
            </div>

            {/* 세부 통계 */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">📝 세부 통계</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">시작한 글</span>
                  <span className="text-gray-800">{currentStats.totalWritings}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">완료한 글</span>
                  <span className="text-gray-800">{currentStats.completedWritings}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">총 문장 수</span>
                  <span className="text-gray-800">{currentStats.totalSentences}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">평균 문장 수</span>
                  <span className="text-gray-800">{currentStats.avgSentencesPerWriting}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">다룬 주제</span>
                  <span className="text-gray-800">{currentStats.uniqueTopics}개</span>
                </div>
              </div>
            </div>

            {/* 코멘트 */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-indigo-800 mb-2">💬 코멘트</h3>
              <p className="text-indigo-700 text-sm">
                {currentStats.completedWritings === 0 ? (
                  '이번 기간에는 완료한 글이 없어요. 함께 글쓰기를 시작해볼까요?'
                ) : currentStats.completedWritings >= 3 ? (
                  `${selectedChild.name}이(가) 이번 기간에 ${currentStats.completedWritings}개의 글을 완성했어요! 꾸준히 글을 쓰고 있네요. 평균 ${currentStats.avgWordsPerWriting}자를 썼어요.`
                ) : (
                  `${selectedChild.name}이(가) ${currentStats.completedWritings}개의 글을 완성했어요. 조금씩 글쓰기 습관을 만들어가고 있어요!`
                )}
                {growth && growth.writingsChange > 0 && (
                  ` 지난 기간보다 ${growth.writingsChange}% 더 많이 썼어요!`
                )}
              </p>
            </div>

            {/* 추천 활동 */}
            {selectedChild.writing_type && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">✨ 추천 활동</h3>
                <p className="text-gray-600 text-sm">
                  {WRITING_TYPE_RESULTS[selectedChild.writing_type].supportStrategy}
                </p>
              </div>
            )}
          </>
        )}

        {/* 하단 네비게이션 */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push('/select-profile')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            글쓰기하기
          </button>
        </div>
      </div>
    </div>
  )
}
