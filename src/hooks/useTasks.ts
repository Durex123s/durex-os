import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { Task } from '@/types';
import { useCharacter } from '@/store/useCharacter';

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), [], []);
  const react = useCharacter((s) => s.react);

  async function addTask(task: Task) {
    await db.tasks.add(task);
  }

  async function deleteTask(id: string) {
    await db.tasks.delete(id);
  }

  async function toggleDone(id: string) {
    const t = await db.tasks.get(id);
    if (!t) return;
    const done = !t.done;
    await db.tasks.put({ ...t, done });
    if (done) react('success');
  }

  async function updateTask(id: string, changes: Partial<Task>) {
    const t = await db.tasks.get(id);
    if (!t) return;
    await db.tasks.put({ ...t, ...changes });
  }

  return { tasks: tasks ?? [], addTask, deleteTask, toggleDone, updateTask };
}
