import { supabase } from './supabaseClient';
import { dumpAllTables, restoreDump } from './backup';

export async function pushBackupToCloud(userId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré.');
  const data = await dumpAllTables();
  const { error } = await supabase
    .from('backups')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function pullBackupFromCloud(userId: string): Promise<{ tablesRestored: number; updatedAt: string | null }> {
  if (!supabase) throw new Error('Supabase non configuré.');
  const { data, error } = await supabase
    .from('backups')
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return { tablesRestored: 0, updatedAt: null };

  const { tablesRestored } = await restoreDump(data.data as Record<string, unknown>);
  return { tablesRestored, updatedAt: data.updated_at };
}
