import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardWidgetConfig } from '@/types';

export type ThemeMode = 'auto' | 'dark' | 'light';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  dashboardWidgets: DashboardWidgetConfig[];
  setWidgetOrder: (widgets: DashboardWidgetConfig[]) => void;
  toggleWidget: (id: string) => void;

  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const defaultWidgets: DashboardWidgetConfig[] = [
  { id: 'progression', visible: true, order: 0 },
  { id: 'taches', visible: true, order: 1 },
  { id: 'objectifs', visible: true, order: 2 },
  { id: 'cours', visible: true, order: 3 },
  { id: 'finances', visible: true, order: 4 },
  { id: 'discipline', visible: true, order: 5 },
];

// Store global léger : préférences UI persistées en local (localStorage web).
// La donnée métier (tâches, finances...) vivra dans /database (SQLite/Dexie)
// et sera exposée via des hooks dédiés dans /hooks, pas ici.
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),

      dashboardWidgets: defaultWidgets,
      setWidgetOrder: (widgets) => set({ dashboardWidgets: widgets }),
      toggleWidget: (id) =>
        set({
          dashboardWidgets: get().dashboardWidgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w
          ),
        }),

      themeMode: 'auto',
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    { name: 'veyrion-ui-prefs' }
  )
);
