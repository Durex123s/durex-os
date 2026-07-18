import { useState } from 'react';
import { Github, Trash2, Plus, Check } from 'lucide-react';
import type { DevProject, ProjectStatus } from '@/types';
import { useDevProjects } from '@/hooks/useDevSpace';
import { Button } from '@/components/ui/Button';

const STATUS_LABELS: Record<ProjectStatus, string> = { idee: 'Idée', 'en-cours': 'En cours', termine: 'Terminé' };
// Couleurs alignées sur le thème plutôt que codées en dur :
// idee -> muted, en-cours -> electric (accent), termine -> success
const STATUS_CLASSES: Record<ProjectStatus, string> = {
  idee: 'text-muted border-base-600',
  'en-cours': 'text-electric-400 border-electric-500/40',
  termine: 'text-success border-success/40',
};

export function ProjectCard({ project }: { project: DevProject }) {
  const { deleteProject, addChecklistItem, toggleChecklistItem } = useDevProjects();
  const [addingItem, setAddingItem] = useState(false);
  const [itemText, setItemText] = useState('');

  const done = project.checklist.filter((i) => i.done).length;
  const progress = project.checklist.length ? Math.round((done / project.checklist.length) * 100) : 0;

  const handleAddItem = () => {
    if (!itemText.trim()) return;
    addChecklistItem(project.id, itemText.trim());
    setItemText('');
    setAddingItem(false);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white">{project.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_CLASSES[project.status]}`}>
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-electric-400 hover:underline mt-1"
            >
              <Github className="w-3 h-3" />
              {project.githubUrl.replace('https://github.com/', '')}
            </a>
          )}
        </div>
        <button onClick={() => deleteProject(project.id)} className="text-muted hover:text-danger transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {project.notes && <p className="text-xs text-muted mb-3">{project.notes}</p>}

      {project.checklist.length > 0 && (
        <div className="h-1.5 rounded-full bg-base-700 overflow-hidden mb-3">
          <div className="h-full rounded-full bg-electric-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      <ul className="space-y-1.5 mb-2">
        {project.checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <button
              onClick={() => toggleChecklistItem(project.id, item.id)}
              className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center ${
                item.done ? 'bg-electric-500 border-electric-500' : 'border-base-600'
              }`}
            >
              {item.done && <Check className="w-3 h-3 text-onAccent" />}
            </button>
            <span className={item.done ? 'line-through text-muted' : 'text-white'}>{item.text}</span>
          </li>
        ))}
      </ul>

      {addingItem ? (
        <div className="flex gap-2">
          <input
            value={itemText}
            onChange={(e) => setItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Tâche..."
            autoFocus
            className="flex-1 bg-base-800 border border-base-600 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric-500 outline-none transition-colors"
          />
          <Button size="sm" onClick={handleAddItem}>
            Ajouter
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setAddingItem(true)}>
          <Plus className="w-3 h-3" />
          Ajouter une tâche
        </Button>
      )}
    </div>
  );
}
