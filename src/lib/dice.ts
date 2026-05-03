import type { DiceType, DiceRollResult, RollMode } from '@/types'

export function rollDie(sides: DiceType): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollDice(
  count: number,
  sides: DiceType,
  modifier: number,
  mode: RollMode,
  rolledBy: string
): DiceRollResult {
  const advantage = mode === 'advantage'
  const disadvantage = mode === 'disadvantage'

  let rolls: number[]
  let d20Pair: [number, number] | null = null
  let chosenD20: number | null = null
  let discardedD20: number | null = null

  if (mode !== 'normal' && count === 1 && sides === 20) {
    const a = rollDie(20)
    const b = rollDie(20)
    d20Pair = [a, b]
    chosenD20 = advantage ? Math.max(a, b) : Math.min(a, b)
    discardedD20 = advantage ? Math.min(a, b) : Math.max(a, b)
    rolls = [chosenD20]
  } else {
    rolls = Array.from({ length: count }, () => rollDie(sides))
  }

  const sum = rolls.reduce((x, y) => x + y, 0)
  const total = Math.max(1, sum + modifier)

  let detailLabel: string
  if (d20Pair && chosenD20 !== null) {
    detailLabel = `[${d20Pair[0]}, ${d20Pair[1]}] → Result: ${chosenD20}`
    if (modifier !== 0) detailLabel += `; Total: ${total}`
  } else if (rolls.length > 1) {
    detailLabel = `[${rolls.join(', ')}]${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''} → ${total}`
  } else {
    detailLabel = `${count}d${sides}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''} → ${total}`
  }

  return {
    id: crypto.randomUUID(),
    dice: sides,
    count,
    modifier,
    rolls,
    total,
    advantage,
    disadvantage,
    mode,
    d20Pair,
    chosenD20,
    discardedD20,
    detailLabel,
    timestamp: Date.now(),
    rolledBy,
  }
}

/** Melengkapi entri log lama yang belum punya mode / pasangan d20. */
export function enrichDiceRoll(r: DiceRollResult): DiceRollResult {
  const mode: RollMode =
    r.mode ?? (r.advantage ? 'advantage' : r.disadvantage ? 'disadvantage' : 'normal')

  let detailLabel = r.detailLabel ?? ''
  if (!detailLabel) {
    if (mode !== 'normal' && r.dice === 20 && r.count === 1 && r.d20Pair) {
      const [a, b] = r.d20Pair
      const chosen = r.chosenD20 ?? (r.advantage ? Math.max(a, b) : Math.min(a, b))
      detailLabel = `[${a}, ${b}] → Result: ${chosen}`
      if (r.modifier !== 0) detailLabel += `; Total: ${r.total}`
    } else {
      detailLabel =
        r.rolls.length > 1
          ? `[${r.rolls.join(', ')}]${r.modifier !== 0 ? ` ${r.modifier > 0 ? '+' : ''}${r.modifier}` : ''} → ${r.total}`
          : `${r.count}d${r.dice}${r.modifier !== 0 ? ` ${r.modifier > 0 ? '+' : ''}${r.modifier}` : ''} → ${r.total}`
    }
  }

  return {
    ...r,
    mode,
    d20Pair: r.d20Pair ?? null,
    chosenD20: r.chosenD20 ?? null,
    discardedD20: r.discardedD20 ?? null,
    detailLabel,
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
  const mod =
    result.modifier !== 0 ? ` ${result.modifier > 0 ? '+' : ''}${result.modifier}` : ''
  const adv = result.advantage ? ' (Adv)' : result.disadvantage ? ' (Dis)' : ''
  return `${base}${mod}${adv}`
}
