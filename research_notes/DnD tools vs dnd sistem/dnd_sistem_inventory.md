# dnd-sistem: Code-Verified Feature Inventory (repo at commit 00076e7, read 2026-11-04)

All sources below are files in `/Volumes/File Home/File Web/dnd-sistem`. Paths are relative to the repo root. Everything here comes from reading the source code; nothing comes from the web. "Local" means the data is stored in the browser's localStorage through Zustand `persist`. "Synced" means it is written to or read from Supabase.

## 1. Architecture, routing, and what syncs vs local

### Takeaway
The app is local-first. Four Zustand stores persist to localStorage. Only two Supabase operations exist: **creating a campaign** (insert) and **joining by invite code** (RPC, then a one-time hydrate). Characters, dice rolls, notes, NPCs, sessions, kicks, leaves, and deletes never reach the server, even though the Supabase schema has tables for all of them. The app has no realtime, no PWA, and no export/import.

### Cited Findings
- 16 routes sit behind a guard that checks only for a nickname: /dashboard, /settings, /characters, /characters/new, /characters/:id, /dice, /combat, /campaign, /compendium, /party, /notes, /sessions, /homebrew, /dm-tools, /system-check. The guard is `RequireAuth`, which only checks that `nickname` is set — [src/App.tsx](src/App.tsx)
- Persisted stores and their localStorage keys: `dnd-app` (nickname, role, darkMode, diceAnimations, sidebar, themeId, personalNotes), `dnd-characters`, `dnd-campaigns`, `dnd-dice-log` (last 100 rolls) — [src/store/appStore.ts](src/store/appStore.ts), [src/store/characterStore.ts](src/store/characterStore.ts), [src/store/campaignStore.ts](src/store/campaignStore.ts), [src/store/diceStore.ts](src/store/diceStore.ts)
- The combat store has **no** `persist`, so combat state is in memory only and is lost on reload — [src/store/combatStore.ts](src/store/combatStore.ts)
- The Supabase client defines typed helpers for profiles, campaigns, characters, campaign_members, campaign_npcs, campaign_sessions, personal_notes, dice_rolls, and the `join_campaign` RPC — [src/lib/supabase.ts](src/lib/supabase.ts)
- Only `insertCampaignOnRemote`, `joinCampaignOnRemote`, and `hydrateCampaignById` call Supabase. A grep for `db.` / `ensureSession` / `isSupabaseConfigured` outside `src/lib/` matched only `campaignStore.ts`, so no page or other store calls Supabase — [src/lib/campaignRemote.ts](src/lib/campaignRemote.ts), [src/store/campaignStore.ts](src/store/campaignStore.ts)
- `createCampaign` inserts remotely and retries up to 10 times if the invite code collides (Postgres 23505). If Supabase is not configured, `insertCampaignOnRemote` returns early and the campaign stays local only — [src/store/campaignStore.ts](src/store/campaignStore.ts), [src/lib/campaignRemote.ts](src/lib/campaignRemote.ts)
- These actions only change local state: `leaveCampaign`, `deleteCampaign`, `updateCampaign`, `kickMember`, `updateSessionNotes`, `addNpc`/`removeNpc`/`updateNpc`, `addSession`/`removeSession`/`updateSession`. None calls Supabase — [src/store/campaignStore.ts](src/store/campaignStore.ts)
- The schema creates 8 tables with RLS enabled: profiles, campaigns, characters, campaign_members, campaign_npcs, campaign_sessions, personal_notes, dice_rolls — [supabase/migrations/20260503000000_initial_schema.sql](supabase/migrations/20260503000000_initial_schema.sql)
- A hardening migration adds `private.is_campaign_member`, `private.is_campaign_dm`, a trigger that auto-adds the DM as a member, a `private.join_attempts` table, and a `public.join_campaign(p_invite_code, p_nickname)` RPC — [supabase/migrations/20261102000000_secure_rls.sql](supabase/migrations/20261102000000_secure_rls.sql)
- No Supabase realtime/channel usage exists anywhere in `src`. The migrations contain no `publication`/`realtime` statements. (Checked by grep.) — [src/](src), [supabase/migrations/](supabase/migrations)
- PWA: `public/` holds only `favicon.svg` and `icons.svg`. The repo has no web manifest and no service worker, and `vite.config.ts` uses only the react and tailwind plugins. `index.html` sets `theme-color` and `lang="id"` — [vite.config.ts](vite.config.ts), [index.html](index.html)
- No export/import feature was found. The settings page has no export/import/JSON/download controls — [src/pages/SettingsPage.tsx](src/pages/SettingsPage.tsx)

