import type { CharacterClass, Ability } from '@/types'
import type { CasterProgression } from '@/lib/spellcasting'

export interface Class2024 {
  id: CharacterClass
  hitDie: 6 | 8 | 10 | 12
  casterType: CasterProgression
  subclassLevel: number
  skillsChoose: number
  skillOptions: string[]
  savingThrows: Ability[]
  weaponProficiencies: string[]
  armorProficiencies: string[]
  toolProficiencies?: string[]
  summary: string
}

export const CLASSES_2024: Class2024[] = [
  {
    id: 'Barbarian',
    hitDie: 12,
    casterType: 'none',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    savingThrows: ['str', 'con'],
    weaponProficiencies: ['simple', 'martial'],
    armorProficiencies: ['light', 'medium', 'shield'],
    summary: 'Rage, Unarmored Defense, Reckless Attack. Primal Path at 3rd.',
  },
  {
    id: 'Bard',
    hitDie: 8,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 3,
    skillOptions: [
      'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight',
      'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance',
      'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
    ],
    savingThrows: ['dex', 'cha'],
    weaponProficiencies: ['simple', 'hand crossbow', 'longsword', 'rapier', 'shortsword'],
    armorProficiencies: ['light'],
    toolProficiencies: ['musical instrument (choose three)'],
    summary: 'Bardic Inspiration, Jack of All Trades. College at 3rd. Full caster.',
  },
  {
    id: 'Cleric',
    hitDie: 8,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    savingThrows: ['wis', 'cha'],
    weaponProficiencies: ['simple'],
    armorProficiencies: ['light', 'medium', 'shield'],
    summary: 'Divine Domain at 1st, Channel Divinity at 2nd. Full caster.',
  },
  {
    id: 'Druid',
    hitDie: 8,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    savingThrows: ['int', 'wis'],
    weaponProficiencies: ['club', 'dagger', 'dart', 'javelin', 'mace', 'quarterstaff', 'scimitar', 'sling'],
    armorProficiencies: ['light', 'medium', 'shield'],
    toolProficiencies: ['herbalism kit'],
    summary: 'Druidic, Wild Shape. Circle at 3rd. Full caster.',
  },
  {
    id: 'Fighter',
    hitDie: 10,
    casterType: 'none',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    savingThrows: ['str', 'con'],
    weaponProficiencies: ['simple', 'martial'],
    armorProficiencies: ['light', 'medium', 'heavy', 'shield'],
    summary: 'Fighting Style, Second Wind, Action Surge. Martial Archetype at 3rd.',
  },
  {
    id: 'Monk',
    hitDie: 8,
    casterType: 'none',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    savingThrows: ['str', 'dex'],
    weaponProficiencies: ['simple', 'shortsword'],
    armorProficiencies: [],
    toolProficiencies: ['artisan tool or musical instrument (choose one)'],
    summary: 'Martial Arts, Ki, Unarmored Movement. Tradition at 3rd.',
  },
  {
    id: 'Paladin',
    hitDie: 10,
    casterType: 'half',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    savingThrows: ['wis', 'cha'],
    weaponProficiencies: ['simple', 'martial'],
    armorProficiencies: ['light', 'medium', 'heavy', 'shield'],
    summary: 'Divine Sense, Lay on Hands. Sacred Oath at 3rd. Half caster.',
  },
  {
    id: 'Ranger',
    hitDie: 10,
    casterType: 'half',
    subclassLevel: 3,
    skillsChoose: 3,
    skillOptions: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    savingThrows: ['str', 'dex'],
    weaponProficiencies: ['simple', 'martial'],
    armorProficiencies: ['light', 'medium', 'shield'],
    summary: 'Favored Enemy, Fighting Style. Subclass at 3rd. Half caster.',
  },
  {
    id: 'Rogue',
    hitDie: 8,
    casterType: 'none',
    subclassLevel: 3,
    skillsChoose: 4,
    skillOptions: [
      'Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception',
      'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth',
    ],
    savingThrows: ['dex', 'int'],
    weaponProficiencies: ['simple', 'hand crossbow', 'longsword', 'rapier', 'shortsword'],
    armorProficiencies: ['light'],
    toolProficiencies: ['thieves tools'],
    summary: 'Expertise, Sneak Attack, Cunning Action. Roguish Archetype at 3rd.',
  },
  {
    id: 'Sorcerer',
    hitDie: 6,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    savingThrows: ['con', 'cha'],
    weaponProficiencies: ['dagger', 'dart', 'sling', 'quarterstaff', 'light crossbow'],
    armorProficiencies: [],
    summary: 'Sorcery Points, Metamagic. Origin at 3rd. Full caster.',
  },
  {
    id: 'Warlock',
    hitDie: 8,
    casterType: 'pact',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    savingThrows: ['wis', 'cha'],
    weaponProficiencies: ['simple'],
    armorProficiencies: ['light'],
    summary: 'Pact Magic, Invocations. Patron features. Pact Boon at 3rd.',
  },
  {
    id: 'Wizard',
    hitDie: 6,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    savingThrows: ['int', 'wis'],
    weaponProficiencies: ['dagger', 'dart', 'sling', 'quarterstaff', 'light crossbow'],
    armorProficiencies: [],
    summary: 'Spellbook, Arcane Recovery. Tradition at 3rd. Full caster.',
  },
]

export function getClass2024(c: CharacterClass): Class2024 | undefined {
  return CLASSES_2024.find((x) => x.id === c)
}
