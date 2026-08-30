import type { ReactNode } from 'react';
import clsx from 'clsx';

type WidgetStatus = 'ok' | 'warning' | 'danger' | 'neutral';

interface WidgetCardProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  status?: WidgetStatus;
}

const STATUS_STYLES: Record<WidgetStatus, { border: string; glow: string; dot: string }> = {
  ok: { border: 'before:bg-success/60', glow: 'shadow-[0_0_28px_-8px_rgba(63,174,104,0.35)]', dot: 'text-success' },
  warning: { border: 'before:bg-warning/60', glow: 'shadow-[0_0_28px_-8px_rgba(217,154,61,0.35)]', dot: 'text-warning' },
  danger: { border: 'before:bg-danger/60', glow: 'shadow-[0_0_28px_-8px_rgba(192,67,91,0.4)]', dot: 'text-danger' },
  neutral: { border: 'before:bg-electric-500/40', glow: '', dot: 'text-electric-400' },
};

// Enveloppe standard de chaque widget du dashboard : titre + zone d'action optionnelle.
// status (optionnel) ajoute un liseré + une pastille colorée reflétant l'état du widget
// (ex : budget dépassé -> danger, score correct -> ok).
export function WidgetCard({ title, icon, action, children, className, status }: WidgetCardProps) {
  const s = status ? STATUS_STYLES[status] : null;

  return (
    <div
      className={clsx(
        'glass-card p-5 animate-fadeUp relative transition-shadow duration-500',
        s && [
          'before:content-[""] before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:rounded-full',
          s.border,
          s.glow,
        ],
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          {icon}
          <span>{title}</span>
          {s && <span className={clsx('status-dot w-1.5 h-1.5 rounded-full bg-current shrink-0', s.dot)} />}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
