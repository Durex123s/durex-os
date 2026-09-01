import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { Flame, Timer, CalendarCheck } from 'lucide-react';
import { computeBestStreak, habitDaysThisWeek, pomodoroMinutesThisWeek } from '@/utils/discipline';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

function StatBlock({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: typeof Flame;
  value: React.ReactNode;
  label: string;
  delay: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-3 animate-fadeUp" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-9 h-9 rounded-xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center">
        <Icon className="w-4 h-4 text-electric-400" />
      </div>
      <p className="font-display text-xl font-semibold text-white tabular-nums">{value}</p>
      <p className="text-[11px] text-muted text-center leading-tight">{label}</p>
    </div>
  );
}

export function DisciplineStats() {
  const habits = useLiveQuery(() => db.habits.toArray(), [], []);
  const sessions = useLiveQuery(() => db.pomodoroSessions.toArray(), [], []);

  if (!habits || !sessions) return null;

  const bestStreakOverall = Math.max(0, ...habits.map((h) => computeBestStreak(h.completedDates)));
  const activeDaysThisWeek = habitDaysThisWeek(habits);
  const pomoMinutesWeek = pomodoroMinutesThisWeek(sessions);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white mb-1">Statistiques</h3>
      <p className="text-xs text-muted mb-2">Ta progression sur les 7 derniers jours.</p>
      <div className="grid grid-cols-3 divide-x divide-base-700">
        <StatBlock
          icon={Flame}
          value={<AnimatedNumber value={bestStreakOverall} format={(n) => `${n}j`} />}
          label="Meilleur streak"
          delay={0}
        />
        <StatBlock
          icon={CalendarCheck}
          value={<AnimatedNumber value={activeDaysThisWeek} format={(n) => `${n}/7`} />}
          label="Jours actifs"
          delay={70}
        />
        <StatBlock
          icon={Timer}
          value={<AnimatedNumber value={pomoMinutesWeek} format={(n) => `${n}min`} />}
          label="Pomodoro (semaine)"
          delay={140}
        />
      </div>
    </div>
  );
}
