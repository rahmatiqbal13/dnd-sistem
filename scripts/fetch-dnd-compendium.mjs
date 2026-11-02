/**
 * Fetches SRD 5.1 D&D data (CC-BY-4.0) from the D&D 5e API.
 *
 * Only SRD content is included. Third-party OGL books (e.g. via Open5e) and
 * non-SRD sources are deliberately excluded for licensing reasons.
 *
 * Source: https://www.dnd5eapi.co
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

  const combined = mergeDedupe([
    ...spells,
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
