import { AttachmentManager } from '@/components/files/AttachmentManager';

export function Fichiers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Fichiers</h1>
        <p className="text-muted text-sm mt-1">
          Importe des documents Word, PDF, Excel ou CSV — ils restent stockés hors-ligne sur cet appareil.
          Pour tes fichiers de cours, importe-les directement depuis la fiche de chaque matière (Études).
        </p>
      </div>
      <AttachmentManager />
    </div>
  );
}
