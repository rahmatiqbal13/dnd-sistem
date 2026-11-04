---
name: run-dnd-sistem
description: Run, start, test, screenshot and drive the dnd-sistem web app (Vite/React + Supabase) in a real browser, including a two-user DM + Player end-to-end test of campaigns, sync, party view and live combat. Use when asked to run the app, check a UI change, take a screenshot, or test as DM and as player.
---

dnd-sistem is a Vite/React SPA (Indonesian UI) backed by Supabase. Agents drive it with
`.claude/skills/run-dnd-sistem/driver.mjs`: Playwright on the installed Chrome, headless.
It runs scripted flows, takes screenshots, and prints PASS/FAIL per check. All paths are
relative to the repo root.

## Prerequisites

- Node + npm (the project uses Vite 8 and Vitest 5).
- Google Chrome installed. The driver uses `channel: 'chrome'` and falls back to
  Playwright's bundled Chromium if Chrome is missing.
- For `e2e` mode only: `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  (a publishable or anon key **from the same project** as the URL), all migrations in
  `supabase/migrations/` applied, and **Anonymous Sign-Ins** enabled in that project.

## Setup

```bash
npm ci
npm i --no-save playwright@1     # driver dependency; not in package.json on purpose
```

## Run (agent path)

Start a dev server on its own port, so a human's server on 5173 isn't disturbed:

```bash
(npm run dev -- --port 5199 --strictPort > /tmp/dnd-sistem-dev.log 2>&1 &)
timeout 30 bash -c 'until curl -sf http://localhost:5199 >/dev/null; do sleep 1; done' && echo SERVER_UP
```

Drive it:

```bash
BASE_URL=http://localhost:5199 node .claude/skills/run-dnd-sistem/driver.mjs smoke
BASE_URL=http://localhost:5199 node .claude/skills/run-dnd-sistem/driver.mjs e2e
```

| mode | what it does | needs Supabase |
|---|---|---|
| `smoke` | One DM on a phone viewport: onboarding → build a Fighter (Standard Array) → sheet with class resources → add an SRD Goblin in Combat. 3 checks, about 2 s. | no |
| `e2e` | Two isolated browser contexts: DM on desktop, Player on phone. Create campaign → join by code → member shows live → character build + link → Prone condition → DM Party shows HP and conditions live → NPC hidden from player → combat with party + 2 Goblins → player live view (turn, HP change, monster HP hidden) → sessions sync → Long Rest → kick. 22 checks, about 25 s. | yes |

Output: one `PASS`/`FAIL` line per check, then toasts and console errors for each user, then
`SUMMARY: n/m passed`. The exit code is 1 if any check fails or a step throws.
Screenshots go to `/tmp/dnd-sistem-shots/<mode>-<user>-<step>.png` (override with `OUT=`).
Look at them: `*-error.png` is written when a step throws. `HEADED=1` shows the browser.

Stop the server (only the 5199 listener):

```bash
lsof -ti:5199 -sTCP:LISTEN | xargs kill
```

`e2e` writes real rows to the Supabase project in `.env.local`. Clean up in the SQL Editor:

```sql
delete from characters where name = 'Brakka';
delete from campaigns where name = 'E2E Kampanye';
```

Anonymous test users stay in Authentication → Users. They're harmless; delete them if you want.

## Run (human path)

```bash
npm run dev    # http://localhost:5173, Ctrl-C to stop
```

To test DM and Player by hand, use a normal window plus a private/incognito window.

## Test

```bash
npx tsc -b && npx eslint . && npx vitest run && npx vite build
```

Expected: 0 lint errors (1 known react-hook-form `watch()` warning), 76 tests in 9 files.
`supabase/tests/rls.test.ts` runs every migration twice in PGlite (in-process Postgres) and
checks the RLS allow and deny paths, so no database is needed.

## Gotchas

- **One browser = one identity.** The Supabase anonymous session lives in that browser's
  storage. Changing nickname or role in the same browser doesn't create a new user, so
  "joining" your own campaign as a player silently does nothing. The driver uses separate
  `browser.newContext()`s for this reason.
- **A player's character only reaches the DM once it's linked to the campaign.** Linking
  happens in Kampanye → Overview → "Karakter saya di kampanye ini", or on the sheet's
  "Kampanye & XP" card. Unlinked characters sync with `campaign_id = null` and don't
  appear in Party or Combat.
- **The NPC tab is DM-only by design**, both in the UI and in RLS (migration
  `20261105010000_npcs_dm_only.sql`). Don't assert that a player sees NPCs.
- **Sync is debounced.** Character upserts wait about 1.5 s and combat pushes about 0.3 s.
  Realtime events trigger a refetch, with a 20 s poll (10 s for combat) as fallback. Use
  `waitFor` with a 15–25 s timeout, never an immediate assert.
- **Radix Select has no native `<select>`.** Click the trigger by its placeholder text,
  then `getByRole('option')`. The builder's submit button stays disabled until the
  class's skill picks are made (Fighter: 2).
- **Kick and leave use `window.confirm`.** The driver auto-accepts dialogs.
- **Combat row controls are icon buttons.** Target them by aria-label: `Buka kontrol <name>`,
  `Hapus <name> dari combat`, `Kick <nickname>`.
- **In zsh, `${PIPESTATUS[0]}` is empty.** Check `$?` without a pipe.

## Troubleshooting

- **Toast "Sinkronisasi ke server gagal… initial pull: Gagal masuk ke server: Invalid API
  key"**: the key in `.env.local` belongs to a different project than the URL. Copy the
  anon or publishable key from the project the URL points to, then restart `npm run dev`;
  Vite only reads `.env.local` at startup.
- **Migration error `relation "campaign_members_campaign_id_user_id_key" already exists`**:
  an older copy of `20261102000000_secure_rls.sql` was partially applied. The current file
  is re-runnable; run it again.
- **`e2e` stops at a `locator.click: Timeout`**: a selector no longer matches the UI.
  Open the `*-error.png` screenshot, then fix the selector in `driver.mjs`.
