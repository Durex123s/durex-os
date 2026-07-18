import { useState } from 'react';
import { Gauge } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { calcPower } from '@/utils/electrical';

export function PowerCalculator() {
  const [u, setU] = useState('230');
  const [i, setI] = useState('');
  const [cosPhi, setCosPhi] = useState('0.8');
  const [triphase, setTriphase] = useState(false);

  const uVal = parseFloat(u) || 0;
  const iVal = parseFloat(i) || 0;
  const cosVal = parseFloat(cosPhi) || 0;
  const power = iVal > 0 ? calcPower(uVal, iVal, cosVal, triphase) : null;

  return (
    <CalculatorCard
      title="Puissance"
      icon={Gauge}
      note="Monophasé : P = U × I × cosφ. Triphasé : P = √3 × U × I × cosφ."
      result={
        power !== null && (
          <div className="flex justify-between text-white">
            <span className="text-muted">Puissance active</span>
            <span>{power.toFixed(1)} W ({(power / 1000).toFixed(2)} kW)</span>
          </div>
        )
      }
    >
      <div className="flex gap-1.5 mb-1">
        {[
          { label: 'Monophasé', value: false },
          { label: 'Triphasé', value: true },
        ].map((opt) => (
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
      <NumberField label="Tension" value={u} onChange={setU} unit="V" />
      <NumberField label="Courant" value={i} onChange={setI} unit="A" />
      <NumberField label="Facteur de puissance (cosφ)" value={cosPhi} onChange={setCosPhi} />
    </CalculatorCard>
  );
}
