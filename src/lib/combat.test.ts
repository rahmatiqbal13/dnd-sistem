import { describe, expect, it } from 'vitest'
import type { CompendiumEntry } from '@/types'
import { concentrationDc, monsterCombatants, parseMonsterStats } from '@/lib/combat'

const aboleth = {
  id: 'm', name: 'Aboleth', category: 'monster', subtitle: '', tags: [],
  content: { 'Armor Class': '17 (natural)', 'Hit Points': '135 (18d10)', 'STR / DEX / CON': '21 / 9 / 15' },
} as unknown as CompendiumEntry

describe('combat helpers', () => {
  it('parses SRD monster stats', () => {
    expect(parseMonsterStats(aboleth)).toEqual({ armorClass: 17, maxHp: 135, dexMod: -1 })
  })

  it('numbers duplicates and rolls initiative with DEX', () => {
    const list = monsterCombatants(aboleth, 2, () => 10)
    expect(list.map((c) => [c.name, c.initiative])).toEqual([['Aboleth 1', 9], ['Aboleth 2', 9]])
  })

  it('computes the Concentration DC', () => {
    expect(concentrationDc(7)).toBe(10)
    expect(concentrationDc(25)).toBe(12)
    expect(concentrationDc(100)).toBe(30)
  })
})
