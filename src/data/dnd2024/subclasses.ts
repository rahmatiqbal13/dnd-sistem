import type { CharacterClass } from '@/types'

export interface SubclassFeature {
  level: number
  name: string
  description: string
  uses?: number
  restType?: 'short' | 'long'
  spellSlots?: boolean // For spellcasting subclasses
}

export interface Subclass2024 {
  id: string
  classId: CharacterClass
  name: string
  description: string
  features: SubclassFeature[]
  spellcasting?: {
    ability: 'int' | 'wis' | 'cha'
    casterType: 'full' | 'half' | 'third'
  }
}

// ── Barbarian Subclasses ───────────────────────────────────────────────────

const BARBARIAN_SUBCLASSES: Subclass2024[] = [
  {
    id: 'berserker',
    classId: 'Barbarian',
    name: 'Path of the Berserker',
    description: 'Fueled by fury and bloodlust, you embrace the reckless spirit of the savage berserker.',
    features: [
      {
        level: 3,
        name: 'Frenzy',
        description: 'When you use Reckless Attack while your Rage is active, you can make one melee weapon attack as a Bonus Action on your turn.',
      },
      {
        level: 6,
        name: 'Mindless Rage',
        description: 'While your Rage is active, you can\'t be Charmed or Frightened.',
      },
      {
        level: 10,
        name: 'Intimidating Presence',
        description: 'As an Action, you can frighten a creature within 30 feet. The creature must succeed on a Wisdom saving throw or be Frightened until the end of your next turn.',
      },
      {
        level: 14,
        name: 'Retaliation',
        description: 'When you take damage from a creature within 5 feet of you, you can use your Reaction to make a melee weapon attack against that creature.',
      },
    ],
  },
  {
    id: 'wild-magic',
    classId: 'Barbarian',
    name: 'Path of Wild Magic',
    description: 'The primal magic roiling within you sometimes erupts from you in wild surges.',
    features: [
      {
        level: 3,
        name: 'Magic Awareness',
        description: 'As a Bonus Action, you can open your awareness to detect magic within 60 feet. You know the location of any magical effect or spellcaster.',
      },
      {
        level: 3,
        name: 'Wild Surge',
        description: 'When you enter your Rage, roll on the Wild Magic table to determine the magical effect that occurs.',
      },
      {
        level: 6,
        name: 'Bolstering Magic',
        description: 'As an Action, you can touch one creature and give it a bonus. Roll a d3. The creature adds the number rolled to the next attack roll or saving throw it makes within the next 10 minutes.',
        uses: 3,
        restType: 'long',
      },
      {
        level: 10,
        name: 'Unstable Backlash',
        description: 'When you are damaged by a creature while your Rage is active, you can use your Reaction to roll on the Wild Magic table.',
      },
      {
        level: 14,
        name: 'Controlled Surge',
        description: 'When you roll on the Wild Magic table, you can roll twice and choose which effect occurs.',
      },
    ],
  },
  {
    id: 'world-tree',
    classId: 'Barbarian',
    name: 'Path of the World Tree',
    description: 'You draw power from the cosmic tree that connects all worlds.',
    features: [
      {
        level: 3,
        name: 'Vitality of the World Tree',
        description: 'When you enter your Rage, spectral branches sprout from you. You gain Temporary Hit Points equal to your Barbarian level, and at the start of each of your turns while your Rage is active, you gain 5 Temporary Hit Points.',
      },
      {
        level: 3,
        name: 'Branches of the World Tree',
        description: 'When you enter your Rage, you can choose one damage type: Acid, Cold, Fire, Lightning, or Poison. Your melee weapon attacks deal an extra 1d6 damage of the chosen type while your Rage is active.',
      },
      {
        level: 6,
        name: 'Battering Roots',
        description: 'When you hit a creature with a melee weapon attack while your Rage is active, you can push the creature up to 10 feet away from you.',
      },
      {
        level: 10,
        name: 'Travel Along the Tree',
        description: 'You can teleport up to 60 feet to an unoccupied space you can see. You can use this feature a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
        uses: 3,
        restType: 'long',
      },
      {
        level: 14,
        name: 'Fruit of the World Tree',
        description: 'When you would drop to 0 Hit Points while your Rage is active, you can drop to 1 Hit Point instead and regain Hit Points equal to half your Barbarian level. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
      },
    ],
  },
  {
    id: 'zealot',
    classId: 'Barbarian',
    name: 'Path of the Zealot',
    description: 'Your rage is fueled by divine fury and devotion to a higher power.',
    features: [
      {
        level: 3,
        name: 'Divine Fury',
        description: 'While your Rage is active, the first creature you hit on each of your turns with a weapon attack takes extra damage equal to 1d6 + half your Barbarian level. The damage is Necrotic or Radiant; you choose the type of damage when you gain this feature.',
      },
      {
        level: 3,
        name: 'Warrior of the Gods',
        description: 'A Zealot can be returned from the dead by any spell that returns the dead to life, and it doesn\'t require Material components.',
      },
      {
        level: 6,
        name: 'Fanatical Focus',
        description: 'If you fail a saving throw while your Rage is active, you can reroll it. If you do so, you must use the new roll.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 10,
        name: 'Zealous Presence',
        description: 'As a Bonus Action, you unleash a battle cry that grants Advantage on attack rolls and saving throws to up to 10 creatures within 60 feet for 1 minute. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 14,
        name: 'Rage Beyond Death',
        description: 'While your Rage is active, having 0 Hit Points doesn\'t knock you Unconscious. You still must make death saving throws, and you suffer the normal effects of taking damage while at 0 Hit Points. However, if you would die due to failing death saving throws, you don\'t die until your Rage ends.',
      },
    ],
  },
]

// ── Bard Subclasses ────────────────────────────────────────────────────────

const BARD_SUBCLASSES: Subclass2024[] = [
  {
    id: 'eloquence',
    classId: 'Bard',
    name: 'College of Eloquence',
    description: 'You master the art of oratory and persuasion.',
    features: [
      {
        level: 3,
        name: 'Silver Tongue',
        description: 'You can treat a d20 roll of 9 or lower as a 10 when making a Charisma (Deception) or Charisma (Persuasion) check.',
      },
      {
        level: 3,
        name: 'Unsettling Words',
        description: 'As a Bonus Action, you can expend one use of Bardic Inspiration to choose one creature you can see within 60 feet. Roll the Bardic Inspiration die. The creature must subtract the number rolled from the next saving throw it makes before the start of your next turn.',
      },
      {
        level: 6,
        name: 'Unfailing Inspiration',
        description: 'When a creature adds one of your Bardic Inspiration dice to its ability check, attack roll, or saving throw and the roll fails, the creature can keep the Bardic Inspiration die.',
      },
      {
        level: 6,
        name: 'Universal Speech',
        description: 'You can magically communicate with any creature that knows at least one language. This lasts for 1 hour. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 14,
        name: 'Infectious Inspiration',
        description: 'When you use Bardic Inspiration, you can target a second creature within 60 feet of you.',
      },
    ],
  },
  {
    id: 'glamour',
    classId: 'Bard',
    name: 'College of Glamour',
    description: 'You weave magic that taps into the fears and desires of others.',
    features: [
      {
        level: 3,
        name: 'Mantle of Inspiration',
        description: 'As a Bonus Action, you can expend one use of Bardic Inspiration to surround yourself with a magical mantle. You and each creature of your choice within 60 feet gain Temporary Hit Points equal to your Bard level + your Charisma modifier.',
      },
      {
        level: 3,
        name: 'Enthralling Performance',
        description: 'If you perform for at least 1 minute, you can attempt to inspire wonder in your audience. Make a Charisma (Performance) check contested by the audience\'s Wisdom (Insight). If you succeed, the target is Charmed by you for 1 hour.',
      },
      {
        level: 6,
        name: 'Mantle of Majesty',
        description: 'As a Bonus Action, you cast Command without expending a spell slot. You can use this feature a number of times equal to your Charisma modifier, and regain all uses when you finish a Long Rest.',
        uses: 3,
        restType: 'long',
      },
      {
        level: 14,
        name: 'Unbreakable Majesty',
        description: 'As a Bonus Action, you assume a magically majestic presence. For 1 minute, whenever a creature attempts to attack you for the first time on a turn, it must make a Charisma saving throw or target another creature instead.',
        uses: 1,
        restType: 'short',
      },
    ],
  },
  {
    id: 'lore',
    classId: 'Bard',
    name: 'College of Lore',
    description: 'You gather secrets and knowledge from far and wide.',
    features: [
      {
        level: 3,
        name: 'Bonus Proficiencies',
        description: 'You gain proficiency with three skills of your choice.',
      },
      {
        level: 3,
        name: 'Cutting Words',
        description: 'When a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, you can use your Reaction to expend one use of Bardic Inspiration. Roll the die and subtract the number from the creature\'s roll.',
      },
      {
        level: 6,
        name: 'Magical Discoveries',
        description: 'You learn two spells of your choice from any class list. These count as Bard spells for you.',
      },
      {
        level: 14,
        name: 'Peerless Skill',
        description: 'When you make an ability check, you can expend one use of Bardic Inspiration. Roll the die and add the number to your ability check.',
      },
    ],
  },
  {
    id: 'valor',
    classId: 'Bard',
    name: 'College of Valor',
    description: 'You use your musical talents to inspire courage on the battlefield.',
    features: [
      {
        level: 3,
        name: 'Bonus Proficiencies',
        description: 'You gain proficiency with Medium Armor, Shields, and Martial weapons.',
      },
      {
        level: 3,
        name: 'Combat Inspiration',
        description: 'A creature that has a Bardic Inspiration die from you can use it in new ways: add to AC against an attack, or add to damage roll.',
      },
      {
        level: 6,
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
      },
      {
        level: 14,
        name: 'Battle Magic',
        description: 'You have learned to weave magic into your combat techniques. After you cast a Bard spell, you can make one weapon attack as a Bonus Action.',
      },
    ],
  },
]

