import { supabase } from './supabaseClient';
import { db } from '@/database/db';
import type { Attachment } from '@/types';

const BUCKET = 'attachments';

interface RemoteMeta {
  id: string;
  file_name: string;
  mime_type: string;
  size: number;
  kind: string;
  subject_id: string | null;
  text_content: string | null;
  rows: string[][] | null;
  storage_path: string;
  created_at: string;
}

function storagePath(userId: string, attachment: Attachment) {
  return `${userId}/${attachment.id}-${attachment.fileName}`;
}

/**
 * Envoie les fichiers locaux absents du cloud, et retire du cloud ceux
 * supprimés localement — le contenu va dans Supabase Storage, seules les
 * métadonnées (titre, aperçu texte...) vont dans la table Postgres.
 */
export async function pushAttachments(userId: string): Promise<number> {
  if (!supabase) throw new Error('Supabase non configuré.');
  let changed = 0;

  const [local, { data: remoteRows, error: fetchError }] = await Promise.all([
    db.attachments.toArray(),
    supabase.from('attachment_meta').select('id, storage_path').eq('user_id', userId),
  ]);
  if (fetchError) throw fetchError;

  const remoteIds = new Set((remoteRows ?? []).map((r) => r.id));
  const localIds = new Set(local.map((a) => a.id));

  // Envoie les fichiers présents localement mais absents du cloud.
  for (const attachment of local) {
    if (remoteIds.has(attachment.id)) continue;
    const path = storagePath(userId, attachment);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, attachment.blob, { contentType: attachment.mimeType, upsert: true });
    if (uploadError) throw uploadError;

    const { error: metaError } = await supabase.from('attachment_meta').upsert({
      id: attachment.id,
      user_id: userId,
      file_name: attachment.fileName,
      mime_type: attachment.mimeType,
      size: attachment.size,
      kind: attachment.kind,
      subject_id: attachment.subjectId ?? null,
      text_content: attachment.textContent ?? null,
      rows: attachment.rows ?? null,
      storage_path: path,
      created_at: attachment.createdAt,
    });
    if (metaError) throw metaError;
    changed += 1;
  }

  // Retire du cloud les fichiers supprimés localement depuis le dernier sync.
  const remoteOnly = (remoteRows ?? []).filter((r) => !localIds.has(r.id));
  if (remoteOnly.length > 0) {
    await supabase.storage.from(BUCKET).remove(remoteOnly.map((r) => r.storage_path));
    await supabase
      .from('attachment_meta')
      .delete()
      .eq('user_id', userId)
      .in('id', remoteOnly.map((r) => r.id));
    changed += remoteOnly.length;
  }

  return changed;
}

/**
 * Télécharge les fichiers présents dans le cloud mais absents localement,
 * et retire localement ceux qui ont été supprimés côté cloud (même logique
 * de remplacement que les autres tables lors d'un pull).
 */
export async function pullAttachments(userId: string): Promise<number> {
  if (!supabase) throw new Error('Supabase non configuré.');
  let changed = 0;

  const [local, { data: remoteRows, error: fetchError }] = await Promise.all([
    db.attachments.toArray(),
    supabase.from('attachment_meta').select('*').eq('user_id', userId),
  ]);
  if (fetchError) throw fetchError;

  const remote = (remoteRows ?? []) as RemoteMeta[];
  const remoteIds = new Set(remote.map((r) => r.id));
  const localIds = new Set(local.map((a) => a.id));

  // Télécharge les fichiers présents dans le cloud mais absents localement.
  for (const r of remote) {
    if (localIds.has(r.id)) continue;
    const { data: blob, error: downloadError } = await supabase.storage.from(BUCKET).download(r.storage_path);
    if (downloadError || !blob) continue;

    await db.attachments.add({
      id: r.id,
      fileName: r.file_name,
      mimeType: r.mime_type,
      size: r.size,
      kind: r.kind as Attachment['kind'],
      subjectId: r.subject_id ?? undefined,
      textContent: r.text_content ?? undefined,
      rows: r.rows ?? undefined,
      blob,
      createdAt: r.created_at,
    });
    changed += 1;
  }

  // Retire localement les fichiers qui n'existent plus dans le cloud.
  const localOnly = local.filter((a) => !remoteIds.has(a.id));
  if (localOnly.length > 0) {
    await db.attachments.bulkDelete(localOnly.map((a) => a.id));
    changed += localOnly.length;
  }

  return changed;
}
