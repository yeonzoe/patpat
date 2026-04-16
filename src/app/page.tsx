import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 헤더 */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ✏️ 글쓰기 친구
          </h1>
          <p className="text-xl text-gray-600">
            아이의 글쓰기를 도와주는 AI 코칭 프로그램
          </p>
        </header>

        {/* 특징 */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              맞춤형 진단
            </h3>
            <p className="text-gray-600 text-sm">
              아이의 글쓰기 유형을 파악하고 맞춤형 지원을 제공해요
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              친구같은 피드백
            </h3>
            <p className="text-gray-600 text-sm">
              AI가 친구처럼 편하게 말하며 글쓰기를 도와줘요
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              어휘력 향상
            </h3>
            <p className="text-gray-600 text-sm">
              글쓰기와 함께 어휘와 한자 실력도 키워요
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-blue-500/30 transition"
          >
            시작하기 →
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              로그인
            </Link>
          </p>
        </div>

        {/* 대상 */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            이런 아이에게 좋아요
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              '글쓰기가 막막한 아이',
              '뭘 써야 할지 모르는 아이',
              '표현이 어려운 아이',
              '글 구성이 힘든 아이',
            ].map((text) => (
              <span
                key={text}
                className="px-4 py-2 bg-white rounded-full text-gray-700 shadow-sm"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
