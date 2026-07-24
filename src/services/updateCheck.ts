import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { db } from '@/database/db';

const CHANNEL_ID = 'veyrion_reminders_v2';

const REPO = 'Durex123s/durex-os';
const UPDATE_NOTIF_ID = 900000003;

/**
 * Vérifie si le commit sur `main` a avancé depuis le build actuel. Si oui,
 * et qu'on n'a pas déjà notifié pour ce commit précis, envoie une notif
 * locale une fois. À appeler à chaque ouverture de l'app (natif uniquement).
 */
export async function checkForUpdate() {
  if (!Capacitor.isNativePlatform()) return;
  if (__BUILD_COMMIT__ === 'dev') return;

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/commits/main`);
    if (!res.ok) return;
    const data = await res.json();
    const latestSha: string | undefined = data?.sha;
    if (!latestSha || latestSha === __BUILD_COMMIT__) return;

    const lastNotified = await db.settings.get('lastUpdateNotifiedSha');
    if (lastNotified?.value === latestSha) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: UPDATE_NOTIF_ID,
          title: 'Veyrion — Mise à jour disponible',
          body: 'Une nouvelle version de Veyrion est prête. Touche pour voir comment mettre à jour.',
          schedule: { at: new Date(Date.now() + 1000) },
          extra: { route: '/parametres' },
          channelId: CHANNEL_ID,
        },
      ],
    });
    await db.settings.put({ key: 'lastUpdateNotifiedSha', value: latestSha });
  } catch (e) {
    console.warn('[updateCheck] Vérification impossible :', e);
  }
}
