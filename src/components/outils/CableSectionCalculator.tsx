import { useState } from 'react';
import { Cable } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { requiredSection, nearestStandardSection } from '@/utils/electrical';

export function CableSectionCalculator() {
  const [length, setLength] = useState('');
  const [current, setCurrent] = useState('');
  const [maxDropPercent, setMaxDropPercent] = useState('3');
  const [nominal, setNominal] = useState('230');
  const [cosPhi, setCosPhi] = useState('0.8');
  const [triphase, setTriphase] = useState(false);

  const nominalVal = parseFloat(nominal) || 230;
  const maxDrop = ((parseFloat(maxDropPercent) || 0) / 100) * nominalVal;

  const params = {
    length: parseFloat(length) || 0,
    current: parseFloat(current) || 0,
    maxDrop,
    cosPhi: parseFloat(cosPhi) || 0,
    triphase,
  };
  const minSection = params.length && params.current && maxDrop ? requiredSection(params) : null;
  const standard = minSection !== null ? nearestStandardSection(minSection) : null;

  return (
    <CalculatorCard
      title="Choix de la section de câble"
      icon={Cable}
      note="Calcul basé sur la chute de tension admissible. Vérifie aussi l'ampacité (courant max) du câble choisi."
      result={
        minSection !== null && (
          <div className="grid grid-cols-2 gap-y-1 text-white">
            <span className="text-muted">Section minimale</span><span>{minSection.toFixed(2)} mm²</span>
            <span className="text-muted">Section normalisée</span><span className="text-electric-400 font-medium">{standard} mm²</span>
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
      <NumberField label="Chute de tension max." value={maxDropPercent} onChange={setMaxDropPercent} unit="%" />
      <NumberField label="Facteur de puissance (cosφ)" value={cosPhi} onChange={setCosPhi} />
      <NumberField label="Tension nominale" value={nominal} onChange={setNominal} unit="V" />
    </CalculatorCard>
  );
}
