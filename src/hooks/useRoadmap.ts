import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { RoadmapMonth } from '@/types';

const SEED: { phase: number; monthLabel: string; title: string }[] = [
  { phase: 1, monthLabel: 'Mois 1', title: 'Définir le projet et les destinations' },
  { phase: 1, monthLabel: 'Mois 2', title: 'Commencer les tests de langue' },
  { phase: 1, monthLabel: 'Mois 3', title: 'Rassembler les documents administratifs' },
  { phase: 2, monthLabel: 'Mois 4', title: 'Préparer le dossier de candidature' },
  { phase: 2, monthLabel: 'Mois 5', title: 'Renforcer le niveau de langue' },
  { phase: 2, monthLabel: 'Mois 6', title: "Constituer l'epargne et le budget" },
  { phase: 3, monthLabel: 'Mois 7', title: 'Envoyer les candidatures' },
  { phase: 3, monthLabel: 'Mois 8', title: 'Suivre les réponses et entretiens' },
  { phase: 3, monthLabel: 'Mois 9', title: 'Finaliser le choix de destination' },
  { phase: 4, monthLabel: 'Mois 10', title: 'Démarches visa et logement' },
  { phase: 4, monthLabel: 'Mois 11', title: 'Organiser le départ' },
  { phase: 4, monthLabel: 'Mois 12', title: 'Départ' },
];

let seeding = false;

export function useRoadmap() {
  const months: RoadmapMonth[] | undefined = useLiveQuery(() => db.roadmap.toArray(), [], []);

  if (months && months.length === 0 && !seeding) {
    seeding = true;
    (async () => {
      for (const m of SEED) {
        await db.roadmap.add({ id: crypto.randomUUID(), ...m, done: false });
      }
      seeding = false;
    })();
  }

  async function toggleMonth(id: string) {
    const m = await db.roadmap.get(id);
    if (!m) return;
    await db.roadmap.put({ ...m, done: !m.done });
  }

  const list = months ?? [];
  const progress = list.length ? Math.round((list.filter((m) => m.done).length / list.length) * 100) : 0;

  return { months: list, toggleMonth, progress };
}
