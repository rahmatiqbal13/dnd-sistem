import { describe, expect, it } from 'vitest'
import type { AbilityScores } from '@/types'
import { getClassResources, recoverResources } from '@/lib/classResources'
import { canRaisePointBuy, levelForXp, POINT_BUY_START, pointBuySpent } from '@/lib/abilityGeneration'

const scores: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 16 }
const max = (cls: Parameters<typeof getClassResources>[0], level: number, id: string) =>
  getClassResources(cls, level, scores).find((r) => r.id === id)?.max ?? 0

describe('class resources (2024)', () => {
  it('scales Rage, Second Wind, Channel Divinity and Wild Shape by level', () => {
    expect([1, 3, 6, 12, 17].map((l) => max('Barbarian', l, 'rage'))).toEqual([2, 3, 4, 5, 6])
    expect([1, 4, 10].map((l) => max('Fighter', l, 'second-wind'))).toEqual([2, 3, 4])
    expect([1, 2, 6, 18].map((l) => max('Cleric', l, 'channel-divinity'))).toEqual([0, 2, 3, 4])
    expect([2, 6, 17].map((l) => max('Druid', l, 'wild-shape'))).toEqual([2, 3, 4])
  })

  it('uses level for Focus and Sorcery Points, 5 × level for Lay on Hands, CHA for Bardic Inspiration', () => {
    expect(max('Monk', 1, 'focus')).toBe(0)
    expect(max('Monk', 7, 'focus')).toBe(7)
    expect(max('Sorcerer', 5, 'sorcery-points')).toBe(5)
    expect(max('Paladin', 4, 'lay-on-hands')).toBe(20)
    expect(max('Bard', 1, 'bardic-inspiration')).toBe(3)
  })

  it('Bardic Inspiration recharges on a Short Rest from level 5 (Font of Inspiration)', () => {
    const at = (l: number) => getClassResources('Bard', l, scores)[0].recharge
    expect(at(4)).toBe('long')
    expect(at(5)).toBe('short')
  })

  it('Short Rest: all of "short", one of "short-one", none of "long"', () => {
    const res = getClassResources('Fighter', 10, scores)
    const used = { 'second-wind': 3, 'action-surge': 1, indomitable: 1 }
    expect(recoverResources(res, used, 'short')).toEqual({ 'second-wind': 2, indomitable: 1 })
    expect(recoverResources(res, used, 'long')).toEqual({})
  })
})

describe('ability generation and XP', () => {
  it('Point Buy costs 27 points for 15, 15, 15, 8, 8, 8', () => {
    expect(pointBuySpent({ str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 })).toBe(27)
    expect(canRaisePointBuy({ str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }, 'int')).toBe(false)
    expect(canRaisePointBuy(POINT_BUY_START, 'str')).toBe(true)
    expect(canRaisePointBuy({ ...POINT_BUY_START, str: 15 }, 'str')).toBe(false)
  })

  it('maps XP to level', () => {
    expect(levelForXp(0)).toBe(1)
    expect(levelForXp(299)).toBe(1)
    expect(levelForXp(300)).toBe(2)
    expect(levelForXp(355000)).toBe(20)
  })
})
