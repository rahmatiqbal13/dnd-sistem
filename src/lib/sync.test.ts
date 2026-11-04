import { describe, expect, it } from 'vitest'
import type { Character } from '@/types'
import { characterFromRow, characterToRow } from '@/lib/sync'

describe('character row mapping', () => {
  const c = {
    id: 'a', campaignId: 'camp', name: 'Pip', class: 'Rogue', race: 'Halfling', level: 3,
    maxHp: 20, currentHp: -2, tempHp: 0, armorClass: 14, conditions: ['Prone'],
  } as unknown as Character

  it('clamps columns to the schema checks and keeps the full sheet in data', () => {
    const row = characterToRow(c)
    expect(row).toMatchObject({ id: 'a', campaign_id: 'camp', level: 3, current_hp: 0, armor_class: 14 })
    expect(row.data).toBe(c)
  })

  it('round-trips through the row, with id and campaign from the columns', () => {
    const back = characterFromRow({ id: 'a', campaign_id: null, data: characterToRow(c).data })
    expect(back.conditions).toEqual(['Prone'])
    expect(back.campaignId).toBeNull()
  })
})