### Inferences
- When a player joins a campaign, they get a **snapshot** of it at join time. NPCs, sessions, and notes that the DM adds later are not propagated. The DM's later edits also never leave the DM's browser.
- A user who clears browser storage or switches device loses all characters, notes, and dice history. The anonymous Supabase session persists via supabase-js in localStorage too.
- The server schema is ahead of the client: tables for characters, notes, and dice rolls exist and are RLS-tested but are unused by the UI.

### Gaps
- The code does not show whether a deployed Supabase project exists or which env values are used (`.env.local` was not inspected).

## 2. Onboarding and identity

### Takeaway
Onboarding asks only for a nickname (2–20 chars) and a role (DM or Player), both saved locally. Supabase anonymous auth (`ensureSession`) runs lazily, only on campaign create or join, not at onboarding.

### Cited Findings
- A zod schema enforces a nickname of 2–20 chars. The page shows two role cards: "Dungeon Master" ("Buat & kelola kampanye") and "Player" ("Bergabung & bertualang"). `setProfile` writes to the local store, then the app navigates to /dashboard — [src/pages/OnboardingPage.tsx](src/pages/OnboardingPage.tsx)
- `ensureSession()` reuses an existing session or calls `auth.signInAnonymously()`. It needs "Allow anonymous sign-ins" enabled in Supabase. It caches the promise and resets on error. The error text is in Indonesian ("Gagal masuk ke server") — [src/lib/supabase.ts](src/lib/supabase.ts)
- If env vars are missing, `isSupabaseConfigured` is false and the app runs in local-only mode. The comment reads "app still runs (local-only campaigns)" — [src/lib/supabase.ts](src/lib/supabase.ts)
- The role can be changed later in Settings (`setRole`), and Settings offers logout/reset (`reset()` clears nickname and role) — [src/pages/SettingsPage.tsx](src/pages/SettingsPage.tsx), [src/store/appStore.ts](src/store/appStore.ts)
- Nothing in onboarding writes to the `profiles` table. No code path inserts profiles. — [src/lib/supabase.ts](src/lib/supabase.ts) (helper defined, no callers found by grep)

### Inferences
- Identity across devices is impossible. Campaign membership is keyed to the anonymous `auth.uid()` in that browser.
- The role is self-selected and global, not per campaign. Any user can flip to DM in Settings and see DM pages locally.

### Gaps
- None significant.

## 3. Character builder

### Takeaway
The builder is a single-page form, not a step wizard. It mixes 2024 rules (background-based +2/+1 ASI, origin feat from background, 12 classes) with 2014 species (Half-Elf and Half-Orc, no Aasimar/Goliath/Orc). Ability scores can be manual or 4d6-drop-lowest; there is no point-buy or standard array. Subclass is a free-text field in the builder. AC, HP, and speed are computed automatically, and starting equipment is generated as editable text lines.

