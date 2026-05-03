-- =============================================================================
-- D&D Sistem — Seed Data (development / testing only)
-- Run after applying the migration:
--   supabase db reset   (applies migration + seed)
-- =============================================================================

-- Sample campaign
insert into campaigns (id, name, description, dm_nickname, invite_code, is_active)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Curse of Strahd',
  'A gothic horror campaign in Barovia',
  'DungeonMaster',
  'STRAHD',
  true
) on conflict (id) do nothing;

-- Sample DM profile
insert into profiles (nickname, role)
values ('DungeonMaster', 'dm')
on conflict (nickname) do nothing;

-- Sample player profile
insert into profiles (nickname, role)
values ('Aragorn', 'player')
on conflict (nickname) do nothing;

-- Sample campaign member (DM)
insert into campaign_members (campaign_id, nickname, role)
values ('a1b2c3d4-0000-0000-0000-000000000001', 'DungeonMaster', 'dm')
on conflict (campaign_id, nickname) do nothing;

-- Sample campaign member (player)
insert into campaign_members (campaign_id, nickname, role)
values ('a1b2c3d4-0000-0000-0000-000000000001', 'Aragorn', 'player')
on conflict (campaign_id, nickname) do nothing;

-- Sample character
insert into characters (
  id, owner_id, campaign_id, name, class, race, level, alignment, background,
  ability_scores, max_hp, current_hp, armor_class, speed, initiative, proficiency_bonus
) values (
  'b2c3d4e5-0000-0000-0000-000000000001',
  'Aragorn',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Kael Stormwind',
  'Fighter',
  'Human',
  5,
  'Lawful Good',
  'Soldier',
  '{"str":18,"dex":14,"con":16,"int":10,"wis":12,"cha":10}',
  52, 52, 18, 30, 2, 3
) on conflict (id) do nothing;

-- Sample NPC
insert into campaign_npcs (campaign_id, name, role, notes)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Count Strahd von Zarovich',
  'Antagonist',
  'Vampire lord of Barovia. Obsessed with Tatyana. Do not trust.'
) on conflict do nothing;

-- Sample session
insert into campaign_sessions (campaign_id, title, date, summary, xp_awarded)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Sesi 1: Kedatangan di Barovia',
  '2026-05-03',
  'Para petualang tiba di Barovia melalui kabut misterius. Mereka bertemu dengan penduduk desa yang ketakutan dan menemukan surat undangan dari Tuan tanah setempat.',
  300
) on conflict do nothing;
