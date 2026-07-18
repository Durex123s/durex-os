import { useRef, useState, type ChangeEvent } from 'react';
import { Download, Upload, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import { exportAllData, importAllData, exportTransactionsCSV, exportFullReportPDF } from '@/services/backup';

export function BackupSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restored, setRestored] = useState<number | null>(null);

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { tablesRestored } = await importAllData(file);
    setRestored(tablesRestored);
    e.target.value = '';
    setTimeout(() => setRestored(null), 4000);
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white mb-1">Sauvegarde & export</h3>
      <p className="text-xs text-muted mb-4">
        Toutes tes données restent sur cet appareil (hors-ligne). Exporte-les régulièrement pour ne rien perdre.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportAllData}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-onAccent font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Exporter tout (JSON)
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-base-600 text-muted hover:text-white transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Importer une sauvegarde
        </button>
        <button
          onClick={exportTransactionsCSV}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-base-600 text-muted hover:text-white transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Export Excel (transactions)
        </button>
        <button
          onClick={exportFullReportPDF}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-base-600 text-muted hover:text-white transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          Exporter en PDF (rapport complet)
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
      </div>

      {restored !== null && (
        <div className="flex items-center gap-2 text-xs text-success mt-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {restored} table(s) restaurée(s) avec succès.
        </div>
      )}
    </div>
  );
}
