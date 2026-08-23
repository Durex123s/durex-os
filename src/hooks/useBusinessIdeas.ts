import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { BusinessIdea, BusinessStatus } from '@/types';

export function useBusinessIdeas() {
  const ideas = useLiveQuery(
    () => db.businessIdeas.toArray().then((list) => list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    [],
    []
  );

  async function addIdea(name: string, status: BusinessStatus, clients: number, revenue: number) {
    await db.businessIdeas.add({
      id: crypto.randomUUID(),
      name,
      status,
      clients,
      revenue,
      createdAt: new Date().toISOString(),
    });
  }

  async function updateIdea(idea: BusinessIdea) {
    await db.businessIdeas.put(idea);
  }

  async function deleteIdea(id: string) {
    await db.businessIdeas.delete(id);
  }

  const list = ideas ?? [];
  const totalClients = list.reduce((sum, i) => sum + i.clients, 0);
  const totalRevenue = list.reduce((sum, i) => sum + i.revenue, 0);

  return { ideas: list, addIdea, updateIdea, deleteIdea, totalClients, totalRevenue };
}
