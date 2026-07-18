import { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets';
import { DEFAULT_EXPENSE_CATEGORIES, type BudgetPeriod } from '@/types';

const PERIOD_LABELS: Record<BudgetPeriod, string> = {
  jour: 'par jour',
  semaine: 'par semaine',
  mois: 'par mois',
};

function money(v: number) {
  return `${Math.round(v).toLocaleString('fr-FR')} FCFA`;
}

export function CategoryBudgetsSection() {
  const { budgets, addBudget, deleteBudget } = useCategoryBudgets();
  const [adding, setAdding] = useState(false);
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [period, setPeriod] = useState<BudgetPeriod>('mois');
  const [limit, setLimit] = useState('');

  const availableCategories = DEFAULT_EXPENSE_CATEGORIES.filter(
    (c) => !budgets.some((b) => b.category === c)
  );

  async function handleAdd() {
    const value = Number(limit);
    if (!value || value <= 0) return;
    await addBudget(category, value, period);
    setLimit('');
    setAdding(false);
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted">Budgets par catégorie</h3>
        {availableCategories.length > 0 && (
          <button
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-1 text-xs text-electric-400 hover:text-electric-500"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        )}
      </div>

      {adding && (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-base-800 border border-base-600 rounded-lg text-sm text-white px-2 py-1.5"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as BudgetPeriod)}
            className="bg-base-800 border border-base-600 rounded-lg text-sm text-white px-2 py-1.5"
          >
            <option value="jour">Jour</option>
            <option value="semaine">Semaine</option>
            <option value="mois">Mois</option>
          </select>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Plafond FCFA"
            className="bg-base-800 border border-base-600 rounded-lg text-sm text-white px-2 py-1.5 w-32"
          />
          <button
            onClick={handleAdd}
            className="bg-electric-500 hover:bg-electric-600 text-onAccent text-xs font-medium px-3 py-1.5 rounded-lg"
          >
            OK
          </button>
        </div>
      )}

      {budgets.length === 0 ? (
        <p className="text-sm text-muted">Aucun budget par catégorie défini pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {budgets.map((b) => {
            const percent = b.limit > 0 ? Math.min(100, Math.round((b.spent / b.limit) * 100)) : 0;
            const over = b.spent > b.limit;
            return (
              <div key={b.id}>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-white">
                    {b.category} <span className="text-muted text-xs">({PERIOD_LABELS[b.period]})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={over ? 'text-danger' : 'text-muted'}>
                      {money(b.spent)} / {money(b.limit)}
                    </span>
                    <button onClick={() => deleteBudget(b.id)} aria-label="Supprimer">
                      <Trash2 className="w-3.5 h-3.5 text-muted hover:text-danger" />
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-base-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-danger' : 'bg-electric-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {over && (
                  <div className="flex items-center gap-1.5 text-xs text-danger mt-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Dépassement sur {b.category}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
