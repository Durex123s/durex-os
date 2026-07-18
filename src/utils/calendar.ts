import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import type { CalendarEvent } from '@/types';

// Grille du mois : toujours des semaines complètes (lundi -> dimanche)
// pour un rendu régulier en 5 ou 6 lignes.
export function getMonthGrid(reference: Date): Date[] {
  const start = startOfWeek(startOfMonth(reference), { locale: fr, weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(reference), { locale: fr, weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function getWeekDays(reference: Date): Date[] {
  const start = startOfWeek(reference, { locale: fr, weekStartsOn: 1 });
  const end = endOfWeek(reference, { locale: fr, weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function eventsOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events
    .filter((e) => isSameDay(new Date(e.startTime), day))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export { isSameDay, isSameMonth };

// Heures affichées dans les vues Jour / Semaine (06h -> 23h)
export const DAY_HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
