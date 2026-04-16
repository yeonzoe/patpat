'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  getVocabularyByGrade,
  VOCABULARY_CATEGORIES,
  type VocabularyItem,
} from '@/constants/vocabulary'
import type { Grade } from '@/types/database'

type TabType = 'my' | 'learn'

interface MyWord {
  id: string
  vocabulary_id: string
  source: string
  mastery: number
  created_at: string
}

export default function VocabularyPage() {
  const router = useRouter()
  const supabase = createClient()

  const [childId, setChildId] = useState<string | null>(null)
  const [childName, setChildName] = useState('')
  const [grade, setGrade] = useState<Grade>('elementary-3')
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<TabType>('my')
  const [myWords, setMyWords] = useState<MyWord[]>([])
  const [gradeWords, setGradeWords] = useState<VocabularyItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null)

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
    const { data: child } = await supabase
      .from('children')
      .select('name, grade')
      .eq('id', id)
      .single()

    if (child) {
      setChildName(child.name)
      setGrade(child.grade as Grade)
      setGradeWords(getVocabularyByGrade(child.grade as Grade))
    }

    // 내 단어장 로드
    const { data: words } = await supabase
      .from('my_vocabulary')
      .select('*')
      .eq('child_id', id)
      .order('created_at', { ascending: false })

    setMyWords(words || [])
    setLoading(false)
  }

  const addToMyWords = async (vocabId: string) => {
    if (!childId) return

    // 이미 추가된 단어인지 확인
    const exists = myWords.some((w) => w.vocabulary_id === vocabId)
    if (exists) return

    const { data } = await supabase
      .from('my_vocabulary')
      .insert({
        child_id: childId,
        vocabulary_id: vocabId,
        source: 'learn',
        mastery: 0,
      })
      .select()
      .single()

    if (data) {
      setMyWords([data, ...myWords])
    }
  }

  const removeFromMyWords = async (id: string) => {
    await supabase.from('my_vocabulary').delete().eq('id', id)
    setMyWords(myWords.filter((w) => w.id !== id))
  }

  const updateMastery = async (id: string, mastery: number) => {
    await supabase.from('my_vocabulary').update({ mastery }).eq('id', id)
    setMyWords(myWords.map((w) => (w.id === id ? { ...w, mastery } : w)))
  }

  const getWordById = (vocabId: string): VocabularyItem | undefined => {
    return gradeWords.find((w) => w.id === vocabId)
  }

  const filteredGradeWords = selectedCategory
    ? gradeWords.filter((w) => w.category === selectedCategory)
    : gradeWords

  const usedCategories = [...new Set(gradeWords.map((w) => w.category))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📚 단어 학습</h1>
            <p className="text-gray-500 text-sm">{childName}의 단어장</p>
          </div>
          <button
            onClick={() => router.push('/topics')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            글쓰기 →
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              activeTab === 'my'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-700 hover:bg-emerald-50'
            }`}
          >
            ⭐ 내 단어장 ({myWords.length})
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              activeTab === 'learn'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-700 hover:bg-emerald-50'
            }`}
          >
            📖 학년별 어휘
          </button>
        </div>

        {/* 내 단어장 */}
        {activeTab === 'my' && (
          <div>
            {myWords.length > 0 ? (
              <div className="space-y-3">
                {myWords.map((myWord) => {
                  const vocab = getWordById(myWord.vocabulary_id)
                  if (!vocab) return null

                  return (
                    <div
                      key={myWord.id}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedWord(vocab)}
                        >
                          <span className="font-semibold text-gray-800 text-lg">
                            {vocab.word}
                          </span>
                          {vocab.hanja && (
                            <span className="text-gray-400 text-sm ml-2">
                              {vocab.hanja}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromMyWords(myWord.id)}
                          className="text-gray-400 hover:text-red-500 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{vocab.meaning}</p>

                      {/* 숙달도 */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">숙달도:</span>
                        <div className="flex gap-1">
                          {[0, 25, 50, 75, 100].map((level) => (
                            <button
                              key={level}
                              onClick={() => updateMastery(myWord.id, level)}
                              className={`w-6 h-6 rounded-full text-xs transition ${
                                myWord.mastery >= level
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {level === 100 ? '✓' : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 mb-4">
                  아직 저장한 단어가 없어요
                </p>
                <button
                  onClick={() => setActiveTab('learn')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition"
                >
                  단어 배우러 가기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 학년별 어휘 */}
        {activeTab === 'learn' && (
          <div>
            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  selectedCategory === null
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-emerald-50'
                }`}
              >
                전체
              </button>
              {usedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-emerald-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 단어 목록 */}
            <div className="grid gap-3">
              {filteredGradeWords.map((vocab) => {
                const isAdded = myWords.some(
                  (w) => w.vocabulary_id === vocab.id
                )

                return (
                  <div
                    key={vocab.id}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => setSelectedWord(vocab)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            {vocab.word}
                          </span>
                          {vocab.hanja && (
                            <span className="text-gray-400 text-sm">
                              {vocab.hanja}
                            </span>
                          )}
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {vocab.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{vocab.meaning}</p>
                      </div>
                      <button
                        onClick={() => addToMyWords(vocab.id)}
                        disabled={isAdded}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          isAdded
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        {isAdded ? '추가됨' : '+ 저장'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 단어 상세 모달 */}
        {selectedWord && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedWord(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedWord.word}
                </h2>
                {selectedWord.hanja && (
                  <div className="text-2xl text-gray-600 mb-1">
                    {selectedWord.hanja}
                  </div>
                )}
                {selectedWord.hanjaMeaning && (
                  <p className="text-sm text-gray-400">
                    {selectedWord.hanjaMeaning}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">뜻</h3>
                  <p className="text-gray-800">{selectedWord.meaning}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    예문
                  </h3>
                  <ul className="space-y-2">
                    {selectedWord.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="text-gray-700 bg-gray-50 rounded-lg p-3"
                      >
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setSelectedWord(null)}
                className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
