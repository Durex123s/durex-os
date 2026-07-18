import { useEffect, useState } from 'react';
import { Lock, Fingerprint, Check, X } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { sha256 } from '@/utils/hash';
import { isBiometricAvailable, verifyBiometric } from '@/utils/biometric';
import { ModalPortal } from '@/components/ui/ModalPortal';

export function SecuritySection() {
  const { get, set, remove, loaded } = useAppSettings();
  const [settingPin, setSettingPin] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioBusy, setBioBusy] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBioAvailable);
  }, []);

  const pinEnabled = !!get('lockPinHash');
  const bioEnabled = get('biometricEnabled') === 'true';

  const handleToggleBiometric = async () => {
    if (bioEnabled) {
      await remove('biometricEnabled');
      return;
    }
    setBioBusy(true);
    const ok = await verifyBiometric('Active le déverrouillage biométrique pour Veyrion.');
    setBioBusy(false);
    if (ok) {
      await set('biometricEnabled', 'true');
    } else {
      setError("Vérification biométrique échouée, réessaie.");
    }
  };

  const handleSetPin = async () => {
    if (pin.length < 4) return setError('Le code doit faire au moins 4 chiffres.');
    if (pin !== confirmPin) return setError('Les deux codes ne correspondent pas.');
    await set('lockPinHash', await sha256(pin));
    setSettingPin(false);
    setPin('');
    setConfirmPin('');
    setError('');
  };

  const handleRemovePin = () => remove('lockPinHash');

  if (!loaded) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white mb-1">Sécurité</h3>
      <p className="text-xs text-muted mb-4">Protège l'accès à l'app par un code, en plus de l'écran de verrouillage du téléphone.</p>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-sm text-white">
          <Lock className="w-4 h-4 text-muted" />
          Code PIN
        </div>
        {pinEnabled ? (
          <button onClick={handleRemovePin} className="text-xs text-danger hover:underline">
            Désactiver
          </button>
        ) : (
          <button onClick={() => setSettingPin(true)} className="text-xs text-electric-400 hover:underline">
            Activer
          </button>
        )}
      </div>

      <div className={`flex items-center justify-between py-2 ${bioAvailable ? '' : 'opacity-50'}`}>
        <div className="flex items-center gap-2 text-sm text-white">
          <Fingerprint className="w-4 h-4 text-muted" />
          Biométrie (empreinte / Face ID)
        </div>
        {!bioAvailable ? (
          <span className="text-xs text-muted">Indisponible sur cet appareil</span>
        ) : bioEnabled ? (
          <button onClick={handleToggleBiometric} className="text-xs text-danger hover:underline">
            Désactiver
          </button>
        ) : (
          <button onClick={handleToggleBiometric} disabled={bioBusy} className="text-xs text-electric-400 hover:underline disabled:opacity-50">
            {bioBusy ? 'Vérification…' : 'Activer'}
          </button>
        )}
      </div>
      <p className="text-[11px] text-muted mt-1">
        {bioAvailable
          ? "Une fois activée, tu pourras déverrouiller l'app avec ton empreinte ou ton visage, en plus du code PIN."
          : "La biométrie n'est disponible que dans l'app installée (pas dans le navigateur)."}
      </p>

      {settingPin && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSettingPin(false)}>
            <div className="glass-card w-full max-w-xs p-6 bg-base-900/95" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Définir un code PIN</h3>
                <button onClick={() => setSettingPin(false)} className="text-muted hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Nouveau code"
                autoFocus
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white text-center tracking-[0.3em] focus:border-electric-500 outline-none transition-colors mb-3"
              />
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Confirmer le code"
                className="w-full bg-base-800 border border-base-600 rounded-lg px-3 py-2 text-sm text-white text-center tracking-[0.3em] focus:border-electric-500 outline-none transition-colors mb-3"
              />
              {error && <p className="text-xs text-danger mb-3">{error}</p>}
              <button
                onClick={handleSetPin}
                className="w-full flex items-center justify-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-onAccent font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                Activer le code PIN
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
