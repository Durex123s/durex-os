import { format } from 'date-fns';
import clsx from 'clsx';
import type { CalendarEvent } from '@/types';
import { getWeekDays, eventsOnDay, isSameDay, DAY_HOURS } from '@/utils/calendar';
import { EventPill } from './EventPill';

interface WeekViewProps {
  reference: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

// Position verticale d'un événement dans la grille horaire (06h -> 23h = 17h de plage)
function eventOffset(event: CalendarEvent) {
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const dayStartMinutes = 6 * 60;
  const totalMinutes = 17 * 60;

  const startMin = start.getHours() * 60 + start.getMinutes() - dayStartMinutes;
  const endMin = end.getHours() * 60 + end.getMinutes() - dayStartMinutes;
  const durationMin = Math.max(20, endMin - startMin);

  return {
    top: `${(startMin / totalMinutes) * 100}%`,
    height: `${(durationMin / totalMinutes) * 100}%`,
  };
}

export function WeekView({ reference, events, onSelectEvent }: WeekViewProps) {
  const days = getWeekDays(reference);
  const today = new Date();

  return (
    <div className="glass-card overflow-hidden">
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-white/5">
        <div />
        {days.map((day) => (
          <div key={day.toISOString()} className="px-2 py-2 text-center border-l border-white/5">
            <p className="text-xs text-muted capitalize">{format(day, 'EEE')}</p>
            <span
              className={clsx(
                'text-sm w-6 h-6 mx-auto flex items-center justify-center rounded-full',
                isSameDay(day, today) ? 'bg-electric-500 text-onAccent font-semibold' : 'text-white'
              )}
            >
              {format(day, 'd')}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[56px_repeat(7,1fr)] relative" style={{ height: `${DAY_HOURS.length * 56}px` }}>
        <div className="relative">
          {DAY_HOURS.map((h) => (
            <div key={h} className="h-14 text-[10px] text-muted text-right pr-2 -translate-y-2">
              {h}:00
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div key={day.toISOString()} className="relative border-l border-white/5">
            {DAY_HOURS.map((h) => (
              <div key={h} className="h-14 border-b border-white/[0.03]" />
            ))}
            <div className="absolute inset-0 p-0.5">
              {eventsOnDay(events, day).map((ev) => {
                const { top, height } = eventOffset(ev);
                return (
                  <div key={ev.id} className="absolute left-0.5 right-0.5" style={{ top, height }}>
                    <EventPill event={ev} onClick={() => onSelectEvent(ev)} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
