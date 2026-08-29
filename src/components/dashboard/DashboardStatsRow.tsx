import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { TrendingUp, CheckCircle2, Target, Flame } from 'lucide-react';
import { db } from '@/database/db';
import { useDisciplineScore } from '@/hooks/useDisciplineScore';
import { useGoals } from '@/hooks/useGoals';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

function qualifier(score: number) {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Très bon';
  if (score >= 40) return 'Bien';
  return 'À améliorer';
}

export function DashboardStatsRow() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const { score: disciplineScore } = useDisciplineScore();
  const { goals } = useGoals();

  const tasksDone = tasks.filter((t) => t.done).length;
  const taskRate = tasks.length > 0 ? Math.round((tasksDone / tasks.length) * 100) : 0;
  const productivite = useMemo(
    () => (tasks.length > 0 ? Math.round((taskRate + disciplineScore) / 2) : disciplineScore),
    [taskRate, disciplineScore, tasks.length]
  );
  const activeGoals = goals.filter((g) => g.progress < 100).length;

  const stats = [
    {
      icon: TrendingUp,
      label: 'Productivité',
      value: <AnimatedNumber value={productivite} format={(n) => `${n}%`} />,
      hint: qualifier(productivite),
    },
    {
      icon: CheckCircle2,
      label: 'Tâches',
      value: `${tasksDone}/${tasks.length}`,
      hint: tasks.length === 0 ? 'Aucune' : 'En cours',
    },
    {
      icon: Target,
      label: 'Objectifs',
      value: `${activeGoals}/${goals.length}`,
      hint: goals.length === 0 ? 'Aucun' : 'En progression',
    },
    {
      icon: Flame,
      label: 'Discipline',
      value: <AnimatedNumber value={disciplineScore} format={(n) => `${n}%`} />,
      hint: qualifier(disciplineScore),
    },
  ];

  function statusColor(index: number) {
    if (index === 0) return productivite >= 65 ? 'text-success' : productivite >= 40 ? 'text-warning' : 'text-danger';
    if (index === 3) return disciplineScore >= 65 ? 'text-success' : disciplineScore >= 40 ? 'text-warning' : 'text-danger';
    return 'text-electric-400';
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="glass-card p-2.5 sm:p-4 animate-fadeUp"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted min-w-0">
              <s.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{s.label}</span>
            </div>
            <span className={`status-dot w-1.5 h-1.5 rounded-full shrink-0 ${statusColor(i)} bg-current`} />
          </div>
          <p className="font-display text-base sm:text-2xl font-semibold text-white leading-tight">{s.value}</p>
          <p className="text-[10px] sm:text-xs text-electric-400 mt-0.5 truncate">{s.hint}</p>
        </div>
      ))}
    </div>
  );
}
