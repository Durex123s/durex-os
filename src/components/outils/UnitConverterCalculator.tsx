import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { UNIT_CONVERTERS, type UnitConversion } from '@/utils/electrical';

const GROUPS: { label: string; conversions: UnitConversion[] }[] = [
  { label: 'Puissance', conversions: ['W→kW', 'kW→W', 'W→HP', 'HP→W'] },
  { label: 'Courant', conversions: ['A→mA', 'mA→A'] },
  { label: 'Tension', conversions: ['V→kV', 'kV→V'] },
  { label: 'Résistance', conversions: ['Ω→kΩ', 'kΩ→Ω'] },
];

export function UnitConverterCalculator() {
  const [conversion, setConversion] = useState<UnitConversion>('W→kW');
  const [value, setValue] = useState('');

  const v = parseFloat(value) || 0;
  const result = value ? UNIT_CONVERTERS[conversion](v) : null;

  return (
    <CalculatorCard
      title="Conversion d'unités"
      icon={ArrowRightLeft}
      result={
        result !== null && (
          <div className="flex justify-between text-white">
            <span className="text-muted">{conversion}</span>
            <span>{result.toLocaleString('fr-FR', { maximumFractionDigits: 4 })}</span>
          </div>
        )
      }
    >
      {GROUPS.map((group) => (
        <div key={group.label}>
          <label className="text-xs text-muted mb-1.5 block">{group.label}</label>
          <div className="flex flex-wrap gap-1.5">
            {group.conversions.map((c) => (
              <button
                key={c}
                onClick={() => setConversion(c)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  conversion === c ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ))}
      <NumberField label="Valeur" value={value} onChange={setValue} />
    </CalculatorCard>
  );
}
