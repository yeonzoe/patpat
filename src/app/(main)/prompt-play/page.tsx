'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  getTodayMissions,
  MISSION_CATEGORY_INFO,
  MISSIONS,
  type Mission,
  type MissionCategory,
} from '@/constants/missions'

interface Writing {
  id: string
  content: string
  custom_topic: string | null
  topic_id: string | null
  created_at: string
}

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

export default function PromptPlayPage() {
  const router = useRouter()
  const supabase = createClient()

  const [childId, setChildId] = useState<string | null>(null)
  const [childName, setChildName] = useState('')
  const [loading, setLoading] = useState(true)

  const [todayMissions, setTodayMissions] = useState<Mission[]>([])
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [recentWriting, setRecentWriting] = useState<Writing | null>(null)

  const [userPrompt, setUserPrompt] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [generating, setGenerating] = useState(false)
  const [feedback, setFeedback] = useState('')

  const [activeCategory, setActiveCategory] = useState<MissionCategory | 'all'>('all')

  useEffect(() => {
    const id = sessionStorage.getItem('selectedChildId')
    if (!id) {
      router.push('/select-profile')
      return
    }
    setChildId(id)
    loadData(id)
  }, [])

  const loadData = async (id: string) => {
    // 아이 정보
    const { data: child } = await supabase
      .from('children')
      .select('name')
      .eq('id', id)
      .single()

    if (child) {
      setChildName(child.name)
    }

    // 최근 글 (오늘 또는 가장 최근)
    const { data: writings } = await supabase
      .from('writings')
      .select('*')
      .eq('child_id', id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)

    if (writings && writings.length > 0) {
      setRecentWriting(writings[0])
    }

    // 오늘의 미션
    setTodayMissions(getTodayMissions(3))
    setLoading(false)
  }

  const selectMission = (mission: Mission) => {
    setSelectedMission(mission)
    setChatHistory([])
    setUserPrompt('')
    setFeedback('')
  }

  const sendPrompt = async () => {
    if (!userPrompt.trim() || !selectedMission || generating) return

    const newUserMessage: ChatMessage = { role: 'user', content: userPrompt }
    setChatHistory([...chatHistory, newUserMessage])
    setUserPrompt('')
    setGenerating(true)
    setFeedback('')

    try {
      const response = await fetch('/api/prompt-play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: selectedMission.id,
          userPrompt: userPrompt,
          writingContent: recentWriting?.content || '',
          childName,
        }),
      })

      const data = await response.json()

      if (data.response) {
        const newAiMessage: ChatMessage = { role: 'ai', content: data.response }
        setChatHistory((prev) => [...prev, newAiMessage])

        if (data.feedback) {
          setFeedback(data.feedback)
        }

        // DB에 저장
        if (childId) {
          await supabase.from('prompt_attempts').insert({
            child_id: childId,
            mission_id: selectedMission.id,
            writing_id: recentWriting?.id || null,
            user_prompt: newUserMessage.content,
            ai_response: data.response,
            feedback: data.feedback || null,
          })
        }
      }
    } catch (error) {
      console.error('Prompt play error:', error)
      const errorMessage: ChatMessage = {
        role: 'ai',
        content: '앗, 뭔가 잘못됐어! 다시 시도해볼래?',
      }
      setChatHistory((prev) => [...prev, errorMessage])
    }

    setGenerating(false)
  }

  const filteredMissions =
    activeCategory === 'all'
      ? MISSIONS
      : MISSIONS.filter((m) => m.category === activeCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  // 미션 선택 화면
  if (!selectedMission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-2xl mx-auto p-4">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6 pt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🎮 프롬프트 플레이</h1>
              <p className="text-gray-500 text-sm">AI와 함께 놀아보자!</p>
            </div>
            <button
              onClick={() => router.push('/topics')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              글쓰기 →
            </button>
          </div>

          {/* 최근 글 연계 */}
          {recentWriting && (
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="text-sm text-gray-500 mb-1">오늘 쓴 글</div>
              <p className="text-gray-800 line-clamp-2">
                {recentWriting.content.slice(0, 100)}
                {recentWriting.content.length > 100 && '...'}
              </p>
            </div>
          )}

          {/* 오늘의 추천 미션 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              ✨ 오늘의 추천 미션
            </h2>
            <div className="grid gap-3">
              {todayMissions.map((mission) => {
                const catInfo = MISSION_CATEGORY_INFO[mission.category]
                return (
                  <button
                    key={mission.id}
                    onClick={() => selectMission(mission)}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{catInfo.emoji}</div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {mission.title}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 전체 미션 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              📋 모든 미션
            </h2>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  activeCategory === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                전체
              </button>
              {(Object.keys(MISSION_CATEGORY_INFO) as MissionCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                      activeCategory === cat
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-purple-50'
                    }`}
                  >
                    {MISSION_CATEGORY_INFO[cat].emoji}{' '}
                    {MISSION_CATEGORY_INFO[cat].label}
                  </button>
                )
              )}
            </div>

            {/* 미션 목록 */}
            <div className="grid gap-2">
              {filteredMissions.map((mission) => {
                const catInfo = MISSION_CATEGORY_INFO[mission.category]
                return (
                  <button
                    key={mission.id}
                    onClick={() => selectMission(mission)}
                    className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition text-left flex items-center gap-3"
                  >
                    <span className="text-xl">{catInfo.emoji}</span>
                    <span className="text-gray-800">{mission.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 미션 플레이 화면
  const catInfo = MISSION_CATEGORY_INFO[selectedMission.category]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      <div className="max-w-2xl mx-auto p-4 flex-1 flex flex-col w-full">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-4 pt-4">
          <button
            onClick={() => setSelectedMission(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← 미션 선택
          </button>
        </div>

        {/* 미션 정보 */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{catInfo.emoji}</span>
            <h1 className="text-lg font-bold text-gray-800">
              {selectedMission.title}
            </h1>
          </div>
          <p className="text-gray-600 text-sm">{selectedMission.description}</p>

          {/* 팁 */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-1">💡 팁</div>
            <div className="flex flex-wrap gap-1">
              {selectedMission.tips.map((tip, i) => (
                <span
                  key={i}
                  className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 bg-white rounded-xl shadow-sm mb-4 p-4 overflow-y-auto min-h-[200px]">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="mb-2">예시: "{selectedMission.exampleUserPrompt}"</p>
              <p className="text-sm">아래에 프롬프트를 입력해봐!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {generating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 text-gray-500">
                    생각하는 중...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 피드백 */}
        {feedback && (
          <div className="bg-yellow-50 rounded-xl p-3 mb-4 text-yellow-700 text-sm">
            {feedback}
          </div>
        )}

        {/* 입력 영역 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="AI한테 뭐라고 말할까?"
            disabled={generating}
          />
          <button
            onClick={sendPrompt}
            disabled={!userPrompt.trim() || generating}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  )
}
