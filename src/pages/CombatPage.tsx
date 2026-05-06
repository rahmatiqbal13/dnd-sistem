import { useState } from 'react'
import { 
  Plus, 
  SkipForward, 
  SkipBack, 
  Sword, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Flame,
  Shield,
  Heart,
  Zap,
  Users,
  Skull,
  Target,
  RotateCcw,
  Play,
  Square
} from 'lucide-react'
import { toast } from 'sonner'
import { useCombatStore } from '@/store/combatStore'
import { useCharacterStore } from '@/store/characterStore'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { hpColor, hpColorText, cn } from '@/lib/utils'
import type { StatusEffect } from '@/types'

const STATUS_EFFECTS: StatusEffect[] = [
  'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Grappled',
  'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone',
  'Restrained', 'Stunned', 'Unconscious',
]

const STATUS_COLORS: Record<string, string> = {
  Blinded: 'bg-gray-500',
  Charmed: 'bg-pink-500',
  Deafened: 'bg-gray-500',
  Exhaustion: 'bg-yellow-600',
  Frightened: 'bg-purple-500',
  Grappled: 'bg-orange-500',
  Incapacitated: 'bg-red-500',
  Invisible: 'bg-blue-400',
  Paralyzed: 'bg-yellow-500',
  Petrified: 'bg-gray-600',
  Poisoned: 'bg-green-500',
  Prone: 'bg-brown-500',
  Restrained: 'bg-orange-600',
  Stunned: 'bg-yellow-500',
  Unconscious: 'bg-red-600',
}

