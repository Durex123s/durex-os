import { useEffect, useState } from 'react';
import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { CalendarHeader, type CalendarView } from '@/components/calendar/CalendarHeader';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { EventModal } from '@/components/calendar/EventModal';
import { useEvents } from '@/hooks/useEvents';
import { requestNotificationPermission } from '@/services/reminders';
import type { CalendarEvent } from '@/types';

export function Planning() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [reference, setReference] = useState(new Date());
  const [view, setView] = useState<CalendarView>('mois');
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const goPrev = () => {
    if (view === 'mois') setReference((d) => subMonths(d, 1));
    else if (view === 'semaine') setReference((d) => subWeeks(d, 1));
    else setReference((d) => subDays(d, 1));
  };

  const goNext = () => {
    if (view === 'mois') setReference((d) => addMonths(d, 1));
    else if (view === 'semaine') setReference((d) => addWeeks(d, 1));
    else setReference((d) => addDays(d, 1));
  };

  const openCreate = (date: Date) => {
    setEditingEvent(null);
    setModalDate(date);
  };

  const openEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalDate(new Date(event.startTime));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Emploi du temps</h1>
        <p className="text-muted text-sm mt-1">Cours, rendez-vous, examens et rappels intelligents.</p>
      </div>

      <CalendarHeader
        reference={reference}
        view={view}
        onViewChange={setView}
        onPrev={goPrev}
        onNext={goNext}
        onToday={() => setReference(new Date())}
        onCreate={() => openCreate(reference)}
      />

      {view === 'mois' && (
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[640px] md:min-w-0">
            <MonthView
              reference={reference}
              events={events}
              onSelectEvent={openEdit}
              onSelectDay={(day) => {
                setReference(day);
                setView('jour');
              }}
            />
          </div>
        </div>
      )}
      {view === 'semaine' && (
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[640px] md:min-w-0">
            <WeekView reference={reference} events={events} onSelectEvent={openEdit} />
          </div>
        </div>
      )}
      {view === 'jour' && <DayView reference={reference} events={events} onSelectEvent={openEdit} />}

      {modalDate && (
        <EventModal
          initialDate={modalDate}
          event={editingEvent}
          onClose={() => setModalDate(null)}
          onSave={(ev) => (editingEvent ? updateEvent(ev) : addEvent(ev))}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}