### Cited Findings
- Classes (12): Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx), [src/data/dnd2024/classes.ts](src/data/dnd2024/classes.ts)
- Species (9): Dragonborn, Dwarf, Elf, Gnome, Half-Elf, Half-Orc, Halfling, Human, Tiefling. The type is still named `CharacterRace` — [src/data/dnd2024/races.ts](src/data/dnd2024/races.ts), [src/types/index.ts](src/types/index.ts)
- Backgrounds (10): Acolyte, Criminal, Folk Hero, Noble, Sage, Soldier, Entertainer, Guild Artisan, Hermit, Outlander. Each has `asiPlus2`/`asiPlus1`, an origin feat, and equipment — [src/data/dnd2024/backgrounds.ts](src/data/dnd2024/backgrounds.ts), [src/lib/characterRules.ts](src/lib/characterRules.ts) (`applyBackgroundAsi`)
- Feats: 54 entries (15 `origin` + 39 `general`) — [src/data/dnd2024/feats.ts](src/data/dnd2024/feats.ts)
- Subclasses: 56 entries, 4 per class, except Sorcerer and Warlock with 5 each and Wizard with 8. They are selectable only through the level-up dialog. — [src/data/dnd2024/subclasses.ts](src/data/dnd2024/subclasses.ts), [src/components/character/SubclassSelector.tsx](src/components/character/SubclassSelector.tsx)
- The builder's subclass field is a plain `<Input>` with the placeholder "Contoh: Champion, Evocation...". It appears at level ≥ 3 and is not linked to the subclass data — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx)
- Ability generation: manual numeric inputs plus a "4d6" button that rolls all six with `rollAbilityScore()` (4d6 drop lowest). No point-buy or standard array code was found — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx), [src/lib/dice.ts](src/lib/dice.ts)
- Level 1–20 can be chosen at creation. HP is computed automatically as max die + CON at L1 plus the rounded-up average per later level (`computeMaxHp`). For builds above level 1 the builder only shows a note ("biasanya ASI atau Feat — sesuaikan skor secara manual") — [src/lib/characterRules.ts](src/lib/characterRules.ts), [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx)
- AC comes from 11 armor presets (none, leather … plate) with a +2 shield toggle. The default armor is auto-picked from class proficiencies. Speed comes from species — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx), [src/lib/characterRules.ts](src/lib/characterRules.ts)
- Class skill picker is capped at `cls.skillsChoose`. Saving throws, weapon/armor/tool proficiencies come from class data. Languages are "Common" plus a hard-coded species language map — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx)
- Starting equipment is auto-generated from class (`getStartingEquipment`) and background, and shown in an editable textarea. Each line is saved as an item with `type: 'gear'` and `weight: 0`, so header lines like "Weapons:" become items too. A starting gold default is set per class — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx), [src/data/dnd2024/equipment.ts](src/data/dnd2024/equipment.ts)
- Spell slots are auto-set for full, half, third, and pact casters. Species innate spells are added — [src/lib/characterRules.ts](src/lib/characterRules.ts), [src/lib/spellcasting.ts](src/lib/spellcasting.ts)
- Personality fields: traits, ideals, bonds, flaws. Alignment has 9 options — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx)
- The character is saved locally (`addCharacter`) with `campaignId: null` and `ownerId: nickname` — [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx)

### Inferences
- The content is a hybrid: 2024 background mechanics with 2014 species names and 2014-era background names (Folk Hero, Guild Artisan, Hermit, Outlander are not among the 16 PHB 2024 backgrounds). This is a correctness and credibility gap compared with D&D Beyond.
- The builder does not select an origin feat as a structured `CharacterFeat`; only the `originFeat` string is stored.

### Gaps
- Whether background equipment option A/B (2024 choice of items vs 50 GP) is modeled was not fully verified. Only a single list plus a gold value were seen.

## 4. Character sheet and level up

### Takeaway
The sheet has 5 tabs (Stats, Skills, Spells, Items, Notes). It offers HP damage/heal, short and long rest dialogs, a spell-slot tracker, a spell picker from the SRD compendium, inventory with an equipped toggle and total weight, and a level-up dialog with HP average/roll/manual, subclass, and ASI or feat choice. **Death saves and exhaustion have store actions but no UI.** Concentration, conditions on the sheet, temp HP entry, attacks/weapon rolls, and rolling from the sheet are absent.

