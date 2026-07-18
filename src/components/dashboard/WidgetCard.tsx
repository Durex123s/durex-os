import type { ReactNode } from 'react';
import clsx from 'clsx';

interface WidgetCardProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

// Enveloppe standard de chaque widget du dashboard : titre + zone d'action optionnelle.
export function WidgetCard({ title, icon, action, children, className }: WidgetCardProps) {
  return (
    <div className={clsx('glass-card p-5 animate-fadeUp', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          {icon}
          <span>{title}</span>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
