import { useState } from 'react';
import { TrendingDown } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { voltageDrop, voltageDropPercent } from '@/utils/electrical';

export function VoltageDropCalculator() {
  const [length, setLength] = useState('');
  const [current, setCurrent] = useState('');
  const [section, setSection] = useState('2.5');
  const [cosPhi, setCosPhi] = useState('0.8');
  const [nominal, setNominal] = useState('230');
  const [triphase, setTriphase] = useState(false);

  const params = {
    length: parseFloat(length) || 0,
    current: parseFloat(current) || 0,
    section: parseFloat(section) || 0,
    cosPhi: parseFloat(cosPhi) || 0,
    triphase,
  };
  const drop = params.length && params.current && params.section ? voltageDrop(params) : null;
  const percent = drop !== null ? voltageDropPercent(drop, parseFloat(nominal) || 230) : null;
  const acceptable = percent !== null && percent <= 3;

  return (
    <CalculatorCard
      title="Chute de tension"
      icon={TrendingDown}
      note="Norme usuelle : chute admissible ≤ 3% en éclairage, ≤ 5% pour les autres usages."
      result={
        drop !== null && (
          <div className="grid grid-cols-2 gap-y-1 text-white">
            <span className="text-muted">Chute de tension</span><span>{drop.toFixed(2)} V</span>
            <span className="text-muted">En pourcentage</span>
            <span className={acceptable ? 'text-success' : 'text-danger'}>{percent?.toFixed(2)} %</span>
          </div>
        )
      }
    >
      <div className="flex gap-1.5 mb-1">
        {[{ label: 'Monophasé', value: false }, { label: 'Triphasé', value: true }].map((opt) => (
          <button
            key={opt.label}
            onClick={() => setTriphase(opt.value)}
            className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
              triphase === opt.value ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <NumberField label="Longueur du câble" value={length} onChange={setLength} unit="m" />
      <NumberField label="Courant" value={current} onChange={setCurrent} unit="A" />
      <NumberField label="Section du câble" value={section} onChange={setSection} unit="mm²" />
      <NumberField label="Facteur de puissance (cosφ)" value={cosPhi} onChange={setCosPhi} />
      <NumberField label="Tension nominale" value={nominal} onChange={setNominal} unit="V" />
    </CalculatorCard>
  );
}
