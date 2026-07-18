import { useState } from 'react';
import { X } from 'lucide-react';
import type { ProjectStatus } from '@/types';
import { ModalPortal } from '@/components/ui/ModalPortal';

interface ProjectModalProps {
  onClose: () => void;
  onSave: (params: { name: string; status: ProjectStatus; githubUrl?: string; notes?: string }) => void;
}

export function ProjectModal({ onClose, onSave }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('idee');
  const [githubUrl, setGithubUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), status, githubUrl: githubUrl.trim() || undefined, notes: notes.trim() || undefined });
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Nouveau projet</h3>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du projet"
            autoFocus
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
          />
          <div className="flex gap-1.5 mb-3">
            {(['idee', 'en-cours', 'termine'] as ProjectStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 text-xs py-1.5 rounded-lg border capitalize transition-colors ${
                  status === s ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted'
                }`}
              >
                {s === 'idee' ? 'Idée' : s === 'en-cours' ? 'En cours' : 'Terminé'}
              </button>
            ))}
          </div>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="Lien GitHub (optionnel)"
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optionnel)"
            rows={2}
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors resize-none mb-5"
          />
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
          >
            Créer
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
