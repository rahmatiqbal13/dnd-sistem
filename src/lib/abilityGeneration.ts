import type { Ability, AbilityScores } from '@/types'

/** 2024 rules: Standard Array. */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const

/** 2024 rules: Point Buy, 27 points, scores 8–15. */
export const POINT_BUY_BUDGET = 27
export const POINT_BUY_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }

export function pointBuySpent(scores: AbilityScores): number {
  return (Object.values(scores) as number[]).reduce((sum, v) => sum + (POINT_BUY_COST[v] ?? Infinity), 0)
}

/** True if raising `ability` by 1 stays within 8–15 and the 27-point budget. */
export function canRaisePointBuy(scores: AbilityScores, ability: Ability): boolean {
  const next = scores[ability] + 1
  if (next > 15) return false
  return pointBuySpent({ ...scores, [ability]: next }) <= POINT_BUY_BUDGET
}

export const POINT_BUY_START: AbilityScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }

/** Minimum XP for each level (index 0 = level 1). */
export const XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
]

export function levelForXp(xp: number): number {
  let level = 1
  for (let i = 0; i < XP_THRESHOLDS.length; i++) if (xp >= XP_THRESHOLDS[i]) level = i + 1
  return level
}
