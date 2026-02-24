import { create } from 'zustand'
import type { ChatMessage } from '@jibscan/types'

interface ChatStore {
  messages: ChatMessage[]
  addMessage: (message: ChatMessage) => void
  updateLastAssistantMessage: (text: string, replace?: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastAssistantMessage: (text, replace = false) =>
    set((state) => {
      const messages = [...state.messages]
      const lastIdx = messages.length - 1
      const last = messages[lastIdx]
      if (!last || last.role !== 'assistant') return state
      messages[lastIdx] = {
        ...last,
        content: replace ? text : last.content + text,
      }
      return { messages }
    }),

  clearMessages: () => set({ messages: [] }),
}))
