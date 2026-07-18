import type { CalendarEvent } from '@/types';
import { format } from 'date-fns';
import clsx from 'clsx';

interface EventPillProps {
  event: CalendarEvent;
  onClick: () => void;
  compact?: boolean;
}

export function EventPill({ event, onClick, compact }: EventPillProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left rounded-md px-2 py-1 text-xs truncate transition-transform hover:scale-[1.02]',
        compact ? 'py-0.5' : 'py-1'
      )}
      style={{ backgroundColor: `${event.color}22`, borderLeft: `3px solid ${event.color}` }}
    >
      <span className="text-white/90 truncate block">
        {!compact && <span className="tabular-nums text-white/60 mr-1">{format(new Date(event.startTime), 'HH:mm')}</span>}
        {event.title}
      </span>
    </button>
  );
}
