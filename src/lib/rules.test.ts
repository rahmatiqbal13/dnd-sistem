import { describe, expect, it } from 'vitest'
import type { Character } from '@/types'
import { computeArmorClass, computeMaxHp, restoreSpellSlots } from '@/lib/characterRules'
import { getASILevels, isASILevel } from '@/lib/levelUp'
import { useCharacterStore } from '@/store/characterStore'

describe('computeArmorClass (2024)', () => {
  it.each([
    ['none', 3, 13],
    ['leather', 3, 14],
    ['studded', 3, 15],
    ['hide', 3, 14],
    ['chain-shirt', 3, 15],
    ['scale', 3, 16],
    ['breastplate', 3, 16],
    ['half-plate', 3, 17],
    ['chain-mail', 3, 16],
    ['splint', 3, 17],
    ['plate', 3, 18],
  ] as const)('%s with DEX +%i = AC %i', (preset, dex, expected) => {
    expect(computeArmorClass(preset, dex, false)).toBe(expected)
  })

  it('applies a negative DEX modifier to medium armor', () => {
    expect(computeArmorClass('hide', -1, false)).toBe(11)
  })

  it('adds +2 for a shield', () => {
    expect(computeArmorClass('plate', 0, true)).toBe(20)
  })
})

describe('computeMaxHp', () => {
  it('uses max die at level 1 and the rounded-up average after', () => {
    expect(computeMaxHp(10, 1, 2)).toBe(12)
    expect(computeMaxHp(10, 5, 2)).toBe(12 + 4 * 8)
    expect(computeMaxHp(6, 3, 0)).toBe(6 + 2 * 4)
  })
})

describe('ASI levels', () => {
  it('gives most classes 4, 8, 12, 16 and the level 19 Epic Boon', () => {
    expect(getASILevels('Wizard')).toEqual([4, 8, 12, 16, 19])
  })

  it('gives Fighter extra ASIs at 6 and 14', () => {
    expect(getASILevels('Fighter')).toEqual([4, 6, 8, 12, 14, 16, 19])
    expect(isASILevel('Wizard', 6)).toBe(false)
  })

  it('gives Rogue an extra ASI at 10', () => {
    expect(getASILevels('Rogue')).toEqual([4, 8, 10, 12, 16, 19])
  })
})

describe('rests', () => {
  const base = {
    id: 'c1',
    maxHp: 30,
    currentHp: 5,
    tempHp: 3,
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    hitDice: { type: 8, total: 6, available: 1 },
    exhaustionLevel: 2,
    spellSlots: { 1: { max: 4, used: 4 }, 2: { max: 2, used: 1 } },
  }

  const load = (overrides: Partial<Character>) => {
    useCharacterStore.setState({ characters: [{ ...base, ...overrides } as unknown as Character] })
  }
  const get = () => useCharacterStore.getState().characters[0]

  it('restoreSpellSlots zeroes every used count', () => {
    expect(restoreSpellSlots({ 1: { max: 4, used: 3 }, 3: { max: 2, used: 2 } })).toEqual({
      1: { max: 4, used: 0 },
      3: { max: 2, used: 0 },
    })
  })

  it('Long Rest restores HP, all Hit Dice and all spell slots, and reduces exhaustion by 1', () => {
    load({ class: 'Wizard' })
    useCharacterStore.getState().longRest('c1')
    const c = get()
    expect(c.currentHp).toBe(30)
    expect(c.tempHp).toBe(0)
    expect(c.hitDice.available).toBe(6)
    expect(c.spellSlots).toEqual({ 1: { max: 4, used: 0 }, 2: { max: 2, used: 0 } })
    expect(c.exhaustionLevel).toBe(1)
  })

  it('Short Rest restores Warlock pact slots only', () => {
    load({ class: 'Warlock' })
    useCharacterStore.getState().shortRest('c1', 0)
    expect(get().spellSlots?.[1]?.used).toBe(0)

    load({ class: 'Wizard' })
    useCharacterStore.getState().shortRest('c1', 0)
    expect(get().spellSlots?.[1]?.used).toBe(4)
  })
})
