import { useState, useMemo, useDeferredValue } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Heart, Minus, Plus, Shield, Zap, Coins,
  Sword, Package, Trash2, Wand2, Search, X, ChevronUp,
  Dices, Moon, Sun, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCharacterStore } from '@/store/characterStore'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  abilityModifier, formatModifier, hpColor, hpColorText,
  ABILITY_LABELS, ABILITY_FULL, SKILLS_LIST,
} from '@/lib/utils'
import { resolveSpellSlots } from '@/lib/characterRules'
import { getClass2024 } from '@/data/dnd2024/classes'
import { getRace2024 } from '@/data/dnd2024/races'
import { getBackground2024 } from '@/data/dnd2024/backgrounds'
import { COMPENDIUM_DATA } from '@/data/compendium'
import { LevelUpDialog } from '@/components/character/LevelUpDialog'
import { canLevelUp, getLevelUpRequirements } from '@/lib/levelUp'
import type { Ability, EquipmentItem, CompendiumEntry } from '@/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseSpellLevel(subtitle: string): number {
  if (/cantrip/i.test(subtitle)) return 0
  const m = subtitle.match(/Level\s+(\d+)/i)
  return m ? parseInt(m[1]) : -1
}

function parseSpellSchool(subtitle: string): string {
  const parts = subtitle.trim().split(/\s+/)
  return parts[parts.length - 1] ?? ''
}

function componentsLookCostly(components: string): boolean {
  return /\d+\s*gp/i.test(components) || /worth at least/i.test(components.toLowerCase())
}

const CLASS_SPELL_TAG: Record<string, string> = {
  Bard: 'Bard', Cleric: 'Cleric', Druid: 'Druid',
  Paladin: 'Paladin', Ranger: 'Ranger', Sorcerer: 'Sorcerer',
  Warlock: 'Warlock', Wizard: 'Wizard',
}

const SPELL_LEVEL_LABEL: Record<number, string> = {
  0: 'Cantrip', 1: 'Level 1', 2: 'Level 2', 3: 'Level 3', 4: 'Level 4',
  5: 'Level 5', 6: 'Level 6', 7: 'Level 7', 8: 'Level 8', 9: 'Level 9',
}

const ALL_SPELL_CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard']

const PICKER_BATCH = 30

// ── Spell Picker Dialog ───────────────────────────────────────────────────────

interface SpellPickerDialogProps {
  open: boolean
  onClose: () => void
  characterClass: string
  knownIds: Set<string>
  onAdd: (entry: CompendiumEntry) => void
}

