import { DisciplineScoreCard } from '@/components/discipline/DisciplineScoreCard';
import { DisciplineStats } from '@/components/discipline/DisciplineStats';
import { BadgesShowcase } from '@/components/discipline/BadgesShowcase';
import { PomodoroTimer } from '@/components/discipline/PomodoroTimer';
import { HabitList } from '@/components/discipline/HabitList';
import { HabitCalendar } from '@/components/discipline/HabitCalendar';

export function Discipline() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Discipline</h1>
        <p className="text-muted text-sm mt-1">Habitudes, Pomodoro, statistiques et récompenses.</p>
      </div>

      <DisciplineStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DisciplineScoreCard />
        <PomodoroTimer />
        <HabitList />
        <HabitCalendar />
      </div>

      <BadgesShowcase />
    </div>
  );
}
