import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, AbilityScores, Spell, EquipmentItem } from '@/types'

const defaultAbilities: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }

const defaultSavingThrows = { str: false, dex: false, con: false, int: false, wis: false, cha: false }

interface CharacterStore {
  characters: Character[]
  addCharacter: (c: Omit<Character, 'id' | 'createdAt'>) => Character
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
  updateHp: (id: string, delta: number) => void
  setHp: (id: string, hp: number) => void
  addSpell: (id: string, spell: Spell) => void
  removeSpell: (id: string, spellId: string) => void
  addEquipment: (id: string, item: EquipmentItem) => void
  removeEquipment: (id: string, itemId: string) => void
  getById: (id: string) => Character | undefined
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],

      addCharacter: (data) => {
        const c: Character = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        }
        set((s) => ({ characters: [...s.characters, c] }))
        return c
      },

      updateCharacter: (id, updates) =>
        set((s) => ({
          characters: s.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCharacter: (id) =>
        set((s) => ({ characters: s.characters.filter((c) => c.id !== id) })),

      updateHp: (id, delta) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== id) return c
            const newHp = Math.min(c.maxHp, Math.max(0, c.currentHp + delta))
            return { ...c, currentHp: newHp }
          }),
        })),

      setHp: (id, hp) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, currentHp: Math.min(c.maxHp, Math.max(0, hp)) } : c
          ),
        })),

      addSpell: (id, spell) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, spells: [...c.spells, spell] } : c
          ),
        })),

      removeSpell: (id, spellId) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, spells: c.spells.filter((sp) => sp.id !== spellId) } : c
          ),
        })),

      addEquipment: (id, item) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, equipment: [...c.equipment, item] } : c
          ),
        })),

      removeEquipment: (id, itemId) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, equipment: c.equipment.filter((e) => e.id !== itemId) } : c
          ),
        })),

      getById: (id) => get().characters.find((c) => c.id === id),
    }),
    { name: 'dnd-characters' }
  )
)

export { defaultAbilities, defaultSavingThrows }
