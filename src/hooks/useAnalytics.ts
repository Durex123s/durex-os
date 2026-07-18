import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';

export type AnalyticsRange = 7 | 30;

function lastNDays(n: number, endDate = new Date()) {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

function dayLabel(d: Date, range: AnalyticsRange) {
  return range === 7
    ? d.toLocaleDateString('fr-FR', { weekday: 'short' })
    : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// null = pas de comparaison significative (période précédente à 0)
function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function useAnalytics(range: AnalyticsRange = 7) {
  return useLiveQuery(async () => {
    const days = lastNDays(range);
    const rangeStart = days[0];
    const previousEnd = new Date(rangeStart);
    previousEnd.setMilliseconds(-1);
    const previousStart = new Date(rangeStart);
    previousStart.setDate(previousStart.getDate() - range);

    const [transactions, sessions, habits] = await Promise.all([
      db.transactions.toArray(),
      db.pomodoroSessions.toArray(),
      db.habits.toArray(),
    ]);

    const expensesPerDay = days.map((d) => ({
      label: dayLabel(d, range),
      value: transactions
        .filter((t) => t.type === 'depense' && isSameDay(new Date(t.date), d))
        .reduce((s, t) => s + t.amount, 0),
    }));

    const incomePerDay = days.map((d) => ({
      label: dayLabel(d, range),
      value: transactions
        .filter((t) => t.type === 'revenu' && isSameDay(new Date(t.date), d))
        .reduce((s, t) => s + t.amount, 0),
    }));

    const combinedPerDay = days.map((d, i) => ({
      label: dayLabel(d, range),
      depense: expensesPerDay[i].value,
      revenu: incomePerDay[i].value,
    }));

    const studyPerDay = days.map((d) => ({
      label: dayLabel(d, range),
      value: sessions
        .filter((s) => s.type === 'etude' && isSameDay(new Date(s.completedAt), d))
        .reduce((sum, s) => sum + s.durationMinutes, 0),
    }));

    const habitRatePerDay = days.map((d) => {
      const iso = d.toISOString().slice(0, 10);
      const done = habits.filter((h) => h.completedDates.includes(iso)).length;
      return { label: dayLabel(d, range), value: habits.length ? Math.round((done / habits.length) * 100) : 0 };
    });

    const totalExpensesWeek = expensesPerDay.reduce((s, d) => s + d.value, 0);
    const totalIncomeWeek = incomePerDay.reduce((s, d) => s + d.value, 0);
    const totalStudyWeek = studyPerDay.reduce((s, d) => s + d.value, 0);
    const avgHabitRate = Math.round(habitRatePerDay.reduce((s, d) => s + d.value, 0) / range);

    const inPreviousRange = (dateStr: string) => {
      const d = new Date(dateStr);
      return d >= previousStart && d <= previousEnd;
    };

    const prevExpenses = transactions
      .filter((t) => t.type === 'depense' && inPreviousRange(t.date))
      .reduce((s, t) => s + t.amount, 0);
    const prevIncome = transactions
      .filter((t) => t.type === 'revenu' && inPreviousRange(t.date))
      .reduce((s, t) => s + t.amount, 0);
    const prevStudy = sessions
      .filter((s) => s.type === 'etude' && inPreviousRange(s.completedAt))
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    const prevDays = lastNDays(range, previousEnd);
    const prevHabitRates = prevDays.map((d) => {
      const iso = d.toISOString().slice(0, 10);
      const done = habits.filter((h) => h.completedDates.includes(iso)).length;
      return habits.length ? Math.round((done / habits.length) * 100) : 0;
    });
    const prevAvgHabitRate = Math.round(prevHabitRates.reduce((s, v) => s + v, 0) / range);

    return {
      range,
      expensesPerDay,
      incomePerDay,
      combinedPerDay,
      studyPerDay,
      habitRatePerDay,
      totalExpensesWeek,
      totalIncomeWeek,
      totalStudyWeek,
      avgHabitRate,
      comparison: {
        expenses: percentChange(totalExpensesWeek, prevExpenses),
        income: percentChange(totalIncomeWeek, prevIncome),
        study: percentChange(totalStudyWeek, prevStudy),
        habitRate: percentChange(avgHabitRate, prevAvgHabitRate),
      },
    };
  }, [range]);
}
