import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, AbilityScores, Spell, EquipmentItem, CharacterFeat, SelectedSubclass, DeathSaves } from '@/types'
import { getClass2024 } from '@/data/dnd2024/classes'
import { proficiencyBonus } from '@/lib/utils'

const defaultAbilities: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }

const defaultSavingThrows = { str: false, dex: false, con: false, int: false, wis: false, cha: false }

interface LevelUpOptions {
  hpIncrease: number
  feat?: CharacterFeat
  subclass?: SelectedSubclass
  asi?: Partial<AbilityScores>
}

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
  // Sprint 1 - Level Up & Rest System
  levelUp: (id: string, options: LevelUpOptions) => void
  addFeat: (id: string, feat: CharacterFeat) => void
  selectSubclass: (id: string, subclass: SelectedSubclass) => void
  spendHitDie: (id: string) => number | null
  shortRest: (id: string, hitDiceToSpend: number) => { healed: number; rolls: number[] }
  longRest: (id: string) => void
  updateDeathSaves: (id: string, result: 'success' | 'failure' | 'reset') => void
  updateExhaustion: (id: string, level: number) => void
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

      // Sprint 1 - Level Up System
      levelUp: (id, options) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== id) return c
            const newLevel = c.level + 1
            const cls = getClass2024(c.class)
            const hitDie = cls?.hitDie ?? 8
            
            // Calculate new max HP
            const newMaxHp = c.maxHp + options.hpIncrease
            
            // Update hit dice
            const newHitDice = {
              type: c.hitDice?.type ?? hitDie,
              total: newLevel,
              available: (c.hitDice?.available ?? 0) + 1,
            }
            
            // Apply ASI if provided
            let newAbilityScores = c.abilityScores
            if (options.asi) {
              newAbilityScores = { ...c.abilityScores }
              for (const [ability, bonus] of Object.entries(options.asi)) {
                if (bonus && ability in newAbilityScores) {
                  newAbilityScores[ability as keyof AbilityScores] = Math.min(20, newAbilityScores[ability as keyof AbilityScores] + bonus)
                }
              }
            }
            
            return {
              ...c,
              level: newLevel,
              maxHp: newMaxHp,
              currentHp: c.currentHp + options.hpIncrease, // Also increase current HP
              hitDice: newHitDice,
              abilityScores: newAbilityScores,
              proficiencyBonus: proficiencyBonus(newLevel),
              feats: options.feat ? [...(c.feats ?? []), options.feat] : c.feats,
              selectedSubclass: options.subclass ?? c.selectedSubclass,
            }
          }),
        })),

      addFeat: (id, feat) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, feats: [...(c.feats ?? []), feat] } : c
          ),
        })),

      selectSubclass: (id, subclass) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, selectedSubclass: subclass, subclass: subclass.name } : c
          ),
        })),

      // Sprint 1 - Rest System
      spendHitDie: (id) => {
        const character = get().characters.find((c) => c.id === id)
        if (!character || !character.hitDice || character.hitDice.available <= 0) return null
        
        const roll = Math.floor(Math.random() * character.hitDice.type) + 1
        const conMod = Math.floor((character.abilityScores.con - 10) / 2)
        const healing = Math.max(1, roll + conMod)
        
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  hitDice: { ...c.hitDice!, available: c.hitDice!.available - 1 },
                  currentHp: Math.min(c.maxHp, c.currentHp + healing),
                }
              : c
          ),
        }))
        
        return healing
      },

      shortRest: (id, hitDiceToSpend) => {
        const character = get().characters.find((c) => c.id === id)
        if (!character || !character.hitDice) return { healed: 0, rolls: [] }
        
        const rolls: number[] = []
        let totalHealed = 0
        const conMod = Math.floor((character.abilityScores.con - 10) / 2)
        
        const diceToRoll = Math.min(hitDiceToSpend, character.hitDice.available)
        
        for (let i = 0; i < diceToRoll; i++) {
          const roll = Math.floor(Math.random() * character.hitDice.type) + 1
          rolls.push(roll)
          totalHealed += Math.max(1, roll + conMod)
        }
        
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id
              ? {
                  ...c,
                  hitDice: { ...c.hitDice!, available: c.hitDice!.available - diceToRoll },
                  currentHp: Math.min(c.maxHp, c.currentHp + totalHealed),
                }
              : c
          ),
        }))
        
        return { healed: totalHealed, rolls }
      },

      longRest: (id) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== id) return c
            
            // Regain all hit points
            const newHp = c.maxHp
            
            // Regain half of total hit dice (minimum 1)
            const hitDiceToRegain = Math.max(1, Math.floor(c.hitDice.total / 2))
            const newAvailableHitDice = Math.min(c.hitDice.total, c.hitDice.available + hitDiceToRegain)
            
            // Reduce exhaustion by 1 if > 0
            const newExhaustion = Math.max(0, (c.exhaustionLevel ?? 0) - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6
            
            // Reset death saves
            const newDeathSaves: DeathSaves = { successes: 0, failures: 0 }
            
            return {
              ...c,
              currentHp: newHp,
              tempHp: 0,
              hitDice: { ...c.hitDice, available: newAvailableHitDice },
              exhaustionLevel: newExhaustion,
              deathSaves: newDeathSaves,
            }
          }),
        })),

      updateDeathSaves: (id, result) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== id) return c
            
            const current = c.deathSaves ?? { successes: 0, failures: 0 }
            let newDeathSaves = { ...current }
            
            if (result === 'success') {
              newDeathSaves.successes = Math.min(3, current.successes + 1)
            } else if (result === 'failure') {
              newDeathSaves.failures = Math.min(3, current.failures + 1)
            } else if (result === 'reset') {
              newDeathSaves = { successes: 0, failures: 0 }
            }
            
            return { ...c, deathSaves: newDeathSaves }
          }),
        })),

      updateExhaustion: (id, level) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, exhaustionLevel: Math.max(0, Math.min(6, level)) as 0 | 1 | 2 | 3 | 4 | 5 | 6 } : c
          ),
        })),
    }),
    { name: 'dnd-characters' }
  )
)

export { defaultAbilities, defaultSavingThrows }
