'use client'

import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TOPICS } from '@/constants/topics'
import { WRITING_TYPE_RESULTS } from '@/constants/diagnosis'
import {
  getHintWords,
  getVocabularyByGrade,
  type VocabularyItem,
} from '@/constants/vocabulary'
import type { WritingType, Grade } from '@/types/database'

interface WritingData {
  id: string
  topic_id: string | null
  custom_topic: string | null
  content: string
  status: string
}

// 유형별 격려 메시지
const ENCOURAGEMENTS: Record<WritingType, string[]> = {
  pressure: [
    '잘하고 있어! 그냥 생각나는 대로 써봐 😊',
    '틀려도 괜찮아. 네 이야기가 중요해!',
    '완벽하지 않아도 돼. 쓰는 것 자체가 대단해!',
    '좋아좋아! 계속 써봐!',
  ],
  structure: [
    '좋아! 이제 그 다음엔 뭐가 있었어?',
    '잘 쓰고 있어! 그래서 어떻게 됐어?',
    '오 재밌다! 더 알려줘!',
  ],
  topic: [
    '오 그거 재밌겠다! 더 써봐!',
    '좋은 생각이야! 계속해봐!',
    '그래그래, 그 이야기 더 해줘!',
  ],
  expression: [
    '좋은 표현이야! 👍',
    '오 그렇게 쓸 수도 있구나!',
    '잘 쓰고 있어! 느낌이 살아있어!',
  ],
}

// 유형별 가이드 질문
const GUIDE_QUESTIONS: Record<WritingType, string[]> = {
  pressure: [],
  structure: [
    '언제 있었던 일이야?',
    '어디서 있었어?',
    '누가 있었어?',
    '뭘 했어?',
    '그래서 어떻게 됐어?',
    '그때 기분이 어땠어?',
  ],
  topic: [
    '그 중에서 제일 기억나는 건 뭐야?',
    '왜 그게 기억나?',
    '그때 뭘 봤어? 뭘 들었어?',
    '누가 있었어?',
  ],
  expression: [],
}

