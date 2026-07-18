import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { computeBadges } from '@/utils/discipline';

export function BadgesShowcase() {
  const habits = useLiveQuery(() => db.habits.toArray(), [], []);
  const sessions = useLiveQuery(() => db.pomodoroSessions.toArray(), [], []);

  if (!habits || !sessions) return null;

  const badges = computeBadges(habits, sessions);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-white">Récompenses</h3>
        <span className="text-xs text-muted">{unlockedCount}/{badges.length}</span>
      </div>
      <p className="text-xs text-muted mb-4">Débloquées automatiquement selon ta progression.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {badges.map((b) => (
          <div
            key={b.id}
            title={b.description}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-colors ${
              b.unlocked
                ? 'border-electric-500/40 bg-electric-500/10'
                : 'border-base-700 bg-base-800/40 opacity-40 grayscale'
            }`}
          >
            <span className="text-2xl leading-none">{b.emoji}</span>
            <span className="text-[10px] text-white leading-tight">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