// ── Cleric Subclasses ──────────────────────────────────────────────────────

const CLERIC_SUBCLASSES: Subclass2024[] = [
  {
    id: 'life-domain',
    classId: 'Cleric',
    name: 'Life Domain',
    description: 'You focus on the preservation of life and vitality.',
    features: [
      {
        level: 1,
        name: 'Disciple of Life',
        description: 'Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell\'s level.',
      },
      {
        level: 2,
        name: 'Preserve Life',
        description: 'As an Action, you can present your holy symbol and evoke healing energy that can restore 5 times your Cleric level in hit points. Choose creatures within 30 feet, dividing the hit points among them. This feature can restore a creature to no more than half its hit point maximum.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 6,
        name: 'Blessed Healer',
        description: 'The healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell\'s level.',
      },
      {
        level: 8,
        name: 'Divine Strike',
        description: 'Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 Radiant damage to the target.',
      },
      {
        level: 17,
        name: 'Supreme Healing',
        description: 'When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die.',
      },
    ],
  },
  {
    id: 'light-domain',
    classId: 'Cleric',
    name: 'Light Domain',
    description: 'You channel the power of light to banish darkness and evil.',
    features: [
      {
        level: 1,
        name: 'Warding Flare',
        description: 'When a creature you can see attacks you or a creature within 30 feet of you, you can use your Reaction to impose Disadvantage on the attack roll. You can use this feature a number of times equal to your Wisdom modifier, and regain all uses when you finish a Long Rest.',
        uses: 3,
        restType: 'long',
      },
      {
        level: 2,
        name: 'Radiance of the Dawn',
        description: 'As an Action, you can dispel magical darkness and deal Radiant damage to creatures within 30 feet. Each creature must make a Constitution saving throw or take 2d10 + your Cleric level Radiant damage.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 6,
        name: 'Improved Flare',
        description: 'You can also use Warding Flare when a creature you can see attacks a creature other than you within 30 feet of you.',
      },
      {
        level: 8,
        name: 'Divine Strike',
        description: 'Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 Radiant damage to the target.',
      },
      {
        level: 17,
        name: 'Corona of Light',
        description: 'As an Action, you can emit bright light in a 60-foot radius and dim light 30 feet beyond that for 1 minute. Enemies in the bright light have Disadvantage on saving throws against spells that deal Fire or Radiant damage.',
      },
    ],
  },
  {
    id: 'trickery-domain',
    classId: 'Cleric',
    name: 'Trickery Domain',
    description: 'You serve a deity of mischief and deception.',
    features: [
      {
        level: 1,
        name: 'Blessing of the Trickster',
        description: 'As an Action, you can choose one creature within 30 feet, including yourself. The creature has Advantage on Dexterity (Stealth) checks. This blessing lasts for 1 hour or until you use this feature again.',
      },
      {
        level: 2,
        name: 'Invoke Duplicity',
        description: 'As an Action, you create a perfect illusion of yourself that lasts for 1 minute. You can move the illusion up to 30 feet as a Bonus Action. You can cast spells as if you were in the illusion\'s space.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 6,
        name: 'Improved Duplicity',
        description: 'You can now create up to four duplicates of yourself with Invoke Duplicity.',
      },
      {
        level: 8,
        name: 'Divine Strike',
        description: 'Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 Poison damage to the target.',
      },
      {
        level: 17,
        name: 'Improved Invoke Duplicity',
        description: 'You and your duplicates can use your Reaction to teleport up to 30 feet to the space of another duplicate when you take damage.',
      },
    ],
  },
  {
    id: 'war-domain',
    classId: 'Cleric',
    name: 'War Domain',
    description: 'You are a champion of divine war and martial prowess.',
    features: [
      {
        level: 1,
        name: 'War Priest',
        description: 'When you use the Attack action, you can make one weapon attack as a Bonus Action. You can use this feature a number of times equal to your Wisdom modifier, and regain all uses when you finish a Long Rest.',
        uses: 3,
        restType: 'long',
      },
      {
        level: 2,
        name: 'Guided Strike',
        description: 'When you make an attack roll, you can add +10 to the roll. You can use this feature once per Short or Long Rest.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 6,
        name: 'War God\'s Blessing',
        description: 'When a creature within 30 feet makes an attack roll, you can use your Reaction to grant a +10 bonus to the roll.',
      },
      {
        level: 8,
        name: 'Divine Strike',
        description: 'Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type as the weapon.',
      },
      {
        level: 17,
        name: 'Avatar of Battle',
        description: 'You gain Resistance to Bludgeoning, Piercing, and Slashing damage from nonmagical attacks.',
      },
    ],
  },
]

// ── Druid Subclasses ───────────────────────────────────────────────────────

