export type WritingType = 'pressure' | 'structure' | 'topic' | 'expression'

export type Grade =
  | 'elementary-1'
  | 'elementary-2'
  | 'elementary-3'
  | 'elementary-4'
  | 'elementary-5'
  | 'elementary-6'
  | 'middle-1'
  | 'middle-2'
  | 'middle-3'
  | 'high-1'
  | 'high-2'
  | 'high-3'

export type TopicCategory =
  | 'school'
  | 'family'
  | 'friend'
  | 'season'
  | 'daily'

export type WritingStatus = 'draft' | 'completed'

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          parent_id: string
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          created_at?: string
        }
      }
      children: {
        Row: {
          id: string
          family_id: string
          name: string
          avatar: string | null
          pin: string | null
          grade: Grade
          writing_type: WritingType | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          avatar?: string | null
          pin?: string | null
          grade: Grade
          writing_type?: WritingType | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          avatar?: string | null
          pin?: string | null
          grade?: Grade
          writing_type?: WritingType | null
          created_at?: string
        }
      }
      diagnosis_questions: {
        Row: {
          id: string
          target: 'child' | 'parent'
          question: string
          options: DiagnosisOption[]
          order_num: number
        }
        Insert: {
          id?: string
          target: 'child' | 'parent'
          question: string
          options: DiagnosisOption[]
          order_num: number
        }
        Update: {
          id?: string
          target?: 'child' | 'parent'
          question?: string
          options?: DiagnosisOption[]
          order_num?: number
        }
      }
      diagnosis_responses: {
        Row: {
          id: string
          child_id: string
          question_id: string
          selected_option: number
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          question_id: string
          selected_option: number
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          question_id?: string
          selected_option?: number
          created_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          title: string
          category: TopicCategory
          season: 'spring' | 'summer' | 'fall' | 'winter' | null
          date_range: string | null
          grade_range: string[]
          prompts: Record<WritingType, string> | null
        }
        Insert: {
          id?: string
          title: string
          category: TopicCategory
          season?: 'spring' | 'summer' | 'fall' | 'winter' | null
          date_range?: string | null
          grade_range: string[]
          prompts?: Record<WritingType, string> | null
        }
        Update: {
          id?: string
          title?: string
          category?: TopicCategory
          season?: 'spring' | 'summer' | 'fall' | 'winter' | null
          date_range?: string | null
          grade_range?: string[]
          prompts?: Record<WritingType, string> | null
        }
      }
      writings: {
        Row: {
          id: string
          child_id: string
          topic_id: string | null
          custom_topic: string | null
          content: string
          word_count: number | null
          sentence_count: number | null
          status: WritingStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          topic_id?: string | null
          custom_topic?: string | null
          content: string
          word_count?: number | null
          sentence_count?: number | null
          status?: WritingStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          topic_id?: string | null
          custom_topic?: string | null
          content?: string
          word_count?: number | null
          sentence_count?: number | null
          status?: WritingStatus
          created_at?: string
          updated_at?: string
        }
      }
      feedbacks: {
        Row: {
          id: string
          writing_id: string
          content: string
          highlights: string[] | null
          questions: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          writing_id: string
          content: string
          highlights?: string[] | null
          questions?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          writing_id?: string
          content?: string
          highlights?: string[] | null
          questions?: string[] | null
          created_at?: string
        }
      }
      vocabulary: {
        Row: {
          id: string
          word: string
          meaning: string
          hanja: string | null
          hanja_meaning: string | null
          stroke_order: string | null
          examples: string[]
          grade: Grade
          category: string | null
        }
        Insert: {
          id?: string
          word: string
          meaning: string
          hanja?: string | null
          hanja_meaning?: string | null
          stroke_order?: string | null
          examples: string[]
          grade: Grade
          category?: string | null
        }
        Update: {
          id?: string
          word?: string
          meaning?: string
          hanja?: string | null
          hanja_meaning?: string | null
          stroke_order?: string | null
          examples?: string[]
          grade?: Grade
          category?: string | null
        }
      }
      my_vocabulary: {
        Row: {
          id: string
          child_id: string
          vocabulary_id: string
          source: 'hint' | 'search' | 'writing'
          source_writing_id: string | null
          mastery: number
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          vocabulary_id: string
          source: 'hint' | 'search' | 'writing'
          source_writing_id?: string | null
          mastery?: number
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          vocabulary_id?: string
          source?: 'hint' | 'search' | 'writing'
          source_writing_id?: string | null
          mastery?: number
          created_at?: string
        }
      }
    }
  }
}

export interface DiagnosisOption {
  text: string
  type_weights: Record<WritingType, number>
}
