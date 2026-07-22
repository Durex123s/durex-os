import { useState } from 'react';
import { Plus, X, BookOpen } from 'lucide-react';
import { useSubjects } from '@/hooks/useSubjects';
import { SubjectCard } from '@/components/etudes/SubjectCard';
import { EtudesOverview } from '@/components/etudes/EtudesOverview';
import { EmptyState } from '@/components/ui/EmptyState';

const ICON_CHOICES = ['BookOpen', 'Cpu', 'Sigma', 'Languages', 'FlaskConical', 'Landmark', 'Palette', 'Dumbbell'];
const COLOR_CHOICES = ['#C9A227', '#3FAE68', '#D99A3D', '#C0435B', '#4E8C82'];

export function Etudes() {
  const { subjects, addSubject } = useSubjects();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICON_CHOICES[0]);
  const [color, setColor] = useState(COLOR_CHOICES[0]);

  const handleCreate = () => {
    if (!name.trim()) return;
    addSubject({ id: crypto.randomUUID(), name: name.trim(), icon, color });
    setName('');
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Études</h1>
          <p className="text-muted text-sm mt-1">Tes matières, cours, fiches et quiz — en un seul endroit.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Nouvelle matière
        </button>
      </div>

      <EtudesOverview />

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucune matière pour l'instant"
          description="Crée ta première matière pour y ranger cours, fiches et quiz."
          action={
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle matière
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => (
            <div key={s.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fadeUp">
              <SubjectCard subject={s} />
            </div>
          ))}
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCreating(false)}>
          <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">Nouvelle matière</h3>
              <button onClick={() => setCreating(false)} className="text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Physique"
              autoFocus
              className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
            />
            <div className="flex flex-wrap gap-1.5 mb-4">
              {COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform"
                  style={{ backgroundColor: c, borderColor: color === c ? '#fff' : 'transparent' }}
                  aria-label={`Couleur ${c}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ICON_CHOICES.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className="text-[10px] px-2 py-1 rounded-md border transition-colors"
                  style={
                    icon === i
                      ? { backgroundColor: `${color}33`, borderColor: color, color: '#fff' }
                      : { borderColor: '#2A2A38', color: '#9E9688' }
                  }
                >
                  {i}
                </button>
              ))}
            </div>
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