const DRUID_SUBCLASSES: Subclass2024[] = [
  {
    id: 'circle-of-the-land',
    classId: 'Druid',
    name: 'Circle of the Land',
    description: 'You draw power from the natural world around you.',
    features: [
      {
        level: 2,
        name: 'Natural Recovery',
        description: 'Once per day during a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to or less than half your Druid level (rounded up), and none can be 6th level or higher.',
      },
      {
        level: 2,
        name: 'Land\'s Aid',
        description: 'As a Bonus Action, you can expend a use of Wild Shape to call upon the spirits of nature. Each creature of your choice within 15 feet must make a Strength saving throw or take Cold, Fire, Lightning, or Thunder damage (your choice) and be knocked Prone.',
      },
      {
        level: 6,
        name: 'Land\'s Stride',
        description: 'Moving through nonmagical Difficult Terrain costs you no extra movement. You also have Advantage on saving throws against spells or magical effects that would impede your movement.',
      },
      {
        level: 10,
        name: 'Nature\'s Ward',
        description: 'You are immune to Poison and Disease. You also gain Resistance to one damage type based on your chosen land.',
      },
      {
        level: 14,
        name: 'Nature\'s Sanctuary',
        description: 'Creatures of the natural world sense your connection to nature and become hesitant to attack you. When a Beast or Plant attacks you, it must make a Wisdom saving throw. On a failed save, the creature must choose a different target.',
      },
    ],
  },
  {
    id: 'circle-of-the-moon',
    classId: 'Druid',
    name: 'Circle of the Moon',
    description: 'You embrace the transformative power of Wild Shape.',
    features: [
      {
        level: 2,
        name: 'Combat Wild Shape',
        description: 'You can use Wild Shape as a Bonus Action, and you can transform into beasts with a Challenge Rating of 1.',
      },
      {
        level: 2,
        name: 'Lunar Healing',
        description: 'While in Wild Shape, you can use a Bonus Action to expend a spell slot to regain 1d8 hit points per level of the spell slot expended.',
      },
      {
        level: 6,
        name: 'Improved Wild Shape',
        description: 'You can transform into beasts with a Challenge Rating equal to your Druid level divided by 3 (rounded down).',
      },
      {
        level: 10,
        name: 'Elemental Wild Shape',
        description: 'You can expend two uses of Wild Shape at the same time to transform into an Air Elemental, Earth Elemental, Fire Elemental, or Water Elemental.',
      },
      {
        level: 14,
        name: 'Thousand Forms',
        description: 'You can cast Alter Self at will, without expending a spell slot.',
      },
    ],
  },
  {
    id: 'circle-of-the-sea',
    classId: 'Druid',
    name: 'Circle of the Sea',
    description: 'You draw power from the boundless oceans and waterways.',
    features: [
      {
        level: 2,
        name: 'Wrath of the Sea',
        description: 'As a Bonus Action, you can expend a use of Wild Shape to manifest a 5-foot Emanation of spectral seawater. It lasts for 1 minute. Once per turn, when you hit a creature in the Emanation, you can force it to make a Strength saving throw or take Cold damage and be pushed up to 15 feet away.',
      },
      {
        level: 2,
        name: 'Aquatic Affinity',
        description: 'You gain a Swim Speed equal to your Speed and can breathe air and water.',
      },
      {
        level: 6,
        name: 'Stormborn',
        description: 'You gain Resistance to Lightning and Thunder damage.',
      },
      {
        level: 10,
        name: 'Oceanic Gift',
        description: 'You can cast Water Breathing without expending a spell slot. You can also cast Control Water once per Long Rest.',
      },
      {
        level: 14,
        name: 'Depths of the Ocean',
        description: 'When you use Wrath of the Sea, the Emanation extends to 10 feet. In addition, creatures have Disadvantage on the saving throw against it.',
      },
    ],
  },
  {
    id: 'circle-of-the-stars',
    classId: 'Druid',
    name: 'Circle of the Stars',
    description: 'You draw power from the celestial bodies above.',
    features: [
      {
        level: 2,
        name: 'Star Map',
        description: 'You create a Star Map, a Tiny object that can be used as a spellcasting focus. While holding the map, you know the Guidance cantrip and have Advantage on Intelligence (Arcana) and Intelligence (Nature) checks.',
      },
      {
        level: 2,
        name: 'Starry Form',
        description: 'As a Bonus Action, you can expend a use of Wild Shape to take on a starry form. You gain a new form: Archer, Chalice, or Dragon. Each form grants different benefits.',
      },
      {
        level: 6,
        name: 'Cosmic Omen',
        description: 'When you finish a Long Rest, you can consult your Star Map for omens. Roll a die. Until your next Long Rest, you can use your Reaction to add or subtract the number rolled from one attack roll, saving throw, or ability check made by a creature within 30 feet.',
      },
      {
        level: 10,
        name: 'Twinkling Constellations',
        description: 'Your Starry Form improves. Archer: attacks deal extra damage. Chalice: healing also grants Temporary Hit Points. Dragon: can fly and deal extra damage.',
      },
      {
        level: 14,
        name: 'Full of Stars',
        description: 'While in Starry Form, you are partially incorporeal and have Resistance to Bludgeoning, Piercing, and Slashing damage.',
      },
    ],
  },
]

// ── Fighter Subclasses ─────────────────────────────────────────────────────

const FIGHTER_SUBCLASSES: Subclass2024[] = [
  {
    id: 'battle-master',
    classId: 'Fighter',
    name: 'Battle Master',
    description: 'You are a master of martial maneuvers and combat tactics.',
    features: [
      {
        level: 3,
        name: 'Combat Superiority',
        description: 'You learn three maneuvers of your choice. You gain Superiority Dice (d8s) equal to your Proficiency Bonus. You regain all expended dice when you finish a Short or Long Rest.',
        uses: 4,
        restType: 'short',
      },
      {
        level: 3,
        name: 'Student of War',
        description: 'You gain proficiency with one type of Artisan\'s Tools of your choice.',
      },
      {
        level: 7,
        name: 'Know Your Enemy',
        description: 'If you spend at least 1 minute observing or interacting with a creature, you learn certain information about its capabilities compared to your own.',
      },
      {
        level: 10,
        name: 'Improved Combat Superiority',
        description: 'Your Superiority Dice turn into d10s.',
      },
      {
        level: 15,
        name: 'Relentless',
        description: 'When you roll Initiative and have no Superiority Dice remaining, you regain one Superiority Die.',
      },
      {
        level: 18,
        name: 'Supreme Combat Superiority',
        description: 'Your Superiority Dice turn into d12s.',
      },
    ],
  },
  {
    id: 'champion',
    classId: 'Fighter',
    name: 'Champion',
    description: 'You focus on raw physical power and honed combat skill.',
    features: [
      {
        level: 3,
        name: 'Improved Critical',
        description: 'Your weapon attacks score a Critical Hit on a roll of 19 or 20.',
      },
      {
        level: 3,
        name: 'Remarkable Athlete',
        description: 'Add half your Proficiency Bonus (round up) to any Strength, Dexterity, or Constitution check that doesn\'t already use your Proficiency Bonus.',
      },
      {
        level: 7,
        name: 'Additional Fighting Style',
        description: 'You choose a second Fighting Style.',
      },
      {
        level: 10,
        name: 'Improved Critical (Improved)',
        description: 'Your weapon attacks score a Critical Hit on a roll of 18-20.',
      },
      {
        level: 15,
        name: 'Superior Critical',
        description: 'Your weapon attacks score a Critical Hit on a roll of 18-20.',
      },
      {
        level: 18,
        name: 'Survivor',
        description: 'You attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left.',
      },
    ],
  },
  {
    id: 'eldritch-knight',
    classId: 'Fighter',
    name: 'Eldritch Knight',
    description: 'You blend martial prowess with arcane magic.',
    features: [
      {
        level: 3,
        name: 'Spellcasting',
        description: 'You learn to cast spells. You know 2 cantrips and 3 1st-level spells from the Wizard spell list. You can replace spells when you level up.',
      },
      {
        level: 3,
        name: 'Weapon Bond',
        description: 'You learn a ritual that creates a magical bond between you and one weapon. You can\'t be disarmed of that weapon unless you are Incapacitated. You can also summon the weapon to your hand as a Bonus Action.',
      },
      {
        level: 7,
        name: 'War Magic',
        description: 'When you use your Action to cast a cantrip, you can make one weapon attack as a Bonus Action.',
      },
      {
        level: 10,
        name: 'Eldritch Strike',
        description: 'When you hit a creature with a weapon attack, that creature has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.',
      },
      {
        level: 15,
        name: 'Improved War Magic',
        description: 'When you use your Action to cast a spell, you can make one weapon attack as a Bonus Action.',
      },
      {
        level: 18,
        name: 'Improved Weapon Bond',
        description: 'You can have up to two bonded weapons. You can\'t be disarmed of either while conscious, and you can summon both as a Bonus Action.',
      },
    ],
    spellcasting: {
      ability: 'int',
      casterType: 'third',
    },
  },
  {
    id: 'psi-warrior',
    classId: 'Fighter',
    name: 'Psi Warrior',
    description: 'You wield psionic power in combat.',
    features: [
      {
        level: 3,
        name: 'Psionic Power',
        description: 'You have Psionic Energy dice (d6s) equal to twice your Proficiency Bonus. You regain all expended dice when you finish a Long Rest. You can use these dice for Protective Field and Psi-Powered Leap.',
        uses: 4,
        restType: 'long',
      },
      {
        level: 3,
        name: 'Protective Field',
        description: 'When you or another creature you can see within 30 feet takes damage, you can use your Reaction to expend one Psionic Energy die and reduce the damage by the number rolled + your Intelligence modifier.',
      },
      {
        level: 3,
        name: 'Psi-Powered Leap',
        description: 'As a Bonus Action, you can expend one Psionic Energy die to jump up to 20 feet horizontally or vertically.',
      },
      {
        level: 7,
        name: 'Telekinetic Adept',
        description: 'You gain two new ways to use your Psionic Energy: Telekinetic Strike and Force Push.',
      },
      {
        level: 10,
        name: 'Guarded Mind',
        description: 'You have Resistance to Psychic damage. You also have Advantage on saving throws against being Charmed or Frightened.',
      },
      {
        level: 15,
        name: 'Bulwark of Force',
        description: 'As a Bonus Action, you can choose creatures within 30 feet. Each gains Resistance to Bludgeoning, Piercing, and Slashing damage for 1 minute.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 18,
        name: 'Telekinetic Master',
        description: 'You can cast Telekinesis without components. Once you do so, you can\'t do so again until you finish a Long Rest.',
      },
    ],
  },
]

// ── Monk Subclasses ────────────────────────────────────────────────────────

