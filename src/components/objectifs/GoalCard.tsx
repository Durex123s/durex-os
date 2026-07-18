import { Trash2, Plus, Zap } from 'lucide-react';
import type { AppGoal } from '@/types';
import { useConfirm } from '@/hooks/useConfirm';

interface GoalCardProps {
  goal: AppGoal & { current: number; progress: number };
  onLog: (amount: number) => void;
  onDelete: () => void;
}

export function GoalCard({ goal, onLog, onDelete }: GoalCardProps) {
  const isAuto = goal.autoSource !== null;
  const { confirm, dialog } = useConfirm();

  const handleDelete = async () => {
    if (!(await confirm(`Supprimer l'objectif « ${goal.title} » ?`))) return;
    onDelete();
  };

  return (
    <div className="glass-card p-5 group">
      {dialog}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-medium text-white">{goal.title}</h3>
            {isAuto && (
              <span title="Suivi automatique">
                <Zap className="w-3 h-3 text-electric-400" />
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {goal.current.toLocaleString('fr-FR')} / {goal.target.toLocaleString('fr-FR')} {goal.unit}
            {goal.mode === 'quotidien' ? " aujourd'hui" : ''}
          </p>
        </div>
        <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-opacity">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-1.5 rounded-full bg-base-700 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${goal.progress >= 100 ? 'bg-success' : 'bg-electric-500'}`}
          style={{ width: `${goal.progress}%` }}
        />
      </div>

      {!isAuto && (
        <button
          onClick={() => onLog(1)}
          className="flex items-center gap-1 text-xs text-electric-400 hover:underline"
        >
          <Plus className="w-3 h-3" />
          {goal.mode === 'quotidien' ? "Marquer comme fait aujourd'hui" : 'Ajouter une contribution'}
        </button>
      )}
      {isAuto && <p className="text-[11px] text-muted">Suivi automatique depuis {goal.autoSource === 'epargne' ? 'Finances' : 'Discipline (Pomodoro)'}</p>}
    </div>
  );
}
