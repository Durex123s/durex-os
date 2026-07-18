import { Link } from 'react-router-dom';
import { WidgetCard } from './WidgetCard';
import { CalendarClock } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { format, isAfter } from 'date-fns';
import { CATEGORY_LABELS } from '@/types';

export function UpcomingEvents() {
  const { events } = useEvents();
  const now = new Date();
  const upcoming = events.filter((e) => isAfter(new Date(e.endTime), now)).slice(0, 4);

  return (
    <WidgetCard
      title="Prochains cours"
      icon={<CalendarClock className="w-4 h-4" />}
      action={
        <Link to="/planning" className="text-xs text-electric-400 hover:underline">
          Voir tout
        </Link>
      }
    >
      {upcoming.length === 0 && <p className="text-sm text-muted">Rien de prévu pour le moment.</p>}
      <ul className="space-y-3">
        {upcoming.map((ev) => (
          <li key={ev.id} className="flex items-center gap-3">
            <span className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{ev.title}</p>
              <p className="text-xs text-muted">
                {format(new Date(ev.startTime), 'd MMM · HH:mm')} · {CATEGORY_LABELS[ev.category]}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
