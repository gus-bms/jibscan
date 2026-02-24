import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'

export const metadata: Metadata = {
  title: '집스캔 — 한국 부동산 AI 분석',
  description: '국토교통부 실거래가 데이터 기반 AI 부동산 분석 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
