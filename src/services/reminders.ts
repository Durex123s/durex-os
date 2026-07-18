import type { CalendarEvent } from '@/types';

// Planifie les rappels d'un événement via setTimeout + Notification API.
// Limite connue : ne survit pas à la fermeture de l'onglet — la version
// Expo (mobile) remplacera ceci par expo-notifications avec planification
// persistante côté OS.
const scheduledTimers = new Map<string, number[]>();

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function clearEventReminders(eventId: string) {
  const timers = scheduledTimers.get(eventId);
  timers?.forEach((t) => window.clearTimeout(t));
  scheduledTimers.delete(eventId);
}

export function scheduleEventReminders(event: CalendarEvent) {
  clearEventReminders(event.id);
  if (Notification.permission !== 'granted') return;

  const start = new Date(event.startTime).getTime();
  const timers: number[] = [];

  for (const offsetMinutes of event.reminders) {
    const triggerAt = start - offsetMinutes * 60 * 1000;
    const delay = triggerAt - Date.now();
    if (delay <= 0) continue; // rappel déjà passé

    const timerId = window.setTimeout(() => {
      new Notification(event.title, {
        body: `${labelFor(offsetMinutes)} — ${new Date(event.startTime).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        tag: `${event.id}-${offsetMinutes}`,
      });
    }, delay);

    timers.push(timerId);
  }

  scheduledTimers.set(event.id, timers);
}

function labelFor(offset: number) {
  if (offset === 1440) return 'Demain';
  if (offset === 60) return 'Dans 1 heure';
  if (offset === 30) return 'Dans 30 minutes';
  return 'Dans 10 minutes';
}

export function cancelEventReminders(eventId: string) {
  clearEventReminders(eventId);
}