function SpellPickerDialog({ open, onClose, characterClass, knownIds, onAdd }: SpellPickerDialogProps) {
  const defaultClass = CLASS_SPELL_TAG[characterClass] ?? 'all'
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState(defaultClass)
  const [levelFilter, setLevelFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PICKER_BATCH)
  const deferred = useDeferredValue(search)

  const spells = useMemo(() => {
    return COMPENDIUM_DATA.filter(e => {
      if (e.category !== 'spell') return false
      if (classFilter !== 'all' && !e.tags.includes(classFilter)) return false
      if (levelFilter !== 'all' && String(parseSpellLevel(e.subtitle)) !== levelFilter) return false
      const q = deferred.toLowerCase().trim()
      return !q || e.name.toLowerCase().includes(q)
    })
  }, [deferred, classFilter, levelFilter])

  const visible = spells.slice(0, visibleCount)
  const hasMore = spells.length > visible.length

  function handleClose() {
    setSearch('')
    setClassFilter(defaultClass)
    setLevelFilter('all')
    setVisibleCount(PICKER_BATCH)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-lg w-full p-0 flex flex-col" style={{ height: '85dvh', maxHeight: '85dvh' }}>
        <DialogHeader className="px-4 pt-4 pb-0 shrink-0">
          <DialogTitle>Pilih Spell</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-4 pt-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-forest-light/60" />
            <Input
              placeholder="Cari nama spell..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PICKER_BATCH) }}
              className="pl-8 pr-8 h-8 text-sm"
            />
            {search && (
              <button onClick={() => { setSearch(''); setVisibleCount(PICKER_BATCH) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-light/60">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Class filter */}
        <div className="px-4 pt-2 shrink-0">
          <p className="text-[10px] font-semibold text-forest-light dark:text-parchment/40 uppercase tracking-wider mb-1">Kelas</p>
          <div className="flex flex-wrap gap-1.5">
            {['all', ...ALL_SPELL_CLASSES].map(cls => (
              <button
                key={cls}
                onClick={() => { setClassFilter(cls); setVisibleCount(PICKER_BATCH) }}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                  classFilter === cls
                    ? 'bg-forest-deep text-parchment border-forest-deep'
                    : 'border-forest-deep/20 dark:border-forest-mid/25 text-forest-deep dark:text-parchment/70'
                }`}
              >
                {cls === 'all' ? 'Semua' : cls}
              </button>
            ))}
          </div>
        </div>

        {/* Level filter */}
        <div className="px-4 pt-1 pb-2 border-b border-forest-deep/10 dark:border-forest-mid/15 shrink-0">
          <p className="text-[10px] font-semibold text-forest-light dark:text-parchment/40 uppercase tracking-wider mb-1">Level</p>
          <div className="flex flex-wrap gap-1.5">
            {['all', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(lv => (
              <button
                key={lv}
                onClick={() => { setLevelFilter(lv); setVisibleCount(PICKER_BATCH) }}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                  levelFilter === lv
                    ? 'bg-forest-deep text-parchment border-forest-deep'
                    : 'border-forest-deep/20 dark:border-forest-mid/25 text-forest-deep dark:text-parchment/70'
                }`}
              >
                {lv === 'all' ? 'Semua' : lv === '0' ? 'Cantrip' : `Lv ${lv}`}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
          <p className="text-[10px] text-forest-light dark:text-parchment/40 mb-1">{spells.length} spell ditemukan</p>
          {visible.map(entry => {
            const already = knownIds.has(entry.id)
            const lvl = parseSpellLevel(entry.subtitle)
            return (
              <div
                key={entry.id}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-forest-deep/10 dark:border-forest-mid/15 bg-white dark:bg-midnight/60"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-xs font-semibold text-forest-deep dark:text-parchment truncate">{entry.name}</p>
                  <p className="text-[10px] text-forest-light dark:text-parchment/40 mt-0.5">
                    {lvl === 0 ? 'Cantrip' : `Level ${lvl}`} · {parseSpellSchool(entry.subtitle)}
                    {entry.tags.length > 0 && ` · ${entry.tags.slice(0, 2).join(', ')}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={already ? 'ghost' : 'outline'}
                  className="h-7 px-2 text-xs shrink-0"
                  disabled={already}
                  onClick={() => !already && onAdd(entry)}
                >
                  {already ? '✓' : <Plus className="h-3.5 w-3.5" />}
                </Button>
              </div>
            )
          })}
          {visible.length === 0 && (
            <p className="text-center text-sm text-forest-light dark:text-parchment/50 py-8">Tidak ada spell ditemukan.</p>
          )}
          {hasMore && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setVisibleCount(c => c + PICKER_BATCH)}
            >
              Muat {Math.min(PICKER_BATCH, spells.length - visibleCount)} lagi
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function CharacterSheetPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const character = useCharacterStore((s) => s.characters.find((c) => c.id === id))
  const updateCharacter = useCharacterStore((s) => s.updateCharacter)
  const addSpell = useCharacterStore((s) => s.addSpell)
  const removeSpell = useCharacterStore((s) => s.removeSpell)
  const addEquipment = useCharacterStore((s) => s.addEquipment)
  const removeEquipment = useCharacterStore((s) => s.removeEquipment)
  const levelUp = useCharacterStore((s) => s.levelUp)
  const shortRest = useCharacterStore((s) => s.shortRest)
  const longRest = useCharacterStore((s) => s.longRest)
  const [hpDelta, setHpDelta] = useState('')
  const [showAddEquip, setShowAddEquip] = useState(false)
  const [equipForm, setEquipForm] = useState({ name: '', type: 'gear' as EquipmentItem['type'], weight: '', description: '' })
  const [spellFilter, setSpellFilter] = useState<'all' | 'ritual' | 'material' | 'innate'>('all')
  const [showSpellPicker, setShowSpellPicker] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showShortRest, setShowShortRest] = useState(false)
  const [showLongRest, setShowLongRest] = useState(false)
  const [hitDiceToSpend, setHitDiceToSpend] = useState(1)

  const slots = useMemo(
    () => (character ? resolveSpellSlots(character) : {}),
    [character]
  )
  const caster = character ? getClass2024(character.class) : undefined
  const showSlots =
    !!character && !!caster && caster.casterType !== 'none' && Object.keys(slots).length > 0

  const filteredSpells = useMemo(() => {
    if (!character) return []
    return character.spells.filter((s) => {
      if (spellFilter === 'ritual' && !s.ritual) return false
      if (spellFilter === 'material' && !s.costlyMaterial && !componentsLookCostly(s.components)) return false
      if (spellFilter === 'innate' && !s.innate) return false
      return true
    })
  }, [character, spellFilter])

  const groupedSpells = useMemo(() => {
    const map: Record<number, typeof filteredSpells> = {}
    for (const sp of filteredSpells) {
      const lv = sp.level ?? 0
      if (!map[lv]) map[lv] = []
      map[lv].push(sp)
    }
    return Object.entries(map)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([lv, spells]) => ({ level: Number(lv), spells }))
  }, [filteredSpells])

  const knownSpellIds = useMemo(
    () => new Set(character?.spells.map(s => s.id) ?? []),
    [character]
  )

  const adjustSpellSlot = (tier: number, delta: number) => {
    if (!character) return
    const s = resolveSpellSlots(character)
    const cur = s[tier]
    if (!cur) return
    const used = Math.min(cur.max, Math.max(0, cur.used + delta))
    updateCharacter(id!, { spellSlots: { ...s, [tier]: { max: cur.max, used } } })
  }

  const handleAddSpellFromCompendium = (entry: CompendiumEntry) => {
    if (!character) return
    if (knownSpellIds.has(entry.id)) { toast.error(`${entry.name} sudah ada`); return }
    const lvl = parseSpellLevel(entry.subtitle)
    const school = parseSpellSchool(entry.subtitle)
    const ct = entry.content['Casting Time'] ?? ''
    addSpell(id!, {
      id: entry.id,
      name: entry.name,
      level: lvl < 0 ? 0 : lvl,
      school,
      castingTime: ct,
      range: entry.content['Range'] ?? '',
      components: entry.content['Components'] ?? '',
      duration: entry.content['Duration'] ?? '',
      description: entry.content['Description'] ?? '',
      prepared: true,
      ritual: /ritual/i.test(ct),
      costlyMaterial: false,
      innate: false,
    })
    toast.success(`${entry.name} ditambahkan`)
  }

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-forest-light dark:text-parchment/50">Karakter tidak ditemukan.</p>
        <Button onClick={() => navigate('/characters')}>Kembali</Button>
      </div>
    )
  }

  const hpPct = Math.round((character.currentHp / character.maxHp) * 100)
  const ABILITIES: Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

  const handleAddEquip = () => {
    if (!equipForm.name.trim()) { toast.error('Nama item wajib diisi'); return }
    addEquipment(id!, {
      id: crypto.randomUUID(),
      name: equipForm.name.trim(),
      type: equipForm.type,
      weight: parseFloat(equipForm.weight) || 0,
      description: equipForm.description.trim(),
      equipped: false,
    })
    toast.success(`${equipForm.name} ditambahkan`)
    setEquipForm({ name: '', type: 'gear', weight: '', description: '' })
    setShowAddEquip(false)
  }

  const applyHpChange = (sign: 1 | -1) => {
    const val = parseInt(hpDelta) || 0
    if (val <= 0) return
    const delta = sign * val
    const newHp = Math.min(character.maxHp, Math.max(0, character.currentHp + delta))
    updateCharacter(id!, { currentHp: newHp })
    toast.success(`HP ${sign > 0 ? '+' : ''}${delta} → ${newHp}/${character.maxHp}`)
    setHpDelta('')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/characters')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-forest-light hover:text-forest-deep hover:bg-forest-deep/5 transition-all mb-4"
      >
        <div className="w-8 h-8 rounded-full bg-forest-deep/10 flex items-center justify-center">
          <ChevronLeft className="h-4 w-4" />
        </div>
        <span>Kembali ke Daftar</span>
      </button>

      {/* Character Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-deep via-forest-deep to-forest-mid p-6 mb-6 shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-forest-light/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          {/* Top Row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-midnight font-cinzel font-bold text-2xl shadow-lg">
                {character.name.charAt(0).toUpperCase()}
              </div>
              
              {/* Name & Info */}
              <div>
                <h1 className="font-cinzel text-2xl md:text-3xl font-black text-parchment">{character.name}</h1>
                <p className="text-gold-light/90 text-sm font-crimson">
                  Level {character.level} {character.race} {character.class}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {character.subclass && (
                    <Badge className="bg-forest-mid/50 text-parchment border-forest-light/30 text-xs">
                      {character.subclass}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-parchment/70 border-parchment/20 text-xs">
                    {character.alignment}
                  </Badge>
                  {character.originFeat && (
                    <Badge className="bg-gold/30 text-gold-light border-gold/50 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {character.originFeat}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Level Badge */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-gold/20 border-2 border-gold/50 flex items-center justify-center">
                <span className="font-cinzel font-bold text-xl text-gold-light">{character.level}</span>
              </div>
              <span className="text-[10px] text-parchment/50 mt-1 uppercase tracking-wider">Level</span>
            </div>
          </div>

          {/* HP Section */}
          <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-crimson/20 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-crimson" />
                </div>
                <span className="text-parchment/70 text-sm font-medium">Hit Points</span>
              </div>
              <span className={`font-mono font-bold text-lg ${hpColorText(character.currentHp, character.maxHp)}`}>
                {character.currentHp} / {character.maxHp}
                {character.tempHp > 0 && (
                  <span className="text-blue-400 text-sm ml-2">+{character.tempHp} temp</span>
                )}
              </span>
            </div>
            <Progress 
              value={hpPct} 
              indicatorClassName={hpColor(character.currentHp, character.maxHp)} 
              className="h-2.5 bg-forest-mid/30 rounded-full" 
            />
            
            {/* HP Controls */}
            <div className="flex gap-2 mt-4">
              <input
                type="number"
                min={0}
                value={hpDelta}
                onChange={(e) => setHpDelta(e.target.value)}
                placeholder="Amount"
                className="flex-1 h-10 text-center font-mono text-base rounded-lg border border-forest-mid/50 bg-forest-deep/50 text-parchment placeholder:text-parchment/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <Button 
                size="default" 
                onClick={() => applyHpChange(1)}
                className="bg-green-600 hover:bg-green-700 text-white px-4"
              >
                <Plus className="h-4 w-4 mr-1" /> Heal
              </Button>
              <Button 
                size="default" 
                variant="destructive" 
                onClick={() => applyHpChange(-1)}
                className="px-4"
              >
                <Minus className="h-4 w-4 mr-1" /> Damage
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <StatBox icon={<Shield className="h-4 w-4" />} label="AC" value={character.armorClass} />
            <StatBox icon={<Zap className="h-4 w-4" />} label="Initiative" value={formatModifier(character.initiative)} />
            <StatBox icon={<span className="text-sm font-bold">SPD</span>} label="Speed" value={`${character.speed}ft`} />
            <StatBox 
              icon={<Dices className="h-4 w-4" />} 
              label="Hit Dice" 
              value={character.hitDice ? `${character.hitDice.available}/${character.hitDice.total}` : '-'} 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {canLevelUp(character) && (
              <Button
                onClick={() => setShowLevelUp(true)}
                className="flex-1 bg-gold hover:bg-gold-light text-midnight font-semibold shadow-lg shadow-gold/20"
              >
                <ChevronUp className="h-5 w-5 mr-2" />
                Level Up Available!
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowShortRest(true)}
              className="flex-1 border-forest-light/30 text-parchment hover:bg-forest-mid/50"
            >
              <Dices className="h-4 w-4 mr-2" />
              Short Rest
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLongRest(true)}
              className="flex-1 border-forest-light/30 text-parchment hover:bg-forest-mid/50"
            >
              <Sun className="h-4 w-4 mr-2" />
              Long Rest
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stats">
        <TabsList className="w-full mb-1 grid grid-cols-5">
          <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          <TabsTrigger value="spells" className="text-xs">Spells</TabsTrigger>
          <TabsTrigger value="equipment" className="text-xs">Items</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
        </TabsList>

        {/* STATS TAB */}
        <TabsContent value="stats">
          <div className="grid grid-cols-3 gap-2">
            {ABILITIES.map((ab) => {
              const score = character.abilityScores[ab]
              const mod = abilityModifier(score)
              const saveProficient = character.savingThrows[ab]
              return (
                <div key={ab} className="flex flex-col items-center p-3 rounded-lg border border-forest-deep/15 dark:border-forest-mid/20 bg-white dark:bg-midnight/60">
                  <p className="font-cinzel text-[10px] text-forest-light dark:text-parchment/50 uppercase tracking-wider">
                    {ABILITY_LABELS[ab]}
                  </p>
                  <p className="font-cinzel text-2xl font-black text-forest-deep dark:text-parchment mt-1">{score}</p>
                  <p className={`font-mono text-sm font-bold ${mod >= 0 ? 'text-forest-mid dark:text-gold-light' : 'text-crimson'}`}>
                    {formatModifier(mod)}
                  </p>
                  {saveProficient && (
                    <Badge variant="default" className="text-[8px] px-1 py-0 mt-1">Save ✓</Badge>
                  )}
                </div>
              )
            })}
          </div>

          <Card className="mt-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">Proficiency & Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <InfoRow label="Proficiency Bonus" value={`+${character.proficiencyBonus}`} />
                <InfoRow label="Gold" value={`${character.gold} gp`} />
                <InfoRow label="Class" value={character.class} />
                <InfoRow label="Race" value={character.race} />
              </div>
            </CardContent>
          </Card>

          {/* Proficiencies */}
          <Card className="mt-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">Proficiencies & Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {(character.weaponProficiencies?.length ?? 0) > 0 && (
                <div>
                  <p className="text-[10px] uppercase text-forest-light/60 dark:text-parchment/40 mb-1">Weapons</p>
                  <p className="text-forest-deep dark:text-parchment">{character.weaponProficiencies?.join(', ')}</p>
                </div>
              )}
              {(character.armorProficiencies?.length ?? 0) > 0 && (
                <div>
                  <p className="text-[10px] uppercase text-forest-light/60 dark:text-parchment/40 mb-1">Armor</p>
                  <p className="text-forest-deep dark:text-parchment">{character.armorProficiencies?.join(', ')}</p>
                </div>
              )}
              {(character.toolProficiencies?.length ?? 0) > 0 && (
                <div>
                  <p className="text-[10px] uppercase text-forest-light/60 dark:text-parchment/40 mb-1">Tools</p>
                  <p className="text-forest-deep dark:text-parchment">{character.toolProficiencies?.join(', ')}</p>
                </div>
              )}
              {(character.languages?.length ?? 0) > 0 && (
                <div>
                  <p className="text-[10px] uppercase text-forest-light/60 dark:text-parchment/40 mb-1">Languages</p>
                  <p className="text-forest-deep dark:text-parchment">{character.languages?.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Character Traits Section */}
          <Card className="mt-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-gold" />
                Traits Karakter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Race Traits */}
              <div className="p-3 bg-forest-deep/5 dark:bg-forest-deep/20 rounded-lg border-l-4 border-forest-deep">
                <p className="text-xs font-bold text-forest-deep dark:text-gold-light mb-1">
                  🧬 RAS: {character.race.toUpperCase()}
                </p>
                <p className="text-sm text-forest-mid dark:text-parchment/80">
                  {getRace2024(character.race)?.traits || 'No racial traits available'}
                </p>
              </div>
              
              {/* Class Traits */}
              <div className="p-3 bg-forest-deep/5 dark:bg-forest-deep/20 rounded-lg border-l-4 border-forest-mid">
                <p className="text-xs font-bold text-forest-deep dark:text-gold-light mb-1">
                  ⚔️ KELAS: {character.class.toUpperCase()}
                </p>
                <p className="text-sm text-forest-mid dark:text-parchment/80">
                  {getClass2024(character.class)?.summary || 'No class features available'}
                </p>
              </div>
              
              {/* Background Traits */}
              {character.backgroundId && getBackground2024(character.backgroundId) && (
                <div className="p-3 bg-gold/10 dark:bg-gold/20 rounded-lg border-l-4 border-gold">
                  <p className="text-xs font-bold text-forest-deep dark:text-gold-light mb-1">
                    📜 BACKGROUND: {getBackground2024(character.backgroundId)?.name.toUpperCase()}
                  </p>
                  <p className="text-sm text-forest-mid dark:text-parchment/80 mb-2">
                    {getBackground2024(character.backgroundId)?.traitSummary}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-gold">★ Origin Feat:</span>{' '}
                    <span className="text-forest-deep dark:text-parchment">{character.originFeat}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {(character.ideals || character.bonds || character.flaws) && (
            <Card className="mt-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Kepribadian (Personality)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {character.ideals && <PersonalityRow label="Ideals" value={character.ideals} />}
                {character.bonds && <PersonalityRow label="Bonds" value={character.bonds} />}
                {character.flaws && <PersonalityRow label="Flaws" value={character.flaws} />}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SKILLS TAB */}
        <TabsContent value="skills">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-forest-deep/5 dark:divide-forest-mid/10">
                {SKILLS_LIST.map((skill) => {
                  const abilityScore = character.abilityScores[skill.ability]
                  const mod = abilityModifier(abilityScore)
                  const proficient = character.skills[skill.name] ?? false
                  const total = mod + (proficient ? character.proficiencyBonus : 0)
                  return (
                    <div key={skill.name} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            updateCharacter(id!, {
                              skills: { ...character.skills, [skill.name]: !proficient },
                            })
                          }}
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                            proficient
                              ? 'bg-forest-deep border-forest-deep dark:bg-gold dark:border-gold'
                              : 'border-forest-deep/30 dark:border-forest-mid/40'
                          }`}
                        />
                        <span className="text-sm text-forest-deep dark:text-parchment">{skill.name}</span>
                        <span className="text-[10px] text-forest-light/60 dark:text-parchment/30 uppercase">
                          {ABILITY_LABELS[skill.ability]}
                        </span>
                      </div>
                      <span className={`font-mono text-sm font-bold ${total >= 0 ? 'text-forest-mid dark:text-gold-light' : 'text-crimson'}`}>
                        {formatModifier(total)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          <p className="text-[10px] text-forest-light/50 dark:text-parchment/30 text-center mt-2">
            Tap lingkaran untuk toggle proficiency
          </p>
        </TabsContent>

        {/* SPELLS TAB */}
        <TabsContent value="spells">
          {/* Spell Slots */}
          {showSlots && (
            <Card className="mb-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Spell Slots ({caster?.casterType} caster)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(slots)
                  .map(Number)
                  .sort((a, b) => a - b)
                  .map((tier) => {
                    const { max, used } = slots[tier]!
                    return (
                      <div key={tier} className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-forest-light dark:text-parchment/60 w-16">Lv {tier}</span>
                        <span className="font-mono text-forest-deep dark:text-parchment">
                          {used}/{max} dipakai
                        </span>
                        <div className="flex gap-1">
                          <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => adjustSpellSlot(tier, 1)} disabled={used >= max}>
                            Pakai
                          </Button>
                          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => adjustSpellSlot(tier, -1)} disabled={used <= 0}>
                            Pulihkan
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'ritual', 'material', 'innate'] as const).map((f) => (
                <Button
                  key={f}
                  type="button"
                  size="sm"
                  variant={spellFilter === f ? 'default' : 'outline'}
                  className="text-[10px] h-7 capitalize"
                  onClick={() => setSpellFilter(f)}
                >
                  {f === 'all' ? 'Semua' : f === 'material' ? 'Material' : f}
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs shrink-0"
              onClick={() => setShowSpellPicker(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Tambah
            </Button>
          </div>

          {/* Spell Picker Dialog */}
          <SpellPickerDialog
            open={showSpellPicker}
            onClose={() => setShowSpellPicker(false)}
            characterClass={character.class}
            knownIds={knownSpellIds}
            onAdd={handleAddSpellFromCompendium}
          />

          {/* Grouped Spell List */}
          {character.spells.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">✨</p>
              <p className="text-forest-light dark:text-parchment/50 text-sm">Belum ada spell.</p>
              <p className="text-[11px] text-forest-light/50 dark:text-parchment/30 mt-1">
                Tekan "+ Tambah" untuk menambah spell dari kompendium.
              </p>
            </div>
          ) : filteredSpells.length === 0 ? (
            <p className="text-center text-sm text-forest-light dark:text-parchment/50 py-6">Tidak ada spell untuk filter ini.</p>
          ) : (
            <div className="space-y-4">
              {groupedSpells.map(({ level, spells }) => (
                <div key={level}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-cinzel text-xs font-bold text-forest-deep dark:text-gold-light uppercase tracking-wider">
                      {SPELL_LEVEL_LABEL[level] ?? `Level ${level}`}
                    </p>
                    <div className="flex-1 h-px bg-forest-deep/10 dark:bg-forest-mid/20" />
                    <span className="text-[10px] text-forest-light dark:text-parchment/40">{spells.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {spells.map((spell) => (
                      <Card key={spell.id}>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment">{spell.name}</p>
                              <p className="text-xs text-forest-light dark:text-parchment/50">
                                {spell.school}
                                {spell.castingTime && ` · ${spell.castingTime}`}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                              <div className="flex items-center gap-1">
                                <Badge variant={spell.prepared ? 'default' : 'outline'} className="text-[9px]">
                                  {spell.prepared ? 'Prepared' : 'Known'}
                                </Badge>
                                {spell.innate && <Badge variant="outline" className="text-[8px] border-gold/50 text-gold">Innate</Badge>}
                                {spell.ritual && <Badge variant="outline" className="text-[8px]">Ritual</Badge>}
                                {(spell.costlyMaterial || componentsLookCostly(spell.components)) && (
                                  <Badge variant="outline" className="text-[8px]">M$</Badge>
                                )}
                                <button
                                  onClick={() => {
                                    removeSpell(id!, spell.id)
                                    toast.success(`${spell.name} dihapus`)
                                  }}
                                  className="text-crimson/40 hover:text-crimson p-0.5 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                          {spell.range && (
                            <p className="text-[10px] text-forest-light/70 dark:text-parchment/40 mt-1">
                              {spell.components} · {spell.range} · {spell.duration}
                            </p>
                          )}
                          <p className="text-xs text-forest-light dark:text-parchment/60 mt-1 line-clamp-2">{spell.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* EQUIPMENT TAB */}
        <TabsContent value="equipment">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-gold" />
              <span className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment">
                {character.gold} gp
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddEquip(!showAddEquip)}>
              <Plus className="h-3.5 w-3.5" /> Tambah Item
            </Button>
          </div>

          {showAddEquip && (
            <Card className="mb-3 border-forest-mid/30">
              <CardContent className="p-3 space-y-2">
                <p className="font-cinzel text-xs font-semibold text-forest-deep dark:text-parchment">Item Baru</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <Label className="text-xs">Nama Item</Label>
                    <Input
                      placeholder="Longsword, Leather Armor..."
                      value={equipForm.name}
                      onChange={(e) => setEquipForm((f) => ({ ...f, name: e.target.value }))}
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tipe</Label>
                    <Select value={equipForm.type} onValueChange={(v) => setEquipForm((f) => ({ ...f, type: v as EquipmentItem['type'] }))}>
                      <SelectTrigger className="mt-1 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weapon">Weapon</SelectItem>
                        <SelectItem value="armor">Armor</SelectItem>
                        <SelectItem value="gear">Gear</SelectItem>
                        <SelectItem value="magic">Magic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Berat (lb)</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={equipForm.weight}
                      onChange={(e) => setEquipForm((f) => ({ ...f, weight: e.target.value }))}
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Deskripsi (opsional)</Label>
                    <Input
                      placeholder="Keterangan item..."
                      value={equipForm.description}
                      onChange={(e) => setEquipForm((f) => ({ ...f, description: e.target.value }))}
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddEquip} className="flex-1">Tambah</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddEquip(false)}>Batal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {character.equipment.length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-10 w-10 text-forest-light/30 mx-auto mb-3" />
              <p className="text-forest-light dark:text-parchment/50 text-sm">Belum ada item.</p>
              <p className="text-[11px] text-forest-light/50 dark:text-parchment/30 mt-1">
                Tekan "Tambah Item" untuk mulai mengisi inventory.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {character.equipment.map((item) => {
                const typeIcon = item.type === 'weapon' ? <Sword className="h-3.5 w-3.5" />
                  : item.type === 'armor' ? <Shield className="h-3.5 w-3.5" />
                  : item.type === 'magic' ? <Wand2 className="h-3.5 w-3.5" />
                  : <Package className="h-3.5 w-3.5" />
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      item.equipped
                        ? 'border-forest-mid/50 bg-forest-deep/5 dark:bg-forest-mid/10'
                        : 'border-forest-deep/10 dark:border-forest-mid/15 bg-white dark:bg-midnight/60'
                    }`}
                  >
                    <button
                      onClick={() => updateCharacter(id!, {
                        equipment: character.equipment.map((e) =>
                          e.id === item.id ? { ...e, equipped: !e.equipped } : e
                        ),
                      })}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        item.equipped
                          ? 'bg-forest-deep border-forest-deep dark:bg-gold dark:border-gold text-parchment'
                          : 'border-forest-deep/30 dark:border-forest-mid/40'
                      }`}
                      title={item.equipped ? 'Unequip' : 'Equip'}
                    >
                      {item.equipped && <span className="text-[9px] font-bold">✓</span>}
                    </button>

                    <span className={`flex-shrink-0 ${item.equipped ? 'text-forest-deep dark:text-gold-light' : 'text-forest-light/60 dark:text-parchment/30'}`}>
                      {typeIcon}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className={`font-cinzel text-sm font-semibold truncate ${item.equipped ? 'text-forest-deep dark:text-parchment' : 'text-forest-deep/70 dark:text-parchment/60'}`}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-auto capitalize">{item.type}</Badge>
                        {item.weight > 0 && (
                          <span className="text-[10px] text-forest-light/60 dark:text-parchment/30">{item.weight} lb</span>
                        )}
                        {item.equipped && (
                          <Badge variant="default" className="text-[8px] px-1 py-0 h-auto">Equipped</Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-forest-light dark:text-parchment/40 mt-0.5 font-crimson italic truncate">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        removeEquipment(id!, item.id)
                        toast.success(`${item.name} dihapus`)
                      }}
                      className="text-crimson/40 hover:text-crimson flex-shrink-0 p-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })}
              <p className="text-[10px] text-forest-light/50 dark:text-parchment/30 text-center mt-2">
                Tap lingkaran untuk toggle equipped · Total: {character.equipment.reduce((s, e) => s + e.weight, 0)} lb
              </p>
            </div>
          )}
        </TabsContent>

        {/* NOTES TAB */}
        <TabsContent value="notes">
          <Textarea
            value={character.notes}
            onChange={(e) => updateCharacter(id!, { notes: e.target.value })}
            placeholder="Tulis catatan karakter, riwayat, atau hal penting lainnya di sini..."
            className="min-h-[300px] font-crimson text-base leading-relaxed"
          />
          <p className="text-[10px] text-forest-light/50 dark:text-parchment/30 text-center mt-2">
            Catatan tersimpan otomatis
          </p>
        </TabsContent>
      </Tabs>

      {/* Level Up Dialog */}
      <LevelUpDialog
        open={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        character={character}
        onLevelUp={(options) => {
          levelUp(character.id, options)
          setShowLevelUp(false)
        }}
      />

      {/* Short Rest Dialog */}
      <Dialog open={showShortRest} onOpenChange={setShowShortRest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Short Rest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-forest-light">
              Spend Hit Dice to regain HP. You have {character.hitDice?.available || 0}d{character.hitDice?.type || 8} available.
            </p>
            <div className="flex items-center gap-4">
              <label className="text-sm">Hit Dice to spend:</label>
              <input
                type="number"
                min={1}
                max={character.hitDice?.available || 1}
                value={hitDiceToSpend}
                onChange={(e) => setHitDiceToSpend(Math.max(1, Math.min(character.hitDice?.available || 1, parseInt(e.target.value) || 1)))}
                className="w-20 text-center border rounded px-2 py-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowShortRest(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const result = shortRest(character.id, hitDiceToSpend)
                  toast.success(`Short rest complete! Regained ${result.healed} HP`)
                  setShowShortRest(false)
                  setHitDiceToSpend(1)
                }}
                disabled={!character.hitDice?.available}
                className="flex-1"
              >
                Rest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Long Rest Dialog */}
      <Dialog open={showLongRest} onOpenChange={setShowLongRest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Long Rest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-forest-light">
              A long rest restores all HP, regains half of your Hit Dice (minimum 1), reduces exhaustion by 1, and resets death saves.
            </p>
            <div className="bg-forest-deep/5 p-3 rounded text-sm space-y-1">
              <p>✓ Full HP recovery</p>
              <p>✓ Regain {Math.max(1, Math.floor((character.hitDice?.total || 1) / 2))} Hit Dice</p>
              <p>✓ Reduce exhaustion by 1</p>
              <p>✓ Reset death saves</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLongRest(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  longRest(character.id)
                  toast.success('Long rest complete! You feel refreshed.')
                  setShowLongRest(false)
                }}
                className="flex-1 bg-gold text-midnight hover:bg-gold/90"
              >
                <Sun className="h-4 w-4 mr-1" />
                Rest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatBox({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-forest-deep/40 border border-forest-light/20 backdrop-blur-sm">
      {icon && <span className="text-gold-light/80 mb-1">{icon}</span>}
      <span className="font-mono font-bold text-parchment text-lg">{value}</span>
      <span className="text-parchment/50 text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-forest-light dark:text-parchment/40 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-forest-deep dark:text-parchment">{value}</p>
    </div>
  )
}

function PersonalityRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-forest-light dark:text-parchment/40 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-forest-deep dark:text-parchment/80 font-crimson italic">{value}</p>
    </div>
  )
}
