import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Zap } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { EmptyState } from '@/components/ui/EmptyState';
import { OhmCalculator } from '@/components/outils/OhmCalculator';
import { PowerCalculator } from '@/components/outils/PowerCalculator';
import { VoltageDropCalculator } from '@/components/outils/VoltageDropCalculator';
import { CableSectionCalculator } from '@/components/outils/CableSectionCalculator';
import { BreakerCalculator } from '@/components/outils/BreakerCalculator';
import { PowerFactorCalculator } from '@/components/outils/PowerFactorCalculator';
import { ClimatisationCalculator } from '@/components/outils/ClimatisationCalculator';
import { UnitConverterCalculator } from '@/components/outils/UnitConverterCalculator';
import { SymbolLibrary } from '@/components/outils/SymbolLibrary';

type Tab = 'calculatrices' | 'symboles';

export function Outils() {
  const [tab, setTab] = useState<Tab>('calculatrices');
  const { get, loaded } = useAppSettings();
  const enabled = get('showElectricianTools') === 'true';

  if (loaded && !enabled) {
    return (
      <EmptyState
        icon={Zap}
        title="Outils électricien désactivés"
        description="Ce module de calculatrices professionnelles est masqué par défaut. Active-le dans Paramètres si tu en as besoin."
        action={
          <Link
            to="/parametres"
            className="flex items-center gap-1.5 bg-electric-500 hover:bg-electric-600 text-onAccent font-medium text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            Aller dans Paramètres
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Outils électricien</h1>
        <p className="text-muted text-sm mt-1">Calculatrices professionnelles et bibliothèque de symboles.</p>
      </div>

      <div className="flex gap-1 bg-base-800 rounded-xl p-1 w-fit">
        {(['calculatrices', 'symboles'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs capitalize transition-colors',
              tab === t ? 'bg-electric-500 text-onAccent font-medium' : 'text-muted hover:text-white'
            )}
          >
            {t === 'calculatrices' ? 'Calculatrices' : 'Symboles électriques'}
          </button>
        ))}
      </div>

      {tab === 'calculatrices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <OhmCalculator />
          <PowerCalculator />
          <VoltageDropCalculator />
          <CableSectionCalculator />
          <BreakerCalculator />
          <PowerFactorCalculator />
          <ClimatisationCalculator />
          <UnitConverterCalculator />
        </div>
      )}

      {tab === 'symboles' && <SymbolLibrary />}
    </div>
  );
}
