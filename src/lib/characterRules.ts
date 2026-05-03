import type { AbilityScores, Character, CharacterClass, CharacterRace, Spell, SpellSlotsState } from '@/types'
import { abilityModifier } from '@/lib/utils'
import { getClass2024 } from '@/data/dnd2024/classes'
import { getRace2024 } from '@/data/dnd2024/races'
import { getBackground2024, type Background2024 } from '@/data/dnd2024/backgrounds'
import { getDefaultSpellSlots, type CasterProgression } from '@/lib/spellcasting'

export function applyBackgroundAsi(base: AbilityScores, bg: Background2024 | undefined): AbilityScores {
  if (!bg) return { ...base }
  return {
    ...base,
    [bg.asiPlus2]: base[bg.asiPlus2] + 2,
    [bg.asiPlus1]: base[bg.asiPlus1] + 1,
  }
}

/** Level 1: max hit die + CON; level 2+: average die (rounded up) + CON per level. */
export function computeMaxHp(hitDie: number, level: number, conMod: number): number {
  const first = hitDie + conMod
  const avg = Math.ceil((hitDie + 1) / 2)
  const rest = Math.max(0, level - 1) * (avg + conMod)
  return Math.max(1, first + rest)
}

export type ArmorPreset =
  | 'none'
  | 'leather'
  | 'studded'
  | 'hide'
  | 'chain-shirt'
  | 'scale'
  | 'breastplate'
  | 'half-plate'
  | 'chain-mail'
  | 'splint'
  | 'plate'

export function computeArmorClass(preset: ArmorPreset, dexMod: number, shield: boolean): number {
  const dex = (max: number) => Math.min(max, dexMod)
  let ac = 10 + dexMod
  switch (preset) {
    case 'none':
      ac = 10 + dexMod
      break
    case 'leather':
    case 'hide':
      ac = 11 + dexMod
      break
    case 'studded':
    case 'scale':
      ac = 12 + dexMod
      break
    case 'breastplate':
    case 'chain-shirt':
      ac = 13 + dex(2)
      break
    case 'half-plate':
      ac = 15 + dex(2)
      break
    case 'chain-mail':
      ac = 16
      break
    case 'splint':
      ac = 17
      break
    case 'plate':
      ac = 18
      break
    default:
      ac = 10 + dexMod
  }
  if (shield) ac += 2
  return ac
}

export function defaultSpeed(race: CharacterRace): number {
  return getRace2024(race)?.speed ?? 30
}

export function buildTraitsBlock(race: CharacterRace, cls: CharacterClass, bg: Background2024 | undefined): string {
  const r = getRace2024(race)
  const c = getClass2024(cls)
  const parts: string[] = []
  if (r?.traits) parts.push(`**Ras (${race})**\n${r.traits}`)
  if (c?.summary) parts.push(`**Kelas (${cls})**\n${c.summary}`)
  if (bg) {
    parts.push(`**Background (${bg.name})**\n${bg.traitSummary}`)
    parts.push(`**Origin Feat:** ${bg.originFeat}`)
  }
  return parts.join('\n\n')
}

export function spellSlotsForCharacter(cls: CharacterClass, level: number) {
  const c = getClass2024(cls)
  const prog: CasterProgression = c?.casterType ?? 'none'
  return getDefaultSpellSlots(prog, level)
}

/** Gabungkan slot baru setelah level up dengan `used` yang sudah tersimpan. */
export function resolveSpellSlots(character: Character): SpellSlotsState {
  const fresh = spellSlotsForCharacter(character.class, character.level)
  const old = character.spellSlots ?? {}
  const merged: SpellSlotsState = {}
  for (let tier = 1; tier <= 9; tier++) {
    const f = fresh[tier]
    if (!f || f.max <= 0) continue
    const o = old[tier]
    merged[tier] = {
      max: f.max,
      used: o ? Math.min(Math.max(0, o.used), f.max) : 0,
    }
  }
  return merged
}

export function innateSpellsFromRace(race: CharacterRace): Spell[] {
  const r = getRace2024(race)
  return (r?.innateSpells ?? []).map((is, i) => ({
    id: `innate-${race}-${i}`,
    name: is.name,
    level: is.level,
    school: 'Innate',
    castingTime: '—',
    range: '—',
    components: '—',
    duration: '—',
    description: is.note ?? 'Innate spellcasting (ras).',
    prepared: true,
    innate: true,
  }))
}
