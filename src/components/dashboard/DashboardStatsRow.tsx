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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </div>
          <p className="font-display text-2xl font-semibold text-white">{s.value}</p>
          <p className="text-xs text-electric-400 mt-0.5">{s.hint}</p>
        </div>
      ))}
    </div>
  );
}
