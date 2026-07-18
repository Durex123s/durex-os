import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { Habit } from '@/types';
import { scheduleHabitReminder, cancelHabitReminder } from '@/services/notifications';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  if (!set.has(todayISO())) cursor.setDate(cursor.getDate() - 1);

  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useHabits() {
  const habits = useLiveQuery(() => db.habits.toArray(), [], []);

  async function addHabit(habit: Habit) {
    await db.habits.add(habit);
    if (habit.reminderTime) {
      await scheduleHabitReminder(habit.id, habit.name, habit.reminderTime);
    }
  }

  async function deleteHabit(id: string) {
    await db.habits.delete(id);
    await cancelHabitReminder(id);
  }

  async function toggleToday(id: string) {
    const h = await db.habits.get(id);
    if (!h) return;
    const today = todayISO();
    const completedDates = h.completedDates.includes(today)
      ? h.completedDates.filter((d) => d !== today)
      : [...h.completedDates, today];
    await db.habits.put({ ...h, completedDates });
  }

  async function setReminder(id: string, time: string | undefined) {
    const h = await db.habits.get(id);
    if (!h) return;
    await db.habits.put({ ...h, reminderTime: time });
    if (time) {
      await scheduleHabitReminder(id, h.name, time);
    } else {
      await cancelHabitReminder(id);
    }
  }

  const list = (habits ?? []).map((h) => ({
    ...h,
    streak: computeStreak(h.completedDates),
    doneToday: h.completedDates.includes(todayISO()),
  }));

  return { habits: list, addHabit, deleteHabit, toggleToday, setReminder };
}
