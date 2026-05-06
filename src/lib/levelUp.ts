import type { Character, CharacterClass, Ability, CharacterFeat, SelectedSubclass } from '@/types'
import { getClass2024 } from '@/data/dnd2024/classes'
import { getSubclassesByClass, getSubclassLevel } from '@/data/dnd2024/subclasses'
import { ALL_FEATS, type Feat2024 } from '@/data/dnd2024/feats'
import { abilityModifier } from '@/lib/utils'

// ASI (Ability Score Improvement) levels in D&D 5e 2024
export const ASI_LEVELS = [4, 8, 12, 16, 19]

// Maximum character level
export const MAX_LEVEL = 20

// Interface for level up requirements
export interface LevelUpRequirements {
  canLevelUp: boolean
  currentLevel: number
  nextLevel: number
  isMaxLevel: boolean
  requiresSubclassSelection: boolean
  requiresASIOrFeat: boolean
  subclassLevel: number
}

// Interface for level up result
export interface LevelUpResult {
  newLevel: number
  hpIncrease: number
  newFeatures: string[]
  newSpellSlots?: Record<number, { max: number; used: number }>
}

/**
 * Check if character can level up
 */
export function canLevelUp(character: Character): boolean {
  return character.level < MAX_LEVEL
}

/**
 * Get level up requirements for a character
 */
export function getLevelUpRequirements(character: Character): LevelUpRequirements {
  const currentLevel = character.level
  const nextLevel = currentLevel + 1
  const isMaxLevel = currentLevel >= MAX_LEVEL
  const subclassLevel = getSubclassLevel(character.class)
  
  return {
    canLevelUp: !isMaxLevel,
    currentLevel,
    nextLevel,
    isMaxLevel,
    requiresSubclassSelection: nextLevel === subclassLevel && !character.selectedSubclass,
    requiresASIOrFeat: ASI_LEVELS.includes(nextLevel),
    subclassLevel,
  }
}

/**
 * Check if a level is an ASI (Ability Score Improvement) level
 */
export function isASILevel(level: number): boolean {
  return ASI_LEVELS.includes(level)
}

/**
 * Calculate average HP increase on level up
 */
export function calculateAverageHpIncrease(hitDie: number, conMod: number): number {
  // Average of hit die (rounded up) + CON mod
  const avgRoll = Math.ceil((hitDie + 1) / 2)
  return Math.max(1, avgRoll + conMod)
}

/**
 * Roll HP increase on level up
 */
export function rollHpIncrease(hitDie: number, conMod: number): number {
  const roll = Math.floor(Math.random() * hitDie) + 1
  return Math.max(1, roll + conMod)
}

/**
 * Get available subclasses for a character's class
 */
export function getAvailableSubclasses(characterClass: CharacterClass) {
  return getSubclassesByClass(characterClass)
}

/**
 * Get available feats for selection
 */
export function getAvailableFeats(
  character: Character,
  includeOrigin: boolean = false
): Feat2024[] {
  if (includeOrigin) {
    // Filter origin feats (level 1)
    return ALL_FEATS.filter(feat => feat.category === 'origin')
  }
  
  // Filter general feats and check prerequisites
  return ALL_FEATS.filter(feat => {
    if (feat.category !== 'general') return false
    
    // Check prerequisites
    if (feat.prerequisite) {
      // Simple prerequisite checking - can be expanded
      const prereq = feat.prerequisite.toLowerCase()
      
      // Check ability score requirements
      const abilityMatch = prereq.match(/(str|dex|con|int|wis|cha)\s*(\d+)/i)
      if (abilityMatch) {
        const ability = abilityMatch[1].toLowerCase() as Ability
        const required = parseInt(abilityMatch[2])
        if (character.abilityScores[ability] < required) return false
      }
      
      // Check proficiency requirements
      if (prereq.includes('proficiency')) {
        // Would need to check actual proficiencies
        // For now, allow all
      }
    }
    
    return true
  })
}

/**
 * Check if a feat is available for a character
 */
