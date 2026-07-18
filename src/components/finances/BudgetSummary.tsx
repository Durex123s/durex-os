import { AlertTriangle } from 'lucide-react';

interface BudgetBar {
  label: string;
  spent: number;
  limit: number;
}

function money(v: number) {
  return `${Math.round(v).toLocaleString('fr-FR')} FCFA`;
}

function BudgetRow({ label, spent, limit }: BudgetBar) {
  const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const over = spent > limit;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-white">{label}</span>
        <span className={over ? 'text-danger' : 'text-muted'}>
          {money(spent)} / {money(limit)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-base-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-danger' : 'bg-electric-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

type BudgetPeriod = Pick<BudgetBar, 'spent' | 'limit'>;

export function BudgetSummary({ budgets }: { budgets: { day: BudgetPeriod; week: BudgetPeriod; month: BudgetPeriod } }) {
  const anyOver = budgets.day.spent > budgets.day.limit || budgets.week.spent > budgets.week.limit || budgets.month.spent > budgets.month.limit;

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted">Budgets automatiques</h3>
        <span className="text-[10px] text-muted">basé sur ta moyenne de revenus/jour</span>
      </div>

      {anyOver && (
        <div className="flex items-center gap-2 text-xs bg-danger/10 border border-danger/30 text-danger rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Tu dépasses ton budget sur au moins une période. Pense à ralentir les dépenses.
        </div>
      )}

      <div className="space-y-4">
        <BudgetRow label="Aujourd'hui" spent={budgets.day.spent} limit={budgets.day.limit} />
        <BudgetRow label="Cette semaine" spent={budgets.week.spent} limit={budgets.week.limit} />
        <BudgetRow label="Ce mois" spent={budgets.month.spent} limit={budgets.month.limit} />
      </div>
    </div>
  );
}
