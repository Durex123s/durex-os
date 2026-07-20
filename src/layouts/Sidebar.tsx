import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Wallet,
  Flame,
  Zap,
  Code2,
  Sparkles,
  Target,
  BarChart3,
  FolderOpen,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/utils/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useAppSettings } from '@/hooks/useAppSettings';
import clsx from 'clsx';

// Table explicite (au lieu de `import * as Icons`) pour que le tree-shaking
// n'embarque que les icônes réellement utilisées dans la navigation.
const NAV_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Wallet,
  Flame,
  Zap,
  Code2,
  Sparkles,
  Target,
  BarChart3,
  FolderOpen,
  Settings,
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = NAV_ICONS[name];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={1.75} />;
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { get } = useAppSettings();
  const photo = get('profilePhoto');
  const showElectricianTools = get('showElectricianTools') === 'true';
  const items = NAV_ITEMS.filter((i) => i.id !== 'outils' || showElectricianTools);
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'h-screen sticky top-0 flex flex-col border-r border-white/5 bg-base-950/80 backdrop-blur-xs transition-all duration-200',
        sidebarCollapsed ? 'w-[76px]' : 'w-[248px]'
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-electric-500 shadow-glow flex items-center justify-center font-display font-bold text-onAccent text-sm overflow-hidden shrink-0">
          {photo ? <img src={photo} alt="Profil" className="w-full h-full object-cover" /> : 'D'}
        </div>
        {!sidebarCollapsed && (
          <span className="font-display font-semibold tracking-tight text-white truncate">
            {get('profileName') || 'Veyrion'}
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {items.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150"
              title={sidebarCollapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-electric-500/10 border border-electric-500/30 shadow-glow"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <NavIcon
                name={item.icon}
                className={clsx('relative z-10 w-[18px] h-[18px] shrink-0', isActive ? 'text-white' : 'text-muted')}
              />
              {!sidebarCollapsed && (
                <span className={clsx('relative z-10 truncate', isActive ? 'text-white' : 'text-muted')}>
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center gap-2 mx-3 mb-4 px-3 py-2.5 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-colors text-sm"
        aria-label={sidebarCollapsed ? 'Déplier le menu' : 'Réduire le menu'}
      >
        {sidebarCollapsed ? <ChevronsRight className="w-[18px] h-[18px]" /> : <ChevronsLeft className="w-[18px] h-[18px]" />}
        {!sidebarCollapsed && <span>Réduire</span>}
      </button>
    </aside>
  );
}
