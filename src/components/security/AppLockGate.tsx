import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';
import { sha256 } from '@/utils/hash';
import { verifyBiometric } from '@/utils/biometric';
import { Lock, Fingerprint } from 'lucide-react';

export function AppLockGate({ children }: { children: ReactNode }) {
  const pinHash = useLiveQuery(() => db.settings.get('lockPinHash'), []);
  const bioSetting = useLiveQuery(() => db.settings.get('biometricEnabled'), []);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [bioChecking, setBioChecking] = useState(false);
  const triedRef = useRef(false);

  const bioEnabled = bioSetting?.value === 'true';

  useEffect(() => {
    if (!pinHash || unlocked || !bioEnabled || triedRef.current) return;
    triedRef.current = true;
    setBioChecking(true);
    verifyBiometric().then((ok) => {
      setBioChecking(false);
      if (ok) setUnlocked(true);
    });
  }, [pinHash, unlocked, bioEnabled]);

  if (pinHash === undefined || !pinHash) return <>{children}</>;
  if (unlocked) return <>{children}</>;

  const handleSubmit = async () => {
    const hash = await sha256(pin);
    if (hash === pinHash.value) {
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 1500);
    }
  };

  const retryBiometric = async () => {
    setBioChecking(true);
    const ok = await verifyBiometric();
    setBioChecking(false);
    if (ok) setUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-xs p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-5 h-5 text-electric-400" />
        </div>
        <h2 className="font-display text-lg font-semibold text-white mb-1">Veyrion verrouillé</h2>
        <p className="text-xs text-muted mb-4">
          {bioChecking ? 'Vérification biométrique…' : 'Entre ton code pour continuer.'}
        </p>

        {bioEnabled && !bioChecking && (
          <button
            onClick={retryBiometric}
            className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg border border-electric-500/40 text-electric-400 hover:bg-electric-500/10 transition-colors mb-4"
          >
            <Fingerprint className="w-4 h-4" />
            Utiliser l'empreinte / Face ID
          </button>
        )}

        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus={!bioEnabled}
          className={`w-full bg-base-800 border rounded-lg px-3 py-2.5 text-sm text-white text-center tracking-[0.4em] outline-none transition-colors mb-3 ${
            error ? 'border-danger' : 'border-base-600 focus:border-electric-500'
          }`}
        />
        {error && <p className="text-xs text-danger mb-3">Code incorrect.</p>}
        <button
          onClick={handleSubmit}
          disabled={pin.length < 4}
          className="w-full text-sm px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 disabled:opacity-40 disabled:cursor-not-allowed text-onAccent font-medium transition-colors"
        >
          Déverrouiller
        </button>
      </div>
    </div>
  );
}
