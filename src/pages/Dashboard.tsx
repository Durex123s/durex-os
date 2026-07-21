import type { ComponentType } from 'react';
import { HeroClock } from '@/components/dashboard/HeroClock';
import { DashboardStatsRow } from '@/components/dashboard/DashboardStatsRow';
import { DayProgress } from '@/components/dashboard/DayProgress';
import { TasksToday } from '@/components/dashboard/TasksToday';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { FinanceWidget } from '@/components/dashboard/FinanceWidget';
import { DisciplineWidget } from '@/components/dashboard/DisciplineWidget';
import { SmartNotificationsWidget } from '@/components/dashboard/SmartNotificationsWidget';
import { useAppStore } from '@/store/useAppStore';
import { useAppSettings } from '@/hooks/useAppSettings';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

// Association id de widget (utilisé dans Paramètres > Personnalisation) -> composant.
const WIDGET_COMPONENTS: Record<string, ComponentType> = {
  progression: DayProgress,
  taches: TasksToday,
  objectifs: GoalsWidget,
  cours: UpcomingEvents,
  finances: FinanceWidget,
  discipline: DisciplineWidget,
};

// Les widgets sont répartis en deux rangées à densité fixe (comme la
// maquette de référence) : une rangée large à 2 colonnes, puis une rangée
// plus dense à 3 colonnes. L'ordre/visibilité restent personnalisables
// dans Paramètres, mais chaque widget reste dans son groupe.
const ROW_A_IDS = ['progression', 'taches', 'objectifs'];
const ROW_B_IDS = ['cours', 'finances', 'discipline'];

// Dashboard = agrégation de widgets indépendants. La personnalisation
// (ordre / visibilité), réglable dans Paramètres, est appliquée ici :
// seuls les widgets visibles sont rendus, dans l'ordre choisi.
export function Dashboard() {
  const { dashboardWidgets } = useAppStore();
  const { get } = useAppSettings();
  const name = get('profileName');

  const visible = (ids: string[]) =>
    [...dashboardWidgets]
      .filter((w) => w.visible && ids.includes(w.id) && WIDGET_COMPONENTS[w.id])
      .sort((a, b) => a.order - b.order);

  const rowA = visible(ROW_A_IDS);
  const rowB = visible(ROW_B_IDS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">
          {getGreeting()}{name ? `, ${name}` : ''} 👋
        </h1>
        <p className="text-muted text-sm mt-1">Voici un aperçu de ta journée.</p>
      </div>

      <HeroClock />
      <DashboardStatsRow />
      <SmartNotificationsWidget />

      {rowA.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          {rowA.map((w) => {
            const Widget = WIDGET_COMPONENTS[w.id];
            return <Widget key={w.id} />;
          })}
        </div>
      )}

      {rowB.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
          {rowB.map((w) => {
            const Widget = WIDGET_COMPONENTS[w.id];
            return <Widget key={w.id} />;
          })}
        </div>
      )}
    </div>
  );
}
