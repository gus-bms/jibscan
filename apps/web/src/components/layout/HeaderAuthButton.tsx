'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

export function HeaderAuthButton() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
          <User className="w-4 h-4" />
          {user?.name ?? user?.email}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    )
  }

  return (
    <a
      href="/login"
      className="text-sm px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
    >
      로그인
    </a>
  )
}
