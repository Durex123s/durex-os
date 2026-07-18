import type { Attachment, AttachmentKind } from '@/types';

function detectKind(file: File): AttachmentKind {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'docx') return 'docx';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
  if (ext === 'csv') return 'csv';
  return 'other';
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value.trim();
}

async function extractPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
    pages.push(text);
  }
  return pages.join('\n\n').trim();
}

async function extractSpreadsheet(file: File): Promise<string[][]> {
  const XLSX = await import('xlsx');
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, blankrows: false });
  return rows.map((row) => row.map((cell) => (cell == null ? '' : String(cell))));
}

/**
 * Parse un fichier Word / PDF / Excel / CSV et retourne un Attachment prêt
 * à être stocké dans Dexie (db.attachments.add(...)).
 */
export async function parseAttachment(file: File, subjectId?: string): Promise<Attachment> {
  const kind = detectKind(file);
  const base: Attachment = {
    id: crypto.randomUUID(),
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    kind,
    subjectId,
    blob: file,
    createdAt: new Date().toISOString(),
  };

  try {
    if (kind === 'docx') {
      base.textContent = await extractDocx(file);
    } else if (kind === 'pdf') {
      base.textContent = await extractPdf(file);
    } else if (kind === 'xlsx' || kind === 'csv') {
      base.rows = await extractSpreadsheet(file);
    }
  } catch (err) {
    // On garde le fichier même si l'extraction échoue (ex: PDF scanné/image) —
    // l'utilisateur peut toujours le télécharger et l'ouvrir ailleurs.
    base.textContent = undefined;
    console.warn(`[attachments] Extraction impossible pour ${file.name}:`, err);
  }

  return base;
}

/** Déclenche le téléchargement d'une pièce jointe stockée. */
export function downloadAttachment(attachment: Attachment) {
  const url = URL.createObjectURL(attachment.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = attachment.fileName;
  a.click();
  URL.revokeObjectURL(url);
}
