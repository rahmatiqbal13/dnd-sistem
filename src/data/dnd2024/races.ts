import type { CharacterRace } from '@/types'

export interface InnateSpell {
  name: string
  level: number
  note?: string
}

export interface Race2024 {
  id: CharacterRace
  speed: number
  traits: string
  innateSpells?: InnateSpell[]
}

export const RACES_2024: Race2024[] = [
  {
    id: 'Human',
    speed: 30,
    traits: 'Versatile — +1 ke semua ability (abaikan jika memakai aturan 2024 murni dengan Background ASI).',
  },
  {
    id: 'Elf',
    speed: 30,
    traits: 'Darkvision 60 ft, Fey Ancestry (advantage vs charm, immune magical sleep), Trance.',
  },
  {
    id: 'Dwarf',
    speed: 25,
    traits: 'Darkvision 60 ft, Dwarven Resilience (advantage vs poison, resistance poison damage).',
  },
  {
    id: 'Halfling',
    speed: 25,
    traits: 'Lucky (reroll 1 on d20), Brave (advantage vs frightened), Halfling Nimbleness.',
  },
  {
    id: 'Dragonborn',
    speed: 30,
    traits: 'Draconic Ancestry (breath weapon, resistance by dragon type).',
  },
  {
    id: 'Gnome',
    speed: 25,
    traits: 'Darkvision 60 ft, Gnome Cunning (advantage INT/WIS/CHA saves vs magic).',
  },
  {
    id: 'Half-Elf',
    speed: 30,
    traits: 'Darkvision 60 ft, Fey Ancestry, Skill Versatility (2 skills).',
  },
  {
    id: 'Half-Orc',
    speed: 30,
    traits: 'Darkvision 60 ft, Relentless Endurance, Savage Attacks.',
  },
  {
    id: 'Tiefling',
    speed: 30,
    traits: 'Darkvision 60 ft, Hellish Resistance (fire), Infernal Legacy.',
    innateSpells: [{ name: 'Thaumaturgy', level: 0 }, { name: 'Hellish Rebuke', level: 1 }],
  },
]

export function getRace2024(r: CharacterRace): Race2024 | undefined {
  return RACES_2024.find((x) => x.id === r)
}
