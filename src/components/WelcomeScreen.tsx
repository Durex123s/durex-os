import { useEffect, useState, type ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/db';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export function WelcomeScreen({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const photoRow = useLiveQuery(() => db.settings.get('profilePhoto'), []);
  const nameRow = useLiveQuery(() => db.settings.get('profileName'), []);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => setVisible(false), 320);
  };

  useEffect(() => {
    const t = setTimeout(dismiss, 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return <>{children}</>;

  const photo = photoRow?.value;
  const name = nameRow?.value;

  return (
    <div
      onClick={dismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-950 transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-28 h-28 rounded-full p-[3px] mb-5 bg-electric-500 shadow-glow">
        <div className="w-full h-full rounded-full overflow-hidden bg-base-800 flex items-center justify-center border-2 border-base-950">
          {photo ? (
            <img src={photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-3xl text-white">{(name?.[0] ?? 'V').toUpperCase()}</span>
          )}
        </div>
      </div>
      <p className="text-xs tracking-[0.3em] uppercase text-muted mb-2">{getGreeting()}</p>
      <h1 className="font-display text-2xl font-semibold text-white px-6 text-center">
        {name ? name : 'Bienvenue'}
      </h1>
      <p className="text-xs text-muted mt-1">Veyrion</p>
    </div>
  );
}
