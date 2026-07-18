import { useState } from 'react';
import { Zap } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { ohmSolve } from '@/utils/electrical';

export function OhmCalculator() {
  const [u, setU] = useState('');
  const [i, setI] = useState('');
  const [r, setR] = useState('');

  const parsed = {
    u: u ? parseFloat(u) : undefined,
    i: i ? parseFloat(i) : undefined,
    r: r ? parseFloat(r) : undefined,
  };
  const filledCount = [parsed.u, parsed.i, parsed.r].filter((v) => v !== undefined).length;
  const result = filledCount >= 2 ? ohmSolve(parsed) : null;

  return (
    <CalculatorCard
      title="Loi d'Ohm"
      icon={Zap}
      note="Remplis deux valeurs pour calculer les autres (U = R × I)."
      result={
        result && (
          <div className="grid grid-cols-2 gap-y-1 text-white">
            <span className="text-muted">Tension (U)</span><span>{result.u.toFixed(2)} V</span>
            <span className="text-muted">Courant (I)</span><span>{result.i.toFixed(3)} A</span>
            <span className="text-muted">Résistance (R)</span><span>{result.r.toFixed(2)} Ω</span>
            <span className="text-muted">Puissance (P)</span><span>{result.p.toFixed(2)} W</span>
          </div>
        )
      }
    >
      <NumberField label="Tension" value={u} onChange={setU} unit="V" />
      <NumberField label="Courant" value={i} onChange={setI} unit="A" />
      <NumberField label="Résistance" value={r} onChange={setR} unit="Ω" />
    </CalculatorCard>
  );
}
