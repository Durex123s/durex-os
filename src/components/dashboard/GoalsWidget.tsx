import { Link } from 'react-router-dom';
import { WidgetCard } from './WidgetCard';
import { Target } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';

export function GoalsWidget() {
  const { goals } = useGoals();
  const shown = goals.slice(0, 3);

  return (
    <WidgetCard
      title="Objectifs"
      icon={<Target className="w-4 h-4" />}
      action={
        <Link to="/objectifs" className="text-xs text-electric-400 hover:underline">
          Voir tout
        </Link>
      }
    >
      {shown.length === 0 && <p className="text-sm text-muted">Aucun objectif pour l'instant.</p>}
      <div className="space-y-4">
        {shown.map((goal) => (
          <div key={goal.id}>
            <div className="flex flex-wrap justify-between gap-x-2 text-sm mb-1.5">
              <span className="text-white">{goal.title}</span>
              <span className="text-muted">
                {goal.current.toLocaleString('fr-FR')} / {goal.target.toLocaleString('fr-FR')} {goal.unit}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-base-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-electric-500 transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
