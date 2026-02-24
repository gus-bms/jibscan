import Link from 'next/link'

const navItems = [
  { href: '/', label: '홈' },
  { href: '/chat', label: '시세 분석 챗봇' },
  { href: '/planner', label: '내 집 마련 플래너' },
  { href: '/monitoring', label: '시장 모니터링' },
  { href: '/auction', label: '경매 분석' },
  { href: '/subscription', label: '청약 어드바이저' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-blue-700">
            🏠 집스캔
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            className="text-sm px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            로그인
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © 2024 집스캔. 국토교통부 공공데이터 기반 서비스.
      </footer>
    </div>
  )
}
