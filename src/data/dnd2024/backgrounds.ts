import type { Ability } from '@/types'

export interface BackgroundFeature {
  name: string
  description: string
}

/** 2024-style: ASI (+2 / +1) dan Origin Feat berasal dari Background. */
export interface Background2024 {
  id: string
  name: string
  asiPlus2: Ability
  asiPlus1: Ability
  originFeat: string
  traitSummary: string
  features: BackgroundFeature[]
  equipment: string[]
  toolProficiencies?: string[]
  languages?: string[]
}

export const BACKGROUNDS_2024: Background2024[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    asiPlus2: 'wis',
    asiPlus1: 'int',
    originFeat: 'Magic Initiate (Cleric)',
    traitSummary: 'Shelter of the Faithful — biaya hidup rendah di kuil; bantuan sesama umat.',
    features: [
      { name: 'Shelter of the Faithful', description: 'You can perform religious ceremonies and have access to temples/shrines. Fellow worshippers provide modest support (food, lodging, healing).' }
    ],
    equipment: [
      'Holy symbol (gift)',
      'Prayer book OR prayer wheel',
      '5 sticks of incense',
      'Vestments',
      'Common clothes',
      '15 gp'
    ],
    languages: ['Two of your choice'],
  },
  {
    id: 'criminal',
    name: 'Criminal',
    asiPlus2: 'dex',
    asiPlus1: 'int',
    originFeat: 'Alert',
    traitSummary: 'Criminal Contact — hubungan dengan jaringan kriminal.',
    features: [
      { name: 'Criminal Contact', description: 'You have a reliable contact in the criminal underworld who can provide information, illegal goods, and connect you with other criminals.' }
    ],
    equipment: [
      'Crowbar',
      'Dark common clothes with hood',
      'Pouch containing 15 gp'
    ],
    toolProficiencies: ['Thieves\' tools', 'One gaming set of your choice'],
  },
  {
    id: 'folk-hero',
    name: 'Folk Hero',
    asiPlus2: 'wis',
    asiPlus1: 'con',
    originFeat: 'Savage Attacker',
    traitSummary: 'Rustic Hospitality — penduduk desa akan menolongmu.',
    features: [
      { name: 'Rustic Hospitality', description: 'Common folk welcome you in their homes and will shield you from the law or others searching for you, though they won\'t risk their lives.' }
    ],
    equipment: [
      'Artisan\'s tools (one of your choice)',
      'Shovel',
      'Iron pot',
      'Common clothes',
      '10 gp'
    ],
    toolProficiencies: ['One type of artisan\'s tools', 'Vehicles (land)'],
  },
  {
    id: 'noble',
    name: 'Noble',
    asiPlus2: 'cha',
    asiPlus1: 'int',
    originFeat: 'Skilled',
    traitSummary: 'Position of Privilege — diakui di kalangan bangsawan.',
    features: [
      { name: 'Position of Privilege', description: 'You are welcome in high society and people assume you have the right to be wherever you are. Commoners and merchants make efforts to accommodate you.' }
    ],
    equipment: [
      'Fine clothes',
      'Signet ring',
      'Scroll of pedigree',
      '25 gp'
    ],
    toolProficiencies: ['One gaming set of your choice'],
    languages: ['One of your choice'],
  },
  {
    id: 'sage',
    name: 'Sage',
    asiPlus2: 'int',
    asiPlus1: 'con',
    originFeat: 'Magic Initiate (Wizard)',
    traitSummary: 'Researcher — ingat di mana menemukan informasi.',
    features: [
      { name: 'Researcher', description: 'When you attempt to learn or recall lore, if you don\'t know the information, you often know where and from whom you can obtain it.' }
    ],
    equipment: [
      'Bottle of black ink',
      'Quill',
      'Small knife',
      'Letter from dead colleague',
      'Common clothes',
      '10 gp'
    ],
    languages: ['Two of your choice'],
  },
  {
    id: 'soldier',
    name: 'Soldier',
    asiPlus2: 'str',
    asiPlus1: 'con',
    originFeat: 'Tough',
    traitSummary: 'Military Rank — memerintahkan prajurit sekutu.',
    features: [
      { name: 'Military Rank', description: 'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence.' }
    ],
    equipment: [
      'Insignia of rank',
      'Trophy from fallen enemy',
      'Bone dice OR deck of cards',
      'Common clothes',
      '10 gp'
    ],
    toolProficiencies: ['One gaming set of your choice', 'Vehicles (land)'],
  },
  {
    id: 'entertainer',
    name: 'Entertainer',
    asiPlus2: 'cha',
    asiPlus1: 'dex',
    originFeat: 'Musician',
    traitSummary: 'By Popular Demand — tempat tampil dan penginapan gratis.',
    features: [
      { name: 'By Popular Demand', description: 'You can always find a place to perform (inn, tavern, circus, theater) with free modest lodging and food as long as you perform each night.' }
    ],
    equipment: [
      'Musical instrument (one of your choice)',
      'Love letter OR lock of hair OR trinket from admirer',
      'Costume',
      '15 gp'
    ],
    toolProficiencies: ['Disguise kit', 'One musical instrument of your choice'],
  },
  {
    id: 'guild-artisan',
    name: 'Guild Artisan',
    asiPlus2: 'int',
    asiPlus1: 'cha',
    originFeat: 'Crafter',
    traitSummary: 'Guild Membership — jaringan artisan dan perumahan.',
    features: [
      { name: 'Guild Membership', description: 'Your guild membership provides lodging and food at guild halls, and fellow guild members provide support and information when possible.' }
    ],
    equipment: [
      'Artisan\'s tools (one of your choice)',
      'Letter of introduction from guild',
      'Traveler\'s clothes',
      '15 gp'
    ],
    toolProficiencies: ['One type of artisan\'s tools of your choice'],
    languages: ['One of your choice'],
  },
  {
    id: 'hermit',
    name: 'Hermit',
    asiPlus2: 'wis',
    asiPlus1: 'con',
    originFeat: 'Healer',
    traitSummary: 'Discovery — wawasan unik dari pengabdian terpencil.',
    features: [
      { name: 'Discovery', description: 'The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature is determined by you and your DM.' }
    ],
    equipment: [
      'Scroll case stuffed with notes',
      'Winter blanket',
      'Common clothes',
      'Herbalism kit',
      '5 gp'
    ],
    toolProficiencies: ['Herbalism kit'],
    languages: ['One of your choice'],
  },
  {
    id: 'outlander',
    name: 'Outlander',
    asiPlus2: 'str',
    asiPlus1: 'wis',
    originFeat: 'Tavern Brawler',
    traitSummary: 'Wanderer — ingat medan dan sumber makanan/air.',
    features: [
      { name: 'Wanderer', description: 'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain and settlements. You can find food and fresh water for yourself and up to five others each day.' }
    ],
    equipment: [
      'Staff',
      'Hunting trap',
      'Trophy from animal you killed',
      'Traveler\'s clothes',
      '10 gp'
    ],
    toolProficiencies: ['One musical instrument of your choice'],
    languages: ['One of your choice'],
  },
]

export function getBackground2024(id: string): Background2024 | undefined {
  return BACKGROUNDS_2024.find((b) => b.id === id)
}
