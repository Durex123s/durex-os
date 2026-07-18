import { useState } from 'react';
import { Snowflake } from 'lucide-react';
import { CalculatorCard } from './CalculatorCard';
import { NumberField } from './NumberField';
import { coolingPowerWatts, wattsToBTU } from '@/utils/electrical';

const EXPOSURE_OPTIONS = [
  { label: 'Faible (bien isolé, peu de soleil)', value: 0.8 },
  { label: 'Moyenne', value: 1 },
  { label: 'Forte (mal isolé, plein soleil)', value: 1.3 },
];

export function ClimatisationCalculator() {
  const [surface, setSurface] = useState('');
  const [exposure, setExposure] = useState(1);

  const s = parseFloat(surface) || 0;
  const watts = s > 0 ? coolingPowerWatts(s, exposure) : null;
  const btu = watts !== null ? wattsToBTU(watts) : null;

  return (
    <CalculatorCard
      title="Climatisation"
      icon={Snowflake}
      note="Estimation indicative (≈100 W/m² modulé par l'exposition) — pas un dimensionnement normatif."
      result={
        watts !== null && (
          <div className="grid grid-cols-2 gap-y-1 text-white">
            <span className="text-muted">Puissance nécessaire</span><span>{watts.toFixed(0)} W</span>
            <span className="text-muted">En BTU/h</span><span>{btu?.toFixed(0)} BTU/h</span>
          </div>
        )
      }
    >
      <NumberField label="Surface de la pièce" value={surface} onChange={setSurface} unit="m²" />
      <div>
        <label className="text-xs text-muted mb-1.5 block">Exposition / isolation</label>
        <div className="flex flex-col gap-1.5">
          {EXPOSURE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setExposure(opt.value)}
              className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                exposure === opt.value ? 'bg-electric-500/20 border-electric-500 text-white' : 'border-base-600 text-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </CalculatorCard>
  );
}
