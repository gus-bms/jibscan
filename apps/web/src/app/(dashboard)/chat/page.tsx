import { ChatInterface } from '@/components/chat/ChatInterface'

export const metadata = { title: '시세 분석 챗봇 | 집스캔' }

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">💬 시세 분석 챗봇</h1>
      <p className="text-gray-600 mb-6 text-sm">
        아파트 실거래가, 전월세 시세, 지역 시장 동향을 자연어로 질문해보세요.
      </p>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  )
}
