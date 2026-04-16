'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TOPIC_CATEGORIES } from '@/constants'
import {
  getRecommendedTopics,
  getTopicsByCategory,
  type Topic,
} from '@/constants/topics'
import type { TopicCategory, Grade } from '@/types/database'

export default function TopicsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [childId, setChildId] = useState<string | null>(null)
  const [childName, setChildName] = useState('')
  const [grade, setGrade] = useState<Grade>('elementary-3')
  const [loading, setLoading] = useState(true)

  const [activeCategory, setActiveCategory] = useState<TopicCategory | 'recommended'>('recommended')
  const [customTopic, setCustomTopic] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    const id = sessionStorage.getItem('selectedChildId')
    if (!id) {
      router.push('/select-profile')
      return
    }
    setChildId(id)
    loadChildInfo(id)
  }, [])

  const loadChildInfo = async (id: string) => {
    const { data } = await supabase
      .from('children')
      .select('name, grade, writing_type')
      .eq('id', id)
      .single()

    if (data) {
      setChildName(data.name)
      setGrade(data.grade as Grade)

      // 진단 안 했으면 진단 페이지로
      if (!data.writing_type) {
        router.push('/diagnosis')
        return
      }

      // 추천 주제 로드
      setTopics(getRecommendedTopics(data.grade))
    }
    setLoading(false)
  }

  const handleCategoryChange = (category: TopicCategory | 'recommended') => {
    setActiveCategory(category)
    if (category === 'recommended') {
      setTopics(getRecommendedTopics(grade))
    } else {
      setTopics(getTopicsByCategory(category, grade))
    }
  }

  const selectTopic = async (topic: Topic) => {
    // 글 생성
    const { data, error } = await supabase
      .from('writings')
      .insert({
        child_id: childId,
        topic_id: topic.id,
        content: '',
        status: 'draft',
      })
      .select('id')
      .single()

    if (data && !error) {
      router.push(`/write/${data.id}`)
    }
  }

  const startCustomTopic = async () => {
    if (!customTopic.trim()) return

    // 글 생성 (직접 입력 주제)
    const { data, error } = await supabase
      .from('writings')
      .insert({
        child_id: childId,
        custom_topic: customTopic.trim(),
        content: '',
        status: 'draft',
      })
      .select('id')
      .single()

    if (data && !error) {
      router.push(`/write/${data.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              오늘 뭐 쓸까?
            </h1>
            <p className="text-gray-500 text-sm">{childName}, 주제를 골라봐!</p>
          </div>
          <button
            onClick={() => router.push('/select-profile')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            프로필 바꾸기
          </button>
        </div>

        {/* 직접 입력 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ✍️ 직접 주제 쓰기
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startCustomTopic()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="쓰고 싶은 주제를 적어봐"
            />
            <button
              onClick={startCustomTopic}
              disabled={!customTopic.trim()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              시작
            </button>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => handleCategoryChange('recommended')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              activeCategory === 'recommended'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            ✨ 추천
          </button>
          {TOPIC_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                activeCategory === cat.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* 주제 카드 목록 */}
        <div className="grid gap-3">
          {topics.map((topic) => {
            const category = TOPIC_CATEGORIES.find(
              (c) => c.value === topic.category
            )
            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition text-left flex items-center gap-4"
              >
                <div className="text-2xl">{category?.emoji || '📝'}</div>
                <div>
                  <div className="font-medium text-gray-800">{topic.title}</div>
                  {topic.season && (
                    <span className="text-xs text-orange-500">
                      #{topic.season === 'spring' && '봄'}
                      {topic.season === 'summer' && '여름'}
                      {topic.season === 'fall' && '가을'}
                      {topic.season === 'winter' && '겨울'}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {topics.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            이 카테고리에 맞는 주제가 없어요
          </div>
        )}

        {/* 내 글 보기 링크 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/writings')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            내 글 모음 보기 →
          </button>
        </div>
      </div>
    </div>
  )
}
