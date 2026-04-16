'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AVATARS } from '@/constants'

interface Child {
  id: string
  name: string
  avatar: string | null
  pin: string | null
  writing_type: string | null
}

export default function SelectProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
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
      .select('id, name, avatar, pin, writing_type')
      .eq('family_id', family.id)
      .order('created_at')

    if (!childrenData || childrenData.length === 0) {
      router.push('/profiles')
      return
    }

    setChildren(childrenData)
    setLoading(false)
  }

  const handleSelectChild = (child: Child) => {
    if (child.pin) {
      setSelectedChild(child)
      setPinInput('')
      setPinError('')
    } else {
      // PIN 없으면 바로 진행
      proceedWithChild(child)
    }
  }

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChild) return

    if (pinInput === selectedChild.pin) {
      proceedWithChild(selectedChild)
    } else {
      setPinError('PIN이 틀렸어요')
      setPinInput('')
    }
  }

  const proceedWithChild = (child: Child) => {
    // 선택한 아이 ID를 세션 스토리지에 저장
    sessionStorage.setItem('selectedChildId', child.id)

    // 진단 완료 여부에 따라 분기
    if (child.writing_type) {
      router.push('/topics')
    } else {
      router.push('/diagnosis')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  // PIN 입력 모달
  if (selectedChild) {
    const avatarData = AVATARS.find((a) => a.id === selectedChild.avatar)

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">{avatarData?.emoji || '👤'}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {selectedChild.name}
          </h2>
          <p className="text-gray-500 mb-6">PIN을 입력해줘!</p>

          {pinError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {pinError}
            </div>
          )}

          <form onSubmit={handlePinSubmit}>
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-14 border-2 border-gray-300 rounded-xl flex items-center justify-center text-2xl font-bold"
                >
                  {pinInput[i] ? '●' : ''}
                </div>
              ))}
            </div>

            <input
              type="tel"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="sr-only"
              autoFocus
              maxLength={4}
            />

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, i) => {
                if (key === null) return <div key={i} />
                if (key === 'del') {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                      className="p-4 text-xl bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                    >
                      ←
                    </button>
                  )
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (pinInput.length < 4) {
                        setPinInput((prev) => prev + key)
                      }
                    }}
                    className="p-4 text-xl bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                  >
                    {key}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedChild(null)}
                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 rounded-xl transition"
              >
                뒤로
              </button>
              <button
                type="submit"
                disabled={pinInput.length !== 4}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-lg mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">누가 글을 쓸까요?</h1>
          <p className="text-gray-500 mt-2">프로필을 선택해줘!</p>
        </div>

        <div className="grid gap-4">
          {children.map((child) => {
            const avatarData = AVATARS.find((a) => a.id === child.avatar)

            return (
              <button
                key={child.id}
                onClick={() => handleSelectChild(child)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-center gap-4 text-left"
              >
                <div className="text-5xl">{avatarData?.emoji || '👤'}</div>
                <div>
                  <div className="text-xl font-semibold text-gray-800">
                    {child.name}
                  </div>
                  {child.pin && (
                    <div className="text-sm text-gray-400">🔒 PIN 필요</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/profiles"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            프로필 관리 →
          </Link>
        </div>
      </div>
    </div>
  )
}
