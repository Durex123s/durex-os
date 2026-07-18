import { RefreshCw, X } from 'lucide-react';
import { useAppUpdate } from '@/hooks/useAppUpdate';

export function UpdateBanner() {
  const { updateAvailable, applyUpdate, dismiss } = useAppUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50">
      <div className="glass-card p-4 flex items-center gap-3">
        <RefreshCw className="w-5 h-5 text-electric-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-white font-medium">Mise à jour disponible</p>
          <p className="text-xs text-muted mt-0.5">Une nouvelle version de Veyrion est prête.</p>
        </div>
        <button
          onClick={() => applyUpdate?.()}
          className="bg-electric-500 hover:bg-electric-600 text-onAccent text-xs font-medium px-3 py-1.5 rounded-lg shrink-0"
        >
          Actualiser
        </button>
        <button onClick={dismiss} aria-label="Fermer" className="shrink-0">
          <X className="w-4 h-4 text-muted hover:text-white" />
        </button>
      </div>
    </div>
  );
}
