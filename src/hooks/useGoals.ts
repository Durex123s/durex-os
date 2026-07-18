import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { AppGoal, GoalMode, GoalAutoSource } from '@/types';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function computeCurrent(goal: AppGoal): Promise<number> {
  if (goal.autoSource === 'epargne') {
    const savings = await db.savingsGoals.toArray();
    return savings.reduce((sum, s) => sum + s.current, 0);
  }
  if (goal.autoSource === 'pomodoro_etude' || goal.autoSource === 'pomodoro_travail') {
    const type = goal.autoSource === 'pomodoro_etude' ? 'etude' : 'travail';
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const sessions = await db.pomodoroSessions
      .where('completedAt')
      .aboveOrEqual(todayStart.toISOString())
      .toArray();
    const minutes = sessions.filter((s) => s.type === type).reduce((sum, s) => sum + s.durationMinutes, 0);
    return Math.round((minutes / 60) * 100) / 100;
  }
  // Suivi manuel
  const key = goal.mode === 'quotidien' ? todayISO() : 'total';
  return goal.manualLog[key] ?? 0;
}

export function useGoals() {
  const rawGoals = useLiveQuery(() => db.goals.toArray(), [], []);

  const goalsWithProgress = useLiveQuery(async () => {
    const list = rawGoals ?? [];
    const withCurrent = await Promise.all(
      list.map(async (g) => {
        const current = await computeCurrent(g);
        const progress = g.target > 0 ? Math.min(100, Math.round((current / g.target) * 100)) : 0;
        return { ...g, current, progress };
      })
    );
    return withCurrent;
  }, [rawGoals]);

  async function addGoal(params: { title: string; unit: string; target: number; mode: GoalMode; autoSource: GoalAutoSource }) {
    const goal: AppGoal = { id: crypto.randomUUID(), manualLog: {}, createdAt: new Date().toISOString(), ...params };
    await db.goals.add(goal);
  }

  async function deleteGoal(id: string) {
    await db.goals.delete(id);
  }

  // Incrémente la progression manuelle (uniquement pertinent si autoSource === null)
  async function logProgress(id: string, amount: number) {
    const goal = await db.goals.get(id);
    if (!goal || goal.autoSource) return;
    const key = goal.mode === 'quotidien' ? todayISO() : 'total';
    const manualLog = { ...goal.manualLog, [key]: (goal.manualLog[key] ?? 0) + amount };
    await db.goals.put({ ...goal, manualLog });
  }

  return { goals: goalsWithProgress ?? [], addGoal, deleteGoal, logProgress };
}
