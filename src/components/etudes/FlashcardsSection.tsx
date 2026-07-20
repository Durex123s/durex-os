import { useMemo, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, RotateCw, Trash2, Flame } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/hooks/useConfirm';
import { sortByDue, isDue, scheduleNextReview, type ReviewRating } from '@/utils/spacedRepetition';

export function FlashcardsSection({ subjectId }: { subjectId: string }) {
  const { cards, addCard, updateCard, deleteCard } = useFlashcards(subjectId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [creating, setCreating] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { confirm, dialog } = useConfirm();

  // Les fiches à réviser (en retard ou jamais vues) passent en premier.
  const ordered = useMemo(() => sortByDue(cards), [cards]);
  const current = ordered[index];
  const dueCount = useMemo(() => cards.filter(isDue).length, [cards]);

  const goTo = (delta: number) => {
    setFlipped(false);
    setIndex((i) => Math.max(0, Math.min(ordered.length - 1, i + delta)));
  };

  const handleCreate = () => {
    if (!question.trim() || !answer.trim()) return;
    addCard({ id: crypto.randomUUID(), subjectId, question: question.trim(), answer: answer.trim() });
    setQuestion('');
    setAnswer('');
    setCreating(false);
  };

  const handleDelete = async () => {
    if (!current) return;
    if (!(await confirm('Supprimer cette fiche de révision ?'))) return;
    deleteCard(current.id);
    setIndex((i) => Math.max(0, i - 1));
    setFlipped(false);
  };

  const handleRate = (rating: ReviewRating) => {
    if (!current) return;
    updateCard(current.id, scheduleNextReview(current, rating));
    setFlipped(false);
    // Passe à la fiche suivante due, sans dépasser la fin du paquet.
    setIndex((i) => Math.min(i, Math.max(0, ordered.length - 2)));
  };

  return (
    <div className="glass-card p-5">
      {dialog}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted">Fiches de révision ({cards.length})</h3>
          {dueCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-electric-500/10 border border-electric-500/30 text-electric-400">
              <Flame className="w-3 h-3" />
              {dueCount} à réviser
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCreating(true)}>
          <Plus className="w-3.5 h-3.5" />
          Nouvelle fiche
        </Button>
      </div>

      {cards.length === 0 ? (
        <p className="text-sm text-muted">Aucune fiche pour cette matière. Ajoutes-en une pour commencer à réviser.</p>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-[160px] rounded-xl border border-electric-500/20 bg-base-800/60 flex flex-col items-center justify-center text-center p-6 hover:border-electric-500/40 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-wide text-muted mb-2">
              {flipped ? 'Réponse' : 'Question'}
            </span>
            <p className="text-white text-base">{flipped ? current?.answer : current?.question}</p>
            {!flipped && (
              <span className="flex items-center gap-1 text-xs text-muted mt-4">
                <RotateCw className="w-3 h-3" /> Cliquer pour retourner
              </span>
            )}
          </button>

          {flipped ? (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRate('difficile')}
                className="text-xs py-2 rounded-lg border border-danger/40 text-danger hover:bg-danger/10 transition-colors"
              >
                Difficile
              </button>
              <button
                onClick={() => handleRate('correct')}
                className="text-xs py-2 rounded-lg border border-base-600 text-white hover:bg-white/5 transition-colors"
              >
                Correct
              </button>
              <button
                onClick={() => handleRate('facile')}
                className="text-xs py-2 rounded-lg border border-success/40 text-success hover:bg-success/10 transition-colors"
              >
                Facile
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => goTo(-1)}
                disabled={index === 0}
                className="p-2 rounded-lg text-muted hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted">
                {index + 1} / {ordered.length}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={handleDelete} className="p-2 rounded-lg text-muted hover:text-danger transition-colors" aria-label="Supprimer la fiche">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goTo(1)}
                  disabled={index === ordered.length - 1}
                  className="p-2 rounded-lg text-muted hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Nouvelle fiche">
        <label className="text-xs text-muted mb-1 block">Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          autoFocus
          className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors resize-none mb-3"
        />
        <label className="text-xs text-muted mb-1 block">Réponse</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={2}
          className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors resize-none mb-4"
        />
        <Button onClick={handleCreate} disabled={!question.trim() || !answer.trim()} className="w-full">
          Ajouter la fiche
        </Button>
      </Modal>
    </div>
  );
}
