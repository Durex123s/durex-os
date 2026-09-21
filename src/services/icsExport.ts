import { db } from '@/database/db';
import { saveOrShareFile } from './nativeExport';
import type { CalendarEvent } from '@/types';

// Format iCalendar (RFC 5545) : YYYYMMDDTHHMMSSZ, toujours en UTC.
function toICSDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// Échappe les caractères spéciaux du format iCalendar (virgules, points-virgules,
// retours à la ligne) — sinon un titre avec une virgule casserait le fichier.
function escapeICS(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

function eventToICS(event: CalendarEvent): string {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${event.id}@veyrion`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(event.startTime)}`,
    `DTEND:${toICSDate(event.endTime)}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ];
  if (event.description) lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  lines.push(`CATEGORIES:${escapeICS(event.category)}`);
  lines.push('END:VEVENT');
  return lines.join('\r\n');
}

/** Exporte tous les événements du calendrier au format .ics (compatible
 * Google Calendar, Apple Calendar, Outlook, etc.). */
export async function exportEventsToICS() {
  const events = await db.events.orderBy('startTime').toArray();

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Veyrion//Emploi du temps//FR',
    'CALSCALE:GREGORIAN',
    ...events.map(eventToICS),
    'END:VCALENDAR',
  ].join('\r\n');

  await saveOrShareFile(
    `veyrion-emploi-du-temps-${new Date().toISOString().slice(0, 10)}.ics`,
    ics,
    'text/calendar',
  );
}
