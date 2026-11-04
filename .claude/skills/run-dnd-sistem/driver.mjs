// Drive dnd-sistem in a real browser (Playwright + installed Chrome).
//   node .claude/skills/run-dnd-sistem/driver.mjs smoke   # one DM, no Supabase needed
//   node .claude/skills/run-dnd-sistem/driver.mjs e2e     # DM + Player, needs .env.local Supabase
// Env: BASE_URL (default http://localhost:5173), OUT (screenshot dir, default /tmp/dnd-sistem-shots), HEADED=1
// Exits 1 if any check fails or a step throws.
import fs from 'node:fs'
import { chromium } from 'playwright'

const MODE = process.argv[2] ?? 'smoke'
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const OUT = process.env.OUT ?? '/tmp/dnd-sistem-shots'
fs.mkdirSync(OUT, { recursive: true })

// Installed Chrome first (no browser download needed); fall back to Playwright's bundled Chromium
const headless = !process.env.HEADED
const browser = await chromium.launch({ channel: 'chrome', headless }).catch(() => chromium.launch({ headless }))
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a)

async function user(label, viewport) {
  const ctx = await browser.newContext({ viewport }) // separate context = separate localStorage + Supabase session
  const page = await ctx.newPage()
  page.on('dialog', (d) => d.accept()) // kick / leave use window.confirm
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error' || m.text().includes('[sync]')) errors.push(`${m.type()}: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  const shot = (name) => page.screenshot({ path: `${OUT}/${MODE}-${label}-${name}.png`, fullPage: true })
  return { page, errors, shot, label }
}
const toasts = async (page) => (await page.locator('[data-sonner-toast]').allInnerTexts()).map((t) => t.replace(/\s+/g, ' '))

const results = []
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); log(ok ? 'PASS' : 'FAIL', name, detail) }

async function onboard(u, nickname, roleTitle) {
  await u.page.goto(BASE + '/')
  await u.page.fill('#nickname', nickname)
  await u.page.getByText(roleTitle, { exact: true }).click()
  await u.page.getByRole('button', { name: /Mulai Petualangan/ }).click()
  await u.page.waitForURL('**/dashboard')
  log(u.label, 'onboarded as', roleTitle)
}

