import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const WIDGET_LABELS: Record<string, string> = {
  horloge: 'Horloge & citation',
  citation: 'Progression de la journée',
  progression: 'Progression de la journée',
  taches: 'Tâches du jour',
  objectifs: 'Objectifs',
  cours: 'Prochains cours',
  finances: 'Finances',
  discipline: 'Discipline',
};

export function PersonalizationSection() {
  const { dashboardWidgets, toggleWidget, setWidgetOrder } = useAppStore();
  const sorted = [...dashboardWidgets].sort((a, b) => a.order - b.order);

  const move = (id: string, direction: -1 | 1) => {
    const index = sorted.findIndex((w) => w.id === id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setWidgetOrder(reordered.map((w, i) => ({ ...w, order: i })));
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white mb-1">Personnalisation du dashboard</h3>
      <p className="text-xs text-muted mb-4">
        Choisis les widgets affichés et leur ordre sur ton tableau de bord.
      </p>

      <div className="space-y-1">
        {sorted.map((w, i) => (
          <div key={w.id} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-1">
              <div className="flex flex-col -my-1">
                <button
                  onClick={() => move(w.id, -1)}
                  disabled={i === 0}
                  className="text-muted hover:text-electric-400 disabled:opacity-20 disabled:hover:text-muted transition-colors p-0.5"
                  aria-label="Monter"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => move(w.id, 1)}
                  disabled={i === sorted.length - 1}
                  className="text-muted hover:text-electric-400 disabled:opacity-20 disabled:hover:text-muted transition-colors p-0.5"
                  aria-label="Descendre"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-sm text-white ml-1.5">{WIDGET_LABELS[w.id] ?? w.id}</span>
            </div>
            <button
              onClick={() => toggleWidget(w.id)}
              className={`w-10 h-6 rounded-full transition-colors relative ${w.visible ? 'bg-electric-500' : 'bg-base-700'}`}
              aria-label={w.visible ? 'Masquer' : 'Afficher'}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#ffffff] transition-transform ${
                  w.visible ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
