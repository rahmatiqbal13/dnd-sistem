import type { Ability } from '@/types'

export type FeatCategory = 'origin' | 'general' | 'fighting_style' | 'epic'

export interface FeatAbilityIncrease {
  ability: Ability
  bonus: number // Usually +1 for feats with ASI
}

export interface Feat2024 {
  id: string
  name: string
  category: FeatCategory
  description: string
  prerequisite?: string
  benefits: string[]
  asi?: FeatAbilityIncrease[] // Some feats give +1 to ability scores
  spellGranted?: {
    name: string
    level: number
    canCastWithoutSlot?: boolean
    usesPerLongRest?: number
  }[]
}

// ── Origin Feats (Level 1, from Background) ─────────────────────────────────

export const ORIGIN_FEATS: Feat2024[] = [
  {
    id: 'alert',
    name: 'Alert',
    category: 'origin',
    description: 'You gain a +5 bonus to Initiative, and you can\'t be Surprised while you are conscious.',
    benefits: [
      'Add +5 to your Initiative rolls',
      'You cannot be Surprised while conscious',
      'Other creatures don\'t gain Advantage on attack rolls against you as a result of being unseen by you',
    ],
  },
  {
    id: 'crafter',
    name: 'Crafter',
    category: 'origin',
    description: 'You gain Tool Proficiency with three Artisan\'s Tools of your choice. You also gain a 20% discount when buying nonmagical items.',
    benefits: [
      'Tool Proficiency with three Artisan\'s Tools of your choice',
      'When you buy a nonmagical item, you receive a 20% discount',
      'When you finish a Long Rest, you can craft one piece of ammunition or one vial of basic poison',
    ],
  },
  {
    id: 'healer',
    name: 'Healer',
    category: 'origin',
    description: 'You can stabilize creatures and restore hit points using a Healer\'s Kit.',
    benefits: [
      'When you use a Healer\'s Kit to stabilize a creature, that creature also gains 1 Hit Die',
      'As a Bonus Action, you can expend one use of a Healer\'s Kit to restore 2d4 + 2 Hit Points to a creature within 5 feet of you',
      'You can use this feature a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest',
    ],
  },
  {
    id: 'lucky',
    name: 'Lucky',
    category: 'origin',
    description: 'You have inexplicable luck that can help you in moments of need.',
    benefits: [
      'You have 3 luck points',
      'Whenever you make an attack roll, ability check, or saving throw, you can spend one luck point to roll an additional d20',
      'You can spend luck points after rolling but before the outcome is determined',
      'You regain all expended luck points when you finish a Long Rest',
    ],
  },
  {
    id: 'magic-initiate-cleric',
    name: 'Magic Initiate (Cleric)',
    category: 'origin',
    description: 'You learn spells from the Cleric class.',
    benefits: [
      'You learn two cantrips of your choice from the Cleric spell list',
      'You learn one 1st-level spell from the Cleric spell list',
      'You can cast the 1st-level spell once without a spell slot, and regain the ability to do so when you finish a Long Rest',
      'You can also cast the spell using any spell slots you have',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you take this feat)',
    ],
    spellGranted: [
      { name: 'Choose 2 Cleric Cantrips', level: 0 },
      { name: 'Choose 1 Cleric Level 1 Spell', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'magic-initiate-druid',
    name: 'Magic Initiate (Druid)',
    category: 'origin',
    description: 'You learn spells from the Druid class.',
    benefits: [
      'You learn two cantrips of your choice from the Druid spell list',
      'You learn one 1st-level spell from the Druid spell list',
      'You can cast the 1st-level spell once without a spell slot, and regain the ability to do so when you finish a Long Rest',
      'You can also cast the spell using any spell slots you have',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you take this feat)',
    ],
    spellGranted: [
      { name: 'Choose 2 Druid Cantrips', level: 0 },
      { name: 'Choose 1 Druid Level 1 Spell', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'magic-initiate-wizard',
    name: 'Magic Initiate (Wizard)',
    category: 'origin',
    description: 'You learn spells from the Wizard class.',
    benefits: [
      'You learn two cantrips of your choice from the Wizard spell list',
      'You learn one 1st-level spell from the Wizard spell list',
      'You can cast the 1st-level spell once without a spell slot, and regain the ability to do so when you finish a Long Rest',
      'You can also cast the spell using any spell slots you have',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you take this feat)',
    ],
    spellGranted: [
      { name: 'Choose 2 Wizard Cantrips', level: 0 },
      { name: 'Choose 1 Wizard Level 1 Spell', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'magic-initiate-sorcerer',
    name: 'Magic Initiate (Sorcerer)',
    category: 'origin',
    description: 'You learn spells from the Sorcerer class.',
    benefits: [
      'You learn two cantrips of your choice from the Sorcerer spell list',
      'You learn one 1st-level spell from the Sorcerer spell list',
      'You can cast the 1st-level spell once without a spell slot, and regain the ability to do so when you finish a Long Rest',
      'You can also cast the spell using any spell slots you have',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you take this feat)',
    ],
    spellGranted: [
      { name: 'Choose 2 Sorcerer Cantrips', level: 0 },
      { name: 'Choose 1 Sorcerer Level 1 Spell', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'magic-initiate-warlock',
    name: 'Magic Initiate (Warlock)',
    category: 'origin',
    description: 'You learn spells from the Warlock class.',
    benefits: [
      'You learn two cantrips of your choice from the Warlock spell list',
      'You learn one 1st-level spell from the Warlock spell list',
      'You can cast the 1st-level spell once without a spell slot, and regain the ability to do so when you finish a Long Rest',
      'You can also cast the spell using any spell slots you have',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you take this feat)',
    ],
    spellGranted: [
      { name: 'Choose 2 Warlock Cantrips', level: 0 },
      { name: 'Choose 1 Warlock Level 1 Spell', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'magic-initiate-bard',
    name: 'Magic Initiate (Bard)',
    category: 'origin',
    description: 'You learn spells from the Bard class.',
    benefits: [
      'You learn two cantrips of your choice from the Bard spell list',
      'You learn one 1st-level spell from the Bard spell list',
      'You can cast the 1st-level spell once without a spell slot, and regain the ability to do so when you finish a Long Rest',
      'You can also cast the spell using any spell slots you have',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you take this feat)',
    ],
    spellGranted: [
      { name: 'Choose 2 Bard Cantrips', level: 0 },
      { name: 'Choose 1 Bard Level 1 Spell', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'musician',
    name: 'Musician',
    category: 'origin',
    description: 'You gain proficiency with three musical instruments of your choice.',
    benefits: [
      'You gain Tool Proficiency with three musical instruments of your choice',
      'When you finish a Short Rest or Long Rest, you can play a musical instrument to give Heroic Inspiration to allies',
      'Choose a number of allies equal to your Proficiency Bonus within 15 feet who can hear you',
      'Each ally gains Heroic Inspiration',
    ],
  },
  {
    id: 'savage-attacker',
    name: 'Savage Attacker',
    category: 'origin',
    description: 'You can reroll damage dice when you score a hit.',
    benefits: [
      'Once per turn when you hit a target with a weapon, you can roll the weapon\'s damage dice twice and use either roll against the target',
      'If the weapon has the Versatile property, you can use this benefit only if you are wielding it with two hands',
    ],
  },
  {
    id: 'skilled',
    name: 'Skilled',
    category: 'origin',
    description: 'You gain proficiency in three skills of your choice.',
    benefits: [
      'You gain proficiency in any combination of three skills or tools of your choice',
      'If you already have proficiency in the chosen skill, you gain Expertise instead',
    ],
  },
  {
    id: 'tavern-brawler',
    name: 'Tavern Brawler',
    category: 'origin',
    description: 'You are skilled at fighting with improvised weapons and unarmed strikes.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'con', bonus: 1 }],
    benefits: [
      'Increase your Strength or Constitution score by 1, to a maximum of 20',
      'When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a Bonus Action to attempt to grapple the target',
      'You are proficient with improvised weapons',
      'Your unarmed strike uses a d4 for damage',
    ],
  },
  {
    id: 'tough',
    name: 'Tough',
    category: 'origin',
    description: 'Your hit point maximum increases.',
    benefits: [
      'Your hit point maximum increases by 2 for every level you have gained',
      'Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points',
    ],
  },
]

// ── General Feats (ASI Levels) ─────────────────────────────────────────────

export const GENERAL_FEATS: Feat2024[] = [
  {
    id: 'ability-score-improvement',
    name: 'Ability Score Improvement',
    category: 'general',
    description: 'Increase your ability scores.',
    benefits: [
      'Increase one ability score by 2, or increase two ability scores by 1',
      'You cannot increase an ability score above 20 using this feat',
    ],
    asi: [
      { ability: 'str', bonus: 2 }, // Can be split as 2/0 or 1/1
    ],
  },
  {
    id: 'actor',
    name: 'Actor',
    category: 'general',
    description: 'You are skilled at deception and performance.',
    asi: [{ ability: 'cha', bonus: 1 }],
    benefits: [
      'Increase your Charisma score by 1, to a maximum of 20',
      'You have Advantage on Charisma (Deception) and Charisma (Performance) checks',
      'If you are disguised as a real person, creatures have Disadvantage on checks to see through your disguise',
      'You can mimic the speech of another person or the sounds made by other creatures',
    ],
  },
  {
    id: 'athlete',
    name: 'Athlete',
    category: 'general',
    description: 'You are physically skilled.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'dex', bonus: 1 }],
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20',
      'When you are Prone, standing up uses only 5 feet of your movement',
      'You have Advantage on Strength (Athletics) checks to climb or swim',
      'You can make a running long jump or running high jump after moving only 5 feet on foot',
    ],
  },
  {
    id: 'charger',
    name: 'Charger',
    category: 'general',
    description: 'You are skilled at charging into combat.',
    benefits: [
      'When you take the Dash action, you can also make one melee attack or shove as a Bonus Action',
      'When you use this Bonus Action, you gain a +5 bonus to the damage roll if you moved at least 10 feet in a straight line immediately before the hit',
    ],
  },
  {
    id: 'chef',
    name: 'Chef',
    category: 'general',
    description: 'You are a skilled cook.',
    asi: [{ ability: 'con', bonus: 1 }, { ability: 'wis', bonus: 1 }],
    benefits: [
      'Increase your Constitution or Wisdom score by 1, to a maximum of 20',
      'You gain proficiency with Cook\'s Utensils if you don\'t already have it',
      'As part of a Short Rest, you can cook special food for up to 5 creatures',
      'Each creature who eats the food and spends Hit Dice to regain hit points regains 1d8 additional hit points',
      'As a Bonus Action, you can cook and serve a meal that restores 2d4 + your Proficiency Bonus hit points to one creature',
      'You can use this Bonus Action a number of times equal to your Proficiency Bonus, and regain all uses when you finish a Long Rest',
    ],
  },
  {
    id: 'crossbow-expert',
    name: 'Crossbow Expert',
    category: 'general',
    description: 'You are skilled at using crossbows.',
    benefits: [
      'You ignore the Loading property of crossbows',
      'Being within 5 feet of an enemy doesn\'t impose Disadvantage on your ranged attack rolls with crossbows',
      'When you attack with a one-handed weapon, you can use a Bonus Action to attack with a hand crossbow you are holding',
    ],
  },
  {
    id: 'crusher',
    name: 'Crusher',
    category: 'general',
    description: 'You are skilled at using bludgeoning weapons.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'con', bonus: 1 }],
    benefits: [
      'Increase your Strength or Constitution score by 1, to a maximum of 20',
      'Once per turn when you hit a creature with an attack that deals bludgeoning damage, you can move that creature 5 feet to an unoccupied space',
      'When you score a Critical Hit that deals bludgeoning damage to a creature, attack rolls against that creature have Advantage until the start of your next turn',
    ],
  },
  {
    id: 'defensive-duelist',
    name: 'Defensive Duelist',
    category: 'general',
    description: 'You are skilled at parrying with finesse weapons.',
    prerequisite: 'Proficiency with a Finesse weapon',
    benefits: [
      'When you are wielding a Finesse weapon with which you have proficiency and another creature hits you with a melee attack, you can use your Reaction to add your Proficiency Bonus to your AC for that attack',
      'This might cause the attack to miss',
    ],
  },
  {
    id: 'dual-wielder',
    name: 'Dual Wielder',
    category: 'general',
    description: 'You are skilled at fighting with two weapons.',
    benefits: [
      'You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand',
      'You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren\'t Light',
      'You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one',
    ],
  },
  {
    id: 'durable',
    name: 'Durable',
    category: 'general',
    description: 'You are exceptionally hardy.',
    asi: [{ ability: 'con', bonus: 1 }],
    benefits: [
      'Increase your Constitution score by 1, to a maximum of 20',
      'Whenever you roll a Hit Die to regain hit points, the minimum number of hit points you regain equals twice your Constitution modifier (minimum of 2)',
    ],
  },
  {
    id: 'elemental-adept',
    name: 'Elemental Adept',
    category: 'general',
    description: 'Your spells ignore resistance to a damage type.',
    prerequisite: 'Ability to cast at least one spell',
    benefits: [
      'Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder',
      'Spells you cast ignore Resistance to damage of the chosen type',
      'In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2',
    ],
  },
  {
    id: 'fey-touched',
    name: 'Fey Touched',
    category: 'general',
    description: 'You have been touched by fey magic.',
    asi: [{ ability: 'int', bonus: 1 }, { ability: 'wis', bonus: 1 }, { ability: 'cha', bonus: 1 }],
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20',
      'You learn the Misty Step spell and one 1st-level spell of your choice',
      'The 1st-level spell must be from the Divination or Enchantment school of magic',
      'You can cast each of these spells without expending a spell slot once per Long Rest',
      'You can also cast these spells using spell slots you have of the appropriate level',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells',
    ],
    spellGranted: [
      { name: 'Misty Step', level: 2, canCastWithoutSlot: true, usesPerLongRest: 1 },
      { name: 'Choose 1st-level Divination or Enchantment', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'grappler',
    name: 'Grappler',
    category: 'general',
    description: 'You are skilled at grappling.',
    prerequisite: 'Strength 13 or higher',
    benefits: [
      'You have Advantage on attack rolls against a creature you are grappling',
      'You can use your action to try to pin a creature you are grappling',
      'To do so, make another grapple check. If you succeed, you and the creature are both Restrained until the grapple ends',
    ],
  },
  {
    id: 'great-weapon-master',
    name: 'Great Weapon Master',
    category: 'general',
    description: 'You are skilled at using heavy weapons.',
    benefits: [
      'When you roll a 19 or 20 on a damage die for an attack you make with a Heavy weapon, you can reroll that die and must use the new roll',
      'Before you make a melee attack with a Heavy weapon you are proficient with, you can choose to take a -5 penalty to the attack roll',
      'If the attack hits, you add +10 to the attack\'s damage',
    ],
  },
  {
    id: 'heavily-armored',
    name: 'Heavily Armored',
    category: 'general',
    description: 'You are trained in heavy armor.',
    prerequisite: 'Proficiency with Medium Armor',
    asi: [{ ability: 'str', bonus: 1 }],
    benefits: [
      'Increase your Strength score by 1, to a maximum of 20',
      'You gain proficiency with Heavy Armor',
    ],
  },
  {
    id: 'heavy-armor-master',
    name: 'Heavy Armor Master',
    category: 'general',
    description: 'You are skilled at using heavy armor.',
    prerequisite: 'Proficiency with Heavy Armor',
    asi: [{ ability: 'str', bonus: 1 }],
    benefits: [
      'Increase your Strength score by 1, to a maximum of 20',
      'While you are wearing Heavy Armor, bludgeoning, piercing, and slashing damage that you take from nonmagical attacks is reduced by 3',
    ],
  },
  {
    id: 'inspiring-leader',
    name: 'Inspiring Leader',
    category: 'general',
    description: 'You can inspire your allies.',
    prerequisite: 'Charisma 13 or higher',
    benefits: [
      'When you finish a Short Rest or Long Rest, you can give temporary hit points to up to 6 creatures',
      'Each creature gains temporary hit points equal to your level + your Charisma modifier',
      'A creature can\'t gain temporary hit points from this feat again until it finishes a Short Rest or Long Rest',
    ],
  },
  {
    id: 'keen-mind',
    name: 'Keen Mind',
    category: 'general',
    description: 'You have an exceptional memory.',
    asi: [{ ability: 'int', bonus: 1 }],
    benefits: [
      'Increase your Intelligence score by 1, to a maximum of 20',
      'You always know which way is north',
      'You always know the number of hours left before the next sunrise or sunset',
      'You can accurately recall anything you have seen or heard within the past month',
    ],
  },
  {
    id: 'lightly-armored',
    name: 'Lightly Armored',
    category: 'general',
    description: 'You are trained in light armor.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'dex', bonus: 1 }],
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20',
      'You gain proficiency with Light Armor',
    ],
  },
  {
    id: 'mage-slayer',
    name: 'Mage Slayer',
    category: 'general',
    description: 'You are skilled at fighting spellcasters.',
    benefits: [
      'When a creature within 5 feet of you casts a spell, you can use your Reaction to make a melee weapon attack against that creature',
      'When you damage a creature that is concentrating on a spell, that creature has Disadvantage on the saving throw it makes to maintain its concentration',
      'You have Advantage on saving throws against spells cast by creatures within 5 feet of you',
    ],
  },
  {
    id: 'martial-weapon-training',
    name: 'Martial Weapon Training',
    category: 'general',
    description: 'You are trained in martial weapons.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'dex', bonus: 1 }],
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20',
      'You gain proficiency with Martial weapons',
    ],
  },
  {
    id: 'medium-armor-master',
    name: 'Medium Armor Master',
    category: 'general',
    description: 'You are skilled at using medium armor.',
    prerequisite: 'Proficiency with Medium Armor',
    benefits: [
      'Wearing Medium Armor doesn\'t impose Disadvantage on your Dexterity (Stealth) checks',
      'When you wear Medium Armor, you can add 3, rather than 2, to your AC if your Dexterity is 16 or higher',
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile',
    category: 'general',
    description: 'You are exceptionally fast and agile.',
    benefits: [
      'Your speed increases by 10 feet',
      'When you use the Dash action, difficult terrain doesn\'t cost you extra movement on that turn',
      'When you make a melee attack against a creature, you don\'t provoke Opportunity Attacks from that creature for the rest of the turn',
    ],
  },
  {
    id: 'mounted-combatant',
    name: 'Mounted Combatant',
    category: 'general',
    description: 'You are skilled at fighting while mounted.',
    benefits: [
      'You have Advantage on melee attack rolls against any unmounted creature that is smaller than your mount',
      'You can force an attack targeted at your mount to target you instead',
      'If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw',
    ],
  },
  {
    id: 'observant',
    name: 'Observant',
    category: 'general',
    description: 'You are quick to notice details.',
    asi: [{ ability: 'int', bonus: 1 }, { ability: 'wis', bonus: 1 }],
    benefits: [
      'Increase your Intelligence or Wisdom score by 1, to a maximum of 20',
      'If you can see a creature\'s mouth while it is speaking a language you understand, you can interpret what it\'s saying by reading its lips',
      'You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores',
    ],
  },
  {
    id: 'piercer',
    name: 'Piercer',
    category: 'general',
    description: 'You are skilled at using piercing weapons.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'dex', bonus: 1 }],
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20',
      'Once per turn, when you hit a creature with an attack that deals piercing damage, you can reroll one of the attack\'s damage dice',
      'When you score a Critical Hit that deals piercing damage to a creature, you can roll one additional damage die when determining the extra piercing damage the target takes',
    ],
  },
  {
    id: 'poisoner',
    name: 'Poisoner',
    category: 'general',
    description: 'You are skilled at using poison.',
    benefits: [
      'You gain proficiency with the Poisoner\'s Kit',
      'When you make a damage roll that deals poison damage, you ignore Resistance to poison damage',
      'You can apply poison to a weapon or piece of ammunition as a Bonus Action',
      'You have proficiency with saving throws to avoid or resist poison',
    ],
  },
  {
    id: 'polearm-master',
    name: 'Polearm Master',
    category: 'general',
    description: 'You are skilled at using polearms.',
    benefits: [
      'When you take the Attack action and attack with only a Glaive, Halberd, Quarterstaff, or Spear, you can use a Bonus Action to make a melee attack with the opposite end of the weapon',
      'This attack uses the same ability modifier as the primary attack and deals 1d4 bludgeoning damage',
      'While you are wielding a Glaive, Halberd, Pike, Quarterstaff, or Spear, other creatures provoke an Opportunity Attack from you when they enter the reach you have with that weapon',
    ],
  },
  {
    id: 'resilient',
    name: 'Resilient',
    category: 'general',
    description: 'You are exceptionally resilient.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'dex', bonus: 1 }, { ability: 'con', bonus: 1 }, { ability: 'int', bonus: 1 }, { ability: 'wis', bonus: 1 }, { ability: 'cha', bonus: 1 }],
    benefits: [
      'Increase one ability score of your choice by 1, to a maximum of 20',
      'You gain proficiency in saving throws using the chosen ability',
    ],
  },
  {
    id: 'ritual-caster',
    name: 'Ritual Caster',
    category: 'general',
    description: 'You can cast spells as rituals.',
    prerequisite: 'Intelligence, Wisdom, or Charisma 13 or higher',
    benefits: [
      'Choose a class: Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard',
      'You acquire a ritual book holding two 1st-level spells of your choice from that class\'s spell list',
      'Choose spells that have the Ritual tag',
      'You can cast these spells as rituals if they are in your ritual book',
      'You can add other ritual spells to your book if you find them on scrolls or in other written forms',
    ],
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    category: 'general',
    description: 'You are vigilant in combat.',
    benefits: [
      'When you hit a creature with an Opportunity Attack, the creature\'s speed becomes 0 for the rest of the turn',
      'Creatures provoke Opportunity Attacks from you even if they take the Disengage action before leaving your reach',
      'When a creature within 5 feet of you makes an attack against a target other than you, you can use your Reaction to make a melee weapon attack against the attacking creature',
    ],
  },
  {
    id: 'shadow-touched',
    name: 'Shadow Touched',
    category: 'general',
    description: 'You have been touched by shadow magic.',
    asi: [{ ability: 'int', bonus: 1 }, { ability: 'wis', bonus: 1 }, { ability: 'cha', bonus: 1 }],
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20',
      'You learn the Invisibility spell and one 1st-level spell of your choice',
      'The 1st-level spell must be from the Illusion or Necromancy school of magic',
      'You can cast each of these spells without expending a spell slot once per Long Rest',
      'You can also cast these spells using spell slots you have of the appropriate level',
      'Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells',
    ],
    spellGranted: [
      { name: 'Invisibility', level: 2, canCastWithoutSlot: true, usesPerLongRest: 1 },
      { name: 'Choose 1st-level Illusion or Necromancy', level: 1, canCastWithoutSlot: true, usesPerLongRest: 1 },
    ],
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    category: 'general',
    description: 'You are skilled at ranged attacks.',
    benefits: [
      'Attacking at long range doesn\'t impose Disadvantage on your ranged attack rolls',
      'Your ranged attacks ignore half cover and three-quarters cover',
      'Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll',
      'If the attack hits, you add +10 to the attack\'s damage',
    ],
  },
  {
    id: 'shield-master',
    name: 'Shield Master',
    category: 'general',
    description: 'You are skilled at using shields.',
    benefits: [
      'If you take the Attack action on your turn, you can use a Bonus Action to try to shove a creature within 5 feet of you with your shield',
      'If you aren\'t Incapacitated, you can add your shield\'s AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you',
      'If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your Reaction to take no damage if you succeed on the saving throw',
    ],
  },
  {
    id: 'skill-expert',
    name: 'Skill Expert',
    category: 'general',
    description: 'You are exceptionally skilled.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'dex', bonus: 1 }, { ability: 'con', bonus: 1 }, { ability: 'int', bonus: 1 }, { ability: 'wis', bonus: 1 }, { ability: 'cha', bonus: 1 }],
    benefits: [
      'Increase one ability score of your choice by 1, to a maximum of 20',
      'Choose one skill in which you have proficiency. You gain Expertise with that skill',
      'Choose one skill in which you don\'t have proficiency. You gain proficiency with that skill',
    ],
  },
  {
    id: 'skulker',
    name: 'Skulker',
    category: 'general',
    description: 'You are skilled at hiding.',
    prerequisite: 'Dexterity 13 or higher',
    benefits: [
      'You can try to hide when you are lightly obscured from the creature from which you are hiding',
      'When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn\'t reveal your position',
      'Dim light doesn\'t impose Disadvantage on your Wisdom (Perception) checks relying on sight',
    ],
  },
  {
    id: 'spell-sniper',
    name: 'Spell Sniper',
    category: 'general',
    description: 'You are skilled at casting spells at range.',
    prerequisite: 'Ability to cast at least one spell',
    benefits: [
      'When you cast a spell that requires you to make an attack roll, the spell\'s range is doubled',
      'Your ranged spell attacks ignore half cover and three-quarters cover',
      'You learn one cantrip that requires an attack roll from a spell list of your choice',
      'Your spellcasting ability for this cantrip depends on the spell list you chose',
    ],
  },
  {
    id: 'war-caster',
    name: 'War Caster',
    category: 'general',
    description: 'You are skilled at casting spells in combat.',
    prerequisite: 'Ability to cast at least one spell',
    benefits: [
      'You have Advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage',
      'You can perform the somatic components of spells even when you have weapons or a shield in one or both hands',
      'When a hostile creature\'s movement provokes an Opportunity Attack from you, you can use your Reaction to cast a spell at the creature',
      'The spell must have a casting time of 1 action and must target only that creature',
    ],
  },
  {
    id: 'weapon-master',
    name: 'Weapon Master',
    category: 'general',
    description: 'You are skilled with weapons.',
    asi: [{ ability: 'str', bonus: 1 }, { ability: 'dex', bonus: 1 }],
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20',
      'You gain proficiency with four simple or martial weapons of your choice',
    ],
  },
]

// ── Combine All Feats ──────────────────────────────────────────────────────

export const ALL_FEATS: Feat2024[] = [...ORIGIN_FEATS, ...GENERAL_FEATS]

// ── Helper Functions ───────────────────────────────────────────────────────

export function getFeatById(id: string): Feat2024 | undefined {
  return ALL_FEATS.find((f) => f.id === id)
}

export function getOriginFeats(): Feat2024[] {
  return ORIGIN_FEATS
}

export function getGeneralFeats(): Feat2024[] {
  return GENERAL_FEATS
}

export function getFeatsByCategory(category: FeatCategory): Feat2024[] {
  return ALL_FEATS.filter((f) => f.category === category)
}

export function getFeatsByPrerequisite(prerequisite: string): Feat2024[] {
  return ALL_FEATS.filter((f) => f.prerequisite?.toLowerCase().includes(prerequisite.toLowerCase()))
}

export function getFeatsWithASI(): Feat2024[] {
  return ALL_FEATS.filter((f) => f.asi && f.asi.length > 0)
}
