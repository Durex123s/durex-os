import { useState } from 'react';
import type { Transaction } from '@/types';
import { Plus } from 'lucide-react';
import { useTransactions, type Period } from '@/hooks/useTransactions';
import { PeriodToggle } from '@/components/finances/PeriodToggle';
import { TransactionModal } from '@/components/finances/TransactionModal';
import { BudgetSummary } from '@/components/finances/BudgetSummary';
import { CategoryBudgetsSection } from '@/components/finances/CategoryBudgetsSection';
import { CategoryChart } from '@/components/finances/CategoryChart';
import { SavingsGoalsWidget } from '@/components/finances/SavingsGoalsWidget';
import { TransactionHistory } from '@/components/finances/TransactionHistory';

export function Finances() {
  const [period, setPeriod] = useState<Period>('total');
  const { transactions, addTransaction, updateTransaction, deleteTransaction, solde, periodRevenus, periodDepenses, budgets, categoryBreakdown, todayDisponible } =
    useTransactions(period);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Finances</h1>
          <p className="text-muted text-sm mt-1">Budgets automatiques et suivi de tes dépenses.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Transaction
        </button>
      </div>

      <PeriodToggle value={period} onChange={setPeriod} />

      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Épargne possible aujourd'hui</p>
          <p className="text-muted text-[11px] mt-0.5">Revenus du jour moins dépenses du jour</p>
        </div>
        <p className={`text-xl font-display font-semibold ${todayDisponible >= 0 ? 'text-success' : 'text-danger'}`}>
          {todayDisponible >= 0 ? '+' : ''}{Math.round(todayDisponible).toLocaleString('fr-FR')} FCFA
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Solde actuel</p>
          <p className="text-2xl font-display font-semibold text-white mt-1">{solde.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Revenus ({period})</p>
          <p className="text-2xl font-display font-semibold text-success mt-1">+{periodRevenus.toLocaleString('fr-FR')}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted">Dépenses ({period})</p>
          <p className="text-2xl font-display font-semibold text-danger mt-1">-{periodDepenses.toLocaleString('fr-FR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BudgetSummary budgets={budgets} />
        <CategoryBudgetsSection />
        <CategoryChart data={categoryBreakdown} />
        <SavingsGoalsWidget />
        <TransactionHistory
          transactions={transactions}
          onDelete={deleteTransaction}
          onEdit={(t) => setEditingTransaction(t)}
        />
      </div>

      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} onSave={addTransaction} />}
      {editingTransaction && (
        <TransactionModal
          editing={editingTransaction}
          onClose={() => setEditingTransaction(undefined)}
          onSave={updateTransaction}
        />
      )}
    </div>
  );
}
