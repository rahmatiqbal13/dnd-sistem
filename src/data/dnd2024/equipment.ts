import type { CharacterClass } from '@/types'

export interface StartingEquipment {
  armor?: string
  shield?: boolean
  weapons: string[]
  tools?: string[]
  gear: string[]
  gold: number // Alternative: take gold instead of equipment
}

export const STARTING_EQUIPMENT_2024: Record<CharacterClass, StartingEquipment> = {
  Barbarian: {
    armor: 'Hide armor (AC 12 + DEX, max 2)',
    weapons: [
      'Greataxe OR any martial melee weapon',
      'Two handaxes OR any simple weapon'
    ],
    gear: [
      'Explorer\'s pack',
      'Four javelins'
    ],
    gold: 50, // 2d4 × 10 gp
  },
  Bard: {
    armor: 'Leather armor (AC 11 + DEX)',
    weapons: [
      'Rapier OR longsword OR any simple weapon',
      'Dagger'
    ],
    gear: [
      'Entertainer\'s pack OR diplomat\'s pack',
      'Lute OR any other musical instrument',
      'Leather armor',
      'Dagger'
    ],
    tools: ['Musical instrument of your choice'],
    gold: 50, // 5d4 × 10 gp
  },
  Cleric: {
    armor: 'Scale mail (AC 14 + DEX, max 2) OR leather armor OR chain mail (if proficient)',
    shield: true,
    weapons: [
      'Mace OR warhammer (if proficient)',
      'Light crossbow and 20 bolts OR any simple weapon'
    ],
    gear: [
      'Priest\'s pack OR explorer\'s pack',
      'Shield',
      'Holy symbol'
    ],
    gold: 75, // 5d4 × 10 gp
  },
  Druid: {
    armor: 'Leather armor (AC 11 + DEX) OR hide armor (AC 12 + DEX, max 2)',
    shield: true,
    weapons: [
      'Scimitar OR any simple melee weapon',
      'Two clubs OR any simple weapon'
    ],
    tools: ['Herbalism kit'],
    gear: [
      'Explorer\'s pack',
      'Druidic focus (sprig of mistletoe OR totem OR wooden staff OR yew wand)'
    ],
    gold: 50, // 2d4 × 10 gp
  },
  Fighter: {
    armor: 'Chain mail (AC 16) OR leather armor, longbow, and 20 arrows',
    shield: true,
    weapons: [
      'One martial weapon AND shield OR two martial weapons',
      'Light crossbow and 20 bolts OR two handaxes'
    ],
    gear: [
      'Dungeoneer\'s pack OR explorer\'s pack'
    ],
    gold: 100, // 5d4 × 10 gp
  },
  Monk: {
    weapons: [
      'Shortsword OR any simple weapon',
      '10 darts'
    ],
    gear: [
      'Dungeoneer\'s pack OR explorer\'s pack',
      '10 darts'
    ],
    tools: ['Artisan tool OR musical instrument of your choice'],
    gold: 20, // 5d4 gp
  },
  Paladin: {
    armor: 'Chain mail (AC 16)',
    shield: true,
    weapons: [
      'One martial weapon AND shield OR two martial weapons',
      'Five javelins OR any simple melee weapon'
    ],
    gear: [
      'Priest\'s pack OR explorer\'s pack',
      'Chain mail',
      'Holy symbol'
    ],
    gold: 125, // 5d4 × 25 gp
  },
  Ranger: {
    armor: 'Scale mail (AC 14 + DEX, max 2)',
    weapons: [
      'Two shortswords OR two simple melee weapons',
      'Longbow and quiver of 20 arrows'
    ],
    gear: [
      'Explorer\'s pack'
    ],
    gold: 75, // 5d4 × 10 gp
  },
  Rogue: {
    armor: 'Leather armor (AC 11 + DEX)',
    weapons: [
      'Rapier OR shortsword',
      'Shortbow and quiver of 20 arrows OR shortsword',
      'Two daggers'
    ],
    gear: [
      'Burglar\'s pack OR dungeoneer\'s pack OR explorer\'s pack',
      'Leather armor',
      'Two daggers',
      'Thieves\' tools'
    ],
    tools: ['Thieves\' tools'],
    gold: 50, // 4d4 × 10 gp
  },
  Sorcerer: {
    weapons: [
      'Light crossbow and 20 bolts OR simple weapon',
      'Two daggers'
    ],
    gear: [
      'Dungeoneer\'s pack OR explorer\'s pack',
      'Two daggers',
      'Arcane focus (crystal OR orb OR rod OR staff OR wand) OR component pouch'
    ],
    gold: 75, // 3d4 × 10 gp
  },
  Warlock: {
    armor: 'Leather armor (AC 11 + DEX)',
    weapons: [
      'Light crossbow and 20 bolts OR simple weapon',
      'Two simple weapons'
    ],
    gear: [
      'Scholar\'s pack OR dungeoneer\'s pack',
      'Leather armor',
      'Two daggers',
      'Arcane focus (crystal OR orb OR rod OR staff OR wand) OR component pouch'
    ],
    gold: 100, // 4d4 × 10 gp
  },
  Wizard: {
    weapons: [
      'Quarterstaff OR dagger',
      'One simple weapon'
    ],
    gear: [
      'Scholar\'s pack OR explorer\'s pack',
      'Spellbook',
      'Arcane focus (crystal OR orb OR rod OR staff OR wand) OR component pouch'
    ],
    gold: 75, // 4d4 × 10 gp
  },
}

export function getStartingEquipment(classId: CharacterClass): StartingEquipment {
  return STARTING_EQUIPMENT_2024[classId]
}

export function getDefaultArmorForClass(classId: CharacterClass): string | undefined {
  const eq = STARTING_EQUIPMENT_2024[classId]
  return eq.armor
}

export function getDefaultShieldForClass(classId: CharacterClass): boolean {
  const eq = STARTING_EQUIPMENT_2024[classId]
  return eq.shield ?? false
}

export function getDefaultGoldForClass(classId: CharacterClass): number {
  const eq = STARTING_EQUIPMENT_2024[classId]
  return eq.gold
}
