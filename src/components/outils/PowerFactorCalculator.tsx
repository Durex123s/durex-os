import { useState } from 'react';
import { Activity } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { capacitorReactivePower } from '@/utils/electrical';

export function PowerFactorCalculator() {
  const [power, setPower] = useState('');
  const [cosPhi1, setCosPhi1] = useState('0.7');
  const [cosPhi2, setCosPhi2] = useState('0.95');

  const p = parseFloat(power) || 0;
  const c1 = parseFloat(cosPhi1) || 0;
  const c2 = parseFloat(cosPhi2) || 0;
  const qc = p > 0 && c1 > 0 && c2 > 0 ? capacitorReactivePower(p, c1, c2) : null;

  return (
    <CalculatorCard
      title="Facteur de puissance"
      icon={Activity}
      note="Puissance réactive de condensateurs à installer pour relever le cosφ de l'installation."
      result={
        qc !== null && (
          <div className="flex justify-between text-white">
            <span className="text-muted">Puissance réactive (Qc)</span>
            <span>{qc.toFixed(2)} kVAR</span>
          </div>
        )
      }
    >
      <NumberField label="Puissance active" value={power} onChange={setPower} unit="kW" />
      <NumberField label="cosφ actuel" value={cosPhi1} onChange={setCosPhi1} />
      <NumberField label="cosφ visé" value={cosPhi2} onChange={setCosPhi2} />
    </CalculatorCard>
  );
}
