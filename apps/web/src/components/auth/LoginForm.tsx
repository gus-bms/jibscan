'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { cn } from '@jibscan/ui'
import { authApi } from '@/lib/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { ApiError } from '@/lib/api'
import { AuthInput } from './AuthInput'

interface FormState {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!values.email) errors.email = '이메일을 입력해주세요.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = '유효한 이메일 형식이 아닙니다.'
  if (!values.password) errors.password = '비밀번호를 입력해주세요.'
  else if (values.password.length < 8) errors.password = '비밀번호는 8자 이상이어야 합니다.'
  return errors
}

export function LoginForm() {
  const router = useRouter()
  const { setTokens } = useAuthStore()
  const [values, setValues] = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const tokens = await authApi.login(values)
      setTokens(tokens.accessToken, tokens.refreshToken)
      router.push('/')
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.status === 401
            ? '이메일 또는 비밀번호가 올바르지 않습니다.'
            : error.message
          : '로그인 중 오류가 발생했습니다.'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">로그인</h2>
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4" noValidate>
        <AuthInput
          label="이메일"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
        />
        <AuthInput
          label="비밀번호"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
        />

        {errors.general && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'mt-2 w-full py-2.5 rounded-lg bg-blue-700 text-white font-medium text-sm',
            'hover:bg-blue-800 transition-colors',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2',
          )}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}
