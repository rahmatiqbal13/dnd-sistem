import type { DiceType, DiceRollResult } from '@/types'

export function rollDie(sides: DiceType): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollDice(
  count: number,
  sides: DiceType,
  modifier: number,
  advantage: boolean,
  disadvantage: boolean,
  rolledBy: string
): DiceRollResult {
  let rolls: number[]

  if ((advantage || disadvantage) && count === 1 && sides === 20) {
    const a = rollDie(20)
    const b = rollDie(20)
    const chosen = advantage ? Math.max(a, b) : Math.min(a, b)
    rolls = [chosen]
  } else {
    rolls = Array.from({ length: count }, () => rollDie(sides))
  }

  const sum = rolls.reduce((a, b) => a + b, 0)
  const total = Math.max(1, sum + modifier)

  return {
    id: crypto.randomUUID(),
    dice: sides,
    count,
    modifier,
    rolls,
    total,
    advantage,
    disadvantage,
    timestamp: Date.now(),
    rolledBy,
  }
}

export function rollAbilityScore(): number {
  const rolls = Array.from({ length: 4 }, () => rollDie(6))
  rolls.sort((a, b) => b - a)
  return rolls.slice(0, 3).reduce((a, b) => a + b, 0)
}

export const DICE_TYPES: DiceType[] = [4, 6, 8, 10, 12, 20, 100]

export function diceLabel(d: DiceType): string {
  return `D${d}`
}

export function resultLabel(result: DiceRollResult): string {
  const base = `${result.count}d${result.dice}`
  const mod = result.modifier !== 0
    ? ` ${result.modifier > 0 ? '+' : ''}${result.modifier}`
    : ''
  const adv = result.advantage ? ' (Advantage)' : result.disadvantage ? ' (Disadvantage)' : ''
  return `${base}${mod}${adv}`
}