### Cited Findings
- Tabs: stats, skills, spells, equipment ("Items"), notes — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx)
- HP: the header has an amount input with heal (+) and damage (−) buttons. Temp HP is displayed if more than 0, but nothing in the sheet sets it — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx)
- Short rest spends N hit dice, each healing die + CON (min 1). Warlock pact slots are restored. Long rest gives full HP, tempHp 0, **all** hit dice, all slots, exhaustion −1, and resets death saves — [src/store/characterStore.ts](src/store/characterStore.ts)
- The long-rest dialog text says "regains half of your Hit Dice (minimum 1)", which contradicts the code, where all are regained per a "2024 rules" comment — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx) (line ~1066) vs [src/store/characterStore.ts](src/store/characterStore.ts)
- `updateDeathSaves`, `updateExhaustion`, and `spendHitDie` exist in the store. A grep of `src/pages` and `src/components` found no UI usage of deathSaves or exhaustion beyond the long-rest text — [src/store/characterStore.ts](src/store/characterStore.ts)
- Spell slots: per-tier "used/max dipakai" counters with +/- buttons. `resolveSpellSlots` recomputes max from class and level and keeps the used counts — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx), [src/lib/characterRules.ts](src/lib/characterRules.ts)
- The spell picker dialog ("Pilih Spell") searches the SRD compendium spells, filters by class tag and level, and paginates in batches. Spells are grouped by level and show Prepared/Known/Innate badges — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx)
- Inventory: add items with name, type (weapon/armor/gear/magic), weight, and description. Tapping a circle toggles equipped, and total lb is shown. Gold is a single gp number. Equipping armor does not recompute AC — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx), [src/types/index.ts](src/types/index.ts)
- Notes: a free textarea bound to `character.notes` — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx)
- Level-up dialog: HP method is average, roll, or manual. A subclass selection is required at the class subclass level. ASI or feat is required at ASI levels: [4, 8, 12, 16, 19], plus Fighter 6 and 14 and Rogue 10. Feats are filtered by prerequisites. New class features for the level are listed. ASI is capped at 20 — [src/components/character/LevelUpDialog.tsx](src/components/character/LevelUpDialog.tsx), [src/lib/levelUp.ts](src/lib/levelUp.ts), [src/store/characterStore.ts](src/store/characterStore.ts)
- The character type has no XP field, so there is no XP tracking. — [src/types/index.ts](src/types/index.ts)
- The sheet does not call the dice library: a grep for `rollDice`/`addRoll` outside DiceRollerPage returned nothing — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx)
- Character list: view and delete (with a confirm "Hapus karakter ...?"). No duplicate function was found — [src/pages/CharacterListPage.tsx](src/pages/CharacterListPage.tsx)

### Inferences
- There is no "click a skill to roll" flow, which competitors (D&D Beyond, Foundry) treat as core.
- The ability-score/skill toggles on the Skills tab appear editable (`updateCharacter` at ~line 662). Not verified in depth.

### Gaps
- No editing flow for the core identity (name, class, species) after creation was found. This was not exhaustively verified.

## 5. Dice roller

### Takeaway
The dice roller is button-based: one die type from d4–d100, a count, a flat modifier, and advantage/disadvantage (true 2d20 for 1d20). It has an optional animation and a local log of 100 rolls. There is no dice notation parser, no mixed pools, no saved rolls, and no sharing.

### Cited Findings
- Dice types are 4, 6, 8, 10, 12, 20, 100. `rollDice(count, sides, modifier, mode, rolledBy)` uses `Math.random()` — [src/lib/dice.ts](src/lib/dice.ts)
- Advantage/disadvantage applies only when count is 1 and the die is d20. Both d20s are recorded with the chosen and discarded values — [src/lib/dice.ts](src/lib/dice.ts)
- The total is clamped with `Math.max(1, sum + modifier)`. This differs from rules-as-written, where a total can go below 1 for attack/check results — [src/lib/dice.ts](src/lib/dice.ts)
- The UI has Advantage and Disadvantage switches (mutually exclusive), a clear-log button, and animation gated by the `diceAnimations` setting — [src/pages/DiceRollerPage.tsx](src/pages/DiceRollerPage.tsx)
- The log is persisted locally, capped at 100 entries (`dnd-dice-log`). A `dice_rolls` table exists in Supabase but is unused — [src/store/diceStore.ts](src/store/diceStore.ts), [supabase/migrations/20260503000000_initial_schema.sql](supabase/migrations/20260503000000_initial_schema.sql)

### Inferences
- Dice results are not visible to other party members, so there is no shared table roll log.

### Gaps
- None.

## 6. Combat tracker

### Takeaway
The combat tracker is local and in memory, not persisted. It supports manual initiative, round and turn tracking, damage with temp-HP absorption, healing, 15 condition toggles, and notes, and can add party characters from the local store. It has no concentration tracking, no monster import from the compendium, no initiative rolling, no write-back of HP to character sheets, and no sharing with players.

### Cited Findings
- State: combatants, currentTurnIndex, round, isActive. Actions: add/remove, updateHp, applyDamage (temp HP absorbs first), healHp, add/removeStatusEffect, updateInitiative (auto-sort desc), next/prev turn (round increments or decrements on wrap), start/end/reset, sortByInitiative, updateNotes — [src/store/combatStore.ts](src/store/combatStore.ts)
- The combat store has no `persist` wrapper — [src/store/combatStore.ts](src/store/combatStore.ts)
- Condition list (15): Blinded, Charmed, Deafened, Exhaustion, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, Unconscious. Exhaustion is a boolean flag here, not leveled — [src/types/index.ts](src/types/index.ts), [src/pages/CombatPage.tsx](src/pages/CombatPage.tsx)
- You can add a local character (blocked if already present, copies tempHp) or add an NPC/Monster manually (name, initiative, max HP required; "Isi nama, initiative, dan Max HP") — [src/pages/CombatPage.tsx](src/pages/CombatPage.tsx)
- CombatPage does not import the compendium, and no "concentration" string exists in pages or components (checked by grep) — [src/pages/CombatPage.tsx](src/pages/CombatPage.tsx)
- Combatant `characterId` is stored, but damage only updates the combat store, not the character store — [src/store/combatStore.ts](src/store/combatStore.ts)

