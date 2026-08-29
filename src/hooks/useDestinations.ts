import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { StudyDestination } from '@/types';

const DEFAULT_DOCUMENTS = [
  'Lettre de motivation',
  'CV',
  'Relevés de notes',
  'Test de langue',
  'Passeport',
  'Preuve de fonds',
];

function makeDocuments() {
  return DEFAULT_DOCUMENTS.map((label) => ({ id: crypto.randomUUID(), label, done: false }));
}

const SEED = [
  { country: 'Japon', priority: 1 },
  { country: 'Allemagne', priority: 2 },
  { country: 'Belgique', priority: 3 },
];

let seeding = false;

export function useDestinations() {
  const destinations: StudyDestination[] | undefined = useLiveQuery(
    () => db.destinations.toArray().then((d) => d.sort((a, b) => a.priority - b.priority)),
    [],
    []
  );

  if (destinations && destinations.length === 0 && !seeding) {
    seeding = true;
    (async () => {
      for (const s of SEED) {
        await db.destinations.add({
          id: crypto.randomUUID(),
          country: s.country,
          priority: s.priority,
          languageLevel: 0,
          documents: makeDocuments(),
          createdAt: new Date().toISOString(),
        });
      }
      seeding = false;
    })();
  }

  async function addDestination(country: string, priority: number) {
    await db.destinations.add({
      id: crypto.randomUUID(),
      country,
      priority,
      languageLevel: 0,
      documents: makeDocuments(),
      createdAt: new Date().toISOString(),
    });
  }

  async function toggleDocument(destId: string, docId: string) {
    const dest = await db.destinations.get(destId);
    if (!dest) return;
    const documents = dest.documents.map((doc) => (doc.id === docId ? { ...doc, done: !doc.done } : doc));
    await db.destinations.put({ ...dest, documents });
  }

  async function setLanguageLevel(destId: string, level: number) {
    const dest = await db.destinations.get(destId);
    if (!dest) return;
    await db.destinations.put({ ...dest, languageLevel: Math.min(100, Math.max(0, level)) });
  }

  async function deleteDestination(id: string) {
    await db.destinations.delete(id);
  }

  return { destinations: destinations ?? [], addDestination, toggleDocument, setLanguageLevel, deleteDestination };
}
