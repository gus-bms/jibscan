import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: '로그인 | 집스캔' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">🏠 집스캔</h1>
          <p className="text-gray-500 mt-1 text-sm">부동산 AI 분석 플랫폼</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            회원가입
          </a>
        </p>
      </div>
    </div>
  )
}
