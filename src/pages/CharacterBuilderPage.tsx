import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dices, ChevronLeft, RefreshCw, Package, Coins } from 'lucide-react'
import { toast } from 'sonner'
import { useCharacterStore, defaultSavingThrows } from '@/store/characterStore'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { rollAbilityScore } from '@/lib/dice'
import { formatModifier, abilityModifier, ABILITY_LABELS, proficiencyBonus } from '@/lib/utils'
import { BACKGROUNDS_2024, getBackground2024 } from '@/data/dnd2024/backgrounds'
import { getClass2024 } from '@/data/dnd2024/classes'
import { getRace2024, getRaceFeatures, getRaceLanguages, getRaceSpeed } from '@/data/dnd2024/races'
import { getStartingEquipment, getDefaultArmorForClass, getDefaultShieldForClass, getDefaultGoldForClass } from '@/data/dnd2024/equipment'
import {
  applyBackgroundAsi,
  computeMaxHp,
  computeArmorClass,
  defaultSpeed,
  spellSlotsForCharacter,
  innateSpellsFromRace,
  type ArmorPreset,
} from '@/lib/characterRules'
import type { CharacterClass, CharacterRace, Alignment, AbilityScores, Ability } from '@/types'

const CLASSES: CharacterClass[] = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard',
]
const RACES: CharacterRace[] = [
  'Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Tiefling',
]
const ALIGNMENTS: Alignment[] = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
]

const ARMOR_PRESETS: { id: ArmorPreset; label: string }[] = [
  { id: 'none', label: 'Tidak ada (10 + DEX)' },
  { id: 'leather', label: 'Leather (11 + DEX)' },
  { id: 'studded', label: 'Studded (12 + DEX)' },
  { id: 'hide', label: 'Hide (12 + DEX)' },
  { id: 'chain-shirt', label: 'Chain shirt (13 + DEX maks 2)' },
  { id: 'scale', label: 'Scale mail (12 + DEX)' },
  { id: 'breastplate', label: 'Breastplate (13 + DEX maks 2)' },
  { id: 'half-plate', label: 'Half plate (15 + DEX maks 2)' },
  { id: 'chain-mail', label: 'Chain mail (16)' },
  { id: 'splint', label: 'Splint (17)' },
  { id: 'plate', label: 'Plate (18)' },
]

