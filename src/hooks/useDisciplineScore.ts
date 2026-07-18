import { useHabits } from './useHabits';
import { useTodayPomodoroTotals } from './usePomodoro';

// Score sur 100 = 60% taux de complétion des habitudes du jour + 40% temps
// productif (étude + travail) aujourd'hui, plafonné à 3h pour la part max.
export function useDisciplineScore() {
  const { habits } = useHabits();
  const totals = useTodayPomodoroTotals();

  const habitRate = habits.length ? habits.filter((h) => h.doneToday).length / habits.length : 0;
  const productiveMinutes = totals.etude + totals.travail;
  const productiveRate = Math.min(1, productiveMinutes / 180);

  const score = Math.round(habitRate * 60 + productiveRate * 40);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  return { score, bestStreak, productiveMinutes, restMinutes: totals.repos };
}
