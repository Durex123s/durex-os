import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { scheduleWeeklySavingsReminder, cancelWeeklySavingsReminder } from '@/services/notifications';
import type { Transaction, SavingsGoal } from '@/types';
import { useAppSettings } from './useAppSettings';
import { DEFAULT_SAVINGS_PERCENT } from '@/components/parametres/SavingsPercentSection';

function startOfDayISO(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
function startOfWeekISO(d: Date) {
  const r = startOfDayISO(d);
  const day = (r.getDay() + 6) % 7; // lundi = 0
  r.setDate(r.getDate() - day);
  return r;
}
function startOfMonthISO(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export type Period = 'jour' | 'semaine' | 'mois' | 'total';

export function useTransactions(period: Period = 'total') {
  const { get } = useAppSettings();
  const savingsPercent = Number(get('savingsPercent') ?? DEFAULT_SAVINGS_PERCENT);
  const transactions = useLiveQuery(
    () => db.transactions.orderBy('date').reverse().toArray(),
    [],
    []
  );

  async function addTransaction(t: Transaction) {
    await db.transactions.add(t);
  }
  async function deleteTransaction(id: string) {
    await db.transactions.delete(id);
  }
  async function updateTransaction(t: Transaction) {
    await db.transactions.put(t);
  }

  const now = new Date();
  const dayStart = startOfDayISO(now);
  const weekStart = startOfWeekISO(now);
  const monthStart = startOfMonthISO(now);

  const list = transactions ?? [];
  const sumSince = (start: Date, type: 'revenu' | 'depense') =>
    list.filter((t) => t.type === type && new Date(t.date) >= start).reduce((s, t) => s + t.amount, 0);

  const totalRevenus = list.filter((t) => t.type === 'revenu').reduce((s, t) => s + t.amount, 0);
  const totalDepenses = list.filter((t) => t.type === 'depense').reduce((s, t) => s + t.amount, 0);
  const solde = totalRevenus - totalDepenses;

  const periodStart = { jour: dayStart, semaine: weekStart, mois: monthStart, total: null as Date | null }[period];
  const periodRevenus = periodStart ? sumSince(periodStart, 'revenu') : totalRevenus;
  const periodDepenses = periodStart ? sumSince(periodStart, 'depense') : totalDepenses;

  // Budgets automatiques : basés sur la moyenne des revenus journaliers historiques
  // (avant aujourd'hui). Le plafond reste donc fixe même si plusieurs revenus tombent
  // le même jour ; il ne se met à jour que d'un jour sur l'autre.
  const historyWindowStart = new Date(dayStart);
  historyWindowStart.setDate(historyWindowStart.getDate() - 30);
  const earliestTxDate = list.length
    ? new Date(Math.min(...list.map((t) => new Date(t.date).getTime())))
    : dayStart;
  const budgetWindowStart = earliestTxDate > historyWindowStart ? earliestTxDate : historyWindowStart;
  const budgetWindowDays = Math.max(1, Math.round((dayStart.getTime() - budgetWindowStart.getTime()) / 86400000));
  const historicalRevenus = list
    .filter((t) => t.type === 'revenu' && new Date(t.date) >= budgetWindowStart && new Date(t.date) < dayStart)
    .reduce((s, t) => s + t.amount, 0);
  // Avant d'avoir un historique (tout premier jour d'usage), on se base sur les revenus du jour même.
  const avgDailyIncome = historicalRevenus > 0 ? historicalRevenus / budgetWindowDays : sumSince(dayStart, 'revenu');

  const dailyBudget = Math.round(avgDailyIncome * (savingsPercent / 100));
  const weeklyBudget = dailyBudget * 7;
  const monthlyBudget = dailyBudget * 30;

  const budgets = {
    day: { spent: sumSince(dayStart, 'depense'), limit: dailyBudget },
    week: { spent: sumSince(weekStart, 'depense'), limit: weeklyBudget },
    month: { spent: sumSince(monthStart, 'depense'), limit: monthlyBudget },
  };

  // Rythme d'épargne moyen sur les 30 derniers jours (ou depuis la première transaction si plus récente).
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const earliestDate = list.length
    ? new Date(Math.min(...list.map((t) => new Date(t.date).getTime())))
    : now;
  const windowStart = earliestDate > thirtyDaysAgo ? earliestDate : thirtyDaysAgo;
  const windowDays = Math.max(1, Math.round((now.getTime() - windowStart.getTime()) / 86400000));
  const windowRevenus = sumSince(windowStart, 'revenu');
  const windowDepenses = sumSince(windowStart, 'depense');
  const avgDailySavings = (windowRevenus - windowDepenses) / windowDays;

  const todayRevenus = sumSince(dayStart, 'revenu');
  const todayDepenses = sumSince(dayStart, 'depense');
  const todayDisponible = todayRevenus - todayDepenses;

  const categoryBreakdown = Object.entries(
    list
      .filter((t) => t.type === 'depense')
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {})
  ).map(([category, amount]) => ({ category, amount }));

  return {
    transactions: list,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    solde,
    totalRevenus,
    totalDepenses,
    periodRevenus,
    periodDepenses,
    budgets,
    categoryBreakdown,
    avgDailySavings,
    todayDisponible,
  };
}

export function useSavingsGoals() {
  const goals = useLiveQuery(() => db.savingsGoals.toArray(), [], []);

  useEffect(() => {
    if (goals === undefined) return;
    if (goals.length > 0) {
      scheduleWeeklySavingsReminder();
    } else {
      cancelWeeklySavingsReminder();
    }
  }, [goals?.length]);

  async function addGoal(goal: SavingsGoal) {
    await db.savingsGoals.add(goal);
  }
  async function contribute(id: string, amount: number) {
    const g = await db.savingsGoals.get(id);
    if (g) await db.savingsGoals.put({ ...g, current: g.current + amount });
  }
  async function deleteGoal(id: string) {
    await db.savingsGoals.delete(id);
  }

  return { goals: goals ?? [], addGoal, contribute, deleteGoal };
}
