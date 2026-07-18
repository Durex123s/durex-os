import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { Task } from '@/types';
import { scheduleTaskReminder, cancelTaskReminder } from '@/services/notifications';

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), [], []);

  async function addTask(task: Task) {
    await db.tasks.add(task);
    if (task.dueTime) {
      await scheduleTaskReminder(task.id, task.title, task.dueTime);
    }
  }

  async function deleteTask(id: string) {
    await db.tasks.delete(id);
    await cancelTaskReminder(id);
  }

  async function toggleDone(id: string) {
    const t = await db.tasks.get(id);
    if (!t) return;
    const done = !t.done;
    await db.tasks.put({ ...t, done });
    if (done) {
      await cancelTaskReminder(id);
    } else if (t.dueTime) {
      await scheduleTaskReminder(id, t.title, t.dueTime);
    }
  }

  async function updateTask(id: string, changes: Partial<Task>) {
    const t = await db.tasks.get(id);
    if (!t) return;
    const updated = { ...t, ...changes };
    await db.tasks.put(updated);
    if (updated.dueTime && !updated.done) {
      await scheduleTaskReminder(id, updated.title, updated.dueTime);
    } else {
      await cancelTaskReminder(id);
    }
  }

  return { tasks: tasks ?? [], addTask, deleteTask, toggleDone, updateTask };
}
