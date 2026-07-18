import { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { useSavingsGoals, useTransactions } from '@/hooks/useTransactions';
import { ModalPortal } from '@/components/ui/ModalPortal';

export function SavingsGoalsWidget() {
  const { goals, addGoal, contribute } = useSavingsGoals();
  const { avgDailySavings } = useTransactions();
  const [contributing, setContributing] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const handleContribute = (id: string) => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    contribute(id, value);
    setAmount('');
    setContributing(null);
  };

  const handleCreate = () => {
    const t = parseFloat(target);
    if (!title.trim() || !t || t <= 0) return;
    addGoal({ id: crypto.randomUUID(), title: title.trim(), target: t, current: 0, createdAt: new Date().toISOString() });
    setTitle('');
    setTarget('');
    setCreating(false);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Target className="w-4 h-4" />
          <span>Objectifs d'épargne</span>
        </div>
        <button onClick={() => setCreating(true)} className="text-muted hover:text-electric-400 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((g) => {
          const percent = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
          const remaining = g.target - g.current;
          let estimation: string;
          if (remaining <= 0) {
            estimation = 'Objectif atteint 🎉';
          } else if (avgDailySavings > 0) {
            const daysLeft = Math.ceil(remaining / avgDailySavings);
            estimation =
              daysLeft <= 60
                ? `≈ ${daysLeft} jour${daysLeft > 1 ? 's' : ''} au rythme actuel`
                : `≈ ${Math.round(daysLeft / 30)} mois au rythme actuel`;
          } else {
            estimation = "Rythme d'épargne actuel insuffisant pour estimer";
          }
          return (
            <div key={g.id}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white">{g.title}</span>
                <span className="text-muted">
                  {g.current.toLocaleString('fr-FR')} / {g.target.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <p className="text-[11px] text-muted mb-1.5">{estimation}</p>
              <div className="h-1.5 rounded-full bg-base-700 overflow-hidden mb-2">
                <div className="h-full rounded-full bg-electric-500 transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>
              {contributing === g.id ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Montant"
                    autoFocus
                    className="flex-1 bg-base-800 border border-base-600 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric-500 outline-none transition-colors"
                  />
                  <button
                    onClick={() => handleContribute(g.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-electric-500 hover:bg-electric-600 text-onAccent font-medium transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              ) : (
                <button onClick={() => setContributing(g.id)} className="text-xs text-electric-400 hover:underline">
                  + Ajouter une contribution
                </button>
              )}
            </div>
          );
        })}
      </div>

      {creating && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setCreating(false)}>
            <div className="glass-card w-full max-w-sm p-6 bg-base-900/95 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-display text-lg font-semibold text-white mb-4">Nouvel objectif</h3>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Épargner pour un ordinateur"
                autoFocus
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-3"
              />
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Montant cible (FCFA)"
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
              />
              <button
                onClick={handleCreate}
                disabled={!title.trim() || !target}
                className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
              >
                Créer l'objectif
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
