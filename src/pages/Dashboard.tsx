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

// Association id de widget (utilisé dans Paramètres > Personnalisation) -> composant.
const WIDGET_COMPONENTS: Record<string, ComponentType> = {
  progression: DayProgress,
  taches: TasksToday,
  objectifs: GoalsWidget,
  cours: UpcomingEvents,
  finances: FinanceWidget,
  discipline: DisciplineWidget,
};

// Dashboard = agrégation de widgets indépendants. La personnalisation
// (ordre / visibilité), réglable dans Paramètres, est appliquée ici :
// seuls les widgets visibles sont rendus, dans l'ordre choisi.
export function Dashboard() {
  const { dashboardWidgets } = useAppStore();

  const visibleWidgets = [...dashboardWidgets]
    .filter((w) => w.visible && WIDGET_COMPONENTS[w.id])
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Bonjour 👋</h1>
        <p className="text-muted text-sm mt-1">Voici un aperçu de ta journée.</p>
      </div>

      <HeroClock />
      <DashboardStatsRow />
      <SmartNotificationsWidget />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {visibleWidgets.map((w) => {
          const Widget = WIDGET_COMPONENTS[w.id];
          return <Widget key={w.id} />;
        })}
      </div>
    </div>
  );
}
