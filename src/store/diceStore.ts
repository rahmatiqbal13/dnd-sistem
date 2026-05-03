import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DiceRollResult } from '@/types'

interface DiceStore {
  rollLog: DiceRollResult[]
  addRoll: (result: DiceRollResult) => void
  clearLog: () => void
}

export const useDiceStore = create<DiceStore>()(
  persist(
    (set) => ({
      rollLog: [],
      addRoll: (result) =>
        set((s) => ({ rollLog: [result, ...s.rollLog].slice(0, 100) })),
      clearLog: () => set({ rollLog: [] }),
    }),
    { name: 'dnd-dice-log' }
  )
)
