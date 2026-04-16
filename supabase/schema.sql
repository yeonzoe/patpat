-- 아이 글쓰기 프로그램 DB 스키마
-- Supabase SQL Editor에서 실행

-- 1. 가족 테이블
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 아이 프로필 테이블
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  pin TEXT,
  grade TEXT NOT NULL,
  writing_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 진단 질문 테이블
CREATE TABLE diagnosis_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target TEXT NOT NULL CHECK (target IN ('child', 'parent')),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  order_num INT NOT NULL
);

-- 4. 진단 응답 테이블
CREATE TABLE diagnosis_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES diagnosis_questions(id) NOT NULL,
  selected_option INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 주제 테이블
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('school', 'family', 'friend', 'season', 'daily')),
  season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter')),
  date_range DATERANGE,
  grade_range TEXT[] NOT NULL,
  prompts JSONB
);

-- 6. 글 테이블
CREATE TABLE writings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES topics(id),
  custom_topic TEXT,
  content TEXT NOT NULL,
  word_count INT,
  sentence_count INT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 글쓰기 세션 테이블 (단계별 UX용)
CREATE TABLE writing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writing_id UUID REFERENCES writings(id) ON DELETE CASCADE NOT NULL,
  step INT NOT NULL,
  step_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. AI 피드백 테이블
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writing_id UUID REFERENCES writings(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  highlights JSONB,
  questions JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. 어휘 테이블
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  hanja TEXT,
  hanja_meaning TEXT,
  stroke_order TEXT,
  examples JSONB,
  grade TEXT NOT NULL,
  category TEXT
);

-- 10. 내 단어장 테이블
CREATE TABLE my_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  vocabulary_id UUID REFERENCES vocabulary(id) NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('hint', 'search', 'writing')),
  source_writing_id UUID REFERENCES writings(id),
  mastery INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. 프롬프트 플레이 미션 테이블
CREATE TABLE prompt_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  template TEXT NOT NULL,
  category TEXT CHECK (category IN ('story', 'riddle', 'image', 'question'))
);

-- 12. 미션 시도 테이블
CREATE TABLE prompt_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES prompt_missions(id) NOT NULL,
  writing_id UUID REFERENCES writings(id),
  user_prompt TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. 리포트 설정 테이블
CREATE TABLE report_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  frequency TEXT[] NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. 발송된 리포트 테이블
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  period_start DATE,
  period_end DATE,
  stats JSONB,
  ai_summary TEXT,
  sent_at TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX idx_children_family ON children(family_id);
CREATE INDEX idx_writings_child ON writings(child_id);
CREATE INDEX idx_writings_created ON writings(created_at DESC);
CREATE INDEX idx_feedbacks_writing ON feedbacks(writing_id);
CREATE INDEX idx_my_vocabulary_child ON my_vocabulary(child_id);
CREATE INDEX idx_topics_category ON topics(category);

-- RLS (Row Level Security) 정책
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_vocabulary ENABLE ROW LEVEL SECURITY;

-- 부모는 자신의 가족만 접근
CREATE POLICY "Users can access own family"
  ON families FOR ALL
  USING (parent_id = auth.uid());

-- 부모는 자신의 가족의 아이만 접근
CREATE POLICY "Users can access own children"
  ON children FOR ALL
  USING (family_id IN (SELECT id FROM families WHERE parent_id = auth.uid()));

-- 부모는 자신의 가족 아이의 글만 접근
CREATE POLICY "Users can access own children writings"
  ON writings FOR ALL
  USING (child_id IN (
    SELECT c.id FROM children c
    JOIN families f ON c.family_id = f.id
    WHERE f.parent_id = auth.uid()
  ));

-- 피드백도 동일
CREATE POLICY "Users can access own children feedbacks"
  ON feedbacks FOR ALL
  USING (writing_id IN (
    SELECT w.id FROM writings w
    JOIN children c ON w.child_id = c.id
    JOIN families f ON c.family_id = f.id
    WHERE f.parent_id = auth.uid()
  ));

-- 내 단어장도 동일
CREATE POLICY "Users can access own children vocabulary"
  ON my_vocabulary FOR ALL
  USING (child_id IN (
    SELECT c.id FROM children c
    JOIN families f ON c.family_id = f.id
    WHERE f.parent_id = auth.uid()
  ));

-- 공개 테이블 (인증 없이 읽기 가능)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read topics"
  ON topics FOR SELECT
  USING (true);

ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read vocabulary"
  ON vocabulary FOR SELECT
  USING (true);

ALTER TABLE diagnosis_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read diagnosis questions"
  ON diagnosis_questions FOR SELECT
  USING (true);

ALTER TABLE prompt_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read prompt missions"
  ON prompt_missions FOR SELECT
  USING (true);
