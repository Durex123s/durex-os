import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { recommendedBreaker } from '@/utils/electrical';

export function BreakerCalculator() {
  const [current, setCurrent] = useState('');
  const [margin, setMargin] = useState('25');

  const iVal = parseFloat(current) || 0;
  const marginFactor = 1 + (parseFloat(margin) || 0) / 100;
  const breaker = iVal > 0 ? recommendedBreaker(iVal, marginFactor) : null;

  return (
    <CalculatorCard
      title="Choix du disjoncteur"
      icon={ShieldCheck}
      note="Calibre normalisé le plus proche, au-dessus du courant d'emploi majoré de la marge de sécurité."
      result={
        breaker !== null && (
          <div className="flex justify-between text-white">
            <span className="text-muted">Calibre recommandé</span>
            <span className="text-electric-400 font-medium">{breaker} A</span>
          </div>
        )
      }
    >
      <NumberField label="Courant d'emploi (Ib)" value={current} onChange={setCurrent} unit="A" />
      <NumberField label="Marge de sécurité" value={margin} onChange={setMargin} unit="%" />
    </CalculatorCard>
  );
}
