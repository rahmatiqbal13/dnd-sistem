-- =============================================================================
-- D&D Sistem — Secure row-level security
-- =============================================================================
-- Replaces the phase-1 "open" policies (anyone with the anon key could read,
-- edit or delete every row) with policies keyed on auth.uid().
--
-- REQUIRES: Anonymous Sign-Ins enabled in the Supabase dashboard
--   (Authentication → Sign In / Providers → Allow anonymous sign-ins).
--   The client signs in anonymously before any database call, so every
--   request runs as the `authenticated` role with a real auth.uid().
--
-- LEGACY ROWS: rows created before this migration have no owner uuid and
--   become invisible to clients. Players keep their local copies; a DM can
--   re-create a campaign to get a fresh, secured invite code.
-- =============================================================================

-- ── Drop phase-1 policies ─────────────────────────────────────────────────────
drop policy if exists "open_profiles"          on profiles;
drop policy if exists "open_campaigns"         on campaigns;
drop policy if exists "open_characters"        on characters;
drop policy if exists "open_campaign_members"  on campaign_members;
drop policy if exists "open_campaign_npcs"     on campaign_npcs;
drop policy if exists "open_campaign_sessions" on campaign_sessions;
drop policy if exists "open_personal_notes"    on personal_notes;
drop policy if exists "open_dice_rolls"        on dice_rolls;