const schema = z.object({
  name: z.string().min(2, 'Min 2 karakter'),
  class: z.string().min(1),
  race: z.string().min(1),
  level: z.number().int().min(1).max(20),
  alignment: z.string().min(1),
  subclass: z.string().optional(),
  maxHp: z.number().int().min(1),
  armorClass: z.number().int().min(1),
  speed: z.number().int().min(1),
  traits: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const ABILITIES: Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

const ASI_LEVELS = new Set([4, 8, 12, 16, 19])

export function CharacterBuilderPage() {
  const navigate = useNavigate()
  const { nickname } = useAppStore()
  const addCharacter = useCharacterStore((s) => s.addCharacter)

  const [baseScores, setBaseScores] = useState<AbilityScores>({
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
  })
  const [backgroundId, setBackgroundId] = useState<string>('')
  const [armorPreset, setArmorPreset] = useState<ArmorPreset>('leather')
  const [shield, setShield] = useState(false)
  const [classSkills, setClassSkills] = useState<string[]>([])
  const [startingGold, setStartingGold] = useState<number>(0)
  const [equipmentItems, setEquipmentItems] = useState<string[]>([])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { level: 1, maxHp: 10, armorClass: 12, speed: 30, subclass: '' },
  })

  const level = watch('level') || 1
  const clsName = watch('class') as CharacterClass | undefined
  const raceName = watch('race') as CharacterRace | undefined

  const bg = backgroundId ? getBackground2024(backgroundId) : undefined
  const effectiveScores = useMemo(() => applyBackgroundAsi(baseScores, bg), [baseScores, bg])
  const conMod = abilityModifier(effectiveScores.con)
  const dexMod = abilityModifier(effectiveScores.dex)
  const cls = clsName ? getClass2024(clsName) : undefined

  useEffect(() => {
    if (!cls || !raceName) return
    const hp = computeMaxHp(cls.hitDie, level, conMod)
    const ac = computeArmorClass(armorPreset, dexMod, shield)
    const sp = getRaceSpeed(raceName)
    setValue('maxHp', hp)
    setValue('armorClass', ac)
    setValue('speed', sp)
  }, [cls, level, conMod, dexMod, armorPreset, shield, raceName, setValue])

  useEffect(() => {
    if (!cls) {
      setClassSkills([])
      return
    }
    setClassSkills((prev) => prev.filter((s) => cls.skillOptions.includes(s)).slice(0, cls.skillsChoose))
  }, [cls])

  // Auto-select armor based on class proficiency
  useEffect(() => {
    if (!cls) return
    
    // Determine best default armor based on class proficiencies
    const hasHeavy = cls.armorProficiencies.includes('heavy')
    const hasMedium = cls.armorProficiencies.includes('medium')
    const hasLight = cls.armorProficiencies.includes('light')
    const hasShield = cls.armorProficiencies.includes('shield')
    
    let defaultArmor: ArmorPreset = 'none'
    
    if (hasHeavy) {
      defaultArmor = 'chain-mail' // Starting heavy armor
    } else if (hasMedium) {
      defaultArmor = 'scale' // Starting medium armor
    } else if (hasLight) {
      defaultArmor = 'leather' // Starting light armor
    }
    
    setArmorPreset(defaultArmor)
    setShield(hasShield)
  }, [cls])

  // Auto-generate starting equipment when class/race/background changes
  useEffect(() => {
    if (!clsName) return
    
    const equipment: string[] = []
    
    // Class equipment
    const classEq = getStartingEquipment(clsName)
    if (classEq.armor) equipment.push(`Armor: ${classEq.armor}`)
    if (classEq.shield) equipment.push('Shield')
    if (classEq.weapons.length > 0) {
      equipment.push('Weapons:')
      classEq.weapons.forEach(w => equipment.push(`  - ${w}`))
    }
    if (classEq.tools && classEq.tools.length > 0) {
      equipment.push('Tools:')
      classEq.tools.forEach(t => equipment.push(`  - ${t}`))
    }
    if (classEq.gear.length > 0) {
      equipment.push('Gear:')
      classEq.gear.forEach(g => equipment.push(`  - ${g}`))
    }
    
    // Background equipment
    if (bg?.equipment && bg.equipment.length > 0) {
      equipment.push('Background Items:')
      bg.equipment.forEach(item => equipment.push(`  - ${item}`))
    }
    
    setEquipmentItems(equipment)
    setStartingGold(getDefaultGoldForClass(clsName))
  }, [clsName, bg])

  const rollAll = () => {
    setBaseScores({
      str: rollAbilityScore(), dex: rollAbilityScore(), con: rollAbilityScore(),
      int: rollAbilityScore(), wis: rollAbilityScore(), cha: rollAbilityScore(),
    })
    toast.success('Ability scores (dasar) di-roll ulang!')
  }

  const toggleClassSkill = (name: string) => {
    if (!cls) return
    setClassSkills((prev) => {
      if (prev.includes(name)) return prev.filter((s) => s !== name)
      if (prev.length >= cls.skillsChoose) {
        toast.error(`Maksimal ${cls.skillsChoose} skill dari kelas`)
        return prev
      }
      return [...prev, name]
    })
  }

  const onSubmit = (data: FormValues) => {
    const b = backgroundId ? getBackground2024(backgroundId) : undefined
    const skillsRecord: Record<string, boolean> = {}
    for (const s of classSkills) skillsRecord[s] = true

    const innate = raceName ? innateSpellsFromRace(raceName) : []
    const slots = clsName ? spellSlotsForCharacter(clsName, data.level) : undefined

    // Get class data for proficiencies and hit die
    const classData = clsName ? getClass2024(clsName) : undefined
    const hitDieType = classData?.hitDie ?? 8

    // Initialize saving throws with class proficiencies
    const classSavingThrows = classData?.savingThrows ?? []
    const savingThrowsRecord = { ...defaultSavingThrows }
    for (const ability of classSavingThrows) {
      savingThrowsRecord[ability] = true
    }

    // Initialize proficiencies from class
    const weaponProficiencies = classData?.weaponProficiencies ?? []
    const armorProficiencies = classData?.armorProficiencies ?? []
    const toolProficiencies = classData?.toolProficiencies ?? []

    // Initialize languages from race (basic implementation - Common + racial languages)
    const languages = ['Common']
    if (raceName) {
      // Add racial languages based on race
      const raceLanguages: Record<string, string[]> = {
        'Dragonborn': ['Draconic'],
        'Dwarf': ['Dwarvish'],
        'Elf': ['Elvish'],
        'Gnome': ['Gnomish'],
        'Half-Elf': ['Elvish'],
        'Half-Orc': ['Orc'],
        'Halfling': ['Halfling'],
        'Tiefling': ['Infernal'],
      }
      if (raceLanguages[raceName]) {
        languages.push(...raceLanguages[raceName])
      }
    }

    const char = addCharacter({
      name: data.name,
      class: data.class as CharacterClass,
      race: data.race as CharacterRace,
      level: data.level,
      alignment: data.alignment as Alignment,
      background: b?.name ?? '',
      backgroundId: backgroundId || undefined,
      subclass: data.subclass || undefined,
      originFeat: b?.originFeat,
      abilityScores: effectiveScores,
      maxHp: data.maxHp,
      currentHp: data.maxHp,
      tempHp: 0,
      armorClass: data.armorClass,
      speed: data.speed,
      initiative: abilityModifier(effectiveScores.dex),
      proficiencyBonus: proficiencyBonus(data.level),
      savingThrows: savingThrowsRecord,
      skills: skillsRecord,
      weaponProficiencies,
      armorProficiencies,
      toolProficiencies,
      languages,
      spells: innate,
      spellSlots: slots,
      hitDice: {
        type: hitDieType,
        total: data.level,
        available: data.level,
      },
      equipment: equipmentItems.map((name, idx) => ({
        id: `eq-${Date.now()}-${idx}`,
        name: name.replace(/^- /, '').trim(),
        type: 'gear' as const,
        weight: 0,
        description: 'Starting equipment',
        equipped: true,
      })),
      gold: startingGold,
      notes: '',
      traits: data.traits ?? '',
      ideals: data.ideals ?? '',
      bonds: data.bonds ?? '',
      flaws: data.flaws ?? '',
      campaignId: null,
      ownerId: nickname ?? 'unknown',
    })
    toast.success(`${data.name} dibuat!`)
    navigate(`/characters/${char.id}`)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
          Buat Karakter
        </h1>
      </div>

      <p className="text-[11px] text-forest-light dark:text-parchment/40 mb-4">
        Aturan ringkas 2024: bonus +2/+1 dari <strong>Background</strong>, Origin Feat dari background, subclass umumnya level 3.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="name">Nama Karakter</Label>
              <Input id="name" placeholder="Masukkan nama..." {...register('name')} className="mt-1" />
              {errors.name && <p className="text-crimson text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ras</Label>
                <Select
                  value={watch('race') || ''}
                  onValueChange={(v) => setValue('race', v)}
                >
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih ras..." /></SelectTrigger>
                  <SelectContent>
                    {RACES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.race && <p className="text-crimson text-xs mt-1">Wajib diisi</p>}
              </div>
              <div>
                <Label>Kelas</Label>
                <Select
                  value={watch('class') || ''}
                  onValueChange={(v) => setValue('class', v)}
                >
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kelas..." /></SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.class && <p className="text-crimson text-xs mt-1">Wajib diisi</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="level">Level</Label>
                <Input id="level" type="number" min={1} max={20} {...register('level', { valueAsNumber: true })} className="mt-1" />
              </div>
              <div>
                <Label>Alignment</Label>
                <Select value={watch('alignment') || ''} onValueChange={(v) => setValue('alignment', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    {ALIGNMENTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {level >= 3 && cls && (
              <div>
                <Label htmlFor="subclass">Subclass / archetype ({cls.id})</Label>
                <Input id="subclass" placeholder="Contoh: Champion, Evocation..." {...register('subclass')} className="mt-1" />
                <p className="text-[10px] text-forest-light/70 mt-1">Umumnya terbuka di level 3.</p>
              </div>
            )}

            <div>
              <Label>Background (2024 — menentukan ASI +2/+1 & Origin Feat)</Label>
              <Select
                value={backgroundId}
                onValueChange={(v) => setBackgroundId(v)}
              >
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih background..." /></SelectTrigger>
                <SelectContent>
                  {BACKGROUNDS_2024.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bg && (
                <p className="text-[11px] text-forest-mid dark:text-gold-light/80 mt-2 space-y-0.5">
                  <span className="block">ASI: +2 {bg.asiPlus2.toUpperCase()}, +1 {bg.asiPlus1.toUpperCase()}</span>
                  <span className="block">Origin Feat: {bg.originFeat}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {cls && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Skill dari kelas (pilih {cls.skillsChoose})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cls.skillOptions.map((sk) => {
                  const on = classSkills.includes(sk)
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleClassSkill(sk)}
                      className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                        on
                          ? 'bg-forest-deep text-parchment border-forest-deep dark:bg-gold dark:text-midnight dark:border-gold'
                          : 'border-forest-deep/20 text-forest-deep dark:text-parchment/70'
                      }`}
                    >
                      {sk}
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-forest-light/60 mt-2">{classSkills.length}/{cls.skillsChoose} dipilih</p>
            </CardContent>
          </Card>
        )}

        {ASI_LEVELS.has(level) && (
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="py-3 text-[11px] text-forest-deep dark:text-parchment/80">
              <strong>Level {level}:</strong> biasanya ASI atau Feat — sesuaikan skor secara manual atau catat di Notes setelah karakter dibuat.
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Ability (dasar, sebelum background)</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={rollAll}>
                <Dices className="h-3 w-3" />
                <RefreshCw className="h-3 w-3" />
                4d6
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {ABILITIES.map((ab) => {
                const baseMod = abilityModifier(baseScores[ab])
                const effMod = abilityModifier(effectiveScores[ab])
                return (
                  <div key={ab} className="text-center">
                    <p className="font-cinzel text-[10px] text-forest-light dark:text-parchment/50 uppercase tracking-wider mb-1">
                      {ABILITY_LABELS[ab]}
                    </p>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={baseScores[ab]}
                      onChange={(e) =>
                        setBaseScores((s) => ({
                          ...s,
                          [ab]: Math.min(30, Math.max(1, parseInt(e.target.value) || 1)),
                        }))
                      }
                      className="w-full text-center font-mono text-lg font-bold border-2 border-forest-deep/20 dark:border-forest-mid/30 rounded-lg py-2 bg-transparent text-forest-deep dark:text-parchment focus:outline-none focus:border-forest-mid"
                    />
                    <p className={`font-mono text-xs font-bold mt-1 ${effMod >= 0 ? 'text-forest-mid dark:text-gold-light' : 'text-crimson'}`}>
                      {formatModifier(baseMod)}
                      {bg && effMod !== baseMod && (
                        <span className="text-forest-mid/80"> → {formatModifier(effMod)}</span>
                      )}
                    </p>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-forest-light/60 dark:text-parchment/30 text-center mt-3">
              Prof Bonus: +{proficiencyBonus(level)} · Initiative: {formatModifier(abilityModifier(effectiveScores.dex))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Perlengkapan & gerak (AC / Speed)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Armor</Label>
              <Select value={armorPreset} onValueChange={(v) => setArmorPreset(v as ArmorPreset)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ARMOR_PRESETS.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="shield" checked={shield} onCheckedChange={setShield} />
              <Label htmlFor="shield" className="text-sm cursor-pointer">Perisai (+2 AC)</Label>
            </div>
            <p className="text-[11px] text-forest-light dark:text-parchment/50">
              Speed mengikuti ras ({raceName ? defaultSpeed(raceName) : '—'} ft). HP dihitung: dadu penuh lv1 + rata-rata naik level + mod CON tiap level.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="maxHp">Max HP</Label>
                <Input id="maxHp" type="number" min={1} {...register('maxHp', { valueAsNumber: true })} className="mt-1 text-center font-mono" readOnly />
              </div>
              <div>
                <Label htmlFor="armorClass">AC</Label>
                <Input id="armorClass" type="number" min={1} {...register('armorClass', { valueAsNumber: true })} className="mt-1 text-center font-mono" readOnly />
              </div>
              <div>
                <Label htmlFor="speed">Speed</Label>
                <Input id="speed" type="number" min={1} {...register('speed', { valueAsNumber: true })} className="mt-1 text-center font-mono" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Character Traits - Auto Display */}
        {(raceName || clsName || bg) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Traits Karakter (Otomatis)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Race Traits */}
              {raceName && (
                <div className="p-3 bg-forest-deep/5 dark:bg-forest-deep/20 rounded-lg border-l-4 border-forest-deep">
                  <p className="text-xs font-bold text-forest-deep dark:text-gold-light mb-1">
                    🧬 RAS: {raceName.toUpperCase()}
                  </p>
                  <p className="text-sm text-forest-mid dark:text-parchment/80">
                    {getRace2024(raceName)?.traits || 'No racial traits'}
                  </p>
                </div>
              )}
              
              {/* Class Traits */}
              {cls && (
                <div className="p-3 bg-forest-deep/5 dark:bg-forest-deep/20 rounded-lg border-l-4 border-forest-mid">
                  <p className="text-xs font-bold text-forest-deep dark:text-gold-light mb-1">
                    ⚔️ KELAS: {clsName?.toUpperCase()}
                  </p>
                  <p className="text-sm text-forest-mid dark:text-parchment/80">
                    {cls.summary}
                  </p>
                </div>
              )}
              
              {/* Background Traits */}
              {bg && (
                <div className="p-3 bg-gold/10 dark:bg-gold/20 rounded-lg border-l-4 border-gold">
                  <p className="text-xs font-bold text-forest-deep dark:text-gold-light mb-1">
                    📜 BACKGROUND: {bg.name.toUpperCase()}
                  </p>
                  <p className="text-sm text-forest-mid dark:text-parchment/80 mb-2">
                    {bg.traitSummary}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-gold">★ Origin Feat:</span>{' '}
                    <span className="text-forest-deep dark:text-parchment">{bg.originFeat}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Kepribadian (Personality)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(['ideals', 'bonds', 'flaws'] as const).map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="capitalize text-xs font-semibold text-forest-light">
                  {field === 'ideals' ? 'Ideals (Cita-cita)' : field === 'bonds' ? 'Bonds (Ikatan)' : 'Flaws (Kelemahan)'}
                </Label>
                <Input 
                  id={field} 
                  placeholder={`Tulis ${field} karaktermu...`} 
                  {...register(field)} 
                  className="mt-1 text-sm" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Proficiencies Display */}
        {(cls || bg) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Proficiencies & Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cls && (
                <>
                  {cls.armorProficiencies.length > 0 && (
                    <div className="p-3 bg-forest-deep/5 rounded-lg">
                      <p className="text-[10px] uppercase text-forest-light/60 mb-1 font-bold">Armor Proficiencies</p>
                      <p className="text-sm">{cls.armorProficiencies.join(', ')}</p>
                    </div>
                  )}
                  <div className="p-3 bg-forest-deep/5 rounded-lg">
                    <p className="text-[10px] uppercase text-forest-light/60 mb-1 font-bold">Weapon Proficiencies</p>
                    <p className="text-sm">{cls.weaponProficiencies.join(', ')}</p>
                  </div>
                  {cls.toolProficiencies && cls.toolProficiencies.length > 0 && (
                    <div className="p-3 bg-forest-deep/5 rounded-lg">
                      <p className="text-[10px] uppercase text-forest-light/60 mb-1 font-bold">Tool Proficiencies</p>
                      <p className="text-sm">{cls.toolProficiencies.join(', ')}</p>
                    </div>
                  )}
                  <div className="p-3 bg-forest-deep/5 rounded-lg">
                    <p className="text-[10px] uppercase text-forest-light/60 mb-1 font-bold">Saving Throws</p>
                    <p className="text-sm">{cls.savingThrows.map(s => s.toUpperCase()).join(', ')}</p>
                  </div>
                </>
              )}
              
              {/* Languages */}
              <div className="p-3 bg-gold/10 rounded-lg border border-gold/30">
                <p className="text-[10px] uppercase text-forest-light/60 mb-1 font-bold">Languages Known</p>
                <p className="text-sm">
                  {raceName ? getRaceLanguages(raceName).join(', ') : 'Common'}
                  {bg?.languages && bg.languages.length > 0 && `, ${bg.languages.join(', ')}`}
                </p>
              </div>
              
              {bg?.toolProficiencies && bg.toolProficiencies.length > 0 && (
                <div className="p-3 bg-forest-deep/5 rounded-lg">
                  <p className="text-[10px] uppercase text-forest-light/60 mb-1 font-bold">Background Tools</p>
                  <p className="text-sm">{bg.toolProficiencies.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Features Display */}
        {(raceName || bg || cls) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
              {/* Race Features */}
              {raceName && (
                <div>
                  <p className="text-xs font-bold text-forest-mid mb-2">{raceName} Features</p>
                  <div className="space-y-2">
                    {getRaceFeatures(raceName).map((feature, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold">{feature.name}:</span>{' '}
                        <span className="text-forest-light">{feature.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Background Features */}
              {bg && bg.features.length > 0 && (
                <div className="border-t border-forest-deep/10 pt-3">
                  <p className="text-xs font-bold text-forest-mid mb-2">{bg.name} Background Features</p>
                  <div className="space-y-2">
                    {bg.features.map((feature, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold">{feature.name}:</span>{' '}
                        <span className="text-forest-light">{feature.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Class Features Summary */}
              {cls && (
                <div className="border-t border-forest-deep/10 pt-3">
                  <p className="text-xs font-bold text-forest-mid mb-2">{cls.id} Class Features</p>
                  <div className="text-sm text-forest-light">
                    <p className="mb-1"><span className="font-semibold">Hit Die:</span> d{cls.hitDie}</p>
                    <p className="mb-1"><span className="font-semibold">Spellcasting:</span> {cls.casterType === 'none' ? 'None' : cls.casterType}</p>
                    <p><span className="font-semibold">Subclass Level:</span> Level {cls.subclassLevel}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              Equipment & Gold (Auto-Generated)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-gold" />
                Starting Gold (gp)
              </Label>
              <Input 
                type="number" 
                min={0} 
                value={startingGold}
                onChange={(e) => setStartingGold(parseInt(e.target.value) || 0)}
                className="mt-1 text-center font-mono"
                placeholder="0"
              />
              <p className="text-[10px] text-forest-light mt-1">
                Auto-generated from class. Can be customized.
              </p>
            </div>
            
            <div>
              <Label>Starting Equipment</Label>
              <Textarea 
                className="mt-1 min-h-[120px] text-sm font-mono text-xs" 
                value={equipmentItems.join('\n')}
                onChange={(e) => setEquipmentItems(e.target.value.split('\n').filter(s => s.trim()))}
              />
              <p className="text-[10px] text-forest-light mt-1">
                Equipment auto-generated from class & background. Edit as needed.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={!!cls && classSkills.length < cls.skillsChoose}>
          ⚔️ Buat Karakter
        </Button>
        {cls && classSkills.length < cls.skillsChoose && (
          <p className="text-crimson text-xs text-center">Pilih {cls.skillsChoose - classSkills.length} skill kelas lagi.</p>
        )}
      </form>
    </div>
  )
}
