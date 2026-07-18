import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '@/types';
import { useConfirm } from '@/hooks/useConfirm';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function TransactionHistory({
  transactions,
  onDelete,
  onEdit,
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}) {
  const { confirm, dialog } = useConfirm();

  const handleDelete = async (id: string) => {
    if (!(await confirm('Supprimer cette transaction ?'))) return;
    onDelete(id);
  };

  return (
    <div className="glass-card p-5">
      {dialog}
      <h3 className="text-sm font-medium text-muted mb-4">Historique</h3>
      {transactions.length === 0 && <p className="text-sm text-muted">Aucune transaction pour l'instant.</p>}
      <ul className="space-y-1.5 max-h-80 overflow-y-auto">
        {transactions.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 group py-1.5 cursor-pointer rounded-lg hover:bg-base-800/60 transition-colors px-1"
              onClick={() => onEdit(t)}
            >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                t.type === 'revenu' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
              }`}
            >
              {t.type === 'revenu' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{t.note || t.category}</p>
              <p className="text-xs text-muted">
                {t.category} · {formatDate(t.date)}
              </p>
            </div>
            <span className={`text-sm tabular-nums ${t.type === 'revenu' ? 'text-success' : 'text-danger'}`}>
              {t.type === 'revenu' ? '+' : '-'}
              {t.amount.toLocaleString('fr-FR')}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(t.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-opacity"
              aria-label="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
