import { Link } from 'react-router-dom';
import { WidgetCard } from './WidgetCard';
import { Flame, Briefcase, Coffee } from 'lucide-react';
import { useDisciplineScore } from '@/hooks/useDisciplineScore';
import { useTodayPomodoroTotals } from '@/hooks/usePomodoro';

function formatMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
}

export function DisciplineWidget() {
  const { score, bestStreak } = useDisciplineScore();
  const totals = useTodayPomodoroTotals();

  return (
    <WidgetCard
      title="Discipline"
      icon={<Flame className="w-4 h-4" />}
      action={
        <Link to="/discipline" className="text-xs text-electric-400 hover:underline">
          Voir tout
        </Link>
      }
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full border-2 border-electric-500 flex items-center justify-center font-display font-semibold text-lg shrink-0">
          {score}
        </div>
        <div>
          <p className="text-sm text-white">Score de discipline</p>
          <p className="text-xs text-muted">🔥 Meilleure série : {bestStreak} jours</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-base-800/60 rounded-lg py-2">
          <p className="text-xs text-muted">Étude</p>
          <p className="text-sm text-white font-medium">{formatMinutes(totals.etude)}</p>
        </div>
        <div className="bg-base-800/60 rounded-lg py-2">
          <Briefcase className="w-3 h-3 mx-auto mb-0.5 text-muted" />
          <p className="text-xs text-muted">Travail</p>
          <p className="text-sm text-white font-medium">{formatMinutes(totals.travail)}</p>
        </div>
        <div className="bg-base-800/60 rounded-lg py-2">
          <Coffee className="w-3 h-3 mx-auto mb-0.5 text-muted" />
          <p className="text-xs text-muted">Repos</p>
          <p className="text-sm text-white font-medium">{formatMinutes(totals.repos)}</p>
        </div>
      </div>
    </WidgetCard>
  );
}
