import type { Ability } from '@/types'

/** 2024-style: ASI (+2 / +1) dan Origin Feat berasal dari Background. */
export interface Background2024 {
  id: string
  name: string
  asiPlus2: Ability
  asiPlus1: Ability
  originFeat: string
  traitSummary: string
}

export const BACKGROUNDS_2024: Background2024[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    asiPlus2: 'wis',
    asiPlus1: 'int',
    originFeat: 'Magic Initiate (Cleric)',
    traitSummary: 'Shelter of the Faithful — biaya hidup rendah di kuil; bantuan sesama umat.',
  },
  {
    id: 'criminal',
    name: 'Criminal',
    asiPlus2: 'dex',
    asiPlus1: 'int',
    originFeat: 'Alert',
    traitSummary: 'Criminal Contact — hubungan dengan jaringan kriminal.',
  },
  {
    id: 'folk-hero',
    name: 'Folk Hero',
    asiPlus2: 'wis',
    asiPlus1: 'con',
    originFeat: 'Savage Attacker',
    traitSummary: 'Rustic Hospitality — penduduk desa akan menolongmu.',
  },
  {
    id: 'noble',
    name: 'Noble',
    asiPlus2: 'cha',
    asiPlus1: 'int',
    originFeat: 'Skilled',
    traitSummary: 'Position of Privilege — diakui di kalangan bangsawan.',
  },
  {
    id: 'sage',
    name: 'Sage',
    asiPlus2: 'int',
    asiPlus1: 'con',
    originFeat: 'Magic Initiate (Wizard)',
    traitSummary: 'Researcher — ingat di mana menemukan informasi.',
  },
  {
    id: 'soldier',
    name: 'Soldier',
    asiPlus2: 'str',
    asiPlus1: 'con',
    originFeat: 'Tough',
    traitSummary: 'Military Rank — memerintahkan prajurit sekutu.',
  },
  {
    id: 'entertainer',
    name: 'Entertainer',
    asiPlus2: 'cha',
    asiPlus1: 'dex',
    originFeat: 'Musician',
    traitSummary: 'By Popular Demand — tempat tampil dan penginapan gratis.',
  },
  {
    id: 'guild-artisan',
    name: 'Guild Artisan',
    asiPlus2: 'int',
    asiPlus1: 'cha',
    originFeat: 'Crafter',
    traitSummary: 'Guild Membership — jaringan artisan dan perumahan.',
  },
  {
    id: 'hermit',
    name: 'Hermit',
    asiPlus2: 'wis',
    asiPlus1: 'con',
    originFeat: 'Healer',
    traitSummary: 'Discovery — wawasan unik dari pengabdian terpencil.',
  },
  {
    id: 'outlander',
    name: 'Outlander',
    asiPlus2: 'str',
    asiPlus1: 'wis',
    originFeat: 'Tavern Brawler',
    traitSummary: 'Wanderer — ingat medan dan sumber makanan/air.',
  },
]

export function getBackground2024(id: string): Background2024 | undefined {
  return BACKGROUNDS_2024.find((b) => b.id === id)
}
