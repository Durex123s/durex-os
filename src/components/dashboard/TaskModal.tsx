import { useState } from 'react';
import { X } from 'lucide-react';
import type { Task } from '@/types';
import { ModalPortal } from '@/components/ui/ModalPortal';

interface TaskModalProps {
  onClose: () => void;
  onSave: (t: Task) => void;
}

const PRIORITIES: Task['priority'][] = ['basse', 'normale', 'haute'];

export function TaskModal({ onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('normale');

  const handleSubmit = () => {
    const value = title.trim();
    if (!value) return;
    onSave({
      id: crypto.randomUUID(),
      title: value,
      done: false,
      dueTime: dueTime || undefined,
      priority,
    });
    onClose();
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Nouvelle tâche</h3>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <label className="text-xs text-muted mb-1 block">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Réviser 1h de programmation"
            autoFocus
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
          />

          <label className="text-xs text-muted mb-1 block">Heure (optionnel)</label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
          />

          <label className="text-xs text-muted mb-1.5 block">Priorité</label>
          <div className="flex gap-1.5 mb-5">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 text-xs py-1.5 rounded-lg border capitalize transition-colors ${
                  priority === p ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
