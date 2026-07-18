import { useState } from 'react';
import { X } from 'lucide-react';
import type { Transaction, TransactionType } from '@/types';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types';
import { ModalPortal } from '@/components/ui/ModalPortal';

interface TransactionModalProps {
  onClose: () => void;
  onSave: (t: Transaction) => void;
  editing?: Transaction;
}

export function TransactionModal({ onClose, onSave, editing }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(editing?.type ?? 'depense');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [category, setCategory] = useState(editing?.category ?? DEFAULT_EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState(editing?.note ?? '');

  const categories = type === 'depense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;
  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory(t === 'depense' ? DEFAULT_EXPENSE_CATEGORIES[0] : DEFAULT_INCOME_CATEGORIES[0]);
  };

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    onSave({
      id: editing?.id ?? crypto.randomUUID(),
      type,
      amount: value,
      category,
      note: note.trim() || undefined,
      date: editing?.date ?? new Date().toISOString(),
    });
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="glass-card w-full max-w-sm p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">{editing ? 'Modifier la transaction' : 'Nouvelle transaction'}</h3>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1.5 mb-4">
            {(['depense', 'revenu'] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`flex-1 text-sm py-2 rounded-lg border capitalize transition-colors ${
                  type === t
                    ? t === 'depense'
                      ? 'bg-danger/15 border-danger text-white'
                      : 'bg-success/15 border-success text-white'
                    : 'border-base-600 text-muted hover:text-white'
                }`}
              >
                {t === 'depense' ? 'Dépense' : 'Revenu'}
              </button>
            ))}
          </div>

          <label className="text-xs text-muted mb-1 block">Montant (FCFA)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            autoFocus
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-4"
          />

          <label className="text-xs text-muted mb-1.5 block">Catégorie</label>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  category === c ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="text-xs text-muted mb-1 block">Note (optionnel)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex : Marché du dimanche"
            className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors mb-5"
          />

          <button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
          >
            {editing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
