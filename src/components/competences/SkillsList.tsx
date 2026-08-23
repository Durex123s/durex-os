import { useState } from 'react';
import { Plus, Minus, Trash2, X, Brain } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';
import { EmptyState } from '@/components/ui/EmptyState';

export function SkillsList() {
  const { skills, addSkill, changeLevel, deleteSkill } = useSkills();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    addSkill(name.trim(), 1);
    setName('');
    setCreating(false);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Mes compétences</h3>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs text-electric-400 hover:text-electric-500"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>

      {skills.length === 0 && !creating ? (
        <EmptyState
          icon={Brain}
          title="Aucune compétence pour l'instant"
          description="Ajoute une compétence pour suivre ta progression."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((skill) => {
            const percent = Math.min(100, Math.max(0, skill.level * 10));
            return (
              <div key={skill.id} className="border border-base-600 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-sm text-white">{skill.name}</strong>
                  <span className="text-xs text-muted">{skill.level}/10</span>
                </div>
                <div className="h-1.5 rounded-full bg-base-700 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-electric-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => changeLevel(skill.id, -1)}
                    className="w-7 h-7 rounded-md border border-base-600 flex items-center justify-center text-muted hover:text-white transition-colors"
                    aria-label="Diminuer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => changeLevel(skill.id, 1)}
                    className="w-7 h-7 rounded-md border border-base-600 flex items-center justify-center text-muted hover:text-white transition-colors"
                    aria-label="Augmenter"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="w-7 h-7 rounded-md border border-base-600 flex items-center justify-center text-muted hover:text-danger transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCreating(false)}>
          <div className="glass-card w-full max-w-sm p-6 bg-base-900/95 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">Nouvelle compétence</h3>
              <button onClick={() => setCreating(false)} className="text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Programmation"
              autoFocus
              className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
            />
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
