-- ============================================================================
-- Veyrion — Stockage cloud dédié pour les fichiers importés (PDF/Word/Excel)
-- À exécuter dans Supabase > SQL Editor
-- ============================================================================

-- Table de métadonnées — le contenu binaire va dans Storage, pas ici,
-- pour ne pas alourdir la base Postgres avec des blobs encodés.
create table if not exists attachment_meta (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  size integer not null,
  kind text not null,
  subject_id text,
  text_content text,
  rows jsonb,
  storage_path text not null,
  created_at timestamptz not null default now()
);

alter table attachment_meta enable row level security;

drop policy if exists "select_own_attachment_meta" on attachment_meta;
create policy "select_own_attachment_meta" on attachment_meta
  for select using (auth.uid() = user_id);

drop policy if exists "insert_own_attachment_meta" on attachment_meta;
create policy "insert_own_attachment_meta" on attachment_meta
  for insert with check (auth.uid() = user_id);

drop policy if exists "update_own_attachment_meta" on attachment_meta;
create policy "update_own_attachment_meta" on attachment_meta
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_attachment_meta" on attachment_meta;
create policy "delete_own_attachment_meta" on attachment_meta
  for delete using (auth.uid() = user_id);

create index if not exists idx_attachment_meta_user on attachment_meta (user_id);

-- ----------------------------------------------------------------------------
-- Bucket de stockage (privé) pour les fichiers eux-mêmes.
-- Si cette ligne échoue selon ta version de Supabase, crée le bucket
-- manuellement : Dashboard > Storage > New bucket > nom "attachments",
-- décoche "Public bucket".
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

-- Chaque utilisateur ne peut lire/écrire que dans son propre dossier
-- (chemin : {user_id}/{fichier}).
drop policy if exists "select_own_storage_files" on storage.objects;
create policy "select_own_storage_files" on storage.objects
  for select using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "insert_own_storage_files" on storage.objects;
create policy "insert_own_storage_files" on storage.objects
  for insert with check (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "delete_own_storage_files" on storage.objects;
create policy "delete_own_storage_files" on storage.objects
  for delete using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);
