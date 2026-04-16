'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TOPICS } from '@/constants/topics'
import { TOPIC_CATEGORIES } from '@/constants'

interface Writing {
  id: string
  topic_id: string | null
  custom_topic: string | null
  content: string
  status: string
  word_count: number | null
  sentence_count: number | null
  created_at: string
}

interface Feedback {
  id: string
  content: string
  created_at: string
}

export default function WritingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: writingId } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [writing, setWriting] = useState<Writing | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingFeedback, setGeneratingFeedback] = useState(false)
  const [childName, setChildName] = useState('')
  const [writingType, setWritingType] = useState('')

  useEffect(() => {
    loadWritingDetail()
  }, [writingId])

  const loadWritingDetail = async () => {
    const childId = sessionStorage.getItem('selectedChildId')
    if (!childId) {
      router.push('/select-profile')
      return
    }

    // 아이 정보
    const { data: child } = await supabase
      .from('children')
      .select('name, writing_type')
      .eq('id', childId)
      .single()

    if (child) {
      setChildName(child.name)
      setWritingType(child.writing_type || 'expression')
    }

    // 글 정보
    const { data: writingData } = await supabase
      .from('writings')
      .select('*')
      .eq('id', writingId)
      .single()

    if (!writingData) {
      router.push('/writings')
      return
    }

    setWriting(writingData)

    // 피드백 정보
    const { data: feedbackData } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('writing_id', writingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (feedbackData) {
      setFeedback(feedbackData)
    }

    setLoading(false)
  }

  const generateFeedback = async () => {
    if (!writing) return

    setGeneratingFeedback(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: writing.content,
          writingType,
          childName,
        }),
      })

      const data = await response.json()

      if (data.feedback) {
        // 피드백 저장
        const { data: savedFeedback } = await supabase
          .from('feedbacks')
          .insert({
            writing_id: writing.id,
            content: data.feedback,
          })
          .select()
          .single()

        if (savedFeedback) {
          setFeedback(savedFeedback)
        }
      }
    } catch (error) {
      console.error('피드백 생성 실패:', error)
    }

    setGeneratingFeedback(false)
  }

  const getTopicInfo = () => {
    if (!writing) return { title: '내 글', emoji: '📝' }

    if (writing.custom_topic) {
      return { title: writing.custom_topic, emoji: '✍️' }
    }
    if (writing.topic_id) {
      const topic = TOPICS.find((t) => t.id === writing.topic_id)
      if (topic) {
        const category = TOPIC_CATEGORIES.find((c) => c.value === topic.category)
        return { title: topic.title, emoji: category?.emoji || '📝' }
      }
    }
    return { title: '내 글', emoji: '📝' }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  if (!writing) return null

  const { title, emoji } = getTopicInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <button
            onClick={() => router.push('/writings')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← 글 목록
          </button>
          {writing.status === 'draft' && (
            <Link
              href={`/write/${writing.id}`}
              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm transition"
            >
              계속 쓰기
            </Link>
          )}
        </div>

        {/* 글 정보 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{emoji}</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-500">
                {formatDate(writing.created_at)}
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
            <span>✏️ {writing.word_count || 0}자</span>
            <span>📝 {writing.sentence_count || 0}문장</span>
            {writing.status === 'draft' && (
              <span className="text-yellow-600">작성 중</span>
            )}
          </div>

          {/* 글 내용 */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {writing.content || '아직 내용이 없어요'}
            </p>
          </div>
        </div>

        {/* AI 피드백 */}
        {writing.status === 'completed' && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              💬 선생님의 피드백
            </h2>

            {feedback ? (
              <div className="bg-white rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {feedback.content}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">
                  아직 피드백이 없어요. 받아볼까?
                </p>
                <button
                  onClick={generateFeedback}
                  disabled={generatingFeedback}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
                >
                  {generatingFeedback ? '피드백 만드는 중...' : '피드백 받기 ✨'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 작성 중인 글 안내 */}
        {writing.status === 'draft' && (
          <div className="bg-yellow-50 rounded-2xl p-6 text-center">
            <p className="text-yellow-700 mb-4">
              아직 작성 중인 글이에요. 완료하면 피드백을 받을 수 있어요!
            </p>
            <Link
              href={`/write/${writing.id}`}
              className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition"
            >
              계속 쓰기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
