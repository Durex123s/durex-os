import { format } from 'date-fns';
import clsx from 'clsx';
import type { CalendarEvent } from '@/types';
import { getMonthGrid, eventsOnDay, isSameDay, isSameMonth } from '@/utils/calendar';
import { EventPill } from './EventPill';

interface MonthViewProps {
  reference: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDay: (day: Date) => void;
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function MonthView({ reference, events, onSelectEvent, onSelectDay }: MonthViewProps) {
  const days = getMonthGrid(reference);
  const today = new Date();

  return (
    <div className="glass-card overflow-hidden">
      <div className="grid grid-cols-7 border-b border-white/5">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="px-2 py-2 text-xs text-muted text-center font-medium">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = eventsOnDay(events, day);
          const outOfMonth = !isSameMonth(day, reference);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              className={clsx(
                'min-h-[104px] p-1.5 border-b border-r border-white/5 text-left align-top flex flex-col gap-1 hover:bg-white/[0.03] transition-colors',
                outOfMonth && 'opacity-40'
              )}
            >
              <span
                className={clsx(
                  'text-xs w-6 h-6 flex items-center justify-center rounded-full',
                  isToday ? 'bg-electric-500 text-onAccent font-semibold' : 'text-muted'
                )}
              >
                {format(day, 'd')}
              </span>
              <div className="space-y-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((ev) => (
                  <EventPill key={ev.id} event={ev} compact onClick={() => onSelectEvent(ev)} />
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-muted pl-1">+{dayEvents.length - 3} autres</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
