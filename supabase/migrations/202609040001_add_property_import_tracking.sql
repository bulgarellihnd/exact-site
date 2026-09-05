-- Tracks external listings without coupling the public site to Imovelweb URLs.
-- The public property reference (EX00xx) remains owned by EXACT.
alter table public.properties
  add column if not exists source_provider text,
  add column if not exists source_listing_id text,
  add column if not exists source_url text,
  add column if not exists source_fingerprint text,
  add column if not exists source_last_seen_at timestamptz,
  add column if not exists source_last_synced_at timestamptz,
  add column if not exists source_sync_state text not null default 'manual',
  add column if not exists source_editorial_lock boolean not null default false;

create unique index if not exists properties_source_listing_unique
  on public.properties (source_provider, source_listing_id)
  where source_provider is not null and source_listing_id is not null;

create index if not exists properties_source_last_seen_idx
  on public.properties (source_provider, source_last_seen_at);

comment on column public.properties.source_editorial_lock is
  'When true, automated synchronization must not replace title, description, cover or photo order.';

comment on column public.properties.source_sync_state is
  'manual, draft, synced, changed, missing or error';

