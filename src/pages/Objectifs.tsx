import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { GoalCard } from '@/components/objectifs/GoalCard';
import { GoalModal } from '@/components/objectifs/GoalModal';
import { EmptyState } from '@/components/ui/EmptyState';

export function Objectifs() {
  const { goals, addGoal, deleteGoal, logProgress } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Objectifs</h1>
          <p className="text-muted text-sm mt-1">Suivi automatique quand c'est possible, manuel sinon.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Objectif
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Aucun objectif pour l'instant"
          description="Fixe-toi un objectif d'épargne, d'étude ou d'habitude — le suivi se fait automatiquement quand c'est possible."
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer un objectif
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} onLog={(amount) => logProgress(g.id, amount)} onDelete={() => deleteGoal(g.id)} />
          ))}
        </div>
      )}

      {modalOpen && <GoalModal onClose={() => setModalOpen(false)} onSave={addGoal} />}
    </div>
  );
}
