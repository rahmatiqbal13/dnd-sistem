import type { Combatant, CompendiumEntry } from '@/types'
import { abilityModifier } from '@/lib/utils'

/** Pull AC, HP and DEX out of an SRD monster entry ("17 (natural)", "135 (18d10)", "21 / 9 / 15"). */
export function parseMonsterStats(entry: CompendiumEntry): { armorClass: number; maxHp: number; dexMod: number } {
  const num = (s: string | undefined, fallback: number) => {
    const m = s?.match(/-?\d+/)
    return m ? parseInt(m[0]) : fallback
  }
  const dex = (entry.content['STR / DEX / CON'] ?? '').split('/')[1]
  return {
    armorClass: num(entry.content['Armor Class'], 10),
    maxHp: Math.max(1, num(entry.content['Hit Points'], 1)),
    dexMod: abilityModifier(num(dex, 10)),
  }
}

/** Build one or more monster combatants; duplicates get numbered names ("Goblin 1", "Goblin 2"). */
export function monsterCombatants(
  entry: CompendiumEntry,
  count: number,
  rollD20: () => number
): Omit<Combatant, 'id'>[] {
  const { armorClass, maxHp, dexMod } = parseMonsterStats(entry)
  return Array.from({ length: count }, (_, i) => ({
    name: count > 1 ? `${entry.name} ${i + 1}` : entry.name,
    initiative: rollD20() + dexMod,
    maxHp,
    currentHp: maxHp,
    tempHp: 0,
    armorClass,
    isPlayer: false,
    isNpc: true,
    statusEffects: [],
    notes: '',
  }))
}

/** 2024 rules: Concentration save DC is 10 or half the damage, whichever is higher, max 30. */
export function concentrationDc(damage: number): number {
  return Math.min(30, Math.max(10, Math.floor(damage / 2)))
}
