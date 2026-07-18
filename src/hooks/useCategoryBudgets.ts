import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { CategoryBudget, BudgetPeriod } from '@/types';

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

export function useCategoryBudgets() {
  const budgets = useLiveQuery(() => db.categoryBudgets.toArray(), [], []);
  const transactions = useLiveQuery(() => db.transactions.toArray(), [], []);

  const now = new Date();
  const starts: Record<BudgetPeriod, Date> = {
    jour: startOfDayISO(now),
    semaine: startOfWeekISO(now),
    mois: startOfMonthISO(now),
  };

  const list = transactions ?? [];

  function spentFor(category: string, period: BudgetPeriod) {
    const start = starts[period];
    return list
      .filter((t) => t.type === 'depense' && t.category === category && new Date(t.date) >= start)
      .reduce((s, t) => s + t.amount, 0);
  }

  const withSpent = (budgets ?? []).map((b) => ({
    ...b,
    spent: spentFor(b.category, b.period),
  }));

  async function addBudget(category: string, limit: number, period: BudgetPeriod) {
    await db.categoryBudgets.add({ id: crypto.randomUUID(), category, limit, period });
  }
  async function updateBudget(b: CategoryBudget) {
    await db.categoryBudgets.put(b);
  }
  async function deleteBudget(id: string) {
    await db.categoryBudgets.delete(id);
  }

  return {
    budgets: withSpent,
    addBudget,
    updateBudget,
    deleteBudget,
    loaded: budgets !== undefined,
  };
}
