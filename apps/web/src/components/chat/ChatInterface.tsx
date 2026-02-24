'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@jibscan/ui'
import type { ChatMessage } from '@jibscan/types'
import { useChatStore } from '@/store/chat.store'
import { ChatBubble } from './ChatBubble'

export function ChatInterface() {
  const { messages, addMessage, updateLastAssistantMessage } = useChatStore()
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async () => {
    const message = input.trim()
    if (!message || isStreaming) return

    setInput('')
    setIsStreaming(true)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    }
    addMessage(userMessage)

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    }
    addMessage(assistantMessage)

    try {
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${apiUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({ message }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('스트림을 읽을 수 없습니다.')

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const json = line.slice(6)
          try {
            const event = JSON.parse(json) as { type: string; text?: string }
            if (event.type === 'delta' && event.text) {
              updateLastAssistantMessage(event.text)
            }
          } catch {
            // JSON 파싱 실패 무시
          }
        }
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : '오류가 발생했습니다.'
      updateLastAssistantMessage(
        `\n\n⚠️ ${errMsg} 잠시 후 다시 시도해주세요.`,
        true,
      )
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-white">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-4xl mb-3">🏠</div>
            <p className="font-medium">부동산 정보를 물어보세요!</p>
            <p className="text-sm mt-1">예: "강남구 최근 아파트 실거래가 알려줘"</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="border-t p-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="부동산 관련 질문을 입력하세요... (Enter로 전송)"
            rows={2}
            className={cn(
              'flex-1 resize-none rounded-lg border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50',
            )}
            disabled={isStreaming}
          />
          <button
            onClick={() => void handleSubmit()}
            disabled={!input.trim() || isStreaming}
            className={cn(
              'flex-shrink-0 p-2.5 rounded-lg bg-blue-700 text-white',
              'hover:bg-blue-800 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          AI 응답은 참고용입니다. 투자 결정 전 전문가와 상담하세요.
        </p>
      </div>
    </div>
  )
}
