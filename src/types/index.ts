export type Role = 'dm' | 'player'

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100

export type RollMode = 'normal' | 'advantage' | 'disadvantage'

export interface DiceRollResult {
  id: string
  dice: DiceType
  count: number
  modifier: number
  /** Hasil dadu yang masuk ke total (untuk adv/dis 1d20: hanya d20 terpilih). */
  rolls: number[]
  total: number
  advantage: boolean
  disadvantage: boolean
  /** Disarankan; entri log lama bisa tanpa field ini. */
  mode?: RollMode
  /** Dua d20 independen jika adv/dis pada 1d20. */
  d20Pair?: [number, number] | null
  chosenD20?: number | null
  discardedD20?: number | null
  /** Contoh: `[18, 5] → Result: 18` (+ mod & total jika ada). */
  detailLabel?: string
  timestamp: number
  rolledBy: string
}

// ── Character ──────────────────────────────────────────────────────────────

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export type CharacterClass =
  | 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter'
  | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer'
  | 'Warlock' | 'Wizard'

export type CharacterRace =
  | 'Dragonborn' | 'Dwarf' | 'Elf' | 'Gnome' | 'Half-Elf'
  | 'Half-Orc' | 'Halfling' | 'Human' | 'Tiefling'

export type Alignment =
  | 'Lawful Good' | 'Neutral Good' | 'Chaotic Good'
  | 'Lawful Neutral' | 'True Neutral' | 'Chaotic Neutral'
  | 'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil'

export interface AbilityScores {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export interface Skill {
  name: string
  ability: Ability
  proficient: boolean
  expertise: boolean
}

export interface Spell {
  id: string
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  components: string
  duration: string
  description: string
  prepared: boolean
  ritual?: boolean
  costlyMaterial?: boolean
  innate?: boolean
}

export interface EquipmentItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'gear' | 'magic'
  weight: number
  description: string
  equipped: boolean
}

/** Slot spell: key = tingkat slot 1–9 */
export type SpellSlotsState = Partial<Record<number, { max: number; used: number }>>

export interface Character {
  id: string
  name: string
  class: CharacterClass
  race: CharacterRace
  level: number
  alignment: Alignment
  /** Nama tampilan background */
  background: string
  /** Id dari `BACKGROUNDS_2024` jika pakai data 2024 */
  backgroundId?: string
  subclass?: string
  originFeat?: string
  abilityScores: AbilityScores
  maxHp: number
  currentHp: number
  tempHp: number
  armorClass: number
  speed: number
  initiative: number
  proficiencyBonus: number
  savingThrows: Record<Ability, boolean>
  skills: Record<string, boolean>
  spells: Spell[]
  equipment: EquipmentItem[]
  /** Slot spell otomatis untuk full/half/third/pact caster */
  spellSlots?: SpellSlotsState
  gold: number
  notes: string
  traits: string
  ideals: string
  bonds: string
  flaws: string
  campaignId: string | null
  ownerId: string
  createdAt: number
}

// ── Campaign ───────────────────────────────────────────────────────────────

export interface CampaignMember {
  nickname: string
  role: Role
  characterId: string | null
  joinedAt: number
}

export interface CampaignNpc {
  id: string
  name: string
  role: string
  notes: string
}

export interface CampaignSession {
  id: string
  title: string
  date: string
  summary: string
  xpAwarded: number
  createdAt: number
}

export interface Campaign {
  id: string
  name: string
  description: string
  dmNickname: string
  inviteCode: string
  members: CampaignMember[]
  npcs: CampaignNpc[]
  sessions: CampaignSession[]
  isActive: boolean
  sessionNotes: string
  createdAt: number
}

// ── Combat ─────────────────────────────────────────────────────────────────

export type StatusEffect =
  | 'Blinded' | 'Charmed' | 'Deafened' | 'Exhaustion'
  | 'Frightened' | 'Grappled' | 'Incapacitated' | 'Invisible'
  | 'Paralyzed' | 'Petrified' | 'Poisoned' | 'Prone'
  | 'Restrained' | 'Stunned' | 'Unconscious'

export interface Combatant {
  id: string
  name: string
  initiative: number
  maxHp: number
  currentHp: number
  tempHp: number
  armorClass: number
  isPlayer: boolean
  isNpc: boolean
  statusEffects: StatusEffect[]
  notes: string
  characterId?: string
}

// ── Compendium ─────────────────────────────────────────────────────────────

export type CompendiumCategory = 'spell' | 'monster' | 'condition' | 'class' | 'equipment'

export interface CompendiumEntry {
  id: string
  name: string
  category: CompendiumCategory
  subtitle: string
  tags: string[]
  content: Record<string, string>
}
