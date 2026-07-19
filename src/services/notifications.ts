import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { router } from '@/router';
import { db } from '@/database/db';

let permissionRequested = false;
let tapListenerRegistered = false;

export async function initNotifications() {
  registerTapListener();

  if (!Capacitor.isNativePlatform()) return;
  if (permissionRequested) return;
  permissionRequested = true;
  const { display } = await LocalNotifications.checkPermissions();
  if (display !== 'granted') {
    await LocalNotifications.requestPermissions();
  }
}

/**
 * Reprogramme tous les rappels à partir des données actuelles (habitudes,
 * tâches, épargne). Nécessaire car Android efface les notifications
 * programmées lors d'une désinstallation/réinstallation (ex: mise à jour
 * de la clé de signature) ou d'un vidage des données de l'app — sans ça,
 * les rappels déjà configurés restent silencieusement inactifs. Idempotent
 * (peut être appelée à chaque ouverture de l'app sans effet de bord).
 */
export async function resyncAllReminders() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const [habits, tasks] = await Promise.all([db.habits.toArray(), db.tasks.toArray()]);

    await Promise.all(
      habits
        .filter((h) => h.reminderTime)
        .map((h) => scheduleHabitReminder(h.id, h.name, h.reminderTime as string))
    );

    await Promise.all(
      tasks
        .filter((t) => t.dueTime && !t.done)
        .map((t) => scheduleTaskReminder(t.id, t.title, t.dueTime as string))
    );

    const goalsCount = await db.savingsGoals.count();
    if (goalsCount > 0) {
      await scheduleWeeklySavingsReminder();
    }
  } catch (e) {
    console.warn('[notifications] Resynchronisation des rappels impossible :', e);
  }
}

/** Quand on touche une notification, ouvre directement la section concernée. */
function registerTapListener() {
  if (!Capacitor.isNativePlatform()) return;
  if (tapListenerRegistered) return;
  tapListenerRegistered = true;
  LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
    const route = (action.notification.extra as { route?: string } | undefined)?.route;
    if (route) router.navigate(route);
  });
}

function hashId(prefix: string, id: string): number {
  const str = `${prefix}:${id}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return (hash % 2147483000) + 1;
}

async function safeSchedule(options: Parameters<typeof LocalNotifications.schedule>[0]) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.schedule(options);
  } catch (e) {
    console.warn('Notification schedule failed', e);
  }
}

async function safeCancel(ids: number[]) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.cancel({ notifications: ids.map((id) => ({ id })) });
  } catch (e) {
    console.warn('Notification cancel failed', e);
  }
}

// ---- Habitudes : rappel quotidien récurrent à une heure fixe ----
export async function scheduleHabitReminder(habitId: string, habitName: string, time: string) {
  const id = hashId('habit', habitId);
  await safeCancel([id]);
  const [hourStr, minuteStr] = time.split(':');
  await safeSchedule({
    notifications: [
      {
        id,
        title: 'Veyrion — Habitude',
        body: `N'oublie pas : "${habitName}"`,
        schedule: {
          on: { hour: parseInt(hourStr, 10), minute: parseInt(minuteStr, 10) },
          allowWhileIdle: true,
        },
        extra: { route: '/discipline' },
      },
    ],
  });
}

export async function cancelHabitReminder(habitId: string) {
  await safeCancel([hashId('habit', habitId)]);
}

// ---- Pomodoro : notification programmée à la fin de la session en cours ----
const POMODORO_NOTIF_ID = 900000001;

export async function schedulePomodoroEnd(secondsLeft: number, label: string) {
  await safeCancel([POMODORO_NOTIF_ID]);
  const fireAt = new Date(Date.now() + secondsLeft * 1000);
  await safeSchedule({
    notifications: [
      {
        id: POMODORO_NOTIF_ID,
        title: 'Veyrion — Pomodoro',
        body: `Session "${label}" terminée.`,
        schedule: { at: fireAt, allowWhileIdle: true },
        extra: { route: '/discipline' },
      },
    ],
  });
}

export async function cancelPomodoroEnd() {
  await safeCancel([POMODORO_NOTIF_ID]);
}

// ---- Épargne : rappel hebdomadaire (dimanche 18h) tant qu'il existe au moins un objectif ----
const SAVINGS_NOTIF_ID = 900000002;

export async function scheduleWeeklySavingsReminder() {
  await safeSchedule({
    notifications: [
      {
        id: SAVINGS_NOTIF_ID,
        title: 'Veyrion — Épargne',
        body: "Vérifie ta progression sur tes objectifs d'épargne cette semaine.",
        schedule: {
          on: { weekday: 1, hour: 18, minute: 0 },
          allowWhileIdle: true,
        },
        extra: { route: '/finances' },
      },
    ],
  });
}

export async function cancelWeeklySavingsReminder() {
  await safeCancel([SAVINGS_NOTIF_ID]);
}

// ---- Tâches : rappel à l'heure prévue (dueTime, aujourd'hui) ----
export async function scheduleTaskReminder(taskId: string, title: string, dueTime: string) {
  const id = hashId('task', taskId);
  await safeCancel([id]);
  const [hourStr, minuteStr] = dueTime.split(':');
  const now = new Date();
  const fireAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hourStr, 10), parseInt(minuteStr, 10), 0);
  if (fireAt.getTime() <= Date.now()) return;
  await safeSchedule({
    notifications: [
      {
        id,
        title: 'Veyrion — Tâche',
        body: title,
        schedule: { at: fireAt, allowWhileIdle: true },
        extra: { route: '/planning' },
      },
    ],
  });
}

export async function cancelTaskReminder(taskId: string) {
  await safeCancel([hashId('task', taskId)]);
}
