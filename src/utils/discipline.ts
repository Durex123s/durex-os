import type { Habit, PomodoroSession } from '@/types';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function computeBestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const cur = new Date(sorted[i]);
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    current = diffDays === 1 ? current + 1 : 1;
    best = Math.max(best, current);
  }
  return best;
}

export function habitDaysThisWeek(habits: Habit[]): number {
  const days = new Set<string>();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);

  habits.forEach((h) => {
    h.completedDates.forEach((d) => {
      if (new Date(d) >= cutoff) days.add(d);
    });
  });
  return days.size;
}

export function pomodoroMinutesThisWeek(sessions: PomodoroSession[]): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);
  return sessions
    .filter((s) => new Date(s.completedAt) >= cutoff)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

export interface Badge {
  id: string;
  emoji: string;
  label: string;
  description: string;
  unlocked: boolean;
}

export function computeBadges(habits: Habit[], sessions: PomodoroSession[]): Badge[] {
  const bestStreakOverall = Math.max(0, ...habits.map((h) => computeBestStreak(h.completedDates)));
  const totalSessions = sessions.length;
  const activeHabits = habits.length;

  return [
    { id: 'first-habit', emoji: '🌱', label: 'Première habitude', description: 'Crée ta première habitude à suivre.', unlocked: activeHabits >= 1 },
    { id: 'multi-habits', emoji: '🌳', label: 'Multi-habitudes', description: 'Suis au moins 3 habitudes en même temps.', unlocked: activeHabits >= 3 },
    { id: 'streak-3', emoji: '🔥', label: 'Sur la bonne voie', description: '3 jours de suite sur une habitude.', unlocked: bestStreakOverall >= 3 },
    { id: 'streak-7', emoji: '🔥', label: 'Semaine parfaite', description: '7 jours de suite sur une habitude.', unlocked: bestStreakOverall >= 7 },
    { id: 'streak-30', emoji: '💎', label: 'Un mois de discipline', description: '30 jours de suite sur une habitude.', unlocked: bestStreakOverall >= 30 },
    { id: 'pomo-first', emoji: '⏱️', label: 'Premier Pomodoro', description: 'Termine ta première session.', unlocked: totalSessions >= 1 },
    { id: 'pomo-10', emoji: '⏱️', label: '10 sessions', description: '10 sessions Pomodoro terminées.', unlocked: totalSessions >= 10 },
    { id: 'pomo-50', emoji: '🏆', label: '50 sessions', description: '50 sessions Pomodoro terminées.', unlocked: totalSessions >= 50 },
    { id: 'pomo-100', emoji: '👑', label: '100 sessions', description: '100 sessions Pomodoro terminées — sérieux niveau.', unlocked: totalSessions >= 100 },
  ];
}

export { todayISO };
