import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const supabaseDebugInfo = {
  urlPresent: !!url,
  urlPreview: url ? `${url.slice(0, 24)}…` : null,
  keyPresent: !!anonKey,
  keyPreview: anonKey ? `${anonKey.slice(0, 12)}…` : null,
  urlFull: url ?? null,
  urlLength: url?.length ?? 0,
  keyLength: anonKey?.length ?? 0,
};
