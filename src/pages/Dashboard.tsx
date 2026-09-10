import type { ComponentType } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { HeroClock } from '@/components/dashboard/HeroClock';
import { DashboardStatsRow } from '@/components/dashboard/DashboardStatsRow';
import { DayProgress } from '@/components/dashboard/DayProgress';
import { TasksToday } from '@/components/dashboard/TasksToday';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { FinanceWidget } from '@/components/dashboard/FinanceWidget';
import { DisciplineWidget } from '@/components/dashboard/DisciplineWidget';
import { SmartNotificationsWidget } from '@/components/dashboard/SmartNotificationsWidget';
import { SortableWidget } from '@/components/dashboard/SortableWidget';
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
// plus dense à 3 colonnes. L'ordre est personnalisable par glisser-déposer
// à l'intérieur de chaque rangée ; la visibilité reste réglable dans Paramètres.
const ROW_A_IDS = ['progression', 'taches', 'objectifs'];
const ROW_B_IDS = ['cours', 'finances', 'discipline'];

export function Dashboard() {
  const { dashboardWidgets, setWidgetOrder } = useAppStore();
  const { get } = useAppSettings();
  const name = get('profileName');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const visible = (ids: string[]) =>
    [...dashboardWidgets]
      .filter((w) => w.visible && ids.includes(w.id) && WIDGET_COMPONENTS[w.id])
      .sort((a, b) => a.order - b.order);

  const rowA = visible(ROW_A_IDS);
  const rowB = visible(ROW_B_IDS);

  const handleDragEnd = (row: typeof rowA) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = row.findIndex((w) => w.id === active.id);
    const newIndex = row.findIndex((w) => w.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(row, oldIndex, newIndex);
    const updated = dashboardWidgets.map((w) => {
      const idx = reordered.findIndex((r) => r.id === w.id);
      return idx === -1 ? w : { ...w, order: idx };
    });
    setWidgetOrder(updated);
  };

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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(rowA)}>
          <SortableContext items={rowA.map((w) => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
              {rowA.map((w) => {
                const Widget = WIDGET_COMPONENTS[w.id];
                return (
                  <SortableWidget key={w.id} id={w.id}>
                    <Widget />
                  </SortableWidget>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {rowB.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(rowB)}>
          <SortableContext items={rowB.map((w) => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
              {rowB.map((w) => {
                const Widget = WIDGET_COMPONENTS[w.id];
                return (
                  <SortableWidget key={w.id} id={w.id}>
                    <Widget />
                  </SortableWidget>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
