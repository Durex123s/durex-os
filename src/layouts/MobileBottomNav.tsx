import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { NAV_ITEMS } from '@/utils/navigation';

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={1.75} />;
}

const PRIMARY_IDS = ['dashboard', 'planning', 'etudes', 'finances'];

export function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const primary = NAV_ITEMS.filter((i) => PRIMARY_IDS.includes(i.id));
  const rest = NAV_ITEMS.filter((i) => !PRIMARY_IDS.includes(i.id));

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 flex border-t border-white/5 bg-base-950/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
        aria-label="Navigation principale"
      >
        {primary.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className="relative flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active-dot"
                  className="absolute top-0 w-8 h-0.5 rounded-full bg-electric-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <NavIcon name={item.icon} className={clsx('w-5 h-5', isActive ? 'text-electric-400' : 'text-muted')} />
              <span className={isActive ? 'text-electric-400' : 'text-muted'}>{item.label.split(' ')[0]}</span>
              {isActive && <span className="sr-only">(actif)</span>}
            </NavLink>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] text-muted"
        >
          <Icons.MoreHorizontal className="w-5 h-5" strokeWidth={1.75} />
          <span>Plus</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex items-end bg-black/60 backdrop-blur-sm" onClick={() => setMoreOpen(false)}>
          <div
            className="w-full bg-base-900/95 border-t border-white/5 rounded-t-3xl p-5 pb-8 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-base-600 mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Tous les modules</h3>
              <button onClick={() => setMoreOpen(false)} className="text-muted" aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {rest.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 bg-base-800/60 rounded-xl py-4 text-muted active:text-white"
                >
                  <NavIcon name={item.icon} className="w-5 h-5" />
                  <span className="text-[11px] text-center leading-tight">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
