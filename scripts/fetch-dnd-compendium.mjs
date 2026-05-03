/**
 * Fetches SRD-oriented D&D data from public APIs and optional 5e.tools-format JSON.
 *
 * Sources:
 *   - D&D 5e API: https://www.dnd5eapi.co (primary)
 *   - Open5e:     https://api.open5e.com/v1 (supplement; non-duplicate by name)
 *   - 5e.tools:   optional — set FIVETOOLS_DATA_BASE to a static root (e.g. raw GitHub mirror)
 *                 that exposes data/spells/*.json (no live site scraping).
 *
 * Usage: node scripts/fetch-dnd-compendium.mjs
 *
 * Output: src/data/generated/compendium.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'src', 'data', 'generated')
const OUT_FILE = path.join(OUT_DIR, 'compendium.json')

const DND_BASE = process.env.DND5EAPI_BASE ?? 'https://www.dnd5eapi.co'
const OPEN5E_BASE = process.env.OPEN5E_BASE ?? 'https://api.open5e.com/v1'
/** Root URL where `data/spells/spells-phb.json` etc. can be fetched (optional). */
const FIVETOOLS_BASE = process.env.FIVETOOLS_DATA_BASE?.replace(/\/$/, '') ?? ''

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  return res.json()
}

function textFromApi(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.map(textFromApi).filter(Boolean).join('\n\n')
  if (typeof value === 'object' && 'name' in value && typeof value.name === 'string') return value.name
  return String(value)
}

function formatComponents(spell) {
  const parts = []
  for (const c of spell.components ?? []) {
    if (c === 'M' && spell.material) parts.push(`M (${spell.material})`)
    else parts.push(c)
  }
  return parts.join(', ') || '—'
}