-- ── Owner columns (uuid, filled from the caller's session) ────────────────────
alter table campaigns        add column if not exists dm_id   uuid references auth.users (id) on delete cascade default auth.uid();
alter table campaign_members add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();
alter table characters       add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();
alter table personal_notes   add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();
alter table dice_rolls       add column if not exists user_id uuid references auth.users (id) on delete cascade default auth.uid();

-- Nicknames are display names now, not identities: two people may share one.
alter table profiles         drop constraint if exists profiles_nickname_key;
alter table campaign_members drop constraint if exists campaign_members_campaign_id_nickname_key;
alter table personal_notes   drop constraint if exists personal_notes_nickname_campaign_id_key;
alter table campaign_members add constraint campaign_members_campaign_id_user_id_key unique (campaign_id, user_id);
alter table personal_notes   add constraint personal_notes_user_id_campaign_id_key   unique (user_id, campaign_id);

-- Text owner columns are no longer required from the client.
alter table characters alter column owner_id  set default '';
alter table dice_rolls alter column rolled_by set default '';

create index if not exists campaigns_dm_id_idx         on campaigns (dm_id);
create index if not exists campaign_members_user_idx   on campaign_members (user_id);
create index if not exists characters_user_idx         on characters (user_id);
create index if not exists personal_notes_user_idx     on personal_notes (user_id);
create index if not exists dice_rolls_user_idx         on dice_rolls (user_id);

-- ── Helpers (security definer so policies don't recurse through RLS) ──────────
create schema if not exists private;

create or replace function private.is_campaign_member(p_campaign_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.campaign_members
    where campaign_id = p_campaign_id and user_id = (select auth.uid())
  );
$$;

create or replace function private.is_campaign_dm(p_campaign_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.campaigns
    where id = p_campaign_id and dm_id = (select auth.uid())
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_campaign_member(uuid) to authenticated;
grant execute on function private.is_campaign_dm(uuid)     to authenticated;

-- The DM is always a member of their own campaign.
create or replace function private.add_dm_membership()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.campaign_members (campaign_id, user_id, nickname, role)
  values (new.id, new.dm_id, new.dm_nickname, 'dm')
  on conflict (campaign_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists campaigns_add_dm_membership on campaigns;
create trigger campaigns_add_dm_membership
  after insert on campaigns
  for each row execute function private.add_dm_membership();

-- ── profiles: a user owns their own row (id = auth.uid()) ─────────────────────
create policy "profiles_owner" on profiles
  for all to authenticated
  using      (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ── campaigns ─────────────────────────────────────────────────────────────────
create policy "campaigns_member_read" on campaigns
  for select to authenticated
  using (dm_id = (select auth.uid()) or private.is_campaign_member(id));

create policy "campaigns_dm_insert" on campaigns
  for insert to authenticated
  with check (dm_id = (select auth.uid()));

create policy "campaigns_dm_update" on campaigns
  for update to authenticated
  using      (dm_id = (select auth.uid()))
  with check (dm_id = (select auth.uid()));

create policy "campaigns_dm_delete" on campaigns
  for delete to authenticated
  using (dm_id = (select auth.uid()));

-- ── campaign_members: join only through join_campaign(); leave or be kicked ──
create policy "campaign_members_read" on campaign_members
  for select to authenticated
  using (private.is_campaign_member(campaign_id));

create policy "campaign_members_update_own" on campaign_members
  for update to authenticated
  using      (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "campaign_members_leave_or_kick" on campaign_members
  for delete to authenticated
  using (user_id = (select auth.uid()) or private.is_campaign_dm(campaign_id));

-- Members may only change their own character link, not their role.
revoke update on campaign_members from authenticated;
grant  update (character_id) on campaign_members to authenticated;

-- ── campaign_npcs / campaign_sessions: members read, DM writes ────────────────
create policy "campaign_npcs_member_read" on campaign_npcs
  for select to authenticated
  using (private.is_campaign_member(campaign_id));

create policy "campaign_npcs_dm_write" on campaign_npcs
  for all to authenticated
  using      (private.is_campaign_dm(campaign_id))
  with check (private.is_campaign_dm(campaign_id));

create policy "campaign_sessions_member_read" on campaign_sessions
  for select to authenticated
  using (private.is_campaign_member(campaign_id));

create policy "campaign_sessions_dm_write" on campaign_sessions
  for all to authenticated
  using      (private.is_campaign_dm(campaign_id))
  with check (private.is_campaign_dm(campaign_id));

-- ── characters: owner writes; campaign members can read ───────────────────────
create policy "characters_owner" on characters
  for all to authenticated
  using      (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "characters_campaign_read" on characters
  for select to authenticated
  using (campaign_id is not null and private.is_campaign_member(campaign_id));

-- ── personal_notes / dice_rolls: owner only ───────────────────────────────────
create policy "personal_notes_owner" on personal_notes
  for all to authenticated
  using      (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and private.is_campaign_member(campaign_id));

create policy "dice_rolls_owner" on dice_rolls
  for all to authenticated
  using      (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ── join_campaign: the only way to become a member ────────────────────────────
-- Invite codes are never readable by non-members; this function looks the code
-- up server-side. Unknown or inactive codes return null (no detail), and each
-- user gets at most 10 failed attempts per 10 minutes to stop brute-forcing.
create table if not exists private.join_attempts (
  user_id      uuid        not null,
  attempted_at timestamptz not null default now()
);
create index if not exists join_attempts_user_time_idx on private.join_attempts (user_id, attempted_at desc);

create or replace function public.join_campaign(p_invite_code text, p_nickname text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_campaign_id uuid;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if (
    select count(*) from private.join_attempts
    where user_id = v_uid and attempted_at > now() - interval '10 minutes'
  ) >= 10 then
    raise exception 'too many attempts, try again later' using errcode = '54000';
  end if;

  select id into v_campaign_id
  from public.campaigns
  where invite_code = upper(trim(p_invite_code)) and is_active;

  if v_campaign_id is null then
    insert into private.join_attempts (user_id) values (v_uid);
    return null;
  end if;

  insert into public.campaign_members (campaign_id, user_id, nickname, role)
  values (v_campaign_id, v_uid, left(trim(p_nickname), 40), 'player')
  on conflict (campaign_id, user_id) do nothing;

  return v_campaign_id;
end;
$$;

revoke execute on function public.join_campaign(text, text) from public, anon;
grant  execute on function public.join_campaign(text, text) to authenticated;
