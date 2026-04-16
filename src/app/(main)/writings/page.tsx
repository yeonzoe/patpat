'use client'

import { useEffect, useState } from 'react'
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
  created_at: string
}

export default function WritingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [childName, setChildName] = useState('')
  const [writings, setWritings] = useState<Writing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWritings()
  }, [])

  const loadWritings = async () => {
    const childId = sessionStorage.getItem('selectedChildId')
    if (!childId) {
      router.push('/select-profile')
      return
    }

    // 아이 정보
    const { data: child } = await supabase
      .from('children')
      .select('name')
      .eq('id', childId)
      .single()

    if (child) {
      setChildName(child.name)
    }

    // 글 목록
    const { data } = await supabase
      .from('writings')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })

    setWritings(data || [])
    setLoading(false)
  }

  const getTopicInfo = (writing: Writing) => {
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
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return '오늘'
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`

    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    })
  }

  const deleteWriting = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return

    await supabase.from('writings').delete().eq('id', id)
    setWritings(writings.filter((w) => w.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📚 내 글 모음</h1>
            <p className="text-gray-500 text-sm">
              {childName}이(가) 쓴 글 {writings.length}개
            </p>
          </div>
          <button
            onClick={() => router.push('/topics')}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm transition"
          >
            새 글 쓰기
          </button>
        </div>

        {/* 글 목록 */}
        {writings.length > 0 ? (
          <div className="space-y-3">
            {writings.map((writing) => {
              const { title, emoji } = getTopicInfo(writing)
              const preview =
                writing.content.slice(0, 50) +
                (writing.content.length > 50 ? '...' : '')

              return (
                <div
                  key={writing.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <Link href={`/writings/${writing.id}`}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800 truncate">
                            {title}
                          </span>
                          {writing.status === 'draft' && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                              작성 중
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {preview || '아직 내용이 없어요'}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span>{formatDate(writing.created_at)}</span>
                          {writing.word_count && (
                            <>
                              <span>•</span>
                              <span>{writing.word_count}자</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                    {writing.status === 'draft' && (
                      <Link
                        href={`/write/${writing.id}`}
                        className="text-sm text-violet-500 hover:text-violet-700"
                      >
                        계속 쓰기
                      </Link>
                    )}
                    <button
                      onClick={() => deleteWriting(writing.id)}
                      className="text-sm text-red-400 hover:text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 mb-4">아직 쓴 글이 없어요</p>
            <button
              onClick={() => router.push('/topics')}
              className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition"
            >
              첫 글 쓰러 가기
            </button>
          </div>
        )}

        {/* 하단 네비게이션 */}
        <div className="mt-8 flex justify-center gap-4 text-sm">
          <button
            onClick={() => router.push('/select-profile')}
            className="text-gray-400 hover:text-gray-600"
          >
            프로필 바꾸기
          </button>
        </div>
      </div>
    </div>
  )
}
