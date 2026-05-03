/** Spell slot maxima by character level (index 0 = level 1). Tiers 1–9. */

import type { SpellSlotsState } from '@/types'

export type CasterProgression = 'full' | 'half' | 'third' | 'pact' | 'none'

const FULL: number[][] = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // 1
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // 2
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // 3
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // 4
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // 5
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // 6
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // 7
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // 8
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // 9
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // 10
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // 11
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // 12
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // 13
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // 14
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // 15
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // 16
  [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17
  [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18
  [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19
  [4, 3, 3, 3, 3, 2, 2, 1, 1], // 20
]

/** Half caster (Paladin, Ranger): spellcasting mulai level 2; setara wizard ceil(L/2). */
function halfCasterRow(level: number): number[] {
  if (level < 2) return [0, 0, 0, 0, 0, 0, 0, 0, 0]
  const w = Math.ceil(level / 2)
  return [...FULL[Math.min(20, w) - 1]]
}

/** Third caster: mulai ~3; setara wizard ceil((L−2)/3). */
function thirdCasterRow(level: number): number[] {
  if (level < 3) return [0, 0, 0, 0, 0, 0, 0, 0, 0]
  const w = Math.max(1, Math.ceil((level - 2) / 3))
  return [...FULL[Math.min(20, w) - 1]]
}

const HALF: number[][] = Array.from({ length: 20 }, (_, i) => halfCasterRow(i + 1))
const THIRD: number[][] = Array.from({ length: 20 }, (_, i) => thirdCasterRow(i + 1))

/** Warlock pact slots — disederhanakan: jumlah slot & level spell maks. */
const PACT_SLOTS: { count: number; level: number }[] = [
  { count: 1, level: 1 },
  { count: 2, level: 1 },
  { count: 2, level: 2 },
  { count: 2, level: 2 },
  { count: 2, level: 3 },
  { count: 2, level: 3 },
  { count: 2, level: 4 },
  { count: 2, level: 4 },
  { count: 2, level: 5 },
  { count: 2, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 3, level: 5 },
  { count: 4, level: 5 },
  { count: 4, level: 5 },
  { count: 4, level: 5 },
  { count: 4, level: 5 },
  { count: 4, level: 5 },
]

export function getSpellSlotsMaxRow(progression: CasterProgression, level: number): number[] {
  const lv = Math.min(20, Math.max(1, level))
  if (progression === 'none') return [0, 0, 0, 0, 0, 0, 0, 0, 0]
  if (progression === 'pact') {
    const p = PACT_SLOTS[lv - 1]
    const row = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    if (p && p.level >= 1 && p.level <= 9) row[p.level - 1] = p.count
    return row
  }
  const table = progression === 'full' ? FULL : progression === 'half' ? HALF : THIRD
  return [...(table[lv - 1] ?? FULL[0])]
}

export function rowToSpellSlotsState(row: number[]): SpellSlotsState {
  const s: SpellSlotsState = {}
  row.forEach((max, i) => {
    const tier = i + 1
    if (max > 0) s[tier] = { max, used: 0 }
  })
  return s
}

export function getDefaultSpellSlots(progression: CasterProgression, level: number): SpellSlotsState {
  return rowToSpellSlotsState(getSpellSlotsMaxRow(progression, level))
}
