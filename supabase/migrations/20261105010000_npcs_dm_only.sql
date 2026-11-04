-- =============================================================================
-- D&D Sistem — NPCs are private to the DM
-- =============================================================================
-- NPC notes hold DM secrets ("Motivasi, secrets, lokasi"), and the app never
-- shows NPCs to players. Members could still read them through the API, so
-- reading is now limited to the DM (covered by "campaign_npcs_dm_write").
-- Safe to re-run.
-- =============================================================================

drop policy if exists "campaign_npcs_member_read" on campaign_npcs;