export function isFeatAvailable(character: Character, feat: Feat2024): boolean {
  // Check if already has this feat
  if (character.feats?.some(f => f.featId === feat.id)) return false
  
  // Check prerequisites
  if (feat.prerequisite) {
    const prereq = feat.prerequisite.toLowerCase()
    
    // Check ability score requirements
    const abilityMatch = prereq.match(/(str|dex|con|int|wis|cha)\s*(\d+)/i)
    if (abilityMatch) {
      const ability = abilityMatch[1].toLowerCase() as Ability
      const required = parseInt(abilityMatch[2])
      if (character.abilityScores[ability] < required) return false
    }
    
    // Check spellcasting requirement
    if (prereq.includes('ability to cast')) {
      const cls = getClass2024(character.class)
      if (!cls || cls.casterType === 'none') return false
    }
    
    // Check armor proficiency requirements
    if (prereq.includes('armor')) {
      // Would need to check actual proficiencies
    }
  }
  
  return true
}

/**
 * Create a CharacterFeat from a Feat2024
 */
export function createCharacterFeat(
  feat: Feat2024,
  levelAcquired: number,
  source: 'origin' | 'asi' | 'general'
): CharacterFeat {
  return {
    featId: feat.id,
    name: feat.name,
    source,
    levelAcquired,
    asiApplied: feat.asi,
  }
}

/**
 * Create a SelectedSubclass
 */
export function createSelectedSubclass(
  subclassId: string,
  name: string,
  classId: CharacterClass,
  levelAcquired: number
): SelectedSubclass {
  return {
    subclassId,
    name,
    classId,
    levelAcquired,
  }
}

/**
 * Get features gained at a specific level for a class
 * This is a simplified version - in full implementation, would pull from class features database
 */
export function getFeaturesAtLevel(classId: CharacterClass, level: number): string[] {
  const features: string[] = []
  
  // Add level-appropriate features based on class
  switch (classId) {
    case 'Barbarian':
      if (level === 1) features.push('Rage', 'Unarmored Defense')
      if (level === 2) features.push('Reckless Attack', 'Danger Sense')
      if (level === 3) features.push('Primal Path')
      if (level === 5) features.push('Extra Attack', 'Fast Movement')
      if (level === 7) features.push('Feral Instinct')
      if (level === 9) features.push('Brutal Critical')
      if (level === 11) features.push('Relentless Rage')
      if (level === 15) features.push('Persistent Rage')
      if (level === 18) features.push('Indomitable Might')
      if (level === 20) features.push('Primal Champion')
      break
    case 'Bard':
      if (level === 1) features.push('Bardic Inspiration', 'Spellcasting')
      if (level === 2) features.push('Jack of All Trades', 'Song of Rest')
      if (level === 3) features.push('Bard College', 'Expertise')
      if (level === 5) features.push('Font of Inspiration')
      if (level === 6) features.push('Countercharm')
      if (level === 10) features.push('Magical Secrets')
      if (level === 20) features.push('Superior Inspiration')
      break
    case 'Cleric':
      if (level === 1) features.push('Spellcasting', 'Divine Domain')
      if (level === 2) features.push('Channel Divinity')
      if (level === 5) features.push('Destroy Undead')
      if (level === 8) features.push('Divine Strike')
      if (level === 10) features.push('Divine Intervention')
      if (level === 17) features.push('Supreme Divine Strike')
      break
    case 'Druid':
      if (level === 1) features.push('Druidic', 'Spellcasting')
      if (level === 2) features.push('Wild Shape', 'Druid Circle')
      if (level === 18) features.push('Timeless Body', 'Beast Spells')
      if (level === 20) features.push('Archdruid')
      break
    case 'Fighter':
      if (level === 1) features.push('Fighting Style', 'Second Wind')
      if (level === 2) features.push('Action Surge')
      if (level === 3) features.push('Martial Archetype')
      if (level === 5) features.push('Extra Attack')
      if (level === 9) features.push('Indomitable')
      break
    case 'Monk':
      if (level === 1) features.push('Unarmored Defense', 'Martial Arts')
      if (level === 2) features.push('Ki', 'Unarmored Movement')
      if (level === 3) features.push('Monastic Tradition')
      if (level === 5) features.push('Extra Attack', 'Stunning Strike')
      if (level === 7) features.push('Evasion', 'Stillness of Mind')
      if (level === 14) features.push('Diamond Soul')
      if (level === 18) features.push('Empty Body')
      if (level === 20) features.push('Perfect Self')
      break
    case 'Paladin':
      if (level === 1) features.push('Divine Sense', 'Lay on Hands')
      if (level === 2) features.push('Fighting Style', 'Spellcasting', 'Divine Smite')
      if (level === 3) features.push('Divine Health', 'Sacred Oath')
      if (level === 5) features.push('Extra Attack')
      if (level === 6) features.push('Aura of Protection')
      if (level === 11) features.push('Improved Divine Smite')
      break
    case 'Ranger':
      if (level === 1) features.push('Favored Enemy', 'Natural Explorer')
      if (level === 2) features.push('Fighting Style', 'Spellcasting')
      if (level === 3) features.push('Ranger Archetype', 'Primeval Awareness')
      if (level === 5) features.push('Extra Attack')
      break
    case 'Rogue':
      if (level === 1) features.push('Sneak Attack', 'Thieves\' Cant', 'Cunning Action')
      if (level === 3) features.push('Roguish Archetype')
      if (level === 5) features.push('Uncanny Dodge')
      if (level === 7) features.push('Evasion')
      if (level === 11) features.push('Reliable Talent')
      if (level === 14) features.push('Blindsense')
      if (level === 15) features.push('Slippery Mind')
      if (level === 18) features.push('Elusive')
      if (level === 20) features.push('Stroke of Luck')
      break
    case 'Sorcerer':
      if (level === 1) features.push('Spellcasting', 'Sorcerous Origin')
      if (level === 2) features.push('Font of Magic')
      if (level === 3) features.push('Metamagic')
      if (level === 20) features.push('Sorcerous Restoration')
      break
    case 'Warlock':
      if (level === 1) features.push('Otherworldly Patron', 'Pact Magic')
      if (level === 2) features.push('Eldritch Invocations')
      if (level === 3) features.push('Pact Boon')
      if (level === 11) features.push('Mystic Arcanum')
      if (level === 20) features.push('Eldritch Master')
      break
    case 'Wizard':
      if (level === 1) features.push('Spellcasting', 'Arcane Recovery')
      if (level === 2) features.push('Arcane Tradition')
      if (level === 18) features.push('Spell Mastery')
      if (level === 20) features.push('Signature Spells')
      break
  }
  
  return features
}

