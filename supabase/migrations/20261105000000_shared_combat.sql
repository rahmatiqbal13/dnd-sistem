-- =============================================================================
-- D&D Sistem — Shared combat (live initiative view for players)
-- =============================================================================
-- Requires 20261102000000_secure_rls.sql. Safe to re-run.
--
-- One row per campaign holding the *player-facing* combat state. The DM's
-- device writes it already redacted (no exact monster HP or AC), so nothing
-- hidden from players is ever stored here.
-- =============================================================================

create table if not exists campaign_combats (
  campaign_id uuid        primary key references campaigns (id) on delete cascade,
  state       jsonb       not null default '{}',
  updated_at  timestamptz not null default now()
);

drop trigger if exists campaign_combats_updated_at on campaign_combats;
create trigger campaign_combats_updated_at
  before update on campaign_combats
  for each row execute function handle_updated_at();

alter table campaign_combats enable row level security;

drop policy if exists "campaign_combats_member_read" on campaign_combats;
create policy "campaign_combats_member_read" on campaign_combats
  for select to authenticated
  using (private.is_campaign_member(campaign_id));

drop policy if exists "campaign_combats_dm_write" on campaign_combats;
create policy "campaign_combats_dm_write" on campaign_combats
  for all to authenticated
  using      (private.is_campaign_dm(campaign_id))
  with check (private.is_campaign_dm(campaign_id));

grant select, insert, update, delete on campaign_combats to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'campaign_combats'
     ) then
    alter publication supabase_realtime add table public.campaign_combats;
  end if;
end;
$$;
