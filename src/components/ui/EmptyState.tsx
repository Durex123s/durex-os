import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <div className="w-12 h-12 rounded-2xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-electric-400" />
      </div>
      <p className="text-sm font-medium text-white mb-1">{title}</p>
      {description && <p className="text-xs text-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
