import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface CalculatorCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  result?: ReactNode;
  note?: string;
}

export function CalculatorCard({ title, icon: Icon, children, result, note }: CalculatorCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-white mb-4">
        <div className="w-7 h-7 rounded-lg bg-electric-500/15 text-electric-400 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        {title}
      </div>

      <div className="space-y-3">{children}</div>

      {result && (
        <div className="mt-4 bg-base-800/60 rounded-lg px-3 py-3 text-sm">
          {result}
        </div>
      )}

      {note && <p className="text-[11px] text-muted mt-3">{note}</p>}
    </div>
  );
}
