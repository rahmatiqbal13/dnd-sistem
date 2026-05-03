import { create } from 'zustand'
import type { Combatant, StatusEffect } from '@/types'

interface CombatStore {
  combatants: Combatant[]
  currentTurnIndex: number
  round: number
  isActive: boolean
  addCombatant: (c: Omit<Combatant, 'id'>) => void
  removeCombatant: (id: string) => void
  updateHp: (id: string, hp: number) => void
  applyDamage: (id: string, damage: number) => void
  healHp: (id: string, amount: number) => void
  addStatusEffect: (id: string, effect: StatusEffect) => void
  removeStatusEffect: (id: string, effect: StatusEffect) => void
  updateInitiative: (id: string, initiative: number) => void
  nextTurn: () => void
  prevTurn: () => void
  startCombat: () => void
  endCombat: () => void
  reset: () => void
  sortByInitiative: () => void
  updateNotes: (id: string, notes: string) => void
}

export const useCombatStore = create<CombatStore>()((set, get) => ({
  combatants: [],
  currentTurnIndex: 0,
  round: 1,
  isActive: false,

  addCombatant: (data) => {
    const c: Combatant = { ...data, id: crypto.randomUUID() }
    set((s) => ({
      combatants: [...s.combatants, c].sort((a, b) => b.initiative - a.initiative),
    }))
  },

  removeCombatant: (id) =>
    set((s) => {
      const filtered = s.combatants.filter((c) => c.id !== id)
      const newIndex = Math.min(s.currentTurnIndex, Math.max(0, filtered.length - 1))
      return { combatants: filtered, currentTurnIndex: newIndex }
    }),

  updateHp: (id, hp) =>
    set((s) => ({
      combatants: s.combatants.map((c) =>
        c.id === id ? { ...c, currentHp: Math.min(c.maxHp, Math.max(0, hp)) } : c
      ),
    })),

  applyDamage: (id, damage) =>
    set((s) => ({
      combatants: s.combatants.map((c) => {
        if (c.id !== id) return c
        let remaining = damage
        let tempHp = c.tempHp
        if (tempHp > 0) {
          const absorbed = Math.min(tempHp, remaining)
          tempHp -= absorbed
          remaining -= absorbed
        }
        const currentHp = Math.max(0, c.currentHp - remaining)
        return { ...c, currentHp, tempHp }
      }),
    })),

  healHp: (id, amount) =>
    set((s) => ({
      combatants: s.combatants.map((c) =>
        c.id === id ? { ...c, currentHp: Math.min(c.maxHp, c.currentHp + amount) } : c
      ),
    })),

  addStatusEffect: (id, effect) =>
    set((s) => ({
      combatants: s.combatants.map((c) =>
        c.id === id && !c.statusEffects.includes(effect)
          ? { ...c, statusEffects: [...c.statusEffects, effect] }
          : c
      ),
    })),

  removeStatusEffect: (id, effect) =>
    set((s) => ({
      combatants: s.combatants.map((c) =>
        c.id === id ? { ...c, statusEffects: c.statusEffects.filter((e) => e !== effect) } : c
      ),
    })),

  updateInitiative: (id, initiative) =>
    set((s) => ({
      combatants: s.combatants
        .map((c) => (c.id === id ? { ...c, initiative } : c))
        .sort((a, b) => b.initiative - a.initiative),
    })),

  nextTurn: () =>
    set((s) => {
      if (s.combatants.length === 0) return s
      const next = (s.currentTurnIndex + 1) % s.combatants.length
      const newRound = next === 0 ? s.round + 1 : s.round
      return { currentTurnIndex: next, round: newRound }
    }),

  prevTurn: () =>
    set((s) => {
      if (s.combatants.length === 0) return s
      const prev =
        s.currentTurnIndex === 0 ? s.combatants.length - 1 : s.currentTurnIndex - 1
      const newRound = s.currentTurnIndex === 0 && s.round > 1 ? s.round - 1 : s.round
      return { currentTurnIndex: prev, round: newRound }
    }),

  startCombat: () => set({ isActive: true, round: 1, currentTurnIndex: 0 }),

  endCombat: () => set({ isActive: false }),

  reset: () => set({ combatants: [], currentTurnIndex: 0, round: 1, isActive: false }),

  sortByInitiative: () =>
    set((s) => ({
      combatants: [...s.combatants].sort((a, b) => b.initiative - a.initiative),
    })),

  updateNotes: (id, notes) =>
    set((s) => ({
      combatants: s.combatants.map((c) => (c.id === id ? { ...c, notes } : c)),
    })),
}))
