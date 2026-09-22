import { db } from '@/database/db';
import { saveOrShareFile } from './nativeExport';
import { scheduleEventReminders } from './reminders';
import type { CalendarEvent, EventCategory } from '@/types';
import { CATEGORY_COLORS } from '@/types';

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


// Sépare le texte .ics en blocs VEVENT et "déplie" les lignes coupées
// (RFC 5545 : une ligne continuée commence par un espace ou une tabulation).
function unfoldICS(raw: string): string[] {
  const rawLines = raw.split(/\r\n|\n|\r/);
  const lines: string[] = [];
  for (const line of rawLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function unescapeICS(text: string): string {
  return text.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

// Convertit une date .ics (YYYYMMDDTHHMMSSZ ou YYYYMMDDTHHMMSS) en ISO 8601.
function fromICSDate(value: string): string {
  const clean = value.replace('Z', '');
  const y = clean.slice(0, 4);
  const mo = clean.slice(4, 6);
  const d = clean.slice(6, 8);
  const h = clean.slice(9, 11) || '00';
  const mi = clean.slice(11, 13) || '00';
  const s = clean.slice(13, 15) || '00';
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}`;
  return value.endsWith('Z') ? new Date(iso + 'Z').toISOString() : new Date(iso).toISOString();
}

const VALID_CATEGORIES: EventCategory[] = ['cours', 'rdv', 'examen', 'travail', 'evenement'];

/** Importe les événements d'un fichier .ics dans le calendrier. Retourne le
 * nombre d'événements importés avec succès. */
export async function importEventsFromICS(file: File): Promise<{ imported: number; skipped: number }> {
  const raw = await file.text();
  const lines = unfoldICS(raw);

  let imported = 0;
  let skipped = 0;
  let current: Record<string, string> | null = null;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      current = {};
      continue;
    }
    if (line.startsWith('END:VEVENT')) {
      if (current && current.DTSTART && current.SUMMARY) {
        try {
          const categoryRaw = (current.CATEGORIES || '').toLowerCase().trim();
          const category: EventCategory = VALID_CATEGORIES.includes(categoryRaw as EventCategory)
            ? (categoryRaw as EventCategory)
            : 'evenement';

          const event: CalendarEvent = {
            id: crypto.randomUUID(),
            title: unescapeICS(current.SUMMARY),
            description: current.DESCRIPTION ? unescapeICS(current.DESCRIPTION) : undefined,
            category,
            priority: 'normale',
            color: CATEGORY_COLORS[category],
            startTime: fromICSDate(current.DTSTART),
            endTime: fromICSDate(current.DTEND || current.DTSTART),
            reminders: [],
          };

          await db.events.add(event);
          scheduleEventReminders(event);
          imported++;
        } catch {
          skipped++;
        }
      } else {
        skipped++;
      }
      current = null;
      continue;
    }
    if (current) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      let key = line.slice(0, idx);
      const value = line.slice(idx + 1);
      key = key.split(';')[0]; // ignore les paramètres type DTSTART;VALUE=DATE
      current[key] = value;
    }
  }

  return { imported, skipped };
}
