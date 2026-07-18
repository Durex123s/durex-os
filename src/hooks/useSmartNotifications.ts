import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import type { SmartNotification } from '@/types';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function startOfWeekDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

// Moteur de règles simple : chaque règle lit les données existantes et
// produit (ou non) un message. Facile à étendre avec de nouvelles règles.
export function useSmartNotifications() {
  const notifications = useLiveQuery(async (): Promise<SmartNotification[]> => {
    const result: SmartNotification[] = [];
    const now = new Date();

    // Règle 1 — événement important demain (examen ou TP/cours tôt le matin)
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const tomorrowEvents = await db.events
      .where('startTime')
      .between(tomorrowStart.toISOString(), tomorrowEnd.toISOString())
      .toArray();
    const importantTomorrow = tomorrowEvents.find((e) => e.category === 'examen' || e.category === 'cours');
    if (importantTomorrow) {
      result.push({
        id: 'evt-tomorrow',
        message: `Tu as "${importantTomorrow.title}" demain.`,
        level: importantTomorrow.category === 'examen' ? 'warning' : 'info',
      });
    }

    // Règle 2 — budget journalier dépassé
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const transactions = await db.transactions.toArray();
    const depensesDuJour = transactions
      .filter((t) => t.type === 'depense' && new Date(t.date) >= dayStart)
      .reduce((s, t) => s + t.amount, 0);
    const totalRevenus = transactions.filter((t) => t.type === 'revenu').reduce((s, t) => s + t.amount, 0);
    const budgetJournalier = Math.round((totalRevenus * 0.5) / 30) || 8000;
    if (depensesDuJour > budgetJournalier) {
      result.push({ id: 'budget-over', message: 'Tu dépasses ton budget du jour.', level: 'warning' });
    }

    // Règle 3 — aucune session d'étude aujourd'hui (déclenché après 18h)
    if (now.getHours() >= 18) {
      const dayStartISO = dayStart.toISOString();
      const sessions = await db.pomodoroSessions.where('completedAt').aboveOrEqual(dayStartISO).toArray();
      const studiedToday = sessions.some((s) => s.type === 'etude');
      if (!studiedToday) {
        result.push({ id: 'no-study', message: "Tu n'as pas étudié aujourd'hui.", level: 'info' });
      }
    }

    // Règle 4 — aucune épargne cette semaine (déclenché à partir du jeudi)
    if (now.getDay() >= 4 || now.getDay() === 0) {
      const savingsGoals = await db.savingsGoals.toArray();
      // Pas de trace fine des contributions dans ce prototype : on utilise
      // les revenus de la semaine comme proxy simple d'activité financière.
      const weekStart = startOfWeekDate();
      const weeklyIncome = transactions.filter((t) => t.type === 'revenu' && new Date(t.date) >= weekStart).length;
      if (savingsGoals.length > 0 && weeklyIncome === 0) {
        result.push({ id: 'no-savings', message: "Tu n'as pas économisé cette semaine.", level: 'info' });
      }
    }

    // Règle 5 — habitude non cochée en fin de journée
    if (now.getHours() >= 20) {
      const habits = await db.habits.toArray();
      const undone = habits.filter((h) => !h.completedDates.includes(todayISO()));
      if (undone.length > 0) {
        result.push({
          id: 'habits-undone',
          message: `${undone.length} habitude${undone.length > 1 ? 's' : ''} pas encore cochée${undone.length > 1 ? 's' : ''} aujourd'hui.`,
          level: 'info',
        });
      }
    }

    return result;
  }, []);

  return notifications ?? [];
}
