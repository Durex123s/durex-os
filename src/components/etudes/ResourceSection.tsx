import { useState } from 'react';
import { Plus, Check, Trash2, FileText, Video, BookOpen, ClipboardList, GraduationCap, NotebookPen } from 'lucide-react';
import type { ResourceType, StudyResource } from '@/types';
import { RESOURCE_TYPE_LABELS } from '@/types';
import { useResources } from '@/hooks/useSubjects';
import { useConfirm } from '@/hooks/useConfirm';

const TYPE_ICONS: Record<ResourceType, typeof FileText> = {
  note: NotebookPen,
  cours: BookOpen,
  pdf: FileText,
  video: Video,
  exercice: ClipboardList,
  devoir: ClipboardList,
  examen: GraduationCap,
};

// Les types "trackables" affichent une case à cocher (fait/pas fait) ;
// note/cours/pdf/video sont plutôt de la lecture, sans notion de complétion.
const TRACKABLE: ResourceType[] = ['exercice', 'devoir', 'examen'];

export function ResourceSection({ subjectId, type }: { subjectId: string; type: ResourceType }) {
  const { byType, addResource, toggleDone, deleteResource } = useResources(subjectId);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const items = byType(type);
  const Icon = TYPE_ICONS[type];
  const trackable = TRACKABLE.includes(type);
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string) => {
    if (!(await confirm('Supprimer cette ressource ?'))) return;
    deleteResource(id);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    const resource: StudyResource = {
      id: crypto.randomUUID(),
      subjectId,
      type,
      title: title.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };
    addResource(resource);
    setTitle('');
    setAdding(false);
  };

  return (
    <div className="glass-card p-5">
      {dialog}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Icon className="w-4 h-4" />
          <span>{RESOURCE_TYPE_LABELS[type]}</span>
          <span className="text-xs text-base-600">({items.length})</span>
        </div>
        <button onClick={() => setAdding(true)} className="text-muted hover:text-electric-400 transition-colors" aria-label="Ajouter">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {items.length === 0 && !adding && <p className="text-xs text-muted">Rien ici pour l'instant.</p>}

      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 group text-sm">
            {trackable && (
              <button
                onClick={() => toggleDone(item.id)}
                className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                  item.done ? 'bg-electric-500 border-electric-500' : 'border-base-600 hover:border-electric-400'
                }`}
                aria-label={item.done ? 'Marquer comme non fait' : 'Marquer comme fait'}
              >
                {item.done && <Check className="w-3 h-3 text-onAccent" />}
              </button>
            )}
            <span className={`flex-1 truncate ${item.done ? 'line-through text-muted' : 'text-white'}`}>{item.title}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-opacity"
              aria-label="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {adding && (
        <div className="flex gap-2 mt-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Titre..."
            autoFocus
            className="flex-1 bg-base-800 border border-base-600 rounded-lg px-3 py-1.5 text-sm text-white focus:border-electric-500 outline-none transition-colors"
          />
          <button
            onClick={handleAdd}
            className="text-xs px-3 py-1.5 rounded-lg bg-electric-500 hover:bg-electric-600 text-onAccent font-medium transition-colors"
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
}