### Inferences
- The tracker is usable solo by a DM on one device. It is weaker than Improved Initiative or Shieldmaiden, which offer monster stat-block import, initiative rolling, and a player view.

### Gaps
- None.

## 7. Campaign, party, NPCs, sessions, notes

### Takeaway
Campaign features are a create/join shell. The DM creates a campaign (synced) with a 6-char invite code, and players join via RPC (synced, rate-limited). NPC list, session log with XP field, DM session notes, and player personal notes are all **local only**. The party view and DM per-character tools depend on a character-to-campaign link that no UI ever sets, so they appear to always be empty.

### Cited Findings
- Invite code: 6 chars from a 32-char alphabet that avoids 0/O and 1/I, generated with `crypto.getRandomValues`. It is normalized to uppercase — [src/lib/campaignRemote.ts](src/lib/campaignRemote.ts)
- `join_campaign` RPC is the only way to become a member under RLS. It locks a user out after 10 failed attempts (tested) — [supabase/migrations/20261102000000_secure_rls.sql](supabase/migrations/20261102000000_secure_rls.sql), [supabase/tests/rls.test.ts](supabase/tests/rls.test.ts)
- CampaignPage: create (name, description), join form, copy invite code to clipboard, member list with kick, leave, NPC add/remove (name, role, notes), and a session notes textarea — [src/pages/CampaignPage.tsx](src/pages/CampaignPage.tsx)
- Kick, leave, NPC changes, and session notes are local-only store mutations — [src/store/campaignStore.ts](src/store/campaignStore.ts)
- SessionsPage: DM-only add/remove of sessions (title, date, summary, xpAwarded), stored locally — [src/pages/SessionsPage.tsx](src/pages/SessionsPage.tsx)
- MyNotesPage: one personal note per campaign, stored in `appStore.personalNotes` (local). The `personal_notes` table is unused — [src/pages/MyNotesPage.tsx](src/pages/MyNotesPage.tsx), [src/store/appStore.ts](src/store/appStore.ts)
- PartyPage and DmToolsPage filter characters by `ch.campaignId === campaign.id` or `member.characterId === ch.id`. The builder always sets `campaignId: null`, and a grep found no code that sets `characterId` on a member or `campaignId` on a character — [src/pages/PartyPage.tsx](src/pages/PartyPage.tsx), [src/pages/DmToolsPage.tsx](src/pages/DmToolsPage.tsx), [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx)
- Even if linked, characters live in each player's own localStorage, so the DM's browser would not have the players' characters — [src/store/characterStore.ts](src/store/characterStore.ts)
- The Kampanye tab (bottom bar) and DM Tools (sidebar) are shown only when role is 'dm' — [src/components/layout/BottomTabBar.tsx](src/components/layout/BottomTabBar.tsx), [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx)

### Inferences
- The biggest functional gap: there is no shared party state. Multiplayer value is limited to "both people know the campaign name, description, and member list as of join time".

### Gaps
- Exactly what the member list shows for a DM after players join could not be determined from the code. The DM's local copy is never re-hydrated, so the DM likely never sees new members. No refresh/hydrate call from the DM side was found.

## 8. DM tools page

### Takeaway
DM Tools is a thin page: per-character HP +/-/full controls for party characters, a "Beri XP ke Party" button that **only shows a toast** (no state change), and a campaign info card. It redirects non-DMs.

### Cited Findings
- The page redirects to /dashboard if role is not 'dm' — [src/pages/DmToolsPage.tsx](src/pages/DmToolsPage.tsx)
- The `HpControl` component offers damage, heal, and full heal for each party character — [src/pages/DmToolsPage.tsx](src/pages/DmToolsPage.tsx)
- The XP grant handler only calls `toast.success(...)` with the XP amount and character count, and there is no XP field on Character — [src/pages/DmToolsPage.tsx](src/pages/DmToolsPage.tsx) (lines ~180–184), [src/types/index.ts](src/types/index.ts)
- There is no encounter builder, CR/XP budget, random generator, or loot tool (none found in the file) — [src/pages/DmToolsPage.tsx](src/pages/DmToolsPage.tsx)

