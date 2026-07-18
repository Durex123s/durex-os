import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { FileText, FileSpreadsheet, File as FileIcon, Upload, Download, Trash2, Loader2 } from 'lucide-react';
import { db } from '@/database/db';
import { parseAttachment, downloadAttachment } from '@/lib/fileImport';
import type { Attachment, AttachmentKind } from '@/types';

const KIND_ICON: Record<AttachmentKind, typeof FileText> = {
  docx: FileText,
  pdf: FileText,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  other: FileIcon,
};

const KIND_LABEL: Record<AttachmentKind, string> = {
  docx: 'Word',
  pdf: 'PDF',
  xlsx: 'Excel',
  csv: 'CSV',
  other: 'Fichier',
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

interface AttachmentManagerProps {
  /** Si fourni, limite l'affichage/l'import aux fichiers rattachés à cette matière. */
  subjectId?: string;
  dropLabel?: string;
  emptyLabel?: string;
}

export function AttachmentManager({ subjectId, dropLabel, emptyLabel }: AttachmentManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const attachments = useLiveQuery(async () => {
    const rows = await db.attachments.toArray();
    const filtered = subjectId ? rows.filter((r) => r.subjectId === subjectId) : rows.filter((r) => !r.subjectId);
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [subjectId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setImporting(true);
    try {
      for (const file of Array.from(files)) {
        const attachment = await parseAttachment(file, subjectId);
        await db.attachments.add(attachment);
      }
    } finally {
      setImporting(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleDelete(id: string) {
    await db.attachments.delete(id);
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="glass-card border-2 border-dashed border-base-600 hover:border-electric-500 transition-colors p-6 flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
      >
        {importing ? (
          <Loader2 className="w-5 h-5 text-electric-400 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-electric-400" />
        )}
        <p className="text-sm text-white font-medium">
          {importing ? 'Import en cours...' : (dropLabel ?? 'Touche pour importer un fichier')}
        </p>
        <p className="text-xs text-muted">Word (.docx), PDF, Excel (.xlsx/.xls), CSV</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".docx,.pdf,.xlsx,.xls,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      <div className="space-y-2">
        {attachments?.length === 0 && (
          <p className="text-muted text-sm text-center py-6">
            {emptyLabel ?? 'Aucun fichier importé pour l\'instant.'}
          </p>
        )}

        {attachments?.map((att: Attachment) => {
          const Icon = KIND_ICON[att.kind];
          const isOpen = expanded === att.id;
          return (
            <div key={att.id} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-electric-500/10 border border-electric-500/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-electric-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{att.fileName}</p>
                  <p className="text-xs text-muted">
                    {KIND_LABEL[att.kind]} · {formatSize(att.size)}
                  </p>
                </div>
                <button
                  onClick={() => downloadAttachment(att)}
                  className="text-muted hover:text-electric-400 transition-colors p-1.5"
                  aria-label="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(att.id)}
                  className="text-muted hover:text-danger transition-colors p-1.5"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {(att.textContent || att.rows) && (
                <button
                  onClick={() => setExpanded(isOpen ? null : att.id)}
                  className="text-xs text-electric-400 mt-2"
                >
                  {isOpen ? "Masquer l'aperçu" : "Voir l'aperçu"}
                </button>
              )}

              {isOpen && att.textContent && (
                <p className="text-xs text-muted mt-2 whitespace-pre-wrap max-h-48 overflow-y-auto border-t border-base-600 pt-2">
                  {att.textContent.slice(0, 3000)}
                  {att.textContent.length > 3000 ? '…' : ''}
                </p>
              )}

              {isOpen && att.rows && (
                <div className="mt-2 border-t border-base-600 pt-2 overflow-x-auto">
                  <table className="text-xs text-muted w-full">
                    <tbody>
                      {att.rows.slice(0, 30).map((row, i) => (
                        <tr key={i} className={i === 0 ? 'text-white font-medium' : ''}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-2 py-1 border-b border-base-700 whitespace-nowrap">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
