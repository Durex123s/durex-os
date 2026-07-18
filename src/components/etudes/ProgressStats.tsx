import { TrendingUp } from 'lucide-react';
import { useSubjectProgress } from '@/hooks/useQuizzes';

export function ProgressStats({ subjectId, color }: { subjectId: string; color: string }) {
  const progress = useSubjectProgress(subjectId);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted mb-4">
        <TrendingUp className="w-4 h-4" />
        <span>Progression</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted mb-1">Exercices / devoirs / examens</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-base-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress?.resourceProgress ?? 0}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs text-white tabular-nums">{progress?.resourceProgress ?? 0}%</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted mb-1">Score moyen aux quiz</p>
          <p className="text-lg font-display font-semibold text-white">
            {progress?.avgQuizScore !== null && progress?.avgQuizScore !== undefined ? `${progress.avgQuizScore}%` : '—'}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-4 text-xs text-muted">
        <span>{progress?.totalResources ?? 0} ressources</span>
        <span>{progress?.totalQuizzes ?? 0} quiz</span>
      </div>
    </div>
  );
}