// Radix Select: click the trigger by its placeholder text, then the option by role
async function pick(page, placeholder, option) {
  await page.getByText(placeholder, { exact: true }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}

async function buildFighter(u, name) {
  await u.page.goto(BASE + '/characters/new')
  await u.page.fill('#name', name)
  await pick(u.page, 'Pilih ras...', 'Human')
  await pick(u.page, 'Pilih kelas...', 'Fighter')
  await pick(u.page, 'Pilih...', 'Neutral Good')
  await u.page.getByRole('radio', { name: 'Standard Array' }).click()
  // Submit stays disabled until the class's skill picks are made (Fighter: 2)
  await u.page.getByRole('button', { name: 'Athletics', exact: true }).click()
  await u.page.getByRole('button', { name: 'Perception', exact: true }).click()
  await u.shot('builder')
  await u.page.locator('form button[type="submit"]').click()
  await u.page.waitForURL(/\/characters\/[0-9a-f-]{36}$/, { timeout: 15000 })
}

async function smoke() {
  const dm = await user('dm', { width: 390, height: 844 })
  try {
    await onboard(dm, 'Smoke DM', 'Dungeon Master')
    await buildFighter(dm, 'Smoke Fighter')
    check('Builder creates character', true)
    check('Sheet shows class resources', await dm.page.getByText('Second Wind').first().isVisible())
    await dm.shot('sheet')
    await dm.page.goto(BASE + '/combat')
    await dm.page.getByRole('button', { name: /Add NPC \/ Monster/ }).click()
    await dm.page.getByPlaceholder('Cari monster, mis. Goblin').fill('Goblin')
    await dm.page.getByRole('button', { name: /^Goblin/ }).first().click()
    check('Combat adds SRD monster', (await dm.page.getByText('Goblin').count()) > 0)
    await dm.shot('combat')
  } catch (e) {
    log('ERROR', e.message.split('\n')[0]); results.push({ ok: false }); await dm.shot('error')
  } finally {
    log('console errors:', JSON.stringify(dm.errors.slice(0, 8)))
  }
}

async function e2e() {
  const dm = await user('dm', { width: 1280, height: 900 })
  const pl = await user('player', { width: 390, height: 844 }) // phone-sized
  try {
    await onboard(dm, 'E2E DM', 'Dungeon Master')
    await onboard(pl, 'E2E Pemain', 'Player')

    // DM creates a campaign
    await dm.page.goto(BASE + '/campaign')
    await dm.page.getByPlaceholder('Lost Mines of Phandelver...').fill('E2E Kampanye')
    await dm.page.getByPlaceholder('Setting, tone, premise...').fill('Tes otomatis')
    await dm.page.getByRole('button', { name: /Buat Kampanye/ }).last().click()
    await dm.page.getByText('Kode Invite').waitFor({ timeout: 15000 })
    const code = (await dm.page.locator('p.font-mono.tracking-widest').first().innerText()).trim()
    check('DM creates campaign', /^[A-Z0-9]{6}$/.test(code), code)
    await dm.shot('01-campaign')

    // Player joins
    await pl.page.goto(BASE + '/campaign')
    await pl.page.getByPlaceholder('ABCDEF').fill(code)
    await pl.page.getByRole('button', { name: /Bergabung/ }).last().click()
    await pl.page.getByText('E2E Kampanye').first().waitFor({ timeout: 15000 })
    check('Player joins by code', true)
    await pl.shot('01-joined')

    // DM sees the player in Anggota (realtime or poll)
    await dm.page.getByRole('tab', { name: 'Anggota' }).click()
    const seen = await dm.page.getByText('E2E Pemain').first().waitFor({ timeout: 25000 }).then(() => true, () => false)
    check('DM sees player in members (live)', seen)
    await dm.shot('02-members')

    // ── Player builds a character (phone layout) ──
    await buildFighter(pl, 'Brakka')
    check('Player creates Fighter with Standard Array', true, pl.page.url().split('/').pop())

    // Sheet: class resources, condition, concentration area render
    const hasResources = await pl.page.getByText('Second Wind').first().isVisible()
    check('Sheet shows Fighter resources (Second Wind)', hasResources)
    await pl.page.getByRole('button', { name: 'Prone', exact: true }).click()
    const proneBadge = await pl.page.getByText('Prone').count()
    check('Player marks Prone condition', proneBadge >= 2, `matches=${proneBadge}`)
    await pl.shot('03-sheet')

    // Link character to the campaign from the campaign page
    await pl.page.goto(BASE + '/campaign')
    await pl.page.getByText('Belum dipilih', { exact: true }).click()
    await pl.page.getByRole('option', { name: /Brakka/ }).click()
    check('Player links character to campaign', await pl.page.locator('#my-character').innerText().then((t) => t.includes('Brakka')))
    await pl.shot('04-linked')

    // ── DM adds an NPC; player should see it ──
    await dm.page.getByRole('tab', { name: /NPC/ }).click()
    await dm.page.getByRole('button', { name: /Tambah NPC/ }).click()
    await dm.page.getByPlaceholder('Nama NPC...').fill('Ireena Kolyana')
    await dm.page.getByPlaceholder('Villain, Ally, Merchant, Quest Giver...').fill('Ally')
    await dm.page.getByRole('button', { name: 'Simpan', exact: true }).click()
    await dm.shot('03-npc')
    await pl.page.getByRole('tab', { name: /NPC/ }).click()
    await pl.page.waitForTimeout(3000)
    check('Player UI keeps DM NPC hidden', (await pl.page.getByText('Ireena Kolyana').count()) === 0)
    await pl.shot('05-npc')

    // ── Player takes damage on own sheet ──
    await pl.page.goto(BASE + '/characters')
    await pl.page.getByText('Brakka').first().click()
    await pl.page.getByPlaceholder('Amount').fill('4')
    await pl.page.getByRole('button', { name: /Damage/ }).click()
    const hpText = await pl.page.locator('span.font-mono.font-bold.text-lg').first().innerText()
    check('Player damage on sheet', /^\d+ \/ \d+/.test(hpText), hpText)
    const [hpNow, hpMax] = hpText.match(/\d+/g).map(Number)

    // ── DM party view shows the player's character with condition ──
    await dm.page.goto(BASE + '/party')
    const partySeen = await dm.page.getByText('Brakka').first().waitFor({ timeout: 25000 }).then(() => true, () => false)
    check('DM Party shows player character', partySeen)
    check('DM Party shows player condition', await dm.page.getByText('Prone').first().isVisible().catch(() => false))
    const partyHp = await dm.page.getByText(`${hpNow}/${hpMax}`).first().waitFor({ timeout: 25000 }).then(() => true, () => false)
    check('DM Party shows player HP after damage (live)', partyHp, `${hpNow}/${hpMax}`)
    await dm.shot('04-party')

    // ── Combat: DM adds goblins + party, starts; player follows live ──
    await dm.page.goto(BASE + '/combat')
    await dm.page.getByRole('button', { name: /Tambah semua party/ }).waitFor({ timeout: 25000 })
    await dm.page.getByRole('button', { name: /Tambah semua party/ }).click()
    await dm.page.getByRole('button', { name: /Add NPC \/ Monster/ }).click()
    await dm.page.getByPlaceholder('Cari monster, mis. Goblin').fill('Goblin')
    await dm.page.getByLabel('Jumlah').fill('2')
    await dm.page.getByRole('button', { name: /^Goblin/ }).first().click()
    const cancel = dm.page.getByRole('button', { name: /Cancel|Batal/ })
    if (await cancel.count()) await cancel.first().click()
    await dm.page.getByRole('button', { name: /Start Combat/ }).click()
    check('DM starts combat with party + 2 goblins', (await dm.page.getByText(/Goblin \d/).count()) >= 2)
    await dm.shot('05-combat')

    await pl.page.goto(BASE + '/combat')
    const live = await pl.page.getByText('Giliran sekarang').waitFor({ timeout: 25000 }).then(() => true, () => false)
    check('Player sees live combat', live)
    const goblinRows = await pl.page.getByText(/Goblin \d/).count()
    check('Player sees goblins', goblinRows >= 2, `rows=${goblinRows}`)
    check('Player view hides goblin HP numbers', (await pl.page.getByText('Sehat').count()) >= 2)
    check('Player view marks own character', await pl.page.getByText('Kamu', { exact: true }).isVisible().catch(() => false))
    await pl.shot('06-combat-live')

    // DM advances the turn; the player's view follows
    await dm.page.getByRole('button', { name: /Next/ }).click()
    await pl.page.waitForTimeout(3000)
    const turnText = await pl.page.getByText(/^Giliran:/).first().innerText().catch(() => '')
    check('Player view follows DM turn change', turnText.length > 0, turnText)
    await pl.shot('07-turn')

    // DM damages the player's character in combat; player's live view shows the new HP
    await dm.page.getByRole('button', { name: 'Buka kontrol Brakka' }).click()
    await dm.page.getByPlaceholder('Amount').first().fill('3')
    await dm.page.getByRole('button', { name: 'Damage', exact: true }).first().click()
    const combatHp = `${Math.max(0, hpNow - 3)}/${hpMax}`
    const seenHp = await pl.page.getByText(combatHp).first().waitFor({ timeout: 15000 }).then(() => true, () => false)
    check('Player live view shows HP change from DM', seenHp, combatHp)
    await dm.shot('06-combat-damage'); await pl.shot('08-hp-live')

    // ── Sessions: DM adds one, player sees it ──
    await dm.page.goto(BASE + '/sessions')
    await dm.page.getByRole('button', { name: /Tambah Sesi Baru/ }).click()
    await dm.page.getByPlaceholder('Sesi 1: Pertemuan di Tavern').fill('Sesi E2E: Gerbang Barovia')
    await dm.page.getByPlaceholder('Apa yang terjadi di sesi ini...').fill('Party tiba di gerbang.')
    await dm.page.getByRole('button', { name: /Simpan Sesi/ }).click()
    await pl.page.goto(BASE + '/sessions')
    const sesSeen = await pl.page.getByText('Sesi E2E: Gerbang Barovia').first().waitFor({ timeout: 25000 }).then(() => true, () => false)
    check('Player sees DM session (live)', sesSeen)
    await pl.shot('09-sessions')

    // ── Player long rest restores HP and Second Wind ──
    await pl.page.goto(BASE + '/characters')
    await pl.page.getByText('Brakka').first().click()
    await pl.page.getByRole('button', { name: /Long Rest/ }).click()
    await pl.page.getByRole('button', { name: /^Rest$/ }).click()
    const afterRest = await pl.page.locator('span.font-mono.font-bold.text-lg').first().innerText()
    check('Long Rest restores full HP', afterRest.startsWith(`${hpMax} / ${hpMax}`), afterRest)

    // ── DM kicks the player; player is removed ──
    await dm.page.goto(BASE + '/campaign')
    await dm.page.getByRole('tab', { name: 'Anggota' }).click()
    await dm.page.getByRole('button', { name: 'Kick E2E Pemain' }).click()
    await pl.page.goto(BASE + '/campaign')
    const kicked = await pl.page.getByText('Kamu tidak lagi menjadi anggota kampanye ini.').waitFor({ timeout: 30000 }).then(() => true, () => false)
    check('Kicked player is removed from campaign', kicked)
    await pl.shot('10-kicked')
  } catch (e) {
    log('ERROR', e.message.split('\n')[0]); results.push({ ok: false })
    await dm.shot('error'); await pl.shot('error')
  } finally {
    log('DM toasts:', JSON.stringify(await toasts(dm.page)))
    log('Player toasts:', JSON.stringify(await toasts(pl.page)))
    log('DM console errors:', JSON.stringify(dm.errors.slice(0, 8)))
    log('Player console errors:', JSON.stringify(pl.errors.slice(0, 8)))
  }
}

await (MODE === 'e2e' ? e2e() : smoke())
await browser.close()
const passed = results.filter((r) => r.ok).length
console.log(`\nSUMMARY: ${passed}/${results.length} passed · screenshots in ${OUT}`)
process.exit(passed === results.length ? 0 : 1)
