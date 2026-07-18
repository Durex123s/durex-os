import { PiggyBank } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

const SETTING_KEY = 'savingsPercent';
export const DEFAULT_SAVINGS_PERCENT = 50;

export function SavingsPercentSection() {
  const { get, set, loaded } = useAppSettings();
  const current = Number(get(SETTING_KEY) ?? DEFAULT_SAVINGS_PERCENT);

  if (!loaded) return null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-white mb-1">
        <PiggyBank className="w-4 h-4" />
        <span>Pourcentage d'épargne</span>
      </div>
      <p className="text-xs text-muted mb-4">
        Part de tes revenus allouée à l'épargne/dépenses courantes, utilisée pour calculer tes budgets automatiques.
      </p>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min={5}
          max={90}
          step={5}
          value={current}
          onChange={(e) => set(SETTING_KEY, e.target.value)}
          className="flex-1 accent-electric-500"
        />
        <span className="text-sm font-medium text-white w-12 text-right">{current}%</span>
      </div>
    </div>
  );
}
