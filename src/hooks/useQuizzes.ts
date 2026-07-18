import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { Quiz, QuizAttempt } from '@/types';

export function useQuizzes(subjectId: string) {
  const quizzes = useLiveQuery(() => db.quizzes.where('subjectId').equals(subjectId).toArray(), [subjectId], []);

  async function addQuiz(quiz: Quiz) {
    await db.quizzes.add(quiz);
  }
  async function deleteQuiz(id: string) {
    await db.quizzes.delete(id);
    await db.quizAttempts.where('quizId').equals(id).delete();
  }
  async function recordAttempt(attempt: QuizAttempt) {
    await db.quizAttempts.add(attempt);
  }
  async function bestScore(quizId: string) {
    const attempts = await db.quizAttempts.where('quizId').equals(quizId).toArray();
    return attempts.length ? Math.max(...attempts.map((a) => a.score)) : null;
  }

  return { quizzes: quizzes ?? [], addQuiz, deleteQuiz, recordAttempt, bestScore };
}

// Statistiques de progression d'une matière : % de ressources "faites" +
// meilleur score moyen des quiz. Utilisé par la page matière et par
// l'espace Analytics (étape 7).
export function useSubjectProgress(subjectId: string) {
  return useLiveQuery(async () => {
    const resources = await db.resources.where('subjectId').equals(subjectId).toArray();
    const trackable = resources.filter((r) => r.type !== 'note' && r.type !== 'cours' && r.type !== 'pdf' && r.type !== 'video');
    const done = trackable.filter((r) => r.done).length;
    const resourceProgress = trackable.length ? Math.round((done / trackable.length) * 100) : 0;

    const quizzes = await db.quizzes.where('subjectId').equals(subjectId).toArray();
    const quizIds = quizzes.map((q) => q.id);
    const attempts = quizIds.length ? await db.quizAttempts.where('quizId').anyOf(quizIds).toArray() : [];
    const avgQuizScore = attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : null;

    return { resourceProgress, avgQuizScore, totalResources: resources.length, totalQuizzes: quizzes.length };
  }, [subjectId]);
}
