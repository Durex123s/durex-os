import { useState, useCallback, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmState {
  message: string;
  resolve: (value: boolean) => void;
}

/**
 * Remplace window.confirm() par une modale cohérente avec le design de
 * l'app. Usage :
 *   const { confirm, dialog } = useConfirm();
 *   async function handleDelete(id: string) {
 *     if (!(await confirm('Supprimer cette tâche ?'))) return;
 *     await db.tasks.delete(id);
 *   }
 *   return (<>...{dialog}</>)
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setState({ message, resolve });
    });
  }, []);

  const handle = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  const dialog: ReactNode = state ? (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => handle(false)}
    >
      <div
        className="glass-card w-full max-w-xs p-5 bg-base-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-danger/10 border border-danger/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <p className="text-sm text-white leading-relaxed pt-1">{state.message}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handle(false)}
            className="flex-1 text-sm py-2 rounded-lg border border-base-600 text-muted hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => handle(true)}
            className="flex-1 text-sm py-2 rounded-lg bg-danger text-white hover:opacity-90 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
