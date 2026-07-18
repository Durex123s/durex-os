import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import { useAssistantChat } from '@/hooks/useAssistantChat';
import { ChatBubble } from '@/components/assistant/ChatBubble';
import { QuickActions } from '@/components/assistant/QuickActions';
import { VoiceInputButton } from '@/components/assistant/VoiceInputButton';
import { useConfirm } from '@/hooks/useConfirm';

export function Assistant() {
  const { messages, sendMessage, clearChat } = useAssistantChat();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text ?? input;
    if (!content.trim() || sending) return;
    setInput('');
    setSending(true);
    await sendMessage(content);
    setSending(false);
  };

  const handleClearChat = async () => {
    if (!(await confirm('Effacer toute la conversation ? Cette action est irréversible.'))) return;
    clearChat();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      {dialog}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Assistant IA</h1>
          <p className="text-muted text-sm mt-1">Planification, analyse, études — par texte ou par voix.</p>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClearChat} className="text-muted hover:text-danger transition-colors" aria-label="Effacer la conversation">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto glass-card p-4 space-y-3 mb-3">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-10">
            <div className="w-12 h-12 rounded-2xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-electric-400" />
            </div>
            <p className="text-sm text-muted max-w-xs">
              Demande-moi de planifier ta journée, d'analyser tes dépenses, ou choisis une action rapide ci-dessous.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {sending && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-electric-500/15 text-electric-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-base-800 text-muted rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm">...</div>
          </div>
        )}
      </div>

      <div className="mb-3">
        <QuickActions onSelect={(prompt) => handleSend(prompt)} />
      </div>

      <div className="flex items-center gap-2">
        <VoiceInputButton onResult={(text) => setInput(text)} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Écris ta question..."
          className="flex-1 bg-base-800 border border-base-600 rounded-lg px-3 py-2.5 text-sm text-white focus:border-electric-500 outline-none transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || sending}
          className="p-2.5 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent transition-colors shrink-0"
          aria-label="Envoyer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
