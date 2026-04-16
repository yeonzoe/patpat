'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Grade, WritingType } from '@/types/database'

export interface ChildProfile {
  id: string
  name: string
  avatar: string | null
  grade: Grade
  writing_type: WritingType | null
}

export function useChild() {
  const router = useRouter()
  const supabase = createClient()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChild()
  }, [])

  const loadChild = async () => {
    const childId = sessionStorage.getItem('selectedChildId')
    if (!childId) {
      router.push('/select-profile')
      return
    }

    const { data, error } = await supabase
      .from('children')
      .select('id, name, avatar, grade, writing_type')
      .eq('id', childId)
      .single()

    if (error || !data) {
      sessionStorage.removeItem('selectedChildId')
      router.push('/select-profile')
      return
    }

    setChild(data as ChildProfile)
    setLoading(false)
  }

  const updateWritingType = async (writingType: WritingType) => {
    if (!child) return

    await supabase
      .from('children')
      .update({ writing_type: writingType })
      .eq('id', child.id)

    setChild({ ...child, writing_type: writingType })
  }

  const switchProfile = () => {
    sessionStorage.removeItem('selectedChildId')
    router.push('/select-profile')
  }

  return {
    child,
    loading,
    updateWritingType,
    switchProfile,
  }
}
