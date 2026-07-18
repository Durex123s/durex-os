import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useAppStore, type ThemeMode } from '@/store/useAppStore';

const OPTIONS: { mode: ThemeMode; label: string; icon: typeof Moon }[] = [
  { mode: 'auto', label: 'Auto', icon: MonitorSmartphone },
  { mode: 'dark', label: 'Sombre', icon: Moon },
  { mode: 'light', label: 'Clair', icon: Sun },
];

export function ThemeSection() {
  const { themeMode, setThemeMode } = useAppStore();

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white mb-1">Apparence</h3>
      <p className="text-xs text-muted mb-4">
        "Auto" suit le réglage clair/sombre de ton téléphone et se met à jour tout seul.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ mode, label, icon: Icon }) => {
          const active = themeMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setThemeMode(mode)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border text-xs transition-colors ${
                active
                  ? 'border-electric-500/50 bg-electric-500/10 text-electric-400'
                  : 'border-base-600 text-muted hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
