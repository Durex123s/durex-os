import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { Flame, Timer, CalendarCheck } from 'lucide-react';
import { computeBestStreak, habitDaysThisWeek, pomodoroMinutesThisWeek } from '@/utils/discipline';

function StatBlock({ icon: Icon, value, label }: { icon: typeof Flame; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-3">
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
        <StatBlock icon={Flame} value={`${bestStreakOverall}j`} label="Meilleur streak" />
        <StatBlock icon={CalendarCheck} value={`${activeDaysThisWeek}/7`} label="Jours actifs" />
        <StatBlock icon={Timer} value={`${pomoMinutesWeek}min`} label="Pomodoro (semaine)" />
      </div>
    </div>
  );
}