### Inferences
- Given section 7, the party character list here is effectively empty, so the page currently has little working function.

### Gaps
- None.

## 9. Homebrew page

### Takeaway
The Homebrew page is a placeholder: "Segera Hadir" (coming soon), planned for v2.0.

### Cited Findings
- The page is static. Its text says the Homebrew Builder will let users create custom spells, monsters, items, and classes in a personal compendium, "Direncanakan untuk v2.0" — [src/pages/HomebrewPage.tsx](src/pages/HomebrewPage.tsx)
- A `COMPENDIUM_BUILTIN` hook exists for code-level overrides, but it is an empty array — [src/data/compendiumBuiltin.ts](src/data/compendiumBuiltin.ts)

### Inferences
- No user-facing homebrew exists at all.

### Gaps
- None.

## 10. Compendium

### Takeaway
The compendium has 1,279 SRD 5.1 entries fetched from dnd5eapi.co and bundled as a 1.26 MB JSON: 319 spells, 334 monsters, 15 conditions, 12 classes, and 599 equipment. The content is in English and searchable, with sub-filters for spell class and level, monster type, and equipment category. It has no 2024 SRD 5.2 compendium content and no magic-item or feat/background categories.

### Cited Findings
- Counts from `src/data/generated/compendium.json` (computed with node): total 1279; spell 319, monster 334, condition 15, class 12, equipment 599 — [src/data/generated/compendium.json](src/data/generated/compendium.json)
- The fetch script says: "Fetches SRD 5.1 D&D data (CC-BY-4.0) from the D&D 5e API … Only SRD content is included. Third-party OGL books (e.g. via Open5e) … deliberately excluded". Base URL is `https://www.dnd5eapi.co`, run via `npm run fetch:compendium` — [scripts/fetch-dnd-compendium.mjs](scripts/fetch-dnd-compendium.mjs), [package.json](package.json)
- Categories are limited to spell, monster, condition, class, equipment — [src/data/compendium.ts](src/data/compendium.ts), [src/types/index.ts](src/types/index.ts)
- Example entry content is English ("A shimmering green arrow streaks toward …"). Monster entries include AC, HP, speed, ability scores, and proficiencies — [src/data/generated/compendium.json](src/data/generated/compendium.json)
- NOTICE credits SRD 5.2.1 and SRD 5.1 (CC-BY-4.0) and says SRD material "has been translated into Indonesian and summarised", but the generated compendium JSON is SRD 5.1 in English — [NOTICE.md](NOTICE.md), [src/data/generated/compendium.json](src/data/generated/compendium.json)
- The UI has category pills, search over name and tags, spell class/level sub-filters, monster type sub-filter, equipment category sub-filter, incremental paging, and a detail view showing tags and category — [src/pages/CompendiumPage.tsx](src/pages/CompendiumPage.tsx)

### Inferences
- The "translated into Indonesian" claim in NOTICE applies at most to the hand-written `src/data/dnd2024/*` rules data, not to the 1,279-entry compendium.
- Being SRD 5.1, the spell and monster data reflect 2014 wording, which is inconsistent with the app's 2024 rules framing.

### Gaps
- No `source` field exists in the entries (all undefined), so sources cannot be shown per entry.

## 11. System check page

### Takeaway
The System Check page is a diagnostics/debug page. It reports status for the data sets (feats, subclasses, classes, races, backgrounds, compendium) and the 4 stores, lists all feats and subclasses, and shows the stored characters.

### Cited Findings
- It runs checks named Feats Database, Subclasses Database, Classes Database, Races Database, Backgrounds Database, Compendium Data, Character Store, Campaign Store, Combat Store, and App Store. It also has sections for Quick Actions, Origin and General feats, All Feats (n), Subclasses by Class, All Subclasses (n), Compendium Status, and Stored Characters — [src/pages/SystemCheckPage.tsx](src/pages/SystemCheckPage.tsx)
- It is linked from a Dashboard quick action (`navigate('/system-check')`) — [src/pages/DashboardPage.tsx](src/pages/DashboardPage.tsx)

### Inferences
- This is developer tooling exposed to end users.

