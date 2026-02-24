import { cn } from '@jibscan/ui'
import type { ChatMessage } from '@jibscan/types'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold mr-2">
          AI
        </div>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap break-words',
          isUser
            ? 'bg-blue-700 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm',
        )}
      >
        {message.content || (
          <span className="inline-flex gap-1">
            <span className="animate-bounce [animation-delay:0ms]">·</span>
            <span className="animate-bounce [animation-delay:150ms]">·</span>
            <span className="animate-bounce [animation-delay:300ms]">·</span>
          </span>
        )}
      </div>
    </div>
  )
}
