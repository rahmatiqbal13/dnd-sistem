import { describe, expect, it } from 'vitest'
import type { Combatant } from '@/types'
import { healthLabel, toPublicCombat } from '@/lib/combatShare'

const base = { tempHp: 0, armorClass: 15, isNpc: true, statusEffects: [], notes: '' }

describe('shared combat redaction', () => {
  it('labels health without numbers', () => {
    expect(healthLabel(7, 7)).toBe('Sehat')
    expect(healthLabel(5, 7)).toBe('Terluka')
    expect(healthLabel(3, 7)).toBe('Kritis')
    expect(healthLabel(0, 7)).toBe('Tumbang')
  })

  it('never includes monster HP or AC; keeps player HP', () => {
    const combatants = [
      { ...base, id: 'g', name: 'Goblin', initiative: 13, maxHp: 7, currentHp: 3, isPlayer: false },
      { ...base, id: 'p', name: 'Pip', initiative: 8, maxHp: 10, currentHp: 10, tempHp: 2, isPlayer: true, isNpc: false },
    ] as Combatant[]
    const pub = toPublicCombat({ isActive: true, round: 1, currentTurnIndex: 0, combatants })
    const json = JSON.stringify(pub)
    expect(json).not.toContain('armorClass')
    expect(pub.combatants[0]).toMatchObject({ name: 'Goblin', health: 'Kritis', hp: null })
    expect(pub.combatants[1].hp).toEqual({ current: 10, max: 10, temp: 2 })
    expect(json).not.toContain('"notes"')
  })
})
