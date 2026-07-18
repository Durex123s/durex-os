import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';

export function useAppSettings() {
  const settings = useLiveQuery(() => db.settings.toArray(), [], []);

  const get = (key: string) => (settings ?? []).find((s) => s.key === key)?.value ?? null;

  async function set(key: string, value: string) {
    await db.settings.put({ key, value });
  }
  async function remove(key: string) {
    await db.settings.delete(key);
  }

  return { get, set, remove, loaded: settings !== undefined };
}
