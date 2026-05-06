import type { CharacterRace } from '@/types'

export interface RacialFeature {
  name: string
  description: string
}

export interface InnateSpell {
  name: string
  level: number
  note?: string
}

export interface Race2024 {
  id: CharacterRace
  features: RacialFeature[]
  traits?: string
  languages: string[]
  size: 'Small' | 'Medium'
  speed: number
  innateSpells?: InnateSpell[]
}

export const RACES_DATA_2024: Race2024[] = [
  {
    id: 'Dragonborn',
    features: [
      { name: 'Draconic Ancestry', description: 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table.' },
      { name: 'Breath Weapon', description: 'You can use your bonus action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.' },
      { name: 'Damage Resistance', description: 'You have resistance to the damage type associated with your draconic ancestry.' },
      { name: 'Draconic Flight', description: 'Starting at 5th level, you can use a bonus action to gain a flying speed of 30 feet until the end of your turn.' },
    ],
    traits: 'Breath weapon, damage resistance, draconic ancestry.',
    languages: ['Common', 'Draconic'],
    size: 'Medium',
    speed: 30,
    innateSpells: [],
  },
  {
    id: 'Dwarf',
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.' },
      { name: 'Dwarven Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' },
      { name: 'Dwarven Combat Training', description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.' },
      { name: 'Stonecunning', description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.' },
    ],
    traits: 'Darkvision, dwarven resilience (poison resistance), stonecunning.',
    languages: ['Common', 'Dwarvish'],
    size: 'Medium',
    speed: 25,
    innateSpells: [],
  },
  {
    id: 'Elf',
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.' },
      { name: 'Keen Senses', description: 'You have proficiency in the Perception skill.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
      { name: 'Trance', description: 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.' },
    ],
    traits: 'Darkvision, fey ancestry (charm immunity), trance (4hr rest).',
    languages: ['Common', 'Elvish'],
    size: 'Medium',
    speed: 30,
    innateSpells: [],
  },
  {
    id: 'Gnome',
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.' },
      { name: 'Gnome Cunning', description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' },
      { name: 'Natural Illusionist', description: 'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.' },
      { name: 'Speak with Small Beasts', description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.' },
    ],
    traits: 'Darkvision, gnome cunning (magic saves).',
    languages: ['Common', 'Gnomish'],
    size: 'Small',
    speed: 25,
    innateSpells: [
      { name: 'Minor Illusion', level: 0, note: 'Intelligence-based cantrip' }
    ],
  },
  {
    id: 'Half-Elf',
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
      { name: 'Skill Versatility', description: 'You gain proficiency in two skills of your choice.' },
      { name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' },
    ],
    traits: 'Darkvision, fey ancestry, skill versatility (+2 skills).',
    languages: ['Common', 'Elvish'],
    size: 'Medium',
    speed: 30,
    innateSpells: [],
  },
  {
    id: 'Half-Orc',
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.' },
      { name: 'Menacing', description: 'You gain proficiency in the Intimidation skill.' },
      { name: 'Relentless Endurance', description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\'t use this feature again until you finish a long rest.' },
      { name: 'Savage Attacks', description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.' },
    ],
    traits: 'Darkvision, relentless endurance (1/long rest), savage attacks.',
    languages: ['Common', 'Orc'],
    size: 'Medium',
    speed: 30,
    innateSpells: [],
  },
  {
    id: 'Halfling',
    features: [
      { name: 'Lucky', description: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' },
      { name: 'Brave', description: 'You have advantage on saving throws against being frightened.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is of a size larger than yours.' },
      { name: 'Naturally Stealthy', description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.' },
    ],
    traits: 'Lucky (reroll 1s), brave (fear saves), nimbleness.',
    languages: ['Common', 'Halfling'],
    size: 'Small',
    speed: 25,
    innateSpells: [],
  },
  {
    id: 'Human',
    features: [
      { name: 'Versatile', description: 'You gain proficiency in one skill of your choice.' },
      { name: 'Extra Language', description: 'You can speak, read, and write one extra language of your choice.' },
    ],
    traits: 'Versatile (+1 skill), extra language.',
    languages: ['Common'],
    size: 'Medium',
    speed: 30,
    innateSpells: [],
  },
  {
    id: 'Tiefling',
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.' },
      { name: 'Hellish Resistance', description: 'You have resistance to fire damage.' },
      { name: 'Infernal Legacy', description: 'You know the thaumaturgy cantrip. At 3rd level, you can cast hellish rebuke once per day. At 5th level, you can cast darkness once per day. Charisma is your spellcasting ability for these spells.' },
    ],
    traits: 'Darkvision, hellish resistance (fire), infernal legacy (spells).',
    languages: ['Common', 'Infernal'],
    size: 'Medium',
    speed: 30,
    innateSpells: [
      { name: 'Thaumaturgy', level: 0, note: 'Charisma-based cantrip' }
    ],
  },
]

export function getRace2024(raceId: CharacterRace): Race2024 | undefined {
  return RACES_DATA_2024.find((r) => r.id === raceId)
}

export function getRaceFeatures(raceId: CharacterRace): RacialFeature[] {
  const race = getRace2024(raceId)
  return race?.features ?? []
}

export function getRaceLanguages(raceId: CharacterRace): string[] {
  const race = getRace2024(raceId)
  return race?.languages ?? ['Common']
}

export function getRaceSpeed(raceId: CharacterRace): number {
  const race = getRace2024(raceId)
  return race?.speed ?? 30
}
