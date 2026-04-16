'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AVATARS, GRADES } from '@/constants'
import type { Grade } from '@/types/database'

interface Child {
  id: string
  name: string
  avatar: string | null
  grade: Grade
  pin: string | null
}

export default function ProfilesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [children, setChildren] = useState<Child[]>([])
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)

  // 폼 상태
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0].id)
  const [grade, setGrade] = useState<Grade>('elementary-3')
  const [pin, setPin] = useState('')
  const [formError, setFormError] = useState('')

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
      // 가족 레코드 생성
      const { data: newFamily } = await supabase
        .from('families')
        .insert({ parent_id: user.id })
        .select('id')
        .single()
      if (newFamily) {
        setFamilyId(newFamily.id)
      }
      setLoading(false)
      setShowForm(true)
      return
    }

    setFamilyId(family.id)

    const { data: childrenData } = await supabase
      .from('children')
      .select('id, name, avatar, grade, pin')
      .eq('family_id', family.id)
      .order('created_at')

    setChildren(childrenData || [])
    setLoading(false)

    // 아이가 없으면 폼 표시
    if (!childrenData || childrenData.length === 0) {
      setShowForm(true)
    }
  }

  const resetForm = () => {
    setName('')
    setAvatar(AVATARS[0].id)
    setGrade('elementary-3')
    setPin('')
    setFormError('')
    setEditingChild(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!name.trim()) {
      setFormError('이름을 입력해주세요')
      return
    }

    if (pin && !/^\d{4}$/.test(pin)) {
      setFormError('PIN은 4자리 숫자여야 해요')
      return
    }

    if (editingChild) {
      // 수정
      const { error } = await supabase
        .from('children')
        .update({
          name: name.trim(),
          avatar,
          grade,
          pin: pin || null,
        })
        .eq('id', editingChild.id)

      if (error) {
        setFormError('수정에 실패했어요')
        return
      }
    } else {
      // 추가
      const { error } = await supabase.from('children').insert({
        family_id: familyId!,
        name: name.trim(),
        avatar,
        grade,
        pin: pin || null,
      })

      if (error) {
        setFormError('추가에 실패했어요')
        return
      }
    }

    resetForm()
    setShowForm(false)
    loadProfiles()
  }

  const handleEdit = (child: Child) => {
    setEditingChild(child)
    setName(child.name)
    setAvatar(child.avatar || AVATARS[0].id)
    setGrade(child.grade)
    setPin(child.pin || '')
    setShowForm(true)
  }

  const handleDelete = async (childId: string) => {
    if (!confirm('정말 삭제할까요? 작성한 글도 모두 삭제됩니다.')) {
      return
    }

    await supabase.from('children').delete().eq('id', childId)
    loadProfiles()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">👨‍👩‍👧‍👦 우리 가족</h1>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            로그아웃
          </button>
        </div>

        {/* 아이 프로필 목록 */}
        <div className="grid gap-4 mb-6">
          {children.map((child) => {
            const avatarData = AVATARS.find((a) => a.id === child.avatar)
            const gradeLabel = GRADES.find((g) => g.value === child.grade)?.label

            return (
              <div
                key={child.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{avatarData?.emoji || '👤'}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{child.name}</div>
                    <div className="text-sm text-gray-500">{gradeLabel}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(child)}
                    className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* 추가/수정 폼 */}
        {showForm ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingChild ? '프로필 수정' : '아이 프로필 추가'}
            </h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="아이 이름"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  캐릭터
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatar(av.id)}
                      className={`p-3 text-2xl rounded-xl transition ${
                        avatar === av.id
                          ? 'bg-blue-100 ring-2 ring-blue-500'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학년
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as Grade)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  {GRADES.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN (선택)
                </label>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="4자리 숫자 (없으면 비워두세요)"
                  maxLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  PIN을 설정하면 아이가 프로필 선택 시 입력해야 해요
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
                >
                  {editingChild ? '수정하기' : '추가하기'}
                </button>
                {(editingChild || children.length > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm()
                      setShowForm(false)
                    }}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-xl transition"
                  >
                    취소
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-2xl text-gray-500 hover:text-blue-500 transition"
          >
            + 아이 추가하기
          </button>
        )}

        {children.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/select-profile')}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
            >
              글쓰기 시작하기 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
