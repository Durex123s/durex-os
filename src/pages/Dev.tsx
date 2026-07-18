import { useState } from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { useDevProjects } from '@/hooks/useDevSpace';
import { ProjectCard } from '@/components/dev/ProjectCard';
import { ProjectModal } from '@/components/dev/ProjectModal';
import { SnippetsSection } from '@/components/dev/SnippetsSection';
import { IdeasSection } from '@/components/dev/IdeasSection';

type Tab = 'projets' | 'idees' | 'snippets';

export function Dev() {
  const { projects, addProject } = useDevProjects();
  const [tab, setTab] = useState<Tab>('projets');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Espace développeur</h1>
          <p className="text-muted text-sm mt-1">Projets, idées et snippets — ton carnet de dev.</p>
        </div>
        {tab === 'projets' && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Projet
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-base-800 rounded-xl p-1 w-fit overflow-x-auto max-w-full">
        {(['projets', 'idees', 'snippets'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs capitalize transition-colors',
              tab === t ? 'bg-electric-500 text-onAccent font-medium' : 'text-muted hover:text-white'
            )}
          >
            {t === 'projets' ? 'Projets' : t === 'idees' ? 'Idées' : 'Snippets'}
          </button>
        ))}
      </div>

      {tab === 'projets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 && <p className="text-sm text-muted">Aucun projet pour l'instant.</p>}
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
      {tab === 'idees' && <IdeasSection />}
      {tab === 'snippets' && <SnippetsSection />}

      {modalOpen && <ProjectModal onClose={() => setModalOpen(false)} onSave={addProject} />}
    </div>
  );
}
