import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dices, ChevronLeft, RefreshCw } from 'lucide-react'
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
import {
  applyBackgroundAsi,
  computeMaxHp,
  computeArmorClass,
  defaultSpeed,
  buildTraitsBlock,
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
    const sp = defaultSpeed(raceName)
    setValue('maxHp', hp)
    setValue('armorClass', ac)
    setValue('speed', sp)
  }, [cls, level, conMod, dexMod, armorPreset, shield, raceName, setValue])

  useEffect(() => {
    if (!clsName || !raceName) return
    const b = backgroundId ? getBackground2024(backgroundId) : undefined
    setValue('traits', buildTraitsBlock(raceName, clsName, b))
  }, [clsName, raceName, backgroundId, setValue])

  useEffect(() => {
    if (!cls) {
      setClassSkills([])
      return
    }
    setClassSkills((prev) => prev.filter((s) => cls.skillOptions.includes(s)).slice(0, cls.skillsChoose))
  }, [cls])

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
      savingThrows: defaultSavingThrows,
      skills: skillsRecord,
      spells: innate,
      spellSlots: slots,
      equipment: [],
      gold: 0,
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Kepribadian (opsional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Traits (auto dari ras/kelas/background — bisa edit)</Label>
              <Textarea className="mt-1 min-h-[100px] font-crimson text-sm" {...register('traits')} />
            </div>
            {(['ideals', 'bonds', 'flaws'] as const).map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="capitalize">{field}</Label>
                <Input id={field} placeholder={`${field}...`} {...register(field)} className="mt-1" />
              </div>
            ))}
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
