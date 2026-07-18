import { format } from 'date-fns';
import type { CalendarEvent } from '@/types';
import { eventsOnDay, DAY_HOURS } from '@/utils/calendar';
import { CATEGORY_LABELS } from '@/types';

interface DayViewProps {
  reference: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function DayView({ reference, events, onSelectEvent }: DayViewProps) {
  const dayEvents = eventsOnDay(events, reference);

  return (
    <div className="glass-card overflow-hidden">
      <div className="grid grid-cols-[64px_1fr]">
        {DAY_HOURS.map((h) => {
          const hourEvents = dayEvents.filter((e) => new Date(e.startTime).getHours() === h);
          return (
            <div key={h} className="contents">
              <div className="h-16 text-xs text-muted text-right pr-3 pt-1 border-b border-white/[0.03]">
                {h}:00
              </div>
              <div className="h-16 border-b border-l border-white/[0.03] px-2 py-1 space-y-1">
                {hourEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => onSelectEvent(ev)}
                    className="w-full text-left rounded-lg px-3 py-1.5 text-sm flex items-center justify-between hover:scale-[1.01] transition-transform"
                    style={{ backgroundColor: `${ev.color}22`, borderLeft: `3px solid ${ev.color}` }}
                  >
                    <span className="text-white">{ev.title}</span>
                    <span className="text-xs text-muted">
                      {format(new Date(ev.startTime), 'HH:mm')}–{format(new Date(ev.endTime), 'HH:mm')} ·{' '}
                      {CATEGORY_LABELS[ev.category]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {dayEvents.length === 0 && (
        <p className="text-center text-muted text-sm py-10">Aucun événement ce jour-là.</p>
      )}
    </div>
  );
}
