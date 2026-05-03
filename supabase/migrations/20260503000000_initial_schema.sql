-- =============================================================================
-- D&D Sistem v1.9 — Initial Supabase Schema
-- =============================================================================
-- HOW TO APPLY:
--   Option A (Supabase CLI): supabase db push
--   Option B (Dashboard):    SQL Editor → paste this file → Run
-- =============================================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Helper: auto-update updated_at ────────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- TABLE: profiles
-- One row per user. Will link to auth.users in v2.
-- =============================================================================
create table if not exists profiles (
  id                uuid        primary key default gen_random_uuid(),
  nickname          text        not null unique,
  role              text        not null default 'player'
                                check (role in ('dm', 'player')),
  dark_mode         boolean     not null default false,
  dice_animations   boolean     not null default true,
  sidebar_collapsed boolean     not null default false,
  theme_id          text        not null default 'forest',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

-- =============================================================================
-- TABLE: campaigns
-- =============================================================================
create table if not exists campaigns (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  description   text        not null default '',
  dm_nickname   text        not null,
  invite_code   text        not null unique,
  is_active     boolean     not null default true,
  session_notes text        not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger campaigns_updated_at
  before update on campaigns
  for each row execute function handle_updated_at();

create index if not exists campaigns_invite_code_idx on campaigns (invite_code);
create index if not exists campaigns_dm_nickname_idx  on campaigns (dm_nickname);

-- =============================================================================
-- TABLE: characters
-- spells / equipment stored as jsonb arrays (normalized in v2 if needed)
-- =============================================================================
create table if not exists characters (
  id                uuid         primary key default gen_random_uuid(),
  -- owner_id = nickname for now; will become auth.uid()::text in v2
  owner_id          text         not null,
  campaign_id       uuid         references campaigns (id) on delete set null,
  name              text         not null,
  class             text         not null,
  race              text         not null,
  level             integer      not null default 1  check (level between 1 and 20),
  alignment         text         not null default 'True Neutral',
  background        text         not null default '',
  ability_scores    jsonb        not null default '{"str":10,"dex":10,"con":10,"int":10,"wis":10,"cha":10}',
  max_hp            integer      not null default 10  check (max_hp    >= 0),
  current_hp        integer      not null default 10  check (current_hp >= 0),
  temp_hp           integer      not null default 0   check (temp_hp    >= 0),
  armor_class       integer      not null default 10,
  speed             integer      not null default 30  check (speed >= 0),
  initiative        integer      not null default 0,
  proficiency_bonus integer      not null default 2   check (proficiency_bonus >= 0),
  saving_throws     jsonb        not null default '{"str":false,"dex":false,"con":false,"int":false,"wis":false,"cha":false}',
  skills            jsonb        not null default '{}',
  spells            jsonb        not null default '[]',
  equipment         jsonb        not null default '[]',
  gold              numeric(12,2) not null default 0  check (gold >= 0),
  notes             text         not null default '',
  traits            text         not null default '',
  ideals            text         not null default '',
  bonds             text         not null default '',
  flaws             text         not null default '',
  created_at        timestamptz  not null default now(),
  updated_at        timestamptz  not null default now()
);

create trigger characters_updated_at
  before update on characters
  for each row execute function handle_updated_at();

create index if not exists characters_owner_id_idx    on characters (owner_id);
create index if not exists characters_campaign_id_idx on characters (campaign_id);

-- =============================================================================
-- TABLE: campaign_members
-- =============================================================================
create table if not exists campaign_members (
  id           uuid        primary key default gen_random_uuid(),
  campaign_id  uuid        not null references campaigns  (id) on delete cascade,
  nickname     text        not null,
  role         text        not null default 'player' check (role in ('dm', 'player')),
  character_id uuid        references characters (id) on delete set null,
  joined_at    timestamptz not null default now(),
  unique (campaign_id, nickname)
);

create index if not exists campaign_members_campaign_idx on campaign_members (campaign_id);
create index if not exists campaign_members_nickname_idx on campaign_members (nickname);

-- =============================================================================
-- TABLE: campaign_npcs
-- =============================================================================
create table if not exists campaign_npcs (
  id          uuid        primary key default gen_random_uuid(),
  campaign_id uuid        not null references campaigns (id) on delete cascade,
  name        text        not null,
  role        text        not null default '',
  notes       text        not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists campaign_npcs_campaign_idx on campaign_npcs (campaign_id);

-- =============================================================================
-- TABLE: campaign_sessions
-- =============================================================================
create table if not exists campaign_sessions (
  id          uuid        primary key default gen_random_uuid(),
  campaign_id uuid        not null references campaigns (id) on delete cascade,
  title       text        not null,
  date        date        not null default current_date,
  summary     text        not null default '',
  xp_awarded  integer     not null default 0 check (xp_awarded >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger campaign_sessions_updated_at
  before update on campaign_sessions
  for each row execute function handle_updated_at();

create index if not exists campaign_sessions_campaign_idx on campaign_sessions (campaign_id);
create index if not exists campaign_sessions_date_idx     on campaign_sessions (date desc);

-- =============================================================================
-- TABLE: personal_notes
-- Private per-user per-campaign notes (appStore.personalNotes)
-- =============================================================================
create table if not exists personal_notes (
  id          uuid        primary key default gen_random_uuid(),
  nickname    text        not null,
  campaign_id uuid        not null references campaigns (id) on delete cascade,
  note        text        not null default '',
  updated_at  timestamptz not null default now(),
  unique (nickname, campaign_id)
);

create trigger personal_notes_updated_at
  before update on personal_notes
  for each row execute function handle_updated_at();

create index if not exists personal_notes_nickname_idx on personal_notes (nickname);
create index if not exists personal_notes_campaign_idx on personal_notes (campaign_id);

-- =============================================================================
-- TABLE: dice_rolls
-- Persisted roll history across devices
-- =============================================================================
create table if not exists dice_rolls (
  id           uuid        primary key default gen_random_uuid(),
  rolled_by    text        not null,
  dice         integer     not null check (dice in (4, 6, 8, 10, 12, 20, 100)),
  count        integer     not null default 1  check (count >= 1),
  modifier     integer     not null default 0,
  rolls        jsonb       not null default '[]',
  total        integer     not null,
  advantage    boolean     not null default false,
  disadvantage boolean     not null default false,
  rolled_at    timestamptz not null default now()
);

create index if not exists dice_rolls_rolled_by_idx on dice_rolls (rolled_by);
create index if not exists dice_rolls_rolled_at_idx on dice_rolls (rolled_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Phase 1 (no auth): RLS enabled, anon + authenticated can do everything.
-- Phase 2 (with auth): uncomment the policies at the bottom of this file.
-- =============================================================================
alter table profiles          enable row level security;
alter table campaigns         enable row level security;
alter table characters        enable row level security;
alter table campaign_members  enable row level security;
alter table campaign_npcs     enable row level security;
alter table campaign_sessions enable row level security;
alter table personal_notes    enable row level security;
alter table dice_rolls        enable row level security;

-- Phase 1: open policies — replace with scoped policies in v2
create policy "open_profiles"          on profiles          for all to anon, authenticated using (true) with check (true);
create policy "open_campaigns"         on campaigns         for all to anon, authenticated using (true) with check (true);
create policy "open_characters"        on characters        for all to anon, authenticated using (true) with check (true);
create policy "open_campaign_members"  on campaign_members  for all to anon, authenticated using (true) with check (true);
create policy "open_campaign_npcs"     on campaign_npcs     for all to anon, authenticated using (true) with check (true);
create policy "open_campaign_sessions" on campaign_sessions for all to anon, authenticated using (true) with check (true);
create policy "open_personal_notes"    on personal_notes    for all to anon, authenticated using (true) with check (true);
create policy "open_dice_rolls"        on dice_rolls        for all to anon, authenticated using (true) with check (true);

-- =============================================================================
-- PHASE 2 POLICIES — uncomment when Supabase Auth is wired up
-- =============================================================================
/*

-- Drop phase-1 policies first:
-- drop policy "open_profiles"          on profiles;
-- drop policy "open_campaigns"         on campaigns;
-- ... etc

-- profiles: user owns their own row
create policy "profiles_owner" on profiles
  for all to authenticated
  using     (id = auth.uid())
  with check (id = auth.uid());

-- characters: user owns their characters
create policy "characters_owner" on characters
  for all to authenticated
  using     (owner_id = auth.uid()::text)
  with check (owner_id = auth.uid()::text);

-- campaigns: DM can write; any member can read
create policy "campaigns_dm_write" on campaigns
  for all to authenticated
  using     (dm_nickname = (select nickname from profiles where id = auth.uid()))
  with check (dm_nickname = (select nickname from profiles where id = auth.uid()));

create policy "campaigns_member_read" on campaigns
  for select to authenticated
  using (
    exists (
      select 1 from campaign_members cm
      join profiles p on p.nickname = cm.nickname
      where cm.campaign_id = campaigns.id
        and p.id = auth.uid()
    )
  );

-- campaign_members: DM manages; members can read
create policy "campaign_members_dm_write" on campaign_members
  for all to authenticated
  using (
    exists (
      select 1 from campaigns c
      join profiles p on p.nickname = c.dm_nickname
      where c.id = campaign_members.campaign_id
        and p.id = auth.uid()
    )
  );

create policy "campaign_members_read" on campaign_members
  for select to authenticated
  using (
    exists (
      select 1 from campaign_members cm2
      join profiles p on p.nickname = cm2.nickname
      where cm2.campaign_id = campaign_members.campaign_id
        and p.id = auth.uid()
    )
  );

-- campaign_npcs: DM writes; members read
create policy "campaign_npcs_dm_write" on campaign_npcs
  for all to authenticated
  using (
    exists (
      select 1 from campaigns c
      join profiles p on p.nickname = c.dm_nickname
      where c.id = campaign_npcs.campaign_id
        and p.id = auth.uid()
    )
  );

create policy "campaign_npcs_member_read" on campaign_npcs
  for select to authenticated
  using (
    exists (
      select 1 from campaign_members cm
      join profiles p on p.nickname = cm.nickname
      where cm.campaign_id = campaign_npcs.campaign_id
        and p.id = auth.uid()
    )
  );

-- campaign_sessions: DM writes; members read
create policy "campaign_sessions_dm_write" on campaign_sessions
  for all to authenticated
  using (
    exists (
      select 1 from campaigns c
      join profiles p on p.nickname = c.dm_nickname
      where c.id = campaign_sessions.campaign_id
        and p.id = auth.uid()
    )
  );

create policy "campaign_sessions_member_read" on campaign_sessions
  for select to authenticated
  using (
    exists (
      select 1 from campaign_members cm
      join profiles p on p.nickname = cm.nickname
      where cm.campaign_id = campaign_sessions.campaign_id
        and p.id = auth.uid()
    )
  );

-- personal_notes: user owns their own
create policy "personal_notes_owner" on personal_notes
  for all to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and nickname = personal_notes.nickname)
  )
  with check (
    exists (select 1 from profiles where id = auth.uid() and nickname = personal_notes.nickname)
  );

-- dice_rolls: user owns their own
create policy "dice_rolls_owner" on dice_rolls
  for all to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and nickname = dice_rolls.rolled_by)
  )
  with check (
    exists (select 1 from profiles where id = auth.uid() and nickname = dice_rolls.rolled_by)
  );

*/
