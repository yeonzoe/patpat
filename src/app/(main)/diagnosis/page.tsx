'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  CHILD_QUESTIONS,
  PARENT_QUESTIONS,
  WRITING_TYPE_RESULTS,
  type DiagnosisQuestion,
} from '@/constants/diagnosis'
import type { WritingType } from '@/types/database'

type DiagnosisTarget = 'child' | 'parent' | null
type DiagnosisStep = 'select' | 'quiz' | 'result'

export default function DiagnosisPage() {
  const router = useRouter()
  const supabase = createClient()

  const [childId, setChildId] = useState<string | null>(null)
  const [childName, setChildName] = useState('')
  const [step, setStep] = useState<DiagnosisStep>('select')
  const [target, setTarget] = useState<DiagnosisTarget>(null)
  const [questions, setQuestions] = useState<DiagnosisQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<WritingType | null>(null)
  const [loading, setLoading] = useState(true)

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
      .select('name, writing_type')
      .eq('id', id)
      .single()

    if (data) {
      setChildName(data.name)
      // 이미 진단 완료한 경우
      if (data.writing_type) {
        setResult(data.writing_type as WritingType)
        setStep('result')
      }
    }
    setLoading(false)
  }

  const startQuiz = (selectedTarget: DiagnosisTarget) => {
    setTarget(selectedTarget)
    const selectedQuestions =
      selectedTarget === 'child' ? CHILD_QUESTIONS : PARENT_QUESTIONS
    setQuestions(selectedQuestions)
    setAnswers([])
    setCurrentIndex(0)
    setStep('quiz')
  }

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex]
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // 퀴즈 완료 - 결과 계산
      calculateResult(newAnswers)
    }
  }

  const calculateResult = async (finalAnswers: number[]) => {
    // 유형별 점수 합산
    const scores: Record<WritingType, number> = {
      pressure: 0,
      structure: 0,
      topic: 0,
      expression: 0,
    }

    questions.forEach((question, qIndex) => {
      const selectedOption = question.options[finalAnswers[qIndex]]
      if (selectedOption) {
        Object.entries(selectedOption.weights).forEach(([type, weight]) => {
          scores[type as WritingType] += weight
        })
      }
    })

    // 최고 점수 유형 찾기
    const maxType = Object.entries(scores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as WritingType

    // DB에 저장
    if (childId) {
      await supabase
        .from('children')
        .update({ writing_type: maxType })
        .eq('id', childId)
    }

    setResult(maxType)
    setStep('result')
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setAnswers(answers.slice(0, -1))
    } else {
      setStep('select')
    }
  }

  const retakeDiagnosis = () => {
    setResult(null)
    setStep('select')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  // 대상 선택 화면
  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4">
        <div className="max-w-lg mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              🎯 글쓰기 유형 알아보기
            </h1>
            <p className="text-gray-600 mt-2">
              {childName}의 글쓰기 스타일을 파악해볼게요
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => startQuiz('child')}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">👧</div>
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {childName}이(가) 직접 할게요
                  </div>
                  <div className="text-sm text-gray-500">
                    아이가 직접 질문에 답해요
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => startQuiz('parent')}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">👨‍👩‍👧</div>
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    부모님이 대신 할게요
                  </div>
                  <div className="text-sm text-gray-500">
                    부모님이 아이에 대해 답해요
                  </div>
                </div>
              </div>
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            둘 중 하나만 해도 충분해요!
          </p>
        </div>
      </div>
    )
  }

  // 퀴즈 화면
  if (step === 'quiz') {
    const question = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4">
        <div className="max-w-lg mx-auto pt-4">
          {/* 진행률 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <button onClick={goBack} className="hover:text-gray-700">
                ← 이전
              </button>
              <span>
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 질문 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* 선택지 */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-teal-50 transition text-left"
              >
                <span className="text-gray-700">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 결과 화면
  if (step === 'result' && result) {
    const typeResult = WRITING_TYPE_RESULTS[result]

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4">
        <div className="max-w-lg mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{typeResult.emoji}</div>
            <h1 className="text-3xl font-bold text-gray-800">
              {childName}은(는) {typeResult.title}!
            </h1>
            <p className="text-gray-600 mt-2">{typeResult.description}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              이런 특징이 있어요
            </h3>
            <ul className="space-y-2">
              {typeResult.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-teal-500">•</span>
                  {char}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-teal-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-teal-800 mb-2">
              💡 이렇게 도와줄게요
            </h3>
            <p className="text-teal-700">{typeResult.supportStrategy}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/topics')}
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition"
            >
              글쓰기 시작하기 →
            </button>
            <button
              onClick={retakeDiagnosis}
              className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              다시 진단하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
