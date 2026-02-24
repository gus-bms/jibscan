import Link from 'next/link'

const features = [
  {
    href: '/chat',
    icon: '💬',
    title: '시세 분석 챗봇',
    description: '자연어로 아파트 실거래가를 조회하고 AI가 트렌드를 분석해드립니다.',
  },
  {
    href: '/planner',
    icon: '🏡',
    title: '내 집 마련 플래너',
    description: '예산과 지역에 맞는 매물을 추천하고 매매 vs 전세를 비교합니다.',
  },
  {
    href: '/monitoring',
    icon: '📊',
    title: '시장 모니터링',
    description: '지역별 거래량과 가격 변동을 실시간으로 감지하고 알림을 받습니다.',
  },
  {
    href: '/auction',
    icon: '⚖️',
    title: '경매/공매 분석',
    description: '낙찰가율, 경쟁률, 권리관계를 AI가 분석하여 요약해드립니다.',
  },
  {
    href: '/subscription',
    icon: '🎯',
    title: '청약 어드바이저',
    description: '청약 일정과 경쟁률을 분석하여 당첨 전략을 제안합니다.',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI로 더 스마트하게 부동산 분석
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          국토교통부 실거래가 데이터와 AI를 결합하여 부동산 시장을 정확하게 분석합니다.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          💬 지금 바로 시세 물어보기
        </Link>
      </section>

      {/* 기능 카드 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="p-6 border rounded-xl hover:shadow-md transition-shadow bg-white group"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
              {feature.title}
            </h2>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