### Gaps
- None.

## 12. Settings, themes, dark mode

### Takeaway
Settings offers 18 color themes, a dark-mode switch with anti-flash script, a dice-animation toggle, a role switch, and logout/reset. All of it is local. A vitest suite checks WCAG AA contrast for text on each theme's gold color.

### Cited Findings
- 18 theme IDs: forest (default), sapphire, ruby, amethyst, amber, teal, rose, obsidian, crimson-knight, draconic-bronze, mystic-indigo, shadow-assassin, desert-nomad, iceborn-sorcerer, nature-druid, blood-hunter, arcane-scholar, wild-magic — [src/lib/themes.ts](src/lib/themes.ts)
- Dark mode toggles the `dark` class on `<html>`. An inline script in index.html reads `localStorage['dnd-app']` before render to prevent the wrong-theme flash — [src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx), [index.html](index.html)
- Settings controls: profile/role, theme palette, "Preferensi" (dark mode Switch, dice animations Switch), and logout via `reset()` — [src/pages/SettingsPage.tsx](src/pages/SettingsPage.tsx)
- Theme contrast test: `readableTextOn(gold)` must reach ≥ 4.5:1 for every theme — [src/lib/themes.test.ts](src/lib/themes.test.ts)

### Inferences
- The theming is a differentiator, since most competitors offer only light and dark.

### Gaps
- No `prefers-color-scheme` auto-detection was seen; the default is `darkMode: false`. — [src/store/appStore.ts](src/store/appStore.ts)

## 13. Tests

### Takeaway
There are three test files. The rules tests cover AC, HP, ASI levels, and rests. The theme test covers contrast. A thorough RLS security test runs against PGlite. There are no component or UI tests and no e2e tests.

### Cited Findings
- `src/lib/rules.test.ts` covers computeArmorClass (2024, negative DEX on medium armor, shield +2), computeMaxHp, ASI levels (base, Fighter 6 and 14, Rogue 10), restoreSpellSlots, Long Rest, and Short Rest restoring Warlock slots only — [src/lib/rules.test.ts](src/lib/rules.test.ts)
- `src/lib/themes.test.ts` checks WCAG reference values and the AA check per theme — [src/lib/themes.test.ts](src/lib/themes.test.ts)
- `supabase/tests/rls.test.ts` checks that anon cannot read, write, or join; that the DM is auto-membered; that non-members cannot see the campaign, invite code, members, NPCs, or sessions; that join is case-insensitive and idempotent; the 10-attempt lockout; that members cannot self-promote or edit NPCs; that only the DM can kick; and that characters, notes, and dice rolls are owner-only. It uses `@electric-sql/pglite` (devDependency) — [supabase/tests/rls.test.ts](supabase/tests/rls.test.ts), [package.json](package.json)
- The test runner is `vitest run` — [package.json](package.json)

### Inferences
- The server security model is better tested than the server is actually used by the client.

### Gaps
- Tests were not executed during this research, so their pass or fail status is unknown.

## 14. Localisation

### Takeaway
The app has no i18n framework. The UI is a hand-written Indonesian/English mix: navigation, toasts, and helper text are mostly Indonesian, while many D&D terms and headings stay English. The compendium content is fully English.

### Cited Findings
- No i18n library appears in package.json, and a grep for i18n/i18next/useTranslation/intl in `src` matched only the compendium JSON (text content) — [package.json](package.json)
- `index.html` sets `lang="id"`. The meta description is "Sistem D&D Digital – Mobile-First" — [index.html](index.html)
- Indonesian examples: "Selamat Datang", "Pilih Peran", "Mulai Petualangan", "Minimal 2 karakter" (onboarding); "Kode invite disalin!", "Kode invite tidak valid atau kampanye tidak aktif" (campaign); "Pilih Spell", "dipakai" (sheet); "Segera Hadir" (homebrew); "Beri XP ke Party" (DM tools) — [src/pages/OnboardingPage.tsx](src/pages/OnboardingPage.tsx), [src/pages/CampaignPage.tsx](src/pages/CampaignPage.tsx), [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx), [src/pages/HomebrewPage.tsx](src/pages/HomebrewPage.tsx), [src/pages/DmToolsPage.tsx](src/pages/DmToolsPage.tsx)
- English examples: tabs "Stats/Skills/Spells/Items/Notes", "Short Rest"/"Long Rest" dialogs and long-rest explanation text, "Add NPC / Monster", "Starting Equipment", "Equipment auto-generated from class & background. Edit as needed.", bottom-tab "Home"/"Combat", "Quick Actions", the System Check page headings, and the onboarding Tolkien quote — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx), [src/pages/CombatPage.tsx](src/pages/CombatPage.tsx), [src/pages/CharacterBuilderPage.tsx](src/pages/CharacterBuilderPage.tsx), [src/components/layout/BottomTabBar.tsx](src/components/layout/BottomTabBar.tsx), [src/pages/SystemCheckPage.tsx](src/pages/SystemCheckPage.tsx)
- Some code comments and type docs are Indonesian ("Slot spell otomatis…", "Nama tampilan background") — [src/types/index.ts](src/types/index.ts)

