export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

export interface ChatSession {
  id: string
  userId?: string
  messages: ChatMessage[]
  createdAt: string
}

export interface ChatRequest {
  sessionId?: string
  message: string
}

/** SSE 스트리밍 이벤트 */
export type ChatStreamEvent =
  | { type: 'start'; sessionId: string }
  | { type: 'delta'; text: string }
  | { type: 'done'; usage: { inputTokens: number; outputTokens: number } }
  | { type: 'error'; message: string }
