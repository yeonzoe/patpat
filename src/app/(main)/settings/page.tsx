'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ReportFrequency = 'weekly' | 'biweekly' | 'monthly' | 'per_writing'

interface ReportSettings {
  frequency: ReportFrequency[]
  email: string
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [familyId, setFamilyId] = useState<string | null>(null)

  const [settings, setSettings] = useState<ReportSettings>({
    frequency: ['weekly'],
    email: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    setUserEmail(user.email || '')

    const { data: family } = await supabase
      .from('families')
      .select('id')
      .eq('parent_id', user.id)
      .single()

    if (!family) {
      router.push('/profiles')
      return
    }

    setFamilyId(family.id)

    // 기존 설정 로드
    const { data: existingSettings } = await supabase
      .from('report_settings')
      .select('*')
      .eq('family_id', family.id)
      .single()

    if (existingSettings) {
      setSettings({
        frequency: existingSettings.frequency as ReportFrequency[],
        email: existingSettings.email,
      })
    } else {
      setSettings({
        frequency: ['weekly'],
        email: user.email || '',
      })
    }

    setLoading(false)
  }

  const toggleFrequency = (freq: ReportFrequency) => {
    setSettings((prev) => {
      const newFrequency = prev.frequency.includes(freq)
        ? prev.frequency.filter((f) => f !== freq)
        : [...prev.frequency, freq]
      return { ...prev, frequency: newFrequency }
    })
  }

  const saveSettings = async () => {
    if (!familyId || !settings.email) return

    setSaving(true)

    // upsert
    await supabase.from('report_settings').upsert(
      {
        family_id: familyId,
        frequency: settings.frequency,
        email: settings.email,
      },
      { onConflict: 'family_id' }
    )

    setSaving(false)
    alert('설정이 저장되었어요!')
  }

  const handleLogout = async () => {
    sessionStorage.removeItem('selectedChildId')
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <h1 className="text-2xl font-bold text-gray-800">⚙️ 설정</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            닫기
          </button>
        </div>

        {/* 계정 정보 */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">👤 계정</h2>
          <div className="text-sm text-gray-600">{userEmail}</div>
        </div>

        {/* 리포트 설정 */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">📊 리포트 설정</h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              리포트 받을 이메일
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="이메일 주소"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              리포트 주기 (중복 선택 가능)
            </label>
            <div className="space-y-2">
              {[
                { value: 'weekly' as ReportFrequency, label: '매주' },
                { value: 'biweekly' as ReportFrequency, label: '격주' },
                { value: 'monthly' as ReportFrequency, label: '매월' },
                { value: 'per_writing' as ReportFrequency, label: '글 쓸 때마다' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                >
                  <input
                    type="checkbox"
                    checked={settings.frequency.includes(option.value)}
                    onChange={() => toggleFrequency(option.value)}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving || !settings.email || settings.frequency.length === 0}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            {saving ? '저장 중...' : '설정 저장'}
          </button>

          <p className="text-xs text-gray-400 mt-2 text-center">
            MVP에서는 앱 내 리포트 보기만 지원해요. 이메일 발송은 곧 추가될 예정이에요!
          </p>
        </div>

        {/* 바로가기 */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">🔗 바로가기</h2>
          <div className="space-y-2">
            <Link
              href="/profiles"
              className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-gray-700"
            >
              👨‍👩‍👧‍👦 프로필 관리
            </Link>
            <Link
              href="/reports"
              className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-gray-700"
            >
              📊 성장 리포트 보기
            </Link>
            <Link
              href="/select-profile"
              className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-gray-700"
            >
              ✏️ 글쓰기하기
            </Link>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full py-3 border border-red-300 text-red-500 hover:bg-red-50 rounded-xl transition"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
