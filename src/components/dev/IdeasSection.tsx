import { useState } from 'react';
import { Plus, Trash2, Lightbulb } from 'lucide-react';
import { useDevIdeas } from '@/hooks/useDevSpace';
import { useConfirm } from '@/hooks/useConfirm';

export function IdeasSection() {
  const { ideas, addIdea, deleteIdea } = useDevIdeas();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string) => {
    if (!(await confirm('Supprimer cette idée ?'))) return;
    deleteIdea(id);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    addIdea({ title: title.trim(), note: note.trim() || undefined });
    setTitle('');
    setNote('');
  };

  return (
    <div className="space-y-4">
      {dialog}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nouvelle idée..."
          className="flex-1 bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Détail (optionnel)"
          className="flex-1 bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!title.trim()}
          className="flex items-center justify-center gap-1.5 bg-electric-500 hover:bg-electric-600 disabled:opacity-40 text-onAccent font-medium text-sm px-3 py-2 rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ideas.length === 0 && (
          <p className="text-sm text-muted col-span-full text-center py-6">
            Aucune idée notée — écris-la ci-dessus avant de l'oublier.
          </p>
        )}
        {ideas.map((idea) => (
          <div key={idea.id} className="glass-card p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric-500/15 text-electric-400 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{idea.title}</p>
              {idea.note && <p className="text-xs text-muted mt-0.5">{idea.note}</p>}
            </div>
            <button onClick={() => handleDelete(idea.id)} className="text-muted hover:text-danger transition-colors shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
