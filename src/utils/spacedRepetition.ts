import type { Flashcard } from '@/types';

export type ReviewRating = 'difficile' | 'correct' | 'facile';

/**
 * Répétition espacée façon SM-2 (simplifiée à 3 niveaux). Une fiche jamais
 * révisée est considérée "due" immédiatement. Chaque révision décale la
 * prochaine échéance plus ou moins loin selon la difficulté ressentie.
 */
export function scheduleNextReview(card: Flashcard, rating: ReviewRating): Pick<Flashcard, 'dueDate' | 'interval' | 'easeFactor' | 'repetitions'> {
  const ease = card.easeFactor ?? 2.5;
  const reps = card.repetitions ?? 0;

  if (rating === 'difficile') {
    // Échec : on repart de zéro, on la reverra dès aujourd'hui.
    return {
      dueDate: new Date().toISOString(),
      interval: 0,
      easeFactor: Math.max(1.3, ease - 0.2),
      repetitions: 0,
    };
  }

  const newEase = rating === 'facile' ? ease + 0.15 : ease;
  const nextReps = reps + 1;
  let nextInterval: number;
  if (nextReps === 1) nextInterval = 1;
  else if (nextReps === 2) nextInterval = 3;
  else nextInterval = Math.round((card.interval ?? 1) * newEase);

  const due = new Date();
  due.setDate(due.getDate() + nextInterval);

  return {
    dueDate: due.toISOString(),
    interval: nextInterval,
    easeFactor: newEase,
    repetitions: nextReps,
  };
}

/** Une fiche est due si elle n'a jamais été révisée, ou si sa date est passée. */
export function isDue(card: Flashcard): boolean {
  if (!card.dueDate) return true;
  return new Date(card.dueDate) <= new Date();
}

/** Trie : fiches dues d'abord (les plus en retard en premier), puis le reste. */
export function sortByDue(cards: Flashcard[]): Flashcard[] {
  return [...cards].sort((a, b) => {
    const aDue = isDue(a);
    const bDue = isDue(b);
    if (aDue !== bDue) return aDue ? -1 : 1;
    const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    return aTime - bTime;
  });
}
