import type { Period } from '@/hooks/useTransactions';

const OPTIONS: { value: Period; label: string }[] = [
  { value: 'jour', label: 'Jour' },
  { value: 'semaine', label: 'Semaine' },
  { value: 'mois', label: 'Mois' },
  { value: 'total', label: 'Total' },
];

export function PeriodToggle({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="inline-flex bg-base-800 border border-base-600 rounded-lg p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            value === opt.value ? 'bg-electric-500 text-onAccent' : 'text-muted hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
