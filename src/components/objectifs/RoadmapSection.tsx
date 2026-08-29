import { useRoadmap } from '@/hooks/useRoadmap';
import { Route } from 'lucide-react';

const PHASE_LABELS: Record<number, string> = {
  1: 'Phase 1 — Préparation',
  2: 'Phase 2 — Constitution du dossier',
  3: 'Phase 3 — Candidatures',
  4: 'Phase 4 — Départ',
};

export function RoadmapSection() {
  const { months, toggleMonth, progress } = useRoadmap();

  const phases = [1, 2, 3, 4].map((phase) => ({
    phase,
    label: PHASE_LABELS[phase],
    items: months.filter((m) => m.phase === phase),
  }));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Route className="w-4 h-4 text-electric-400" />
          Roadmap 12 mois
        </h3>
        <span className="text-xs text-muted">{progress}%</span>
      </div>

      <div className="h-1.5 rounded-full bg-base-700 overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-electric-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-4">
        {phases.map(({ phase, label, items }) => (
          <div key={phase}>
            <p className="text-xs font-medium text-muted mb-2">{label}</p>
            <div className="space-y-1.5">
              {items.map((m) => (
                <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={m.done}
                    onChange={() => toggleMonth(m.id)}
                    className="w-3.5 h-3.5 rounded accent-electric-500"
                  />
                  <span className={`text-xs ${m.done ? 'line-through text-muted' : 'text-white'}`}>
                    {m.monthLabel} — {m.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
