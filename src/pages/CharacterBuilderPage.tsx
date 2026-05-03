import { useState } from 'react'
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
import { rollAbilityScore } from '@/lib/dice'
import { formatModifier, abilityModifier, ABILITY_LABELS, proficiencyBonus } from '@/lib/utils'
import type { CharacterClass, CharacterRace, Alignment, AbilityScores, Ability } from '@/types'

const CLASSES: CharacterClass[] = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard']
const RACES: CharacterRace[] = ['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Tiefling']
const ALIGNMENTS: Alignment[] = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil']

const schema = z.object({
  name: z.string().min(2, 'Min 2 karakter'),
  class: z.string().min(1),
  race: z.string().min(1),
  level: z.number().int().min(1).max(20),
  alignment: z.string().min(1),
  background: z.string().optional(),
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

export function CharacterBuilderPage() {
  const navigate = useNavigate()
  const { nickname } = useAppStore()
  const addCharacter = useCharacterStore((s) => s.addCharacter)

  const [scores, setScores] = useState<AbilityScores>({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 })

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { level: 1, maxHp: 10, armorClass: 10, speed: 30 },
  })

  const level = watch('level') || 1

  const rollAll = () => {
    setScores({
      str: rollAbilityScore(), dex: rollAbilityScore(), con: rollAbilityScore(),
      int: rollAbilityScore(), wis: rollAbilityScore(), cha: rollAbilityScore(),
    })
    toast.success('Ability scores di-roll ulang!')
  }

  const onSubmit = (data: FormValues) => {
    const char = addCharacter({
      name: data.name,
      class: data.class as CharacterClass,
      race: data.race as CharacterRace,
      level: data.level,
      alignment: data.alignment as Alignment,
      background: data.background ?? '',
      abilityScores: scores,
      maxHp: data.maxHp,
      currentHp: data.maxHp,
      tempHp: 0,
      armorClass: data.armorClass,
      speed: data.speed,
      initiative: abilityModifier(scores.dex),
      proficiencyBonus: proficiencyBonus(data.level),
      savingThrows: defaultSavingThrows,
      skills: {},
      spells: [],
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
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
                <Select onValueChange={(v) => setValue('race', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih ras..." /></SelectTrigger>
                  <SelectContent>
                    {RACES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.race && <p className="text-crimson text-xs mt-1">Wajib diisi</p>}
              </div>
              <div>
                <Label>Kelas</Label>
                <Select onValueChange={(v) => setValue('class', v)}>
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
                <Select onValueChange={(v) => setValue('alignment', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    {ALIGNMENTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="background">Background</Label>
              <Input id="background" placeholder="Acolyte, Criminal, Folk Hero..." {...register('background')} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Ability Scores */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Ability Scores</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={rollAll}>
                <Dices className="h-3 w-3" />
                <RefreshCw className="h-3 w-3" />
                Roll 4d6 drop lowest
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {ABILITIES.map((ab) => {
                const mod = abilityModifier(scores[ab])
                return (
                  <div key={ab} className="text-center">
                    <p className="font-cinzel text-[10px] text-forest-light dark:text-parchment/50 uppercase tracking-wider mb-1">
                      {ABILITY_LABELS[ab]}
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={scores[ab]}
                        onChange={(e) => setScores((s) => ({ ...s, [ab]: Math.min(30, Math.max(1, parseInt(e.target.value) || 1)) }))}
                        className="w-full text-center font-mono text-lg font-bold border-2 border-forest-deep/20 dark:border-forest-mid/30 rounded-lg py-2 bg-transparent text-forest-deep dark:text-parchment focus:outline-none focus:border-forest-mid"
                      />
                    </div>
                    <p className={`font-mono text-xs font-bold mt-1 ${mod >= 0 ? 'text-forest-mid dark:text-gold-light' : 'text-crimson'}`}>
                      {formatModifier(mod)}
                    </p>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-forest-light/60 dark:text-parchment/30 text-center mt-3">
              Prof Bonus: +{proficiencyBonus(level)} · Initiative: {formatModifier(abilityModifier(scores.dex))}
            </p>
          </CardContent>
        </Card>

        {/* Combat Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Statistik Combat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="maxHp">Max HP</Label>
                <Input id="maxHp" type="number" min={1} {...register('maxHp', { valueAsNumber: true })} className="mt-1 text-center font-mono" />
                {errors.maxHp && <p className="text-crimson text-xs mt-1">Invalid</p>}
              </div>
              <div>
                <Label htmlFor="armorClass">Armor Class</Label>
                <Input id="armorClass" type="number" min={1} {...register('armorClass', { valueAsNumber: true })} className="mt-1 text-center font-mono" />
              </div>
              <div>
                <Label htmlFor="speed">Speed (ft)</Label>
                <Input id="speed" type="number" min={1} {...register('speed', { valueAsNumber: true })} className="mt-1 text-center font-mono" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Kepribadian (Opsional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(['traits', 'ideals', 'bonds', 'flaws'] as const).map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="capitalize">{field}</Label>
                <Input id={field} placeholder={`${field}...`} {...register(field)} className="mt-1" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg">
          ⚔️ Buat Karakter
        </Button>
      </form>
    </div>
  )
}
