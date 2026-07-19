import { Link } from 'react-router-dom';
import { WidgetCard } from './WidgetCard';
import { Wallet } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import clsx from 'clsx';

function formatFCFA(value: number) {
  return `${Math.round(value).toLocaleString('fr-FR')} FCFA`;
}

export function FinanceWidget() {
  const { solde, totalRevenus, totalDepenses, budgets } = useTransactions();
  const overBudget = budgets.day.spent > budgets.day.limit;

  return (
    <WidgetCard
      title="Finances"
      icon={<Wallet className="w-4 h-4" />}
      action={
        <Link to="/finances" className="text-xs text-electric-400 hover:underline">
          Voir tout
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted">Solde actuel</p>
          <p className="text-lg font-display font-semibold text-white">
            <AnimatedNumber value={Math.round(solde)} format={formatFCFA} />
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Revenus (total)</p>
          <p className="text-sm text-success">+{formatFCFA(totalRevenus)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Dépenses (total)</p>
          <p className="text-sm text-danger">-{formatFCFA(totalDepenses)}</p>
        </div>
      </div>

      {overBudget ? (
        <div className="text-xs bg-danger/10 border border-danger/30 text-danger rounded-lg px-3 py-2">
          Budget journalier dépassé : {formatFCFA(budgets.day.spent)} / {formatFCFA(budgets.day.limit)}
        </div>
      ) : (
        <div className={clsx('text-xs text-muted')}>
          Budget du jour : {formatFCFA(budgets.day.spent)} / {formatFCFA(budgets.day.limit)}
        </div>
      )}
    </WidgetCard>
  );
}