const MONK_SUBCLASSES: Subclass2024[] = [
  {
    id: 'mercy',
    classId: 'Monk',
    name: 'Way of Mercy',
    description: 'You manipulate the life force of others to harm or heal.',
    features: [
      {
        level: 3,
        name: 'Hand of Healing',
        description: 'As a Bonus Action, you can spend 1 Focus Point to touch a creature and restore hit points equal to 1d4 + your Wisdom modifier.',
      },
      {
        level: 3,
        name: 'Hand of Harm',
        description: 'When you use Flurry of Blows and hit a creature, you can spend 1 Focus Point to deal extra Necrotic damage equal to 1d4 + your Wisdom modifier.',
      },
      {
        level: 6,
        name: 'Physician\'s Touch',
        description: 'When you use Hand of Healing, you can also end one disease or condition affecting the creature. When you use Hand of Harm, the target is Poisoned until the end of your next turn.',
      },
      {
        level: 11,
        name: 'Flurry of Healing and Harm',
        description: 'When you use Flurry of Blows, you can replace each attack with Hand of Healing (no Focus Point required) or you can use Hand of Harm with each attack without spending a Focus Point.',
      },
      {
        level: 17,
        name: 'Hand of Ultimate Mercy',
        description: 'You can revive a creature that died within the past 24 hours. It returns to life with 4d10 + your Wisdom modifier hit points. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'shadow',
    classId: 'Monk',
    name: 'Way of Shadow',
    description: 'You manipulate darkness and use stealth to your advantage.',
    features: [
      {
        level: 3,
        name: 'Shadow Arts',
        description: 'You can use Focus Points to duplicate certain spells: Darkness, Darkvision, Pass without Trace, or Silence (2 points each).',
      },
      {
        level: 3,
        name: 'Shadow Step',
        description: 'As a Bonus Action, you can teleport up to 60 feet to an unoccupied space you can see that is in Dim Light or Darkness. You then have Advantage on the next melee attack you make before the end of your turn.',
      },
      {
        level: 6,
        name: 'Improved Shadow Step',
        description: 'When you use Shadow Step, you can bring one willing creature within 5 feet of you. The creature teleports with you.',
      },
      {
        level: 11,
        name: 'Cloak of Shadows',
        description: 'When you are in Dim Light or Darkness, you can use your Action to become Invisible for 1 minute or until you attack, cast a spell, or enter Bright Light.',
      },
      {
        level: 17,
        name: 'Improved Shadow Arts',
        description: 'When you use Shadow Arts to cast Darkness, Darkvision, Pass without Trace, or Silence, you can spend additional Focus Points to cast it without concentration.',
      },
    ],
  },
  {
    id: 'elements',
    classId: 'Monk',
    name: 'Way of the Elements',
    description: 'You manipulate the elemental forces of nature.',
    features: [
      {
        level: 3,
        name: 'Elemental Attunement',
        description: 'You can control the elements in minor ways: create a harmless elemental effect, light or extinguish a flame, chill or warm up to 1 pound of material, or shape earth or water.',
      },
      {
        level: 3,
        name: 'Elemental Disciplines',
        description: 'You learn elemental disciplines that harness your ki. You know Fangs of the Fire Snake, Fist of Four Thunders, Fist of Unbroken Air, Rush of the Gale Spirits, Shape the Flowing River, Sweeping Cinder Strike, Water Whip, and Wave of Rolling Earth.',
      },
      {
        level: 6,
        name: 'Improved Elemental Disciplines',
        description: 'Your elemental disciplines improve and you learn new ones.',
      },
      {
        level: 11,
        name: 'Elemental Mastery',
        description: 'When you use an elemental discipline, you can spend additional Focus Points to increase the effect.',
      },
      {
        level: 17,
        name: 'Avatar of the Elements',
        description: 'You gain Resistance to one damage type of your choice: Acid, Cold, Fire, Lightning, or Thunder. You can change this when you finish a Long Rest.',
      },
    ],
  },
  {
    id: 'hand',
    classId: 'Monk',
    name: 'Way of the Open Hand',
    description: 'You master the art of manipulating your opponent\'s energy.',
    features: [
      {
        level: 3,
        name: 'Open Hand Technique',
        description: 'When you hit a creature with Flurry of Blows, you can impose one of the following effects: knock Prone, push 15 feet away, or prevent Reactions until the end of your next turn.',
      },
      {
        level: 6,
        name: 'Wholeness of Body',
        description: 'As a Bonus Action, you can regain hit points equal to 3 times your Monk level. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 11,
        name: 'Tranquility',
        description: 'At the end of a Long Rest, you gain the effect of a Sanctuary spell that lasts until the start of your next Long Rest.',
      },
      {
        level: 17,
        name: 'Quivering Palm',
        description: 'When you hit a creature with an unarmed strike, you can spend 4 Focus Points to start imperceptible vibrations in the creature\'s body. The vibrations last for a number of days equal to your Monk level. You can use an Action to end the vibrations, forcing the creature to make a Constitution saving throw. On a failed save, it is reduced to 0 hit points. On a success, it takes 10d10 Necrotic damage.',
      },
    ],
  },
]

// ── Paladin Subclasses ─────────────────────────────────────────────────────

const PALADIN_SUBCLASSES: Subclass2024[] = [
  {
    id: 'ancients',
    classId: 'Paladin',
    name: 'Oath of the Ancients',
    description: 'You swear to preserve the light of joy and hope in the world.',
    features: [
      {
        level: 3,
        name: 'Channel Divinity: Nature\'s Wrath',
        description: 'As an Action, you can cause spectral vines to spring up and reach for a creature within 15 feet. The creature must succeed on a Strength or Dexterity saving throw or be Restrained for 1 minute.',
      },
      {
        level: 3,
        name: 'Channel Divinity: Rebuke the Violent',
        description: 'When a creature within 30 feet damages another creature, you can use your Reaction to force the attacker to make a Wisdom saving throw. On a failed save, the attacker takes Radiant damage equal to the damage it just dealt.',
      },
      {
        level: 7,
        name: 'Aura of Warding',
        description: 'You and friendly creatures within 10 feet have Resistance to damage from spells.',
      },
      {
        level: 15,
        name: 'Undying Sentinel',
        description: 'When you would be reduced to 0 hit points, you can choose to drop to 1 hit point instead. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
      },
      {
        level: 20,
        name: 'Elder Champion',
        description: 'As a Bonus Action, you can assume the form of an ancient nature champion for 1 minute. You regain 10 hit points at the start of each of your turns, you can cast spells that normally take an Action as a Bonus Action, and enemies within 10 feet have Disadvantage on saving throws against your spells and Channel Divinity options.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'devotion',
    classId: 'Paladin',
    name: 'Oath of Devotion',
    description: 'You swear to uphold justice and virtue.',
    features: [
      {
        level: 3,
        name: 'Channel Divinity: Sacred Weapon',
        description: 'As a Bonus Action, you can imbue one weapon you hold with positive energy for 1 minute. You add your Charisma modifier to attack rolls with that weapon, and it emits Bright Light in a 20-foot radius and Dim Light 20 feet beyond that.',
      },
      {
        level: 3,
        name: 'Channel Divinity: Turn the Unholy',
        description: 'As an Action, you present your holy symbol and speak a prayer censuring Fiends and Undead. Each Fiend or Undead within 30 feet must make a Wisdom saving throw or be Turned for 1 minute.',
      },
      {
        level: 7,
        name: 'Aura of Devotion',
        description: 'You and friendly creatures within 10 feet can\'t be Charmed.',
      },
      {
        level: 15,
        name: 'Purity of Spirit',
        description: 'You are always under the effects of Protection from Evil and Good.',
      },
      {
        level: 20,
        name: 'Holy Nimbus',
        description: 'As a Bonus Action, you can emanate an aura of sunlight for 1 minute. You shed Bright Light in a 30-foot radius and Dim Light 30 feet beyond that. Enemies in the Bright Light take 10 Radiant damage at the start of their turns. You have Advantage on saving throws against spells cast by Fiends or Undead.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'vengeance',
    classId: 'Paladin',
    name: 'Oath of Vengeance',
    description: 'You swear to punish those who have committed grievous sins.',
    features: [
      {
        level: 3,
        name: 'Channel Divinity: Abjure Enemy',
        description: 'As an Action, you present your holy symbol and speak a word of denunciation. One creature within 60 feet must make a Wisdom saving throw or be Frightened for 1 minute.',
      },
      {
        level: 3,
        name: 'Channel Divinity: Vow of Enmity',
        description: 'As a Bonus Action, you can utter a vow of enmity against a creature you can see within 10 feet. You have Advantage on attack rolls against the creature for 1 minute.',
      },
      {
        level: 7,
        name: 'Relentless Avenger',
        description: 'When you hit a creature with an Opportunity Attack, you can move up to half your speed immediately after the attack as part of the same Reaction.',
      },
      {
        level: 15,
        name: 'Soul of Vengeance',
        description: 'When the target of your Vow of Enmity makes an attack, you can use your Reaction to make a melee weapon attack against it.',
      },
      {
        level: 20,
        name: 'Avenging Angel',
        description: 'As a Bonus Action, you sprout spectral wings for 1 hour. You gain a flying speed of 60 feet. Enemies within 30 feet have Disadvantage on saving throws against your spells and Channel Divinity. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'oathbreaker',
    classId: 'Paladin',
    name: 'Oathbreaker',
    description: 'You have broken your sacred oath and embrace dark power.',
    features: [
      {
        level: 3,
        name: 'Channel Divinity: Control Undead',
        description: 'As an Action, you target one Undead creature you can see within 30 feet. The target must make a Wisdom saving throw or be Charmed by you.',
      },
      {
        level: 3,
        name: 'Channel Divinity: Dreadful Aspect',
        description: 'As an Action, you can cause each creature within 30 feet to make a Wisdom saving throw. On a failed save, a creature is Frightened of you for 1 minute.',
      },
      {
        level: 7,
        name: 'Aura of Hate',
        description: 'You and any Fiends or Undead within 10 feet gain a bonus to melee weapon damage rolls equal to your Charisma modifier.',
      },
      {
        level: 15,
        name: 'Supernatural Resistance',
        description: 'You have Resistance to Bludgeoning, Piercing, and Slashing damage from nonmagical attacks.',
      },
      {
        level: 20,
        name: 'Dread Lord',
        description: 'As an Action, you surround yourself with an aura of gloom for 1 minute. The aura reduces Bright Light to Dim Light in a 30-foot radius. Hostile creatures in the aura have Disadvantage on saving throws against your spells and Channel Divinity.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
]

// ── Ranger Subclasses ──────────────────────────────────────────────────────

const RANGER_SUBCLASSES: Subclass2024[] = [
  {
    id: 'beast-master',
    classId: 'Ranger',
    name: 'Beast Master',
    description: 'You form a powerful bond with a beast companion.',
    features: [
      {
        level: 3,
        name: 'Ranger\'s Companion',
        description: 'You gain a beast companion that accompanies you and obeys your commands. Choose a beast with a Challenge Rating of 1/4 or lower. Your companion uses your Proficiency Bonus instead of its own.',
      },
      {
        level: 5,
        name: 'Coordinated Attack',
        description: 'When you use the Attack action, your companion can use its Reaction to make a melee attack.',
      },
      {
        level: 9,
        name: 'Beast\'s Defense',
        description: 'When your companion is hit by an attack, you can use your Reaction to give it Advantage on the saving throw or impose Disadvantage on the attack roll.',
      },
      {
        level: 13,
        name: 'Storm of Claws and Fangs',
        description: 'Your companion can use its Action to make melee attacks against each creature of its choice within 5 feet, with a separate attack roll for each target.',
      },
      {
        level: 17,
        name: 'Superior Companion',
        description: 'Your companion gains Multiattack if it doesn\'t have it, or one additional attack if it does.',
      },
    ],
  },
  {
    id: 'fey-wanderer',
    classId: 'Ranger',
    name: 'Fey Wanderer',
    description: 'You are touched by the magic of the Feywild.',
    features: [
      {
        level: 3,
        name: 'Dreadful Strikes',
        description: 'When you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage.',
      },
      {
        level: 3,
        name: 'Fey Presence',
        description: 'You have Advantage on saving throws against being Charmed or Frightened, and magic can\'t put you to sleep.',
      },
      {
        level: 5,
        name: 'Beguiling Twist',
        description: 'When a creature fails a saving throw against being Charmed or Frightened, you can use your Reaction to force a different creature within 120 feet to make a Wisdom saving throw or be Charmed or Frightened for 1 minute.',
      },
      {
        level: 9,
        name: 'Fey Reinforcements',
        description: 'You can cast Summon Fey without a material component. Once you do so, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 13,
        name: 'Misty Wanderer',
        description: 'You can cast Misty Step a number of times equal to your Wisdom modifier, and regain all uses when you finish a Long Rest.',
        uses: 3,
        restType: 'long',
      },
    ],
  },
  {
    id: 'gloom-stalker',
    classId: 'Ranger',
    name: 'Gloom Stalker',
    description: 'You excel at hunting in the shadows.',
    features: [
      {
        level: 3,
        name: 'Dread Ambusher',
        description: 'At the start of your first turn in combat, your walking speed increases by 10 feet, and you can make one additional weapon attack as part of the Attack action. If that attack hits, the target takes an extra 1d8 damage.',
      },
      {
        level: 3,
        name: 'Umbral Sight',
        description: 'You gain Darkvision out to 60 feet. If you already have Darkvision, its range increases by 30 feet. You are also invisible to any creature that relies on Darkvision to see you.',
      },
      {
        level: 5,
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
      },
      {
        level: 9,
        name: 'Iron Mind',
        description: 'You have proficiency in Wisdom saving throws. If you already have this proficiency, you gain proficiency in Intelligence or Charisma saving throws.',
      },
      {
        level: 13,
        name: 'Stalker\'s Flurry',
        description: 'Once on each of your turns when you miss with a weapon attack, you can make another weapon attack.',
      },
      {
        level: 17,
        name: 'Shadowy Dodge',
        description: 'When a creature attacks you without Advantage, you can use your Reaction to impose Disadvantage on the attack roll.',
      },
    ],
  },
  {
    id: 'hunter',
    classId: 'Ranger',
    name: 'Hunter',
    description: 'You are a master of the hunt.',
    features: [
      {
        level: 3,
        name: 'Hunter\'s Prey',
        description: 'Choose one: Colossus Slayer (extra 1d8 damage to damaged foes), Giant Killer (Reaction to attack Large+ foe that attacks you), or Horde Breaker (attack second foe within 5 feet).',
      },
      {
        level: 5,
        name: 'Extra Attack',
        description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
      },
      {
        level: 9,
        name: 'Defensive Tactics',
        description: 'Choose one: Escape the Horde (Opportunity Attacks against you have Disadvantage), Multiattack Defense (+4 AC when hit by multiattack), or Steel Will (Advantage on saves vs being Frightened).',
      },
      {
        level: 13,
        name: 'Multiattack',
        description: 'Choose one: Volley (ranged attacks against all within 10-foot radius) or Whirlwind Attack (melee attacks against all within 5 feet).',
      },
      {
        level: 17,
        name: 'Superior Hunter\'s Defense',
        description: 'Choose one: Evasion, Stand Against the Tide, or Uncanny Dodge.',
      },
    ],
  },
]

// ── Rogue Subclasses ───────────────────────────────────────────────────────

const ROGUE_SUBCLASSES: Subclass2024[] = [
  {
    id: 'arcane-trickster',
    classId: 'Rogue',
    name: 'Arcane Trickster',
    description: 'You blend arcane magic with rogue skills.',
    features: [
      {
        level: 3,
        name: 'Spellcasting',
        description: 'You learn to cast spells. You know 2 cantrips and 3 1st-level spells from the Wizard spell list. You can replace spells when you level up.',
      },
      {
        level: 3,
        name: 'Mage Hand Legerdemain',
        description: 'When you cast Mage Hand, you can make it invisible, stow or retrieve objects, use thieves\' tools, or pick pockets.',
      },
      {
        level: 9,
        name: 'Magical Ambush',
        description: 'If you are Hidden when you cast a spell on a creature, the creature has Disadvantage on any saving throw it makes against the spell.',
      },
      {
        level: 13,
        name: 'Versatile Trickster',
        description: 'You gain Advantage on attack rolls against a creature if your Mage Hand is within 5 feet of it.',
      },
      {
        level: 17,
        name: 'Spell Thief',
        description: 'When a creature casts a spell targeting you or including you in its area, you can use your Reaction to force the creature to make a saving throw. On a failed save, the spell fails, the caster can\'t cast it again for 8 hours, and you learn the spell.',
        uses: 1,
        restType: 'long',
      },
    ],
    spellcasting: {
      ability: 'int',
      casterType: 'third',
    },
  },
  {
    id: 'assassin',
    classId: 'Rogue',
    name: 'Assassin',
    description: 'You are a master of infiltration and elimination.',
    features: [
      {
        level: 3,
        name: 'Assassinate',
        description: 'You have Advantage on attack rolls against any creature that hasn\'t taken a turn in combat yet. Any hit you score against a Surprised creature is a Critical Hit.',
      },
      {
        level: 3,
        name: 'Bonus Proficiencies',
        description: 'You gain proficiency with the Disguise Kit and Poisoner\'s Kit.',
      },
      {
        level: 9,
        name: 'Infiltration Expertise',
        description: 'You can create false identities. It takes 7 days and 25 gp to establish a false identity.',
      },
      {
        level: 13,
        name: 'Impostor',
        description: 'You have Advantage on Charisma (Deception) checks if you pretend to be someone else. You can mimic a person\'s speech, writing, and behavior with a DC 15 check.',
      },
      {
        level: 17,
        name: 'Death Strike',
        description: 'When you attack and hit a creature that is Surprised, it must make a Constitution saving throw or take double the damage from your attack.',
      },
    ],
  },
  {
    id: 'soulknife',
    classId: 'Rogue',
    name: 'Soulknife',
    description: 'You strike with blades of psychic energy.',
    features: [
      {
        level: 3,
        name: 'Psychic Blades',
        description: 'When you take the Attack action, you can replace one attack with a psychic blade. It deals 1d6 Psychic damage and has the Finesse, Thrown (20/60), and Hidden properties.',
      },
      {
        level: 3,
        name: 'Psychic Whispers',
        description: 'You can telepathically speak to any creature within 30 feet that knows a language. You can also create a telepathic link with up to your Proficiency Bonus number of willing creatures.',
      },
      {
        level: 9,
        name: 'Soul Blades',
        description: 'Your psychic blades improve. You can make a ranged psychic blade attack as a Bonus Action. You can also add your Psionic Die to attack rolls or teleport to your blade\'s location.',
      },
      {
        level: 13,
        name: 'Psychic Veil',
        description: 'As an Action, you can become invisible for 1 hour. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 17,
        name: 'Rend Mind',
        description: 'When you use your Sneak Attack, you can force the target to make an Intelligence saving throw. On a failed save, the target is Stunned until the end of your next turn.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'thief',
    classId: 'Rogue',
    name: 'Thief',
    description: 'You are a master of speed and stealth.',
    features: [
      {
        level: 3,
        name: 'Fast Hands',
        description: 'You can use your Cunning Action to make a Dexterity (Sleight of Hand) check, use thieves\' tools to disarm a trap or open a lock, or use an object.',
      },
      {
        level: 3,
        name: 'Second-Story Work',
        description: 'You climb at your normal speed, and jumping doesn\'t cost extra movement for you.',
      },
      {
        level: 9,
        name: 'Supreme Sneak',
        description: 'You have Advantage on Dexterity (Stealth) checks if you move no more than half your speed.',
      },
      {
        level: 13,
        name: 'Use Magic Device',
        description: 'You can use magic items even if you aren\'t attuned to them, even if you don\'t meet the class requirements.',
      },
      {
        level: 17,
        name: 'Reflexes',
        description: 'You can take two turns during the first round of any combat. You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.',
      },
    ],
  },
]

// ── Sorcerer Subclasses ────────────────────────────────────────────────────

const SORCERER_SUBCLASSES: Subclass2024[] = [
  {
    id: 'aberrant-sorcery',
    classId: 'Sorcerer',
    name: 'Aberrant Sorcery',
    description: 'You draw power from alien aberrations.',
    features: [
      {
        level: 1,
        name: 'Aberrant Origin',
        description: 'You learn additional spells: Arms of Hadar, Dissonant Whispers, Calm Emotions, Detect Thoughts, Hunger of Hadar, and Sending.',
      },
      {
        level: 1,
        name: 'Psionic Spells',
        description: 'You can cast spells using your mind alone. You can replace verbal and somatic components with psionic components.',
      },
      {
        level: 6,
        name: 'Telepathic Speech',
        description: 'As a Bonus Action, you can telepathically speak to one creature within 30 feet for a number of minutes equal to your Charisma modifier.',
      },
      {
        level: 14,
        name: 'Psychic Defenses',
        description: 'You have Resistance to Psychic damage, and you have Advantage on saving throws against being Charmed or Frightened.',
      },
      {
        level: 18,
        name: 'Warping Implosion',
        description: 'As an Action, you can teleport to an unoccupied space you can see within 120 feet. Each creature within 30 feet of the space you left must make a Strength saving throw or take 3d10 Force damage and be pulled toward the space you left.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'clockwork-sorcery',
    classId: 'Sorcerer',
    name: 'Clockwork Sorcery',
    description: 'You draw power from the order of Mechanus.',
    features: [
      {
        level: 1,
        name: 'Clockwork Spells',
        description: 'You learn additional spells: Alarm, Protection from Evil and Good, Aid, Lesser Restoration, Dispel Magic, and Protection from Energy.',
      },
      {
        level: 1,
        name: 'Restore Balance',
        description: 'When a creature you can see within 60 feet is about to roll a d20 with Advantage or Disadvantage, you can use your Reaction to prevent that.',
        uses: 3,
        restType: 'long',
      },
      {
        level: 6,
        name: 'Bastion of Law',
        description: 'As an Action, you can expend 1-5 Sorcery Points to create a magical ward. When the warded creature takes damage, it can use its Reaction to reduce the damage by the number rolled on a number of d8s equal to the Sorcery Points spent.',
      },
      {
        level: 14,
        name: 'Trance of Order',
        description: 'As a Bonus Action, you enter a state of clockwork focus for 1 minute. Attack rolls against you can\'t benefit from Advantage, and you can treat a d20 roll of 9 or lower as a 10 for ability checks and saving throws using your Proficient skills.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 18,
        name: 'Clockwork Cavalcade',
        description: 'As an Action, you summon spirits of order. Choose up to 5 creatures within 30 feet. Each regains 3d8 + your Charisma modifier hit points, ends one condition, and repairs one object. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'divine-soul',
    classId: 'Sorcerer',
    name: 'Divine Soul',
    description: 'You have been touched by a divine power.',
    features: [
      {
        level: 1,
        name: 'Divine Magic',
        description: 'Your link to a divine source allows you to learn spells from the Cleric class. When you learn a spell, you can choose it from the Sorcerer or Cleric spell list.',
      },
      {
        level: 1,
        name: 'Favored by the Gods',
        description: 'When you fail a saving throw or miss with an attack roll, you can add 2d4 to the roll. You can use this feature once per Short or Long Rest.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 6,
        name: 'Empowered Healing',
        description: 'When you or a creature within 5 feet regains hit points from a spell, you can spend 1 Sorcery Point to reroll any of the dice and choose which roll to use.',
      },
      {
        level: 14,
        name: 'Otherworldly Wings',
        description: 'As a Bonus Action, you can sprout wings from your back. You gain a flying speed of 30 feet until you dismiss them as a Bonus Action.',
      },
      {
        level: 18,
        name: 'Unearthly Recovery',
        description: 'As a Bonus Action, you can regain hit points equal to half your Sorcerer level. Once you use this feature, you can\'t do so again until you finish a Long Rest.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'draconic-sorcery',
    classId: 'Sorcerer',
    name: 'Draconic Sorcery',
    description: 'Your innate magic comes from draconic blood.',
    features: [
      {
        level: 1,
        name: 'Dragon Ancestor',
        description: 'Choose a dragon type. You gain Resistance to the damage type associated with your dragon ancestor. You also double your Proficiency Bonus for Charisma checks when interacting with dragons.',
      },
      {
        level: 1,
        name: 'Draconic Resilience',
        description: 'Your hit point maximum increases by 1 per Sorcerer level. Your AC equals 13 + your Dexterity modifier when you aren\'t wearing armor.',
      },
      {
        level: 6,
        name: 'Elemental Affinity',
        description: 'When you cast a spell that deals damage of the type associated with your dragon ancestor, you can add your Charisma modifier to one damage roll. You can also spend 1 Sorcery Point to gain Resistance to that damage type for 1 hour.',
      },
      {
        level: 14,
        name: 'Dragon Wings',
        description: 'As a Bonus Action, you can sprout dragon wings. You gain a flying speed of 30 feet until you dismiss them as a Bonus Action.',
      },
      {
        level: 18,
        name: 'Draconic Presence',
        description: 'As an Action, you can exude an aura of draconic power for 1 minute. Creatures within 60 feet must make a Wisdom saving throw or be Charmed or Frightened (your choice) until the aura ends.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'wild-magic-sorcery',
    classId: 'Sorcerer',
    name: 'Wild Magic Sorcery',
    description: 'Your magic comes from chaotic wild magic.',
    features: [
      {
        level: 1,
        name: 'Wild Magic Surge',
        description: 'Your spellcasting can unleash surges of untamed magic. When you cast a Sorcerer spell of 1st level or higher, the DM can have you roll a d20. On a 1, roll on the Wild Magic Surge table.',
      },
      {
        level: 1,
        name: 'Tides of Chaos',
        description: 'You can manipulate the forces of chance and chaos. You gain Advantage on one attack roll, ability check, or saving throw. Once you do so, you can\'t do so again until you finish a Long Rest or a Wild Magic Surge occurs.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 6,
        name: 'Bend Luck',
        description: 'When a creature you can see makes an attack roll, ability check, or saving throw, you can use your Reaction to spend 2 Sorcery Points and roll 1d4. You apply the number rolled as a bonus or penalty (your choice).',
      },
      {
        level: 14,
        name: 'Controlled Chaos',
        description: 'When you roll on the Wild Magic Surge table, you can roll twice and choose which effect occurs.',
      },
      {
        level: 18,
        name: 'Spell Bombardment',
        description: 'When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice and roll it again, adding the result to the damage.',
      },
    ],
  },
]

// ── Warlock Subclasses ─────────────────────────────────────────────────────

const WARLOCK_SUBCLASSES: Subclass2024[] = [
  {
    id: 'archfey',
    classId: 'Warlock',
    name: 'The Archfey',
    description: 'Your patron is a powerful fey being.',
    features: [
      {
        level: 1,
        name: 'Fey Presence',
        description: 'As an Action, you can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw. On a failed save, the creature is Charmed or Frightened by you (your choice) until the end of your next turn.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 6,
        name: 'Misty Escape',
        description: 'When you take damage, you can use your Reaction to turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn or until you attack or cast a spell.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 10,
        name: 'Beguiling Defenses',
        description: 'You are immune to being Charmed, and when a creature attempts to Charm you, you can use your Reaction to attempt to turn the effect back on them.',
      },
      {
        level: 14,
        name: 'Dark Delirium',
        description: 'As an Action, you can attempt to send a creature into a realm of dreams. The target must make a Wisdom saving throw or be banished to a harmless demiplane until the end of your next turn.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'celestial',
    classId: 'Warlock',
    name: 'The Celestial',
    description: 'Your patron is a powerful being of the Upper Planes.',
    features: [
      {
        level: 1,
        name: 'Healing Light',
        description: 'You have a pool of d6s equal to 1 + your Warlock level. As a Bonus Action, you can heal a creature within 60 feet by expending dice from the pool. The creature regains hit points equal to the roll.',
      },
      {
        level: 1,
        name: 'Radiant Soul',
        description: 'You have Resistance to Radiant damage. When you cast a spell that deals Radiant or Fire damage, you can add your Charisma modifier to one damage roll.',
      },
      {
        level: 6,
        name: 'Celestial Resistance',
        description: 'You gain Temporary Hit Points whenever you finish a Short or Long Rest. The temporary hit points equal your Warlock level + your Charisma modifier.',
      },
      {
        level: 10,
        name: 'Searing Vengeance',
        description: 'When you have to make a death saving throw at the start of your turn, you can instead spring back to your feet with a burst of radiant energy. You regain hit points equal to half your hit point maximum and deal Radiant damage to each creature within 30 feet.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 14,
        name: 'Radiant Consumption',
        description: 'As an Action, you can unleash a searing light for 1 minute. At the end of each of your turns, each creature within 10 feet takes Radiant damage equal to your Charisma modifier. You also shed Bright Light in a 30-foot radius.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'fiend',
    classId: 'Warlock',
    name: 'The Fiend',
    description: 'Your patron is a powerful fiend from the Lower Planes.',
    features: [
      {
        level: 1,
        name: 'Dark One\'s Blessing',
        description: 'When you reduce a hostile creature to 0 hit points, you gain Temporary Hit Points equal to your Charisma modifier + your Warlock level.',
      },
      {
        level: 6,
        name: 'Dark One\'s Own Luck',
        description: 'When you make a saving throw, you can add 1d10 to the roll. You can do so after seeing the roll but before learning the outcome.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 10,
        name: 'Fiendish Resilience',
        description: 'As a Bonus Action, you can choose one damage type and gain Resistance to it until you finish a Short or Long Rest.',
      },
      {
        level: 14,
        name: 'Hurl Through Hell',
        description: 'When you hit a creature with an attack, you can send it through the lower planes. The creature disappears and hurtles through hellish landscapes, taking 10d10 Psychic damage.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'great-old-one',
    classId: 'Warlock',
    name: 'The Great Old One',
    description: 'Your patron is an unknowable entity from beyond reality.',
    features: [
      {
        level: 1,
        name: 'Awakened Mind',
        description: 'You can telepathically speak to any creature you can see within 30 feet. You don\'t need to share a language.',
      },
      {
        level: 6,
        name: 'Entropic Ward',
        description: 'When a creature attacks you, you can use your Reaction to impose Disadvantage on the attack roll. If the attack misses, you have Advantage on attack rolls against that creature until the end of your next turn.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 10,
        name: 'Thought Shield',
        description: 'You have Resistance to Psychic damage. Any creature that uses telepathy or targets you with a divination spell takes Psychic damage equal to your Charisma modifier.',
      },
      {
        level: 14,
        name: 'Create Thrall',
        description: 'You can touch an Incapacitated humanoid. The target is Charmed by you until a Remove Curse spell is cast on it, the Charmed condition is removed, or you use this feature again.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'hexblade',
    classId: 'Warlock',
    name: 'The Hexblade',
    description: 'Your patron is a mysterious entity that manifests through weapons.',
    features: [
      {
        level: 1,
        name: 'Hex Warrior',
        description: 'When you finish a Long Rest, you can touch one weapon you are proficient with. Until your next Long Rest, you can use your Charisma modifier instead of Strength or Dexterity for attack and damage rolls with that weapon.',
      },
      {
        level: 1,
        name: 'Hexblade\'s Curse',
        description: 'As a Bonus Action, you curse a creature within 30 feet for 1 minute. You add your Proficiency Bonus to damage rolls against the target, score a Critical Hit on a 19 or 20, and regain hit points equal to your Warlock level + your Charisma modifier when the target dies.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 6,
        name: 'Accursed Specter',
        description: 'When you slay a humanoid, you can cause its spirit to rise as a specter. The specter is under your control and remains until your next Long Rest.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 10,
        name: 'Armor of Hexes',
        description: 'When the target of your Hexblade\'s Curse hits you with an attack roll, you can use your Reaction to roll a d6. On a 4 or higher, the attack instead misses you.',
      },
      {
        level: 14,
        name: 'Master of Hexes',
        description: 'When a creature is reduced to 0 hit points while under your Hexblade\'s Curse, you can transfer the curse to another creature within 30 feet.',
      },
    ],
  },
]

// ── Wizard Subclasses ──────────────────────────────────────────────────────

const WIZARD_SUBCLASSES: Subclass2024[] = [
  {
    id: 'abjuration',
    classId: 'Wizard',
    name: 'School of Abjuration',
    description: 'You focus on protective magic and wards.',
    features: [
      {
        level: 2,
        name: 'Abjuration Savant',
        description: 'The gold and time you must spend to copy an Abjuration spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Arcane Ward',
        description: 'When you cast an Abjuration spell of 1st level or higher, you create a magical ward that has hit points equal to twice your Wizard level. Whenever you take damage, the ward takes the damage instead.',
      },
      {
        level: 6,
        name: 'Projected Ward',
        description: 'When a creature within 30 feet takes damage, you can use your Reaction to have your Arcane Ward absorb that damage.',
      },
      {
        level: 10,
        name: 'Improved Abjuration',
        description: 'You have Advantage on ability checks you make to dispel or counter spells.',
      },
      {
        level: 14,
        name: 'Spell Resistance',
        description: 'You have Advantage on saving throws against spells and Resistance to damage from spells.',
      },
    ],
  },
  {
    id: 'conjuration',
    classId: 'Wizard',
    name: 'School of Conjuration',
    description: 'You focus on summoning creatures and objects.',
    features: [
      {
        level: 2,
        name: 'Conjuration Savant',
        description: 'The gold and time you must spend to copy a Conjuration spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Minor Conjuration',
        description: 'As an Action, you can conjure an inanimate object in your hand or on the ground. The object is visibly magical and lasts for 1 hour or until you dismiss it.',
      },
      {
        level: 6,
        name: 'Benign Transportation',
        description: 'As an Action, you can teleport up to 30 feet to an unoccupied space you can see. Alternatively, you can choose a creature within 30 feet and teleport it to an unoccupied space within 5 feet of you.',
        uses: 1,
        restType: 'long',
      },
      {
        level: 10,
        name: 'Focused Conjuration',
        description: 'While you are concentrating on a Conjuration spell, your concentration can\'t be broken as a result of taking damage.',
      },
      {
        level: 14,
        name: 'Durable Summons',
        description: 'Creatures you summon or create have 30 Temporary Hit Points.',
      },
    ],
  },
  {
    id: 'divination',
    classId: 'Wizard',
    name: 'School of Divination',
    description: 'You focus on uncovering secrets and seeing the future.',
    features: [
      {
        level: 2,
        name: 'Divination Savant',
        description: 'The gold and time you must spend to copy a Divination spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Portent',
        description: 'When you finish a Long Rest, roll two d20s and record the numbers. You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of these rolls.',
      },
      {
        level: 6,
        name: 'Expert Divination',
        description: 'When you cast a Divination spell of 2nd level or higher using a spell slot, you regain one expended spell slot. The slot can be of a level lower than the spell you cast.',
      },
      {
        level: 10,
        name: 'Third Eye',
        description: 'As a Bonus Action, you can increase your powers of perception. Choose from Darkvision, Ethereal Sight, Greater Comprehension, or See Invisibility.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 14,
        name: 'Greater Portent',
        description: 'You roll three d20s for your Portent feature instead of two.',
      },
    ],
  },
  {
    id: 'enchantment',
    classId: 'Wizard',
    name: 'School of Enchantment',
    description: 'You focus on affecting the minds of others.',
    features: [
      {
        level: 2,
        name: 'Enchantment Savant',
        description: 'The gold and time you must spend to copy an Enchantment spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Hypnotic Gaze',
        description: 'As an Action, you can attempt to charm a creature within 5 feet. The creature must succeed on a Wisdom saving throw or be Charmed by you until the end of your next turn.',
      },
      {
        level: 6,
        name: 'Instinctive Charm',
        description: 'When a creature attacks you, you can use your Reaction to divert the attack. The attacker must succeed on a Wisdom saving throw or target the creature closest to it instead.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 10,
        name: 'Split Enchantment',
        description: 'When you cast an Enchantment spell that targets only one creature, you can have it target a second creature.',
      },
      {
        level: 14,
        name: 'Alter Memories',
        description: 'When you cast an Enchantment spell to charm a creature, you can alter its memories of the time it was Charmed.',
      },
    ],
  },
  {
    id: 'evocation',
    classId: 'Wizard',
    name: 'School of Evocation',
    description: 'You focus on destructive and elemental magic.',
    features: [
      {
        level: 2,
        name: 'Evocation Savant',
        description: 'The gold and time you must spend to copy an Evocation spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Sculpt Spells',
        description: 'When you cast an Evocation spell that affects other creatures, you can choose a number of them equal to 1 + the spell\'s level. The chosen creatures automatically succeed on their saving throws and take no damage.',
      },
      {
        level: 6,
        name: 'Potent Cantrip',
        description: 'When a creature succeeds on a saving throw against one of your cantrips, the creature takes half the cantrip\'s damage.',
      },
      {
        level: 10,
        name: 'Empowered Evocation',
        description: 'When you cast an Evocation spell, you can add your Intelligence modifier to one damage roll.',
      },
      {
        level: 14,
        name: 'Overchannel',
        description: 'When you cast an Evocation spell of 1st through 5th level, you can deal maximum damage with the spell. The first time you do so, you take no damage. Each subsequent time, you take 2d12 Necrotic damage per level of the spell.',
        uses: 1,
        restType: 'long',
      },
    ],
  },
  {
    id: 'illusion',
    classId: 'Wizard',
    name: 'School of Illusion',
    description: 'You focus on creating false images and deceiving the senses.',
    features: [
      {
        level: 2,
        name: 'Illusion Savant',
        description: 'The gold and time you must spend to copy an Illusion spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Improved Minor Illusion',
        description: 'You learn the Minor Illusion cantrip. You can have up to three Minor Illusions active at once, and you can cast it as a Bonus Action.',
      },
      {
        level: 6,
        name: 'Malleable Illusions',
        description: 'When you cast an Illusion spell with a duration of 1 minute or longer, you can use your Action to change the nature of the illusion.',
      },
      {
        level: 10,
        name: 'Illusory Self',
        description: 'When a creature makes an attack roll against you, you can use your Reaction to interpose an illusory duplicate. The attack automatically misses you.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 14,
        name: 'Illusory Reality',
        description: 'When you cast an Illusion spell, you can choose one inanimate, nonmagical object that is part of the illusion and make it real for 1 minute.',
      },
    ],
  },
  {
    id: 'necromancy',
    classId: 'Wizard',
    name: 'School of Necromancy',
    description: 'You focus on death, undeath, and life force manipulation.',
    features: [
      {
        level: 2,
        name: 'Necromancy Savant',
        description: 'The gold and time you must spend to copy a Necromancy spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Grim Harvest',
        description: 'When you kill a creature with a spell of 1st level or higher, you regain hit points equal to twice the spell\'s level (or three times if it\'s a Necromancy spell).',
      },
      {
        level: 6,
        name: 'Undead Thralls',
        description: 'When you cast Animate Dead or Create Undead, you can target one additional corpse or pile of bones. Undead created by your spells have additional benefits.',
      },
      {
        level: 10,
        name: 'Inured to Undeath',
        description: 'You have Resistance to Necrotic damage, and your hit point maximum can\'t be reduced.',
      },
      {
        level: 14,
        name: 'Command Undead',
        description: 'As an Action, you can target one Undead creature you can see within 60 feet. It must make a Charisma saving throw or be Charmed by you.',
      },
    ],
  },
  {
    id: 'transmutation',
    classId: 'Wizard',
    name: 'School of Transmutation',
    description: 'You focus on changing matter and energy.',
    features: [
      {
        level: 2,
        name: 'Transmutation Savant',
        description: 'The gold and time you must spend to copy a Transmutation spell into your spellbook is halved.',
      },
      {
        level: 2,
        name: 'Transmuter\'s Stone',
        description: 'You can spend 8 hours creating a Transmuter\'s Stone that stores transmutation magic. You and your allies can benefit from its effects.',
      },
      {
        level: 6,
        name: 'Transmuter\'s Stone Improvements',
        description: 'You can change the effect of your Transmuter\'s Stone when you create it: Darkvision, Increase Speed, Proficiency in Constitution Saves, or Resistance to a damage type.',
      },
      {
        level: 10,
        name: 'Shapechanger',
        description: 'You can cast Polymorph without expending a spell slot. When you do so, you can target only yourself and transform into a beast with a Challenge Rating of 1 or lower.',
        uses: 1,
        restType: 'short',
      },
      {
        level: 14,
        name: 'Master Transmuter',
        description: 'You can use your Transmuter\'s Stone to: Panacea (end all conditions), Restore Life (cast Raise Dead), or Restore Youth (reduce age by 3d10 years).',
      },
    ],
  },
]

// ── Combine All Subclasses ─────────────────────────────────────────────────

export const ALL_SUBCLASSES: Subclass2024[] = [
  ...BARBARIAN_SUBCLASSES,
  ...BARD_SUBCLASSES,
  ...CLERIC_SUBCLASSES,
  ...DRUID_SUBCLASSES,
  ...FIGHTER_SUBCLASSES,
  ...MONK_SUBCLASSES,
  ...PALADIN_SUBCLASSES,
  ...RANGER_SUBCLASSES,
  ...ROGUE_SUBCLASSES,
  ...SORCERER_SUBCLASSES,
  ...WARLOCK_SUBCLASSES,
  ...WIZARD_SUBCLASSES,
]

// ── Helper Functions ───────────────────────────────────────────────────────

export function getSubclassById(id: string): Subclass2024 | undefined {
  return ALL_SUBCLASSES.find((s) => s.id === id)
}

export function getSubclassesByClass(classId: CharacterClass): Subclass2024[] {
  return ALL_SUBCLASSES.filter((s) => s.classId === classId)
}

export function getSubclassForClassAtLevel(
  classId: CharacterClass,
  level: number
): Subclass2024[] {
  // Most classes get subclass at level 3
  // Cleric, Sorcerer, Warlock get it at level 1
  const subclassLevel = getSubclassLevel(classId)
  if (level < subclassLevel) return []
  return getSubclassesByClass(classId)
}

export function getSubclassLevel(classId: CharacterClass): number {
  if (['Cleric', 'Sorcerer', 'Warlock'].includes(classId)) return 1
  if (['Druid', 'Wizard'].includes(classId)) return 2
  return 3
}

export function getSubclassFeaturesUpToLevel(
  subclass: Subclass2024,
  level: number
): SubclassFeature[] {
  return subclass.features.filter((f) => f.level <= level)
}