export function CombatPage() {
  const { role } = useAppStore()
  const characters = useCharacterStore((s) => s.characters)
  const {
    combatants, currentTurnIndex, round, isActive,
    addCombatant, removeCombatant, applyDamage, healHp,
    updateInitiative, nextTurn, prevTurn, startCombat, endCombat, reset,
    addStatusEffect, removeStatusEffect, sortByInitiative,
  } = useCombatStore()

  const isDM = role === 'dm'
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hpInputs, setHpInputs] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: '', initiative: '', maxHp: '', armorClass: '', isNpc: false,
  })

  const handleAddFromCharacter = (charId: string) => {
    const char = characters.find((c) => c.id === charId)
    if (!char) return
    if (combatants.some((c) => c.characterId === charId)) {
      toast.error(`${char.name} sudah ada di combat`)
      return
    }
    addCombatant({
      name: char.name,
      initiative: char.initiative,
      maxHp: char.maxHp,
      currentHp: char.currentHp,
      tempHp: char.tempHp,
      armorClass: char.armorClass,
      isPlayer: true,
      isNpc: false,
      statusEffects: [],
      notes: '',
      characterId: charId,
    })
    toast.success(`${char.name} ditambahkan ke combat`)
  }

  const handleAddManual = () => {
    if (!form.name.trim() || !form.initiative || !form.maxHp) {
      toast.error('Isi nama, initiative, dan Max HP')
      return
    }
    const hp = parseInt(form.maxHp)
    addCombatant({
      name: form.name,
      initiative: parseInt(form.initiative) || 0,
      maxHp: hp,
      currentHp: hp,
      tempHp: 0,
      armorClass: parseInt(form.armorClass) || 10,
      isPlayer: false,
      isNpc: form.isNpc,
      statusEffects: [],
      notes: '',
    })
    toast.success(`${form.name} ditambahkan`)
    setForm({ name: '', initiative: '', maxHp: '', armorClass: '', isNpc: false })
    setShowAddForm(false)
  }

  const handleHpAction = (id: string, action: 'damage' | 'heal') => {
    const val = parseInt(hpInputs[id] ?? '') || 0
    if (val <= 0) return
    if (action === 'damage') applyDamage(id, val)
    else healHp(id, val)
    setHpInputs((prev) => ({ ...prev, [id]: '' }))
  }

  const currentCombatant = combatants[currentTurnIndex]

  return (
    <div className="container-responsive py-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-crimson via-red-900 to-red-950 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cinzel text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <Sword className="h-8 w-8 text-orange-400" />
                Combat Tracker
              </h1>
              {isActive && (
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-orange-500/30 text-orange-200 border-orange-400/50 text-sm px-3 py-1">
                    <Flame className="h-4 w-4 mr-1 inline" />
                    Round {round}
                  </Badge>
                  {currentCombatant && (
                    <span className="text-orange-200/80 text-sm">
                      Turn: <strong className="text-white">{currentCombatant.name}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {isDM && !isActive && combatants.length > 0 && (
                <Button 
                  onClick={() => { sortByInitiative(); startCombat(); toast.success('Combat dimulai!') }}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                >
                  <Play className="h-4 w-4 mr-1" /> Start Combat
                </Button>
              )}
              {isDM && isActive && (
                <Button 
                  variant="destructive" 
                  onClick={() => { endCombat(); toast.success('Combat selesai') }}
                  className="shadow-lg"
                >
                  <Square className="h-4 w-4 mr-1" /> End
                </Button>
              )}
              {isDM && !isActive && (
                <Button 
                  variant="outline" 
                  onClick={() => { reset(); toast.success('Reset') }}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Turn Controls */}
      {isActive && (
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-forest-light">Current Turn</p>
                  <p className="font-cinzel font-bold text-lg text-forest-deep dark:text-parchment">
                    {currentCombatant?.name || 'None'}
                  </p>
                </div>
              </div>
              
              {isDM && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevTurn}>
                    <SkipBack className="h-4 w-4 mr-1" /> Prev
                  </Button>
                  <Button 
                    onClick={nextTurn}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Next <SkipForward className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Combatant */}
      {isDM && (
        <div className="space-y-3">
          {!showAddForm ? (
            <Card className="border-dashed border-2 border-orange-500/30 bg-orange-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gold/20 text-gold border-gold/50">DM ONLY</Badge>
                    <span className="text-sm text-forest-light">Combat Control</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="w-full border-dashed border-2 border-orange-500/50 hover:border-orange-500 hover:bg-orange-500/10"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add NPC / Monster
                </Button>
                
                {characters.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-500/20">
                    <p className="text-xs text-forest-light mb-2">Quick Add Characters:</p>
                    <div className="flex flex-wrap gap-2">
                      {characters.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => handleAddFromCharacter(char.id)}
                          disabled={combatants.some((c) => c.characterId === char.id)}
                          className="px-3 py-1.5 rounded-lg border border-forest-deep/20 text-sm hover:bg-forest-deep/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          + {char.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-orange-500/30 shadow-lg">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-cinzel font-bold text-lg flex items-center gap-2">
                  <Skull className="h-5 w-5 text-orange-500" />
                  Add Combatant
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-forest-light mb-1 block">Name</label>
                    <Input 
                      placeholder="Goblin Warrior" 
                      value={form.name} 
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-forest-light mb-1 block">Initiative</label>
                    <Input 
                      placeholder="15" 
                      type="number" 
                      value={form.initiative} 
                      onChange={(e) => setForm((f) => ({ ...f, initiative: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-forest-light mb-1 block">Max HP</label>
                    <Input 
                      placeholder="30" 
                      type="number" 
                      value={form.maxHp} 
                      onChange={(e) => setForm((f) => ({ ...f, maxHp: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-forest-light mb-1 block">Armor Class</label>
                    <Input 
                      placeholder="15" 
                      type="number" 
                      value={form.armorClass} 
                      onChange={(e) => setForm((f) => ({ ...f, armorClass: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input 
                      type="checkbox" 
                      id="isNpc" 
                      checked={form.isNpc} 
                      onChange={(e) => setForm((f) => ({ ...f, isNpc: e.target.checked }))}
                      className="w-5 h-5 rounded border-forest-deep/30"
                    />
                    <label htmlFor="isNpc" className="text-sm">NPC / Monster</label>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleAddManual} className="flex-1 bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Combatant List */}
      {combatants.length === 0 ? (
        <Card className="border-dashed border-2 border-forest-deep/20">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-forest-deep/10 flex items-center justify-center mx-auto mb-4">
              <Sword className="h-10 w-10 text-forest-light" />
            </div>
            <p className="font-cinzel text-lg text-forest-deep dark:text-parchment mb-2">No combatants</p>
            <p className="text-sm text-forest-light">
              {isDM ? 'Add characters or NPCs to start combat' : 'Wait for the DM to start combat'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {combatants.map((c, idx) => {
            const isCurrentTurn = isActive && idx === currentTurnIndex
            const hpPct = Math.round((c.currentHp / c.maxHp) * 100)
            const isExpanded = expandedId === c.id
            const isDead = c.currentHp === 0

            return (
              <Card
                key={c.id}
                className={cn(
                  'card-hover transition-all border-2',
                  isCurrentTurn
                    ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                    : isDead 
                      ? 'border-gray-300 opacity-60' 
                      : 'border-transparent hover:border-forest-mid/30'
                )}
              >
                <CardContent className="p-4">
                  {/* Header Row */}
                  <div className="flex items-center gap-3">
                    {/* Turn Indicator */}
                    {isCurrentTurn && (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center animate-pulse">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    {/* Avatar */}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-cinzel font-bold",
                      c.isNpc 
                        ? "bg-crimson/20 text-crimson" 
                        : "bg-forest-deep/20 text-forest-deep dark:text-forest-light"
                    )}>
                      {c.isNpc ? <Skull className="h-5 w-5" /> : c.name.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          'font-cinzel font-bold truncate',
                          c.isNpc ? 'text-crimson' : 'text-forest-deep dark:text-parchment',
                          isDead && 'line-through'
                        )}>
                          {c.name}
                        </p>
                        {c.isNpc && (
                          <Badge variant="outline" className="text-[9px] border-crimson/30 text-crimson">
                            NPC
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-forest-light">
                        <Shield className="h-3 w-3" /> AC {c.armorClass}
                        {c.statusEffects.length > 0 && (
                          <span className="text-amber-600">
                            • {c.statusEffects.length} effects
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Initiative */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-[10px] text-forest-light uppercase">Init</p>
                      {isDM ? (
                        <Input
                          type="number"
                          value={c.initiative}
                          onChange={(e) => updateInitiative(c.id, parseInt(e.target.value) || 0)}
                          className="w-14 h-8 text-center font-mono font-bold text-sm p-0"
                        />
                      ) : (
                        <p className="font-mono font-bold text-lg">{c.initiative}</p>
                      )}
                    </div>
                    
                    {/* DM Controls */}
                    {isDM && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(isExpanded ? null : c.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCombatant(c.id)}
                          className="text-crimson hover:text-crimson hover:bg-crimson/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* HP Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-crimson" />
                        <span className="text-xs text-forest-light">HP</span>
                      </div>
                      <span className={cn('font-mono font-bold text-sm', hpColorText(c.currentHp, c.maxHp))}>
                        {c.currentHp}/{c.maxHp}
                        {c.tempHp > 0 && <span className="text-blue-500 ml-1">+{c.tempHp}</span>}
                      </span>
                    </div>
                    <Progress 
                      value={hpPct} 
                      indicatorClassName={hpColor(c.currentHp, c.maxHp)} 
                      className="h-2.5 rounded-full"
                    />
                  </div>

                  {/* Status Effects */}
                  {c.statusEffects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {c.statusEffects.map((effect) => (
                        <Badge 
                          key={effect} 
                          className={cn(
                            'text-[9px] text-white border-0',
                            STATUS_COLORS[effect] || 'bg-gray-500'
                          )}
                        >
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Expanded DM Controls */}
                  {isExpanded && isDM && (
                    <div className="mt-4 pt-4 border-t border-forest-deep/10 space-y-4">
                      {/* HP Controls */}
                      <div>
                        <label className="text-xs text-forest-light mb-2 block">HP Adjustment</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min={0}
                            placeholder="Amount"
                            value={hpInputs[c.id] ?? ''}
                            onChange={(e) => setHpInputs((prev) => ({ ...prev, [c.id]: e.target.value }))}
                            className="flex-1"
                          />
                          <Button 
                            variant="destructive" 
                            onClick={() => handleHpAction(c.id, 'damage')}
                          >
                            Damage
                          </Button>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleHpAction(c.id, 'heal')}
                          >
                            Heal
                          </Button>
                        </div>
                      </div>

                      {/* Status Effects */}
                      <div>
                        <label className="text-xs text-forest-light mb-2 block">Status Effects</label>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUS_EFFECTS.map((effect) => {
                            const active = c.statusEffects.includes(effect)
                            return (
                              <button
                                key={effect}
                                onClick={() => active ? removeStatusEffect(c.id, effect) : addStatusEffect(c.id, effect)}
                                className={cn(
                                  'px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
                                  active
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'bg-forest-deep/10 text-forest-light hover:bg-forest-deep/20'
                                )}
                              >
                                {effect}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
