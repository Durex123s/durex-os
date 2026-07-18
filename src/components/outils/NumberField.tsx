interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  placeholder?: string;
}

export function NumberField({ label, value, onChange, unit, placeholder }: NumberFieldProps) {
  return (
    <div>
      <label className="text-xs text-muted mb-1 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white focus:border-electric-500 outline-none transition-colors pr-12"
        />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{unit}</span>}
      </div>
    </div>
  );
}
