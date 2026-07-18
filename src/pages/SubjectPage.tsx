import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { useSubjects } from '@/hooks/useSubjects';
import { ResourceSection } from '@/components/etudes/ResourceSection';
import { FlashcardsSection } from '@/components/etudes/FlashcardsSection';
import { QuizSection } from '@/components/etudes/QuizSection';
import { ProgressStats } from '@/components/etudes/ProgressStats';
import { AttachmentManager } from '@/components/files/AttachmentManager';
import type { ResourceType } from '@/types';

const RESOURCE_TYPES: ResourceType[] = ['cours', 'note', 'pdf', 'video', 'exercice', 'devoir', 'examen'];

type Tab = 'ressources' | 'fichiers' | 'fiches' | 'quiz' | 'progression';
const TABS: { id: Tab; label: string }[] = [
  { id: 'ressources', label: 'Ressources' },
  { id: 'fichiers', label: 'Fichiers' },
  { id: 'fiches', label: 'Fiches de révision' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'progression', label: 'Progression' },
];

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { subjects } = useSubjects();
  const [tab, setTab] = useState<Tab>('ressources');

  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return <p className="text-muted text-sm">Chargement de la matière...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/etudes" className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${subject.color}22`, color: subject.color }}>
          {subject.name[0]}
        </div>
        <h1 className="font-display text-2xl font-semibold text-white">{subject.name}</h1>
      </div>

      <div className="flex gap-1 bg-base-800 rounded-xl p-1 w-fit overflow-x-auto max-w-full">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs transition-colors',
              tab === t.id ? 'bg-electric-500 text-onAccent font-medium' : 'text-muted hover:text-white'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'ressources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESOURCE_TYPES.map((type) => (
            <ResourceSection key={type} subjectId={subject.id} type={type} />
          ))}
        </div>
      )}

      {tab === 'fichiers' && (
        <AttachmentManager
          subjectId={subject.id}
          dropLabel="Touche pour importer un PDF ou un Word de cette matière"
          emptyLabel="Aucun fichier importé pour cette matière — touche la zone ci-dessus pour ajouter un PDF ou un Word."
        />
      )}

      {tab === 'fiches' && <FlashcardsSection subjectId={subject.id} />}
      {tab === 'quiz' && <QuizSection subjectId={subject.id} />}
      {tab === 'progression' && <ProgressStats subjectId={subject.id} color={subject.color} />}
    </div>
  );
}
