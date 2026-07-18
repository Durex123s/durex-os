import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { Flashcard } from '@/types';

export function useFlashcards(subjectId: string) {
  const cards = useLiveQuery(() => db.flashcards.where('subjectId').equals(subjectId).toArray(), [subjectId], []);

  async function addCard(card: Flashcard) {
    await db.flashcards.add(card);
  }
  async function deleteCard(id: string) {
    await db.flashcards.delete(id);
  }

  return { cards: cards ?? [], addCard, deleteCard };
}
