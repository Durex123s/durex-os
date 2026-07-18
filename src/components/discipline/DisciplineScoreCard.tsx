import { Flame, Briefcase, Coffee, BookOpen } from 'lucide-react';
import { useDisciplineScore } from '@/hooks/useDisciplineScore';
import { useTodayPomodoroTotals } from '@/hooks/usePomodoro';

function fmtMin(m: number) {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h > 0 ? `${h}h${r.toString().padStart(2, '0')}` : `${r}min`;
}

export function DisciplineScoreCard() {
  const { score, bestStreak } = useDisciplineScore();
  const totals = useTodayPomodoroTotals();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-full border-2 border-electric-500 flex items-center justify-center font-display font-semibold text-xl shrink-0">
          {score}
        </div>
        <div>
          <p className="text-sm text-white">Score de discipline</p>
          <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
            <Flame className="w-3 h-3 text-warning" />
            Meilleure série : {bestStreak} jours
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-base-800/60 rounded-lg py-2.5">
          <BookOpen className="w-3.5 h-3.5 mx-auto mb-1 text-muted" />
          <p className="text-xs text-muted">Étude</p>
          <p className="text-sm text-white font-medium">{fmtMin(totals.etude)}</p>
        </div>
        <div className="bg-base-800/60 rounded-lg py-2.5">
          <Briefcase className="w-3.5 h-3.5 mx-auto mb-1 text-muted" />
          <p className="text-xs text-muted">Travail</p>
          <p className="text-sm text-white font-medium">{fmtMin(totals.travail)}</p>
        </div>
        <div className="bg-base-800/60 rounded-lg py-2.5">
          <Coffee className="w-3.5 h-3.5 mx-auto mb-1 text-muted" />
          <p className="text-xs text-muted">Repos</p>
          <p className="text-sm text-white font-medium">{fmtMin(totals.repos)}</p>
        </div>
      </div>
    </div>
  );
}
