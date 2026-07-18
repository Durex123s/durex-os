import { useState } from 'react';
import { X } from 'lucide-react';
import type { GoalMode, GoalAutoSource } from '@/types';
import { ModalPortal } from '@/components/ui/ModalPortal';

interface GoalModalProps {
  onClose: () => void;
  onSave: (params: { title: string; unit: string; target: number; mode: GoalMode; autoSource: GoalAutoSource }) => void;
}

const AUTO_SOURCE_OPTIONS: { label: string; value: GoalAutoSource }[] = [
  { label: 'Suivi manuel', value: null },
  { label: 'Épargne (Finances)', value: 'epargne' },
  { label: "Temps d'étude (Pomodoro)", value: 'pomodoro_etude' },
  { label: 'Temps de travail (Pomodoro)', value: 'pomodoro_travail' },
];

export function GoalModal({ onClose, onSave }: GoalModalProps) {
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('');
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState<GoalMode>('quotidien');
  const [autoSource, setAutoSource] = useState<GoalAutoSource>(null);

  const canSave = title.trim() && unit.trim() && parseFloat(target) > 0;

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({ title: title.trim(), unit: unit.trim(), target: parseFloat(target), mode, autoSource });
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Nouvel objectif</h3>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <label className="text-xs text-muted mb-1 block">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Lire"
            autoFocus
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Cible</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="3"
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Unité</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="h, FCFA, fois..."
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
              />
            </div>
          </div>

          <label className="text-xs text-muted mb-1.5 block">Type</label>
          <div className="flex gap-1.5 mb-3">
            {(['quotidien', 'cumulatif'] as GoalMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 text-xs py-1.5 rounded-lg border capitalize transition-colors ${
                  mode === m ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <label className="text-xs text-muted mb-1.5 block">Source de suivi</label>
          <div className="flex flex-col gap-1.5 mb-5">
            {AUTO_SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAutoSource(opt.value)}
                className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                  autoSource === opt.value ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSave}
            className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
          >
            Créer l'objectif
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
