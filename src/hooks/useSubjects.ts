import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { Subject, StudyResource, ResourceType } from '@/types';
import { scheduleResourceReminder, cancelResourceReminder } from '@/services/notifications';

export function useSubjects() {
  const subjects = useLiveQuery(
    () => db.subjects.toArray().then((s) => s.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))),
    [],
    []
  );

  async function addSubject(subject: Subject) {
    await db.subjects.add(subject);
  }
  async function deleteSubject(id: string) {
    await db.subjects.delete(id);
    await db.resources.where('subjectId').equals(id).delete();
    await db.flashcards.where('subjectId').equals(id).delete();
    await db.quizzes.where('subjectId').equals(id).delete();
  }

  return { subjects: subjects ?? [], addSubject, deleteSubject };
}

export function useResources(subjectId: string) {
  const resources = useLiveQuery(
    () => db.resources.where('subjectId').equals(subjectId).toArray(),
    [subjectId],
    []
  );

  async function addResource(resource: StudyResource) {
    await db.resources.add(resource);
    if (resource.dueDate && !resource.done) {
      await scheduleResourceReminder(resource.id, resource.title, resource.dueDate, resource.subjectId);
    }
  }
  async function toggleDone(id: string) {
    const r = await db.resources.get(id);
    if (!r) return;
    const updated = { ...r, done: !r.done };
    await db.resources.put(updated);
    if (updated.done) {
      await cancelResourceReminder(id);
    } else if (updated.dueDate) {
      await scheduleResourceReminder(id, updated.title, updated.dueDate, updated.subjectId);
    }
  }
  async function deleteResource(id: string) {
    await db.resources.delete(id);
    await cancelResourceReminder(id);
  }

  const byType = (type: ResourceType) => (resources ?? []).filter((r) => r.type === type);

  return { resources: resources ?? [], addResource, toggleDone, deleteResource, byType };
}
