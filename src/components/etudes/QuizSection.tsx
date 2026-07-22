import { useState } from 'react';
import { Plus, X, Trash2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { Quiz, QuizQuestion } from '@/types';
import { useQuizzes } from '@/hooks/useQuizzes';
import { ModalPortal } from '@/components/ui/ModalPortal';

function QuizBuilder({ subjectId, onClose, onCreate }: { subjectId: string; onClose: () => void; onCreate: (quiz: Quiz) => void }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const updateOption = (id: string, optIndex: number, value: string) =>
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) } : q))
    );

  const addQuestion = () =>
    setQuestions((qs) => [...qs, { id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correctIndex: 0 }]);

  const removeQuestion = (id: string) => setQuestions((qs) => qs.filter((q) => q.id !== id));

  const canSave =
    title.trim() &&
    questions.length > 0 &&
    questions.every((q) => q.question.trim() && q.options.every((o) => o.trim()));

  const handleSave = () => {
    if (!canSave) return;
    onCreate({ id: crypto.randomUUID(), subjectId, title: title.trim(), questions });
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="glass-card w-full max-w-lg p-6 bg-base-900/95 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Nouveau quiz</h3>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du quiz"
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
          />

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={q.id} className="border border-base-700 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted">Question {qi + 1}</span>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(q.id)} className="text-muted hover:text-danger transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                  placeholder="Intitulé de la question"
                  className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-1.5 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-2"
                />
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuestion(q.id, { correctIndex: oi })}
                        className={`w-4 h-4 rounded-full border shrink-0 transition-colors ${
                          q.correctIndex === oi ? 'bg-success border-success' : 'border-base-600'
                        }`}
                        aria-label="Marquer comme bonne réponse"
                      />
                      <input
                        value={opt}
                        onChange={(e) => updateOption(q.id, oi, e.target.value)}
                        placeholder={`Option ${oi + 1}`}
                        className="flex-1 bg-base-800 border border-base-600 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric-500 outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={addQuestion} className="flex items-center gap-1 text-xs text-electric-400 hover:underline mt-3">
            <Plus className="w-3.5 h-3.5" />
            Ajouter une question
          </button>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full mt-5 text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
          >
            Créer le quiz
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

function QuizPlayer({ quiz, onClose, onFinish }: { quiz: Quiz; onClose: () => void; onFinish: (score: number) => void }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const question = quiz.questions[step];
  const isLast = step === quiz.questions.length - 1;

  const handleNext = () => {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);

    if (isLast) {
      const correct = nextAnswers.filter((a, i) => a === quiz.questions[i].correctIndex).length;
      const score = Math.round((correct / quiz.questions.length) * 100);
      onFinish(score);
      setFinished(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const correctCount = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;
  const finalScore = finished ? Math.round((correctCount / quiz.questions.length) * 100) : 0;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="glass-card w-full max-w-md p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-semibold text-white">{quiz.title}</h3>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!finished ? (
            <>
              <p className="text-xs text-muted mb-3">
                Question {step + 1} / {quiz.questions.length}
              </p>
              <p className="text-white text-base mb-4">{question.question}</p>
              <div className="space-y-2 mb-5">
                {question.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setSelected(oi)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      selected === oi
                        ? 'bg-electric-500/20 border-electric-500 text-white'
                        : 'border-base-600 text-muted hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={selected === null}
                className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
              >
                {isLast ? 'Terminer' : 'Question suivante'}
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              {finalScore >= 50 ? (
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
              ) : (
                <XCircle className="w-12 h-12 text-danger mx-auto mb-3" />
              )}
              <p className="text-3xl font-display font-semibold text-white mb-1">{finalScore}%</p>
              <p className="text-sm text-muted mb-5">
                {correctCount} / {quiz.questions.length} bonnes réponses
              </p>
              <button
                onClick={onClose}
                className="text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-onAccent font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}

import { useConfirm } from '@/hooks/useConfirm';

export function QuizSection({ subjectId }: { subjectId: string }) {
  const { quizzes, addQuiz, deleteQuiz, recordAttempt } = useQuizzes(subjectId);
  const [building, setBuilding] = useState(false);
  const [playing, setPlaying] = useState<Quiz | null>(null);
  const { confirm, dialog } = useConfirm();

  const handleDeleteQuiz = async (id: string) => {
    if (!(await confirm('Supprimer ce quiz ? Cette action est irréversible.'))) return;
    deleteQuiz(id);
  };

  return (
    <div className="glass-card p-5">
      {dialog}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted">Quiz ({quizzes.length})</h3>
        <button onClick={() => setBuilding(true)} className="flex items-center gap-1 text-xs text-electric-400 hover:underline">
          <Plus className="w-3.5 h-3.5" />
          Nouveau quiz
        </button>
      </div>

      {quizzes.length === 0 && <p className="text-sm text-muted">Aucun quiz pour cette matière.</p>}
      <ul className="space-y-2">
        {quizzes.map((q) => (
          <li key={q.id} className="flex items-center justify-between bg-base-800/60 rounded-lg px-3 py-2 group">
            <div>
              <p className="text-sm text-white">{q.title}</p>
              <p className="text-xs text-muted">{q.questions.length} question{q.questions.length > 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPlaying(q)}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-electric-500/20 text-electric-400 hover:bg-electric-500/30 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Faire le quiz
              </button>
              <button onClick={() => handleDeleteQuiz(q.id)} className="opacity-40 group-hover:opacity-100 text-muted hover:text-danger transition-opacity p-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {building && (
        <QuizBuilder
          subjectId={subjectId}
          onClose={() => setBuilding(false)}
          onCreate={(quiz) => {
            addQuiz(quiz);
            setBuilding(false);
          }}
        />
      )}

      {playing && (
        <QuizPlayer
          quiz={playing}
          onClose={() => setPlaying(null)}
          onFinish={(score) =>
            recordAttempt({ id: crypto.randomUUID(), quizId: playing.id, score, completedAt: new Date().toISOString() })
          }
        />
      )}
    </div>
  );
}
