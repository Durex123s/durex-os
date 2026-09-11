import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useCharacter } from '@/store/useCharacter';

// Bandeau discret affiché uniquement quand le navigateur détecte une perte
// de connexion — rassure l'utilisateur que l'app continue de fonctionner
// (tout est en local/IndexedDB) plutôt que de le laisser deviner.
export function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const react = useCharacter((s) => s.react);

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      react('connection', { duration: 2500 });
    };
    const goOffline = () => {
      setOnline(false);
      react('disconnection', { duration: 2500 });
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [react]);

  if (online) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-warning/90 text-onAccent text-xs font-medium py-1.5">
      <WifiOff className="w-3.5 h-3.5" />
      Hors-ligne — tes données restent enregistrées localement.
    </div>
  );
}
