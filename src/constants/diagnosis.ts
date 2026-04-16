import type { WritingType } from '@/types/database'

export interface DiagnosisOption {
  text: string
  weights: Record<WritingType, number>
}

export interface DiagnosisQuestion {
  id: string
  target: 'child' | 'parent'
  question: string
  options: DiagnosisOption[]
}

// 아이용 진단 질문
export const CHILD_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 'c1',
    target: 'child',
    question: '글쓰기 숙제가 있으면 어떤 생각이 들어?',
    options: [
      {
        text: '잘 못 쓰면 어쩌지... 걱정돼',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '뭘 써야 할지 모르겠어',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '어떻게 시작해야 할지 모르겠어',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '생각은 있는데 어떻게 쓸지 모르겠어',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'c2',
    target: 'child',
    question: '글을 쓸 때 제일 어려운 건 뭐야?',
    options: [
      {
        text: '틀릴까봐 무서워',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '첫 문장 쓰기가 너무 어려워',
        weights: { pressure: 0, structure: 2, topic: 1, expression: 0 },
      },
      {
        text: '재미있는 주제가 없어',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '머릿속 생각을 글로 바꾸기 어려워',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'c3',
    target: 'child',
    question: '선생님이 "자유롭게 써봐"라고 하면?',
    options: [
      {
        text: '뭘 써도 괜찮을지 걱정돼',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '오히려 더 어려워. 뭘 써야 해?',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '쓸 건 있는데 순서를 모르겠어',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '쓰고 싶은 건 있는데 말이 안 나와',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'c4',
    target: 'child',
    question: '내가 쓴 글을 다른 사람이 보면?',
    options: [
      {
        text: '부끄럽고 떨려',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '별로 신경 안 써',
        weights: { pressure: 0, structure: 1, topic: 1, expression: 1 },
      },
      {
        text: '내용이 이상하면 어쩌지',
        weights: { pressure: 1, structure: 2, topic: 0, expression: 0 },
      },
      {
        text: '내 마음을 잘 전달했으면 좋겠어',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 2 },
      },
    ],
  },
  {
    id: 'c5',
    target: 'child',
    question: '일기를 쓸 때 어떤 느낌이야?',
    options: [
      {
        text: '잘 써야 한다는 부담감이 있어',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '오늘 뭐 했는지 기억이 안 나',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '그냥 있었던 일만 나열하게 돼',
        weights: { pressure: 0, structure: 2, topic: 0, expression: 1 },
      },
      {
        text: '느낌을 어떻게 표현할지 모르겠어',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'c6',
    target: 'child',
    question: '좋아하는 책이나 영화 이야기를 쓰라고 하면?',
    options: [
      {
        text: '제대로 쓸 수 있을지 걱정돼',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '어디서부터 어디까지 쓸지 모르겠어',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '재밌었는데 왜 재밌었는지 설명이 안 돼',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
      {
        text: '딱히 쓰고 싶은 부분이 없어',
        weights: { pressure: 0, structure: 0, topic: 2, expression: 1 },
      },
    ],
  },
  {
    id: 'c7',
    target: 'child',
    question: '"더 자세히 써봐"라는 말을 들으면?',
    options: [
      {
        text: '뭘 더 써야 하는지 모르겠어',
        weights: { pressure: 1, structure: 1, topic: 0, expression: 1 },
      },
      {
        text: '더 쓰면 틀릴 것 같아',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '어떤 순서로 더 쓸지 모르겠어',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '단어가 안 떠올라',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'c8',
    target: 'child',
    question: '글쓰기에서 제일 좋아하는 건?',
    options: [
      {
        text: '다 쓰고 나면 뿌듯해',
        weights: { pressure: 2, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '내 생각을 정리할 수 있어',
        weights: { pressure: 0, structure: 2, topic: 0, expression: 0 },
      },
      {
        text: '새로운 이야기를 만들 수 있어',
        weights: { pressure: 0, structure: 0, topic: 2, expression: 0 },
      },
      {
        text: '내 마음을 표현할 수 있어',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 2 },
      },
    ],
  },
]

// 부모용 진단 질문
export const PARENT_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 'p1',
    target: 'parent',
    question: '아이가 글쓰기 과제를 받으면 어떤 반응을 보이나요?',
    options: [
      {
        text: '불안해하거나 미루려고 해요',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '"뭘 써야 해요?"라고 자주 물어요',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '시작은 하는데 중간에 막혀요',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '짧게만 쓰고 끝내려고 해요',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'p2',
    target: 'parent',
    question: '아이의 글을 보면 어떤 특징이 있나요?',
    options: [
      {
        text: '실수를 지우고 다시 쓰는 게 많아요',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '내용 연결이 자연스럽지 않아요',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '뻔한 내용만 반복해요',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '단순한 단어만 사용해요',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'p3',
    target: 'parent',
    question: '아이가 글쓰기 도움을 요청할 때 주로 뭘 물어보나요?',
    options: [
      {
        text: '"이렇게 써도 돼요?"',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '"그 다음에 뭘 써요?"',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '"뭐에 대해 써요?"',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '"이거 다른 말로 뭐라고 해요?"',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'p4',
    target: 'parent',
    question: '글쓰기 피드백을 주면 아이가 어떻게 반응하나요?',
    options: [
      {
        text: '쉽게 상처받거나 포기하려고 해요',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '수정 방향을 잘 이해 못 해요',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '새로운 아이디어를 추가하기 어려워해요',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '다양한 표현으로 바꾸기 어려워해요',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'p5',
    target: 'parent',
    question: '아이가 가장 힘들어하는 글의 종류는?',
    options: [
      {
        text: '평가받는 느낌의 글 (시험, 대회 등)',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '형식이 정해진 글 (보고서, 설명문 등)',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '주제가 자유로운 글',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '감정이나 느낌을 표현하는 글',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'p6',
    target: 'parent',
    question: '아이 글의 길이는 어떤 편인가요?',
    options: [
      {
        text: '쓰다가 지우고를 반복해서 진도가 안 나요',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '앞부분은 긴데 뒤로 갈수록 짧아져요',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '전체적으로 짧고 내용이 없어요',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '길이는 되는데 표현이 단조로워요',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'p7',
    target: 'parent',
    question: '아이가 글쓰기를 즐기는 편인가요?',
    options: [
      {
        text: '잘 쓰면 좋아하는데, 자신이 없어해요',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '아이디어가 있으면 쓰려고 해요',
        weights: { pressure: 0, structure: 2, topic: 1, expression: 0 },
      },
      {
        text: '흥미 있는 주제면 몰입해요',
        weights: { pressure: 0, structure: 0, topic: 2, expression: 1 },
      },
      {
        text: '말로는 잘 하는데 글로는 어려워해요',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
  {
    id: 'p8',
    target: 'parent',
    question: '아이의 말하기와 글쓰기를 비교하면?',
    options: [
      {
        text: '말도 글도 조심스러워요',
        weights: { pressure: 3, structure: 0, topic: 0, expression: 0 },
      },
      {
        text: '말은 두서없이, 글도 비슷해요',
        weights: { pressure: 0, structure: 3, topic: 0, expression: 0 },
      },
      {
        text: '말도 글도 내용이 적어요',
        weights: { pressure: 0, structure: 0, topic: 3, expression: 0 },
      },
      {
        text: '말은 잘 하는데 글은 힘들어해요',
        weights: { pressure: 0, structure: 0, topic: 0, expression: 3 },
      },
    ],
  },
]

// 유형별 결과 설명
export const WRITING_TYPE_RESULTS: Record<
  WritingType,
  {
    title: string
    emoji: string
    description: string
    characteristics: string[]
    supportStrategy: string
  }
> = {
  pressure: {
    title: '신중형',
    emoji: '🌱',
    description: '완벽하게 쓰고 싶은 마음이 커서 글쓰기가 부담스러울 수 있어요',
    characteristics: [
      '틀릴까봐 걱정이 많아요',
      '시작하기 전에 오래 고민해요',
      '쓰다가 지우는 일이 많아요',
      '남에게 보여주기 부끄러워해요',
    ],
    supportStrategy:
      '틀려도 괜찮다는 것을 자주 알려주고, 칭찬을 많이 해줄게요. 완성보다 시도를 격려할게요!',
  },
  structure: {
    title: '구성형',
    emoji: '🧩',
    description: '생각은 있는데 어떤 순서로 써야 할지 어려울 수 있어요',
    characteristics: [
      '첫 문장 시작이 어려워요',
      '내용 연결이 자연스럽지 않아요',
      '글의 앞부분이 길고 뒤가 짧아요',
      '중간에 막히는 경우가 많아요',
    ],
    supportStrategy:
      '단계별로 하나씩 질문하면서 글을 완성해나갈 거예요. "먼저 이것만 써봐"처럼 작은 단위로 안내할게요!',
  },
  topic: {
    title: '탐색형',
    emoji: '🔍',
    description: '쓸 거리를 찾는 게 어렵고, 주제를 좁히기 힘들 수 있어요',
    characteristics: [
      '"뭘 써야 해요?"라고 자주 물어요',
      '자유 주제가 오히려 더 어려워요',
      '비슷한 내용만 반복해요',
      '새로운 아이디어 떠올리기 힘들어요',
    ],
    supportStrategy:
      '다양한 주제를 추천해주고, 질문으로 주제를 구체화할 거예요. 경험에서 이야기거리를 찾도록 도와줄게요!',
  },
  expression: {
    title: '표현형',
    emoji: '🎨',
    description: '머릿속 생각은 많은데 글로 옮기기 어려울 수 있어요',
    characteristics: [
      '말로는 잘 하는데 글은 힘들어요',
      '단순한 단어만 사용해요',
      '감정 표현이 어려워요',
      '짧게 쓰고 끝내려고 해요',
    ],
    supportStrategy:
      '다양한 단어와 표현을 힌트로 알려줄게요. 쓴 부분을 칭찬하고, 조금씩 표현을 풍부하게 만들어볼 거예요!',
  },
}
