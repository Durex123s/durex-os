import type { NavItem } from '@/types';

// Source unique de vérité pour la navigation : Sidebar, breadcrumbs
// et futur menu mobile (Expo) consomment tous ce tableau.
export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', path: '/', icon: 'LayoutDashboard' },
  { id: 'planning', label: 'Emploi du temps', path: '/planning', icon: 'CalendarDays' },
  { id: 'etudes', label: 'Études', path: '/etudes', icon: 'GraduationCap' },
  { id: 'finances', label: 'Finances', path: '/finances', icon: 'Wallet' },
  { id: 'discipline', label: 'Discipline', path: '/discipline', icon: 'Flame' },
  { id: 'outils', label: 'Outils électricien', path: '/outils', icon: 'Zap' },
  { id: 'dev', label: 'Espace développeur', path: '/dev', icon: 'Code2' },
  { id: 'assistant', label: 'Assistant IA', path: '/assistant', icon: 'Sparkles' },
  { id: 'objectifs', label: 'Objectifs', path: '/objectifs', icon: 'Target' },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { id: 'fichiers', label: 'Fichiers', path: '/fichiers', icon: 'FolderOpen' },
  { id: 'parametres', label: 'Paramètres', path: '/parametres', icon: 'Settings' },
];