/**
 * Get proficiency bonus for a level
 */
export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1
}

/**
 * Validate ASI (Ability Score Improvement) selection
 */
export function validateASI(
  currentScores: Record<Ability, number>,
  asiSelection: Partial<Record<Ability, number>>
): { valid: boolean; error?: string; newScores: Record<Ability, number> } {
  // Filter out undefined values and calculate total
  const validIncreases: Record<Ability, number> = {} as Record<Ability, number>
  for (const [ability, increase] of Object.entries(asiSelection)) {
    if (increase !== undefined && increase > 0) {
      validIncreases[ability as Ability] = increase
    }
  }
  
  const totalIncrease = Object.values(validIncreases).reduce((a, b) => a + b, 0)
  
  if (totalIncrease !== 2) {
    return { valid: false, error: 'Total ability score increase must be exactly 2', newScores: currentScores }
  }
  
  // Check that no ability would exceed 20
  for (const [ability, increase] of Object.entries(validIncreases)) {
    if (increase > 0) {
      const current = currentScores[ability as Ability]
      if (current + increase > 20) {
        return { valid: false, error: `${ability} cannot exceed 20`, newScores: currentScores }
      }
    }
  }
  
  // Calculate new scores
  const newScores = { ...currentScores }
  for (const [ability, increase] of Object.entries(validIncreases)) {
    newScores[ability as Ability] += increase
  }
  
  return { valid: true, newScores }
}

/**
 * Get recommended HP increase (average)
 */
export function getRecommendedHpIncrease(character: Character): number {
  const cls = getClass2024(character.class)
  const hitDie = cls?.hitDie ?? 8
  const conMod = abilityModifier(character.abilityScores.con)
  return calculateAverageHpIncrease(hitDie, conMod)
}

/**
 * Get new spell slots on level up (for spellcasters)
 */
export function getNewSpellSlots(
  character: Character,
  newLevel: number
): Record<number, { max: number; used: number }> | undefined {
  const cls = getClass2024(character.class)
  if (!cls || cls.casterType === 'none') return undefined
  
  // This would need to be implemented with actual spell slot tables
  // For now, return undefined to indicate no change needed
  return undefined
}
