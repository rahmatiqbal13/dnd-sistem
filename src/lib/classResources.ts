import type { AbilityScores, CharacterClass } from '@/types'
import { abilityModifier } from '@/lib/utils'

/**
 * How a resource comes back:
 * - 'long': all uses on a Long Rest only
 * - 'short': all uses on a Short or Long Rest
 * - 'short-one': one use on a Short Rest, all on a Long Rest
 */
export type Recharge = 'long' | 'short' | 'short-one'

export interface ClassResource {
  id: string
  name: string
  max: number
  recharge: Recharge
}

/** Pick the value for the highest threshold level reached, e.g. step(5, [[1, 2], [3, 3]]) → 3. */
function step(level: number, table: [number, number][]): number {
  let out = 0
  for (const [lv, value] of table) if (level >= lv) out = value
  return out
}

/** Limited-use class features from the 2024 rules (SRD 5.2.1). */
export function getClassResources(cls: CharacterClass, level: number, scores: AbilityScores): ClassResource[] {
  const res: ClassResource[] = []
  const add = (id: string, name: string, max: number, recharge: Recharge) => {
    if (max > 0) res.push({ id, name, max, recharge })
  }

  switch (cls) {
    case 'Barbarian':
      add('rage', 'Rage', step(level, [[1, 2], [3, 3], [6, 4], [12, 5], [17, 6]]), 'short-one')
      break
    case 'Bard':
      add(
        'bardic-inspiration',
        'Bardic Inspiration',
        Math.max(1, abilityModifier(scores.cha)),
        level >= 5 ? 'short' : 'long'
      )
      break
    case 'Cleric':
      add('channel-divinity', 'Channel Divinity', step(level, [[2, 2], [6, 3], [18, 4]]), 'short-one')
      break
    case 'Druid':
      add('wild-shape', 'Wild Shape', step(level, [[2, 2], [6, 3], [17, 4]]), 'short-one')
      break
    case 'Fighter':
      add('second-wind', 'Second Wind', step(level, [[1, 2], [4, 3], [10, 4]]), 'short-one')
      add('action-surge', 'Action Surge', step(level, [[2, 1], [17, 2]]), 'short')
      add('indomitable', 'Indomitable', step(level, [[9, 1], [13, 2], [17, 3]]), 'long')
      break
    case 'Monk':
      add('focus', 'Focus Points', level >= 2 ? level : 0, 'short')
      break
    case 'Paladin':
      add('lay-on-hands', 'Lay on Hands (HP)', level * 5, 'long')
      add('channel-divinity', 'Channel Divinity', step(level, [[3, 2], [11, 3]]), 'short-one')
      break
    case 'Ranger':
      add('favored-enemy', "Favored Enemy (Hunter's Mark)", step(level, [[1, 2], [5, 3], [9, 4], [13, 5], [17, 6]]), 'long')
      break
    case 'Sorcerer':
      add('sorcery-points', 'Sorcery Points', level >= 2 ? level : 0, 'long')
      break
    case 'Wizard':
      add('arcane-recovery', 'Arcane Recovery', 1, 'long')
      break
  }
  return res
}

/** Used counts after a rest. Unknown ids (e.g. from an old level) are dropped on a Long Rest. */
export function recoverResources(
  resources: ClassResource[],
  used: Record<string, number>,
  rest: 'short' | 'long'
): Record<string, number> {
  if (rest === 'long') return {}
  const out: Record<string, number> = {}
  for (const r of resources) {
    const u = used[r.id] ?? 0
    const left = r.recharge === 'short' ? 0 : r.recharge === 'short-one' ? Math.max(0, u - 1) : u
    if (left > 0) out[r.id] = left
  }
  return out
}

export const RECHARGE_LABEL: Record<Recharge, string> = {
  long: 'Long Rest',
  short: 'Short/Long Rest',
  'short-one': '1 per Short Rest, semua per Long Rest',
}
