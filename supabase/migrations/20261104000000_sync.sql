-- =============================================================================
-- D&D Sistem — Character sync and realtime
-- =============================================================================
-- Requires 20261102000000_secure_rls.sql.
--
-- characters.data holds the full client-side Character object (conditions,
-- resources, spells, ...). The flat columns stay for listings and the DM view.
-- =============================================================================

alter table characters add column if not exists data jsonb not null default '{}';

-- Realtime: clients treat each change as "refetch", never trusting the payload.
do $$
declare
  t text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    return;
  end if;
  foreach t in array array['campaigns', 'campaign_members', 'campaign_npcs', 'campaign_sessions', 'characters'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;
