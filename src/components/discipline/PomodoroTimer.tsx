import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, RotateCcw, Settings, X } from 'lucide-react';
import { usePomodoro } from '@/hooks/usePomodoro';
import type { PomodoroType } from '@/types';

const TYPE_LABELS: Record<PomodoroType, string> = { etude: 'Étude', travail: 'Travail', repos: 'Repos' };
const TYPES: PomodoroType[] = ['etude', 'travail', 'repos'];

export function PomodoroTimer() {
  const { type, changeType, running, toggle, reset, minutes, seconds, percent, durations, setCustomDuration } = usePomodoro();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<PomodoroType, string>>({
    etude: String(durations.etude),
    travail: String(durations.travail),
    repos: String(durations.repos),
  });

  const openEdit = () => {
    setDraft({ etude: String(durations.etude), travail: String(durations.travail), repos: String(durations.repos) });
    setEditing(true);
  };

  const saveEdit = async () => {
    for (const t of TYPES) {
      const value = parseInt(draft[t], 10);
      if (value > 0 && value <= 180) {
        await setCustomDuration(t, value);
      }
    }
    setEditing(false);
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="glass-card p-5 flex flex-col items-center relative">
      <button
        onClick={openEdit}
        className="absolute top-4 right-4 text-muted hover:text-electric-400 transition-colors"
        aria-label="Régler les durées"
      >
        <Settings className="w-4 h-4" />
      </button>

      <div className="flex gap-1.5 bg-base-800 rounded-xl p-1 mb-5 self-stretch justify-center">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => changeType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              type === t ? 'bg-electric-500 text-onAccent font-medium' : 'text-muted hover:text-white'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="relative w-40 h-40 mb-5">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" strokeWidth="10" style={{ stroke: 'rgb(var(--color-bg-700))' }} />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-display font-semibold text-white tabular-nums">
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-[200px]">
        <div className="flex justify-end pr-3">
          <button
            onClick={reset}
            className="p-3 rounded-full border border-base-600 text-muted hover:text-white transition-colors"
            aria-label="Réinitialiser"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={toggle}
          className="p-4 rounded-full bg-electric-500 hover:bg-electric-600 text-onAccent shadow-glow transition-colors"
          aria-label={running ? 'Pause' : 'Démarrer'}
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <div />
      </div>

      {editing && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(false)}>
          <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">Durées Pomodoro</h3>
              <button onClick={() => setEditing(false)} className="text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {TYPES.map((t) => (
              <div key={t} className="mb-4">
                <label className="text-xs text-muted mb-1 block">{TYPE_LABELS[t]} (minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={draft[t]}
                  onChange={(e) => setDraft((d) => ({ ...d, [t]: e.target.value }))}
                  className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors"
                />
              </div>
            ))}

            <button
              onClick={saveEdit}
              className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-onAccent font-medium transition-colors mt-1"
            >
              Enregistrer
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
