import { Zap } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

export function ElectricianToolsSection() {
  const { get, set } = useAppSettings();
  const enabled = get('showElectricianTools') === 'true';

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-4 h-4 text-electric-400" />
        <h3 className="text-sm font-medium text-white">Outils électricien</h3>
      </div>
      <p className="text-xs text-muted mb-4">
        Calculatrices professionnelles (loi d'Ohm, chute de tension, disjoncteurs...) et bibliothèque
        de symboles électriques. Masqué par défaut — active si tu en as besoin dans ton métier.
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-white">Afficher ce module</span>
        <button
          onClick={() => set('showElectricianTools', enabled ? 'false' : 'true')}
          className={`w-10 h-6 rounded-full transition-colors relative ${enabled ? 'bg-electric-500' : 'bg-base-700'}`}
          aria-label={enabled ? 'Désactiver' : 'Activer'}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#ffffff] transition-transform ${
              enabled ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