export default function WritePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: writingId } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [writing, setWriting] = useState<WritingData | null>(null)
  const [content, setContent] = useState('')
  const [topicTitle, setTopicTitle] = useState('')
  const [writingType, setWritingType] = useState<WritingType>('expression')
  const [childName, setChildName] = useState('')

  // 구성형: 현재 가이드 단계
  const [guideStep, setGuideStep] = useState(0)
  const [guideAnswers, setGuideAnswers] = useState<string[]>([])

  // 격려 메시지
  const [encouragement, setEncouragement] = useState('')
  const [showEncouragement, setShowEncouragement] = useState(false)

  // 단어 힌트
  const [grade, setGrade] = useState<Grade>('elementary-3')
  const [showHintModal, setShowHintModal] = useState(false)
  const [hintWords, setHintWords] = useState<VocabularyItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<VocabularyItem[]>([])

  useEffect(() => {
    loadWriting()
  }, [writingId])

  const loadWriting = async () => {
    const childId = sessionStorage.getItem('selectedChildId')
    if (!childId) {
      router.push('/select-profile')
      return
    }

    // 아이 정보 로드
    const { data: child } = await supabase
      .from('children')
      .select('name, grade, writing_type')
      .eq('id', childId)
      .single()

    if (child) {
      setChildName(child.name)
      setGrade(child.grade as Grade)
      setWritingType((child.writing_type as WritingType) || 'expression')
    }

    // 글 정보 로드
    const { data } = await supabase
      .from('writings')
      .select('*')
      .eq('id', writingId)
      .single()

    if (!data) {
      router.push('/topics')
      return
    }

    setWriting(data)
    setContent(data.content || '')

    // 주제 제목 설정
    if (data.custom_topic) {
      setTopicTitle(data.custom_topic)
    } else if (data.topic_id) {
      const topic = TOPICS.find((t) => t.id === data.topic_id)
      setTopicTitle(topic?.title || '내 글')
    }

    setLoading(false)
  }

  // 자동 저장 (디바운스)
  const saveContent = useCallback(
    async (newContent: string) => {
      if (!writing) return
      setSaving(true)

      const wordCount = newContent.trim().split(/\s+/).filter(Boolean).length
      const sentenceCount = (newContent.match(/[.!?。]/g) || []).length

      await supabase
        .from('writings')
        .update({
          content: newContent,
          word_count: wordCount,
          sentence_count: sentenceCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', writing.id)

      setSaving(false)
    },
    [writing, supabase]
  )

  // 디바운스된 저장
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== writing?.content) {
        saveContent(content)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, writing?.content, saveContent])

  // 글자 수에 따른 격려 메시지
  useEffect(() => {
    const wordCount = content.trim().length
    if (wordCount > 0 && wordCount % 50 === 0 && wordCount <= 300) {
      const messages = ENCOURAGEMENTS[writingType]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setEncouragement(randomMessage)
      setShowEncouragement(true)
      setTimeout(() => setShowEncouragement(false), 3000)
    }
  }, [content, writingType])

  // 단어 힌트 열기
  const openHintModal = () => {
    setHintWords(getHintWords(grade, 5))
    setSearchQuery('')
    setSearchResults([])
    setShowHintModal(true)
  }

  // 단어 검색
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 1) {
      setSearchResults([])
      return
    }
    const allWords = getVocabularyByGrade(grade)
    const results = allWords.filter(
      (w) =>
        w.word.includes(query) ||
        w.meaning.includes(query) ||
        (w.hanja && w.hanja.includes(query))
    )
    setSearchResults(results.slice(0, 10))
  }

  // 단어를 내 단어장에 저장
  const saveWordToMyVocabulary = async (vocab: VocabularyItem) => {
    const childId = sessionStorage.getItem('selectedChildId')
    if (!childId || !writing) return

    await supabase.from('my_vocabulary').upsert(
      {
        child_id: childId,
        vocabulary_id: vocab.id,
        source: 'hint',
        source_writing_id: writing.id,
        mastery: 0,
      },
      { onConflict: 'child_id,vocabulary_id', ignoreDuplicates: true }
    )
  }

  // 구성형: 가이드 답변 추가
  const addGuideAnswer = (answer: string) => {
    const newAnswers = [...guideAnswers, answer]
    setGuideAnswers(newAnswers)

    // 전체 내용에 추가
    const newContent = content + (content ? '\n' : '') + answer
    setContent(newContent)

    if (guideStep < GUIDE_QUESTIONS.structure.length - 1) {
      setGuideStep(guideStep + 1)
    }
  }

  // 글쓰기 완료
  const completeWriting = async () => {
    if (!writing || !content.trim()) return

    await supabase
      .from('writings')
      .update({
        content,
        status: 'completed',
        word_count: content.trim().split(/\s+/).filter(Boolean).length,
        sentence_count: (content.match(/[.!?。]/g) || []).length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', writing.id)

    router.push(`/writings/${writing.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  const typeInfo = WRITING_TYPE_RESULTS[writingType]
  const wordCount = content.trim().length
  const sentences = (content.match(/[.!?。]/g) || []).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4 pt-4">
          <button
            onClick={() => router.push('/topics')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← 주제 선택
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {saving && <span className="text-blue-500">저장 중...</span>}
            <span>{wordCount}자</span>
            <span>•</span>
            <span>{sentences}문장</span>
          </div>
        </div>

        {/* 주제 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="text-sm text-gray-500 mb-1">오늘의 주제</div>
          <h1 className="text-xl font-bold text-gray-800">{topicTitle}</h1>
        </div>

        {/* 유형별 힌트 박스 */}
        {writingType === 'pressure' && (
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <p className="text-green-700 text-sm">
              🌱 {childName}, 틀려도 괜찮아! 생각나는 대로 자유롭게 써봐.
            </p>
          </div>
        )}

        {writingType === 'structure' && guideStep < GUIDE_QUESTIONS.structure.length && (
          <div className="bg-purple-50 rounded-xl p-4 mb-4">
            <p className="text-purple-700 text-sm mb-2">
              🧩 {GUIDE_QUESTIONS.structure[guideStep]}
            </p>
            <input
              type="text"
              className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="여기에 짧게 써봐"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  addGuideAnswer(e.currentTarget.value.trim())
                  e.currentTarget.value = ''
                }
              }}
            />
            <p className="text-purple-400 text-xs mt-1">
              Enter 누르면 다음 질문으로!
            </p>
          </div>
        )}

        {writingType === 'topic' && content.length < 20 && (
          <div className="bg-amber-50 rounded-xl p-4 mb-4">
            <p className="text-amber-700 text-sm">
              🔍 {GUIDE_QUESTIONS.topic[0]}
            </p>
          </div>
        )}

        {writingType === 'expression' && (
          <div className="bg-pink-50 rounded-xl p-4 mb-4">
            <p className="text-pink-700 text-sm">
              🎨 느낌을 표현해봐! 어떤 색깔 같아? 어떤 맛 같아?
            </p>
          </div>
        )}

        {/* 격려 메시지 토스트 */}
        {showEncouragement && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-3 animate-bounce z-50">
            <p className="text-gray-800 font-medium">{encouragement}</p>
          </div>
        )}

        {/* 글쓰기 영역 */}
        <div className="bg-white rounded-2xl shadow-sm mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-80 p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 leading-relaxed"
            placeholder={`${childName}, 여기에 글을 써봐! ✏️`}
          />
          {/* 단어 힌트 버튼 */}
          <div className="px-4 pb-4">
            <button
              onClick={openHintModal}
              className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm transition"
            >
              📚 단어 힌트
            </button>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/topics')}
            className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 rounded-xl transition"
          >
            나중에 쓰기
          </button>
          <button
            onClick={completeWriting}
            disabled={!content.trim()}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다 썼어요! ✨
          </button>
        </div>

        {/* 유형 정보 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <span>
            {typeInfo.emoji} {childName}의 글쓰기 스타일: {typeInfo.title}
          </span>
        </div>

        {/* 단어 힌트 모달 */}
        {showHintModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
            onClick={() => setShowHintModal(false)}
          >
            <div
              className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">📚 단어 힌트</h2>
                <button
                  onClick={() => setShowHintModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* 검색 */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="단어 검색..."
              />

              {/* 검색 결과 또는 추천 단어 */}
              <div className="space-y-2">
                {(searchQuery ? searchResults : hintWords).length > 0 ? (
                  (searchQuery ? searchResults : hintWords).map((vocab) => (
                    <div
                      key={vocab.id}
                      className="bg-gray-50 rounded-xl p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-800">
                            {vocab.word}
                          </span>
                          {vocab.hanja && (
                            <span className="text-gray-400 text-sm ml-1">
                              {vocab.hanja}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            saveWordToMyVocabulary(vocab)
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-800"
                        >
                          저장
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {vocab.meaning}
                      </p>
                      {vocab.examples[0] && (
                        <p className="text-xs text-gray-400 mt-1">
                          예: {vocab.examples[0]}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-4">
                    {searchQuery ? '검색 결과가 없어요' : '추천 단어가 없어요'}
                  </p>
                )}
              </div>

              {!searchQuery && (
                <button
                  onClick={() => setHintWords(getHintWords(grade, 5))}
                  className="w-full mt-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg text-sm transition"
                >
                  🔄 다른 단어 보기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
