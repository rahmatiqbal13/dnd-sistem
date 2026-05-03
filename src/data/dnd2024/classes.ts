import type { CharacterClass } from '@/types'
import type { CasterProgression } from '@/lib/spellcasting'

export interface Class2024 {
  id: CharacterClass
  hitDie: 6 | 8 | 10 | 12
  casterType: CasterProgression
  subclassLevel: number
  skillsChoose: number
  /** Skill names the class can pick from (subset of SKILLS_LIST names). */
  skillOptions: string[]
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
    summary: 'Bardic Inspiration, Jack of All Trades. College at 3rd. Full caster.',
  },
  {
    id: 'Cleric',
    hitDie: 8,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    summary: 'Divine Domain at 1st, Channel Divinity at 2nd. Full caster.',
  },
  {
    id: 'Druid',
    hitDie: 8,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    summary: 'Druidic, Wild Shape. Circle at 3rd. Full caster.',
  },
  {
    id: 'Fighter',
    hitDie: 10,
    casterType: 'none',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    summary: 'Fighting Style, Second Wind, Action Surge. Martial Archetype at 3rd.',
  },
  {
    id: 'Monk',
    hitDie: 8,
    casterType: 'none',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    summary: 'Martial Arts, Ki, Unarmored Movement. Tradition at 3rd.',
  },
  {
    id: 'Paladin',
    hitDie: 10,
    casterType: 'half',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    summary: 'Divine Sense, Lay on Hands. Sacred Oath at 3rd. Half caster.',
  },
  {
    id: 'Ranger',
    hitDie: 10,
    casterType: 'half',
    subclassLevel: 3,
    skillsChoose: 3,
    skillOptions: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
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
    summary: 'Expertise, Sneak Attack, Cunning Action. Roguish Archetype at 3rd.',
  },
  {
    id: 'Sorcerer',
    hitDie: 6,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    summary: 'Sorcery Points, Metamagic. Origin at 3rd. Full caster.',
  },
  {
    id: 'Warlock',
    hitDie: 8,
    casterType: 'pact',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    summary: 'Pact Magic, Invocations. Patron features. Pact Boon at 3rd.',
  },
  {
    id: 'Wizard',
    hitDie: 6,
    casterType: 'full',
    subclassLevel: 3,
    skillsChoose: 2,
    skillOptions: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    summary: 'Spellbook, Arcane Recovery. Tradition at 3rd. Full caster.',
  },
]

export function getClass2024(c: CharacterClass): Class2024 | undefined {
  return CLASSES_2024.find((x) => x.id === c)
}
