import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';

export type CalendarView = 'jour' | 'semaine' | 'mois';

interface CalendarHeaderProps {
  reference: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreate: () => void;
}

const VIEWS: CalendarView[] = ['jour', 'semaine', 'mois'];

export function CalendarHeader({
  reference,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onCreate,
}: CalendarHeaderProps) {
  const label =
    view === 'mois'
      ? format(reference, 'MMMM yyyy', { locale: fr })
      : view === 'semaine'
        ? `Semaine du ${format(reference, 'd MMM', { locale: fr })}`
        : format(reference, 'EEEE d MMMM', { locale: fr });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors" aria-label="Période précédente">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={onNext} className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors" aria-label="Période suivante">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={onToday} className="text-xs px-3 py-1.5 rounded-lg border border-base-600 text-muted hover:text-white hover:border-electric-500/40 transition-colors">
          Aujourd'hui
        </button>
        <h2 className="font-display text-lg font-semibold text-white capitalize ml-1">{label}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-base-800 rounded-xl p-1">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs capitalize transition-colors',
                view === v ? 'bg-electric-500 text-onAccent font-medium' : 'text-muted hover:text-white'
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </div>
  );
}
