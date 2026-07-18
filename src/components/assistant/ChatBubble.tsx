import clsx from 'clsx';
import type { ChatMessage } from '@/types';
import { Sparkles } from 'lucide-react';

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-electric-500/15 text-electric-400 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
          isUser ? 'bg-electric-500 text-onAccent rounded-tr-sm' : 'bg-base-800 text-white rounded-tl-sm'
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
