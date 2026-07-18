import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { askAssistant } from '@/services/aiAssistant';


export function useAssistantChat() {

  const messages = useLiveQuery(
    () => db.chatMessages.orderBy('createdAt').toArray(),
    [],
    []
  );


  async function sendMessage(content: string) {

    const trimmed = content.trim();

    if (!trimmed) return;


    // Message utilisateur
    await db.chatMessages.add({
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    });


    // Réponse de Pérignon
    const response = await askAssistant(trimmed);


    await db.chatMessages.add({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response.message,
      createdAt: new Date().toISOString(),
    });

  }


  async function clearChat() {
    await db.chatMessages.clear();
  }


  return {
    messages: messages ?? [],
    sendMessage,
    clearChat
  };

}