### Inferences
- Indonesian-first is a niche differentiator, since the major competitors are English-centric. Without an i18n layer, adding English or full Indonesian would mean touching every page.

### Gaps
- No string-by-string ratio was computed. The mix is a qualitative assessment.

## 15. Mobile UX

### Takeaway
The layout is mobile-first: a fixed bottom tab bar on mobile (4 tabs, 5 for DM) with 44px min-height targets, a collapsible sidebar on desktop, and dvh-based dialogs. Some in-page buttons are smaller than 44px (h-7, about 28px).

### Cited Findings
- The bottom bar is hidden at md+. It is `h-16`, and each tab is `min-h-[44px]` with 10px labels. Tabs are Home, Karakter, Combat, Kompendium, plus Kampanye for DM — [src/components/layout/BottomTabBar.tsx](src/components/layout/BottomTabBar.tsx)
- The bottom bar has no Dice, Party, Notes, or Sessions tab. Those are reachable only via the sidebar (md+) or in-page links — [src/components/layout/BottomTabBar.tsx](src/components/layout/BottomTabBar.tsx), [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx)
- Sidebar items: Dashboard, Karakter, Party, Combat, Dadu, Kompendium, Catatan, Sesi, Homebrew, plus Kampanye and DM Tools for DM. It collapses from 220px to 52px — [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx), [src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx)
- Main content gets `pb-20` on mobile to clear the tab bar — [src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx)
- The spell-slot +/- buttons are `h-7 px-2`, below the 44px touch target. 14 occurrences of `h-7 ` exist across `src/pages` — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx)
- The spell picker dialog uses `height: 85dvh` — [src/pages/CharacterSheetPage.tsx](src/pages/CharacterSheetPage.tsx)
- The app has no safe-area-inset handling in the bottom bar classes (none seen). This was not verified in index.css. — [src/components/layout/BottomTabBar.tsx](src/components/layout/BottomTabBar.tsx)

### Inferences
- On phones, the Dice roller has no persistent nav entry, even though it is a high-frequency feature. It is reachable from Dashboard quick actions.

### Gaps
- No on-device or browser testing was done. Touch-target observations come from class names only.

## 16. Summary scorecard (from the findings above)

### Takeaway
The app is strongest in theming, Indonesian-first UI, 2024 level-up logic (ASI and feat prerequisites, subclasses), the SRD spell picker, and well-tested RLS. It is weakest in multiplayer sync (only campaign create and join), death saves and exhaustion UI, concentration, monster import into combat, dice notation, XP, homebrew, PWA/offline, and export/import.

### Cited Findings
- Synced: campaign insert and join/hydrate only — [src/lib/campaignRemote.ts](src/lib/campaignRemote.ts)
- Local only: characters, dice log, NPCs, sessions, session notes, personal notes, settings — [src/store/*](src/store)
- In memory only: combat — [src/store/combatStore.ts](src/store/combatStore.ts)
- Placeholder or non-functional: Homebrew page, XP grant button, Party/DM-tools character list (no linking path) — [src/pages/HomebrewPage.tsx](src/pages/HomebrewPage.tsx), [src/pages/DmToolsPage.tsx](src/pages/DmToolsPage.tsx), [src/pages/PartyPage.tsx](src/pages/PartyPage.tsx)
- Scaffolding: README.md is still the stock Vite template text — [README.md](README.md)

### Inferences
- Offline use mostly works by accident, since most data is local. Without a service worker, though, the app shell does not load offline.

### Gaps
- SPRINT1_TODO.md, THEMES.md, and `reports/` were not reviewed. They might list planned features but would not change what the code does.
