import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { CalendarEvent } from '@/types';
import { scheduleEventReminders, cancelEventReminders } from '@/services/reminders';

export function useEvents() {
  const events = useLiveQuery(() => db.events.orderBy('startTime').toArray(), [], []);

  async function addEvent(event: CalendarEvent) {
    await db.events.add(event);
    scheduleEventReminders(event);
  }

  async function updateEvent(event: CalendarEvent) {
    await db.events.put(event);
    scheduleEventReminders(event);
  }

  async function deleteEvent(id: string) {
    await db.events.delete(id);
    cancelEventReminders(id);
  }

  return { events: events ?? [], addEvent, updateEvent, deleteEvent };
}
