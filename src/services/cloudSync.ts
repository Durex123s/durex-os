import { supabase } from './supabaseClient';
import { dumpAllTables, restoreDump } from './backup';
import { pushAttachments, pullAttachments } from './attachmentSync';

export async function pushBackupToCloud(userId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré.');
  const dump = await dumpAllTables();
  // Les fichiers ont leur propre canal (Supabase Storage), plus efficace
  // qu'un blob base64 dans cette table — on les retire d'ici pour éviter
  // de dupliquer leur contenu.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { attachments: _attachments, ...rest } = dump as Record<string, unknown>;
  const { error } = await supabase
    .from('backups')
    .upsert({ user_id: userId, data: rest, updated_at: new Date().toISOString() });
  if (error) throw error;

  await pushAttachments(userId);
}

export async function pullBackupFromCloud(userId: string): Promise<{ tablesRestored: number; updatedAt: string | null }> {
  if (!supabase) throw new Error('Supabase non configuré.');
  const { data, error } = await supabase
    .from('backups')
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;

  const attachmentsChanged = await pullAttachments(userId);

  if (!data) return { tablesRestored: attachmentsChanged > 0 ? 1 : 0, updatedAt: null };

  const { tablesRestored } = await restoreDump(data.data as Record<string, unknown>);
  return { tablesRestored: tablesRestored + (attachmentsChanged > 0 ? 1 : 0), updatedAt: data.updated_at };
}