function dndSpellToEntry(spell) {
  const levelLabel = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`
  const school = spell.school?.name ?? ''
  const tags = []
  for (const c of spell.classes ?? []) {
    if (c?.name) tags.push(c.name)
  }
  if (spell.ritual) tags.push('Ritual')
  if (spell.concentration) tags.push('Concentration')

  const content = {
    'Casting Time': spell.casting_time ?? '—',
    Range: spell.range ?? '—',
    Components: formatComponents(spell),
    Duration: spell.duration ?? '—',
    Description: textFromApi(spell.desc) || '—',
  }
  const hl = textFromApi(spell.higher_level)
  if (hl) content['At Higher Levels'] = hl

  return {
    id: `dnd5e-spell-${spell.index}`,
    name: spell.name,
    category: 'spell',
    subtitle: school ? `${levelLabel} ${school}` : levelLabel,
    tags,
    content,
  }
}

function dndMonsterToEntry(m) {
  const ac = Array.isArray(m.armor_class)
    ? m.armor_class.map((x) => (typeof x === 'object' ? `${x.value}${x.type ? ` (${x.type})` : ''}` : x)).join(', ')
    : String(m.armor_class ?? '—')
  const spd = m.speed
    ? typeof m.speed === 'object'
      ? Object.entries(m.speed)
          .map(([k, v]) => `${k} ${v}`)
          .join(', ')
      : String(m.speed)
    : '—'
  const content = {
    'Armor Class': ac,
    'Hit Points': `${m.hit_points ?? '—'}${m.hit_dice ? ` (${m.hit_dice})` : ''}`,
    Speed: spd,
    'STR / DEX / CON': `${m.strength ?? '—'} / ${m.dexterity ?? '—'} / ${m.constitution ?? '—'}`,
    'INT / WIS / CHA': `${m.intelligence ?? '—'} / ${m.wisdom ?? '—'} / ${m.charisma ?? '—'}`,
  }
  if (m.proficiencies?.length) {
    content.Proficiencies = m.proficiencies.map((p) => `${p.proficiency?.name ?? ''} ${p.value ?? ''}`.trim()).join('; ')
  }
  if (m.damage_vulnerabilities?.length) content['Damage Vulnerabilities'] = m.damage_vulnerabilities.join(', ')
  if (m.damage_resistances?.length) content['Damage Resistances'] = m.damage_resistances.join(', ')
  if (m.damage_immunities?.length) content['Damage Immunities'] = m.damage_immunities.join(', ')
  if (m.condition_immunities?.length) content['Condition Immunities'] = m.condition_immunities.map((c) => c.name ?? c).join(', ')
  if (m.senses) content.Senses = typeof m.senses === 'object' ? JSON.stringify(m.senses) : String(m.senses)
  if (m.languages) content.Languages = String(m.languages)
  if (m.challenge_rating != null) content['Challenge Rating'] = String(m.challenge_rating)
  const traits = []
  for (const t of m.special_abilities ?? []) {
    traits.push(`${t.name}: ${textFromApi(t.desc)}`)
  }
  if (traits.length) content.Traits = traits.join('\n\n')
  const actions = []
  for (const a of m.actions ?? []) {
    actions.push(`${a.name}: ${textFromApi(a.desc)}`)
  }
  if (actions.length) content.Actions = actions.join('\n\n')
  const la = []
  for (const a of m.legendary_actions ?? []) {
    la.push(`${a.name}: ${textFromApi(a.desc)}`)
  }
  if (la.length) content['Legendary Actions'] = la.join('\n\n')

  return {
    id: `dnd5e-monster-${m.index}`,
    name: m.name,
    category: 'monster',
    subtitle: `${m.size ?? ''} ${m.type ?? ''}, CR ${m.challenge_rating ?? '?'}`.trim(),
    tags: [m.type, `CR ${m.challenge_rating}`].filter(Boolean),
    content,
  }
}

function dndConditionToEntry(c) {
  return {
    id: `dnd5e-condition-${c.index}`,
    name: c.name,
    category: 'condition',
    subtitle: 'Status Condition',
    tags: ['Condition'],
    content: { Effect: textFromApi(c.desc) || '—' },
  }
}

function dndClassToEntry(c) {
  return {
    id: `dnd5e-class-${c.index}`,
    name: c.name,
    category: 'class',
    subtitle: `Class · Hit die d${c.hit_die ?? '?'}`,
    tags: ['Class', `d${c.hit_die}`],
    content: {
      'Hit Die': `d${c.hit_die ?? '?'}`,
      Description: textFromApi(c.desc) || '—',
    },
  }
}

function dndEquipmentToEntry(e) {
  const content = {
    Category: e.equipment_category?.name ?? 'Equipment',
    Description: textFromApi(e.desc) || '—',
  }
  if (e.weight != null) content.Weight = `${e.weight} lb`
  if (e.cost) content.Cost = `${e.cost.quantity ?? ''} ${e.cost.unit ?? ''}`.trim()
  if (e.damage?.damage_dice) {
    content.Damage = `${e.damage.damage_dice}${e.damage.damage_type?.name ? ` ${e.damage.damage_type.name}` : ''}`
  }
  if (e.two_handed_damage?.damage_dice) {
    content['Two-Handed'] = `${e.two_handed_damage.damage_dice}${e.two_handed_damage.damage_type?.name ? ` ${e.two_handed_damage.damage_type.name}` : ''}`
  }
  if (e.range) content.Range = `normal ${e.range.normal ?? '—'} / long ${e.range.long ?? '—'}`
  if (e.properties?.length) content.Properties = e.properties.map((p) => p.name).join(', ')
  if (e.armor_class) content['Armor Class'] = typeof e.armor_class === 'object' ? String(e.armor_class.base) : String(e.armor_class)

  return {
    id: `dnd5e-equipment-${e.index}`,
    name: e.name,
    category: 'equipment',
    subtitle: e.equipment_category?.name ?? 'Equipment',
    tags: [e.equipment_category?.name, 'Equipment'].filter(Boolean),
    content,
  }
}

function dndMagicItemToEntry(m) {
  return {
    id: `dnd5e-magic-${m.index}`,
    name: m.name,
    category: 'equipment',
    subtitle: m.equipment_category?.name ?? 'Magic Item',
    tags: ['Magic Item', m.rarity ?? ''].filter(Boolean),
    content: {
      Rarity: m.rarity ?? '—',
      Description: textFromApi(m.desc) || '—',
    },
  }
}

function normName(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

async function fetchAllDndSpells() {
  const list = await fetchJson(`${DND_BASE}/api/spells?limit=500`)
  const results = list.results ?? []
  const entries = []
  let i = 0
  for (const r of results) {
    const spell = await fetchJson(`${DND_BASE}${r.url}`)
    entries.push(dndSpellToEntry(spell))
    i++
    if (i % 25 === 0) await sleep(80)
  }
  return entries
}

async function fetchAllDndMonsters() {
  const list = await fetchJson(`${DND_BASE}/api/monsters?limit=500`)
  const results = list.results ?? []
  const entries = []
  let i = 0
  for (const r of results) {
    const m = await fetchJson(`${DND_BASE}${r.url}`)
    entries.push(dndMonsterToEntry(m))
    i++
    if (i % 20 === 0) await sleep(80)
  }
  return entries
}

async function fetchAllDndConditions() {
  const list = await fetchJson(`${DND_BASE}/api/conditions`)
  const entries = []
  for (const r of list.results ?? []) {
    const c = await fetchJson(`${DND_BASE}${r.url}`)
    entries.push(dndConditionToEntry(c))
  }
  return entries
}

async function fetchAllDndClasses() {
  const list = await fetchJson(`${DND_BASE}/api/classes`)
  const entries = []
  for (const r of list.results ?? []) {
    const c = await fetchJson(`${DND_BASE}${r.url}`)
    entries.push(dndClassToEntry(c))
  }
  return entries
}

async function fetchAllDndEquipment() {
  const list = await fetchJson(`${DND_BASE}/api/equipment?limit=1000`)
  const results = list.results ?? []
  const entries = []
  let i = 0
  for (const r of results) {
    try {
      const e = await fetchJson(`${DND_BASE}${r.url}`)
      entries.push(dndEquipmentToEntry(e))
    } catch {
      /* skip malformed */
    }
    i++
    if (i % 30 === 0) await sleep(60)
  }
  return entries
}

async function fetchAllDndMagicItems() {
  const list = await fetchJson(`${DND_BASE}/api/magic-items?limit=500`)
  const results = list.results ?? []
  const entries = []
  let i = 0
  for (const r of results) {
    try {
      const m = await fetchJson(`${DND_BASE}${r.url}`)
      entries.push(dndMagicItemToEntry(m))
    } catch {
      /* skip */
    }
    i++
    if (i % 25 === 0) await sleep(60)
  }
  return entries
}

function open5eSpellToEntry(s) {
  const slug = s.slug ?? normName(s.name).replace(/\s+/g, '-')
  const levelLabel = s.level === 'cantrip' || s.level === 0 || s.level === '0' ? 'Cantrip' : `Level ${s.level}`
  const tags = []
  if (typeof s.classes === 'string') {
    s.classes.split(',').forEach((c) => tags.push(c.trim()))
  } else if (Array.isArray(s.classes)) {
    for (const c of s.classes) tags.push(typeof c === 'string' ? c : c.name)
  }
  if (s.ritual === 'yes' || s.ritual === true) tags.push('Ritual')
  if (s.concentration === 'yes' || s.concentration === true) tags.push('Concentration')
  if (s.document__title) tags.push(String(s.document__title))

  const comp = []
  if (s.verbal === true || s.verbal === '1') comp.push('V')
  if (s.somatic === true || s.somatic === '1') comp.push('S')
  if (s.material && String(s.material).trim()) comp.push(`M (${s.material})`)
  const content = {
    'Casting Time': s.casting_time ?? '—',
    Range: s.range ?? '—',
    Components: comp.join(', ') || '—',
    Duration: s.duration ?? '—',
    Description: (s.desc ?? s.description ?? '').toString() || '—',
  }
  if (s.higher_level) content['At Higher Levels'] = String(s.higher_level)

  return {
    id: `open5e-spell-${slug}`,
    name: s.name,
    category: 'spell',
    subtitle: `${levelLabel} ${s.school ?? ''}`.trim(),
    tags,
    content,
  }
}

async function fetchOpen5eSpells(existingNames) {
  const out = []
  let url = `${OPEN5E_BASE}/spells/?limit=100`
  while (url) {
    const page = await fetchJson(url)
    for (const s of page.results ?? []) {
      const nn = normName(s.name)
      if (existingNames.has(nn)) continue
      existingNames.add(nn)
      out.push(open5eSpellToEntry(s))
    }
    url = page.next ?? null
    await sleep(50)
  }
  return out
}

function flatten5eEntries(entries, depth = 0) {
  if (!entries || depth > 12) return ''
  if (typeof entries === 'string') return entries
  if (Array.isArray(entries)) return entries.map((e) => flatten5eEntries(e, depth + 1)).filter(Boolean).join('\n\n')
  if (typeof entries === 'object') {
    if (entries.type === 'list' && entries.items) {
      return (entries.items || []).map((x) => `• ${flatten5eEntries(x, depth + 1)}`).join('\n')
    }
    if (entries.name && entries.entries) {
      return `${entries.name}. ${flatten5eEntries(entries.entries, depth + 1)}`
    }
    if (entries.entries) return flatten5eEntries(entries.entries, depth + 1)
  }
  return ''
}

function fiveToolsSpellToEntry(raw, idx) {
  const name = raw.name ?? 'Unknown'
  const level = raw.level ?? 0
  const levelLabel = level === 0 ? 'Cantrip' : `Level ${level}`
  const schoolMap = { A: 'Abjuration', C: 'Conjuration', D: 'Divination', E: 'Enchantment', V: 'Evocation', I: 'Illusion', N: 'Necromancy', T: 'Transmutation' }
  const school = schoolMap[raw.school] ?? raw.school ?? ''
  const tags = [raw.source, school].filter(Boolean)
  if (raw.meta?.ritual) tags.push('Ritual')
  if (raw.duration?.some?.((d) => d.concentration)) tags.push('Concentration')

  const time = (raw.time ?? []).map((t) => `${t.number} ${t.unit}`).join(', ')
  const range = raw.range?.type ? `${raw.range.type}${raw.range.distance?.type ? ` (${raw.range.distance.amount ?? ''}${raw.range.distance.type})` : ''}` : '—'
  const duration = (raw.duration ?? []).map((d) => d.concentration ? `Concentration, ${d.duration?.type}` : `${d.duration?.type}`).join('; ')
  const desc = flatten5eEntries(raw.entries)

  const content = {
    'Casting Time': time || '—',
    Range: range,
    Components: '—',
    Duration: duration || '—',
    Description: desc || '—',
  }

  return {
    id: `5et-spell-${raw.source ?? 'unk'}-${idx}`,
    name,
    category: 'spell',
    subtitle: `${levelLabel} ${school}`.trim(),
    tags,
    content,
  }
}

async function fetch5eToolsSpells(existingNames) {
  if (!FIVETOOLS_BASE) {
    console.log('Skipping 5e.tools-format JSON (set FIVETOOLS_DATA_BASE to enable).')
    return []
  }
  const paths = ['data/spells/spells-phb.json', 'data/spells/spells-xge.json', 'data/spells/spells-tce.json']
  const out = []
  let idx = 0
  for (const p of paths) {
    try {
      const data = await fetchJson(`${FIVETOOLS_BASE}/${p}`)
      const spells = data.spell ?? data.spells ?? []
      for (const raw of spells) {
        const nn = normName(raw.name)
        if (existingNames.has(nn)) continue
        existingNames.add(nn)
        out.push(fiveToolsSpellToEntry(raw, idx++))
      }
      console.log(`5e.tools-format: ${p} → +${spells.length} rows (deduped)`)
    } catch (e) {
      console.warn(`5e.tools-format skip ${p}:`, e.message)
    }
    await sleep(40)
  }
  return out
}

function mergeDedupe(entries) {
  const byId = new Map()
  for (const e of entries) {
    if (!byId.has(e.id)) byId.set(e.id, e)
  }
  return [...byId.values()]
}

async function main() {
  console.log('Fetching D&D 5e API…')
  const spells = await fetchAllDndSpells()
  console.log(`  spells: ${spells.length}`)

  const monsters = await fetchAllDndMonsters()
  console.log(`  monsters: ${monsters.length}`)

  const conditions = await fetchAllDndConditions()
  console.log(`  conditions: ${conditions.length}`)

  const classes = await fetchAllDndClasses()
  console.log(`  classes: ${classes.length}`)

  const equipment = await fetchAllDndEquipment()
  console.log(`  equipment: ${equipment.length}`)

  const magic = await fetchAllDndMagicItems()
  console.log(`  magic items: ${magic.length}`)

  const spellNames = new Set(spells.map((s) => normName(s.name)))

  console.log('Fetching Open5e spells (non-duplicate names)…')
  const open5eSpells = await fetchOpen5eSpells(spellNames)
  console.log(`  open5e extra spells: ${open5eSpells.length}`)

  const fiveSpells = await fetch5eToolsSpells(spellNames)

  const combined = mergeDedupe([
    ...spells,
    ...open5eSpells,
    ...fiveSpells,
    ...monsters,
    ...conditions,
    ...classes,
    ...equipment,
    ...magic,
  ])

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(combined), 'utf8')
  const mb = (fs.statSync(OUT_FILE).size / (1024 * 1024)).toFixed(2)
  console.log(`\nWrote ${combined.length} entries (${mb} MB) → ${path.relative(ROOT, OUT_FILE)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
