import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { Skill } from '@/types';

export function useSkills() {
  const skills: Skill[] | undefined = useLiveQuery(
    () => db.skills.toArray().then((s) => s.sort((a, b) => a.createdAt.localeCompare(b.createdAt))),
    [],
    []
  );

  async function addSkill(name: string, level = 1) {
    await db.skills.add({
      id: crypto.randomUUID(),
      name,
      level: Math.min(10, Math.max(0, level)),
      createdAt: new Date().toISOString(),
    });
  }

  async function changeLevel(id: string, delta: number) {
    const skill = await db.skills.get(id);
    if (!skill) return;
    await db.skills.put({ ...skill, level: Math.min(10, Math.max(0, skill.level + delta)) });
  }

  async function deleteSkill(id: string) {
    await db.skills.delete(id);
  }

  const list = skills ?? [];
  const averageLevel = list.length ? list.reduce((sum, s) => sum + s.level, 0) / list.length : 0;

  return { skills: list, addSkill, changeLevel, deleteSkill, averageLevel };
}
