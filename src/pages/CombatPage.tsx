import { useState } from 'react'
import { Plus, SkipForward, SkipBack, Sword, X, ChevronDown, ChevronUp, Flame } from 'lucide-react'
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

  // Add combatant form state
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
            Combat Tracker
          </h1>
          {isActive && (
            <p className="text-sm text-crimson font-medium mt-0.5 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" /> Ronde {round}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {isDM && !isActive && combatants.length > 0 && (
            <Button size="sm" onClick={() => { sortByInitiative(); startCombat(); toast.success('Combat dimulai!') }}>
              <Sword className="h-3.5 w-3.5" /> Mulai
            </Button>
          )}
          {isDM && isActive && (
            <Button size="sm" variant="destructive" onClick={() => { endCombat(); toast.success('Combat selesai') }}>
              End Combat
            </Button>
          )}
          {isDM && !isActive && (
            <Button size="sm" variant="outline" onClick={() => { reset(); toast.success('Reset') }}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Turn Controls */}
      {isActive && isDM && (
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={prevTurn} className="flex-1">
            <SkipBack className="h-4 w-4" /> Prev
          </Button>
          <Button size="sm" onClick={nextTurn} className="flex-1 bg-forest-deep text-parchment">
            Next Turn <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add Combatant */}
      {isDM && (
        <div className="mb-4">
          {!showAddForm ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-cinzel font-bold text-gold bg-gold/15 border border-gold/40 px-1.5 py-0.5 rounded">DM ONLY</span>
                <span className="text-[10px] text-forest-light/60 dark:text-parchment/30">Kontrol Combat</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed border-gold/40 hover:border-gold/70"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Tambah NPC / Monster
              </Button>
              {characters.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => handleAddFromCharacter(char.id)}
                      disabled={combatants.some((c) => c.characterId === char.id)}
                      className="text-xs px-2 py-1 rounded-md border border-forest-deep/20 text-forest-deep dark:text-parchment hover:bg-forest-deep/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      + {char.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment">
                  Tambah Combatant
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Nama" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  <Input placeholder="Initiative" type="number" value={form.initiative} onChange={(e) => setForm((f) => ({ ...f, initiative: e.target.value }))} />
                  <Input placeholder="Max HP" type="number" value={form.maxHp} onChange={(e) => setForm((f) => ({ ...f, maxHp: e.target.value }))} />
                  <Input placeholder="Armor Class" type="number" value={form.armorClass} onChange={(e) => setForm((f) => ({ ...f, armorClass: e.target.value }))} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isNpc" checked={form.isNpc} onChange={(e) => setForm((f) => ({ ...f, isNpc: e.target.checked }))} className="rounded" />
                  <label htmlFor="isNpc" className="text-sm text-forest-deep dark:text-parchment">NPC/Monster</label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddManual} className="flex-1">Tambah</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>Batal</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Combatant List */}
      {combatants.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">⚔️</div>
          <p className="font-cinzel text-forest-deep dark:text-parchment/60">Belum ada combatant</p>
          <p className="text-xs text-forest-light dark:text-parchment/30 mt-1">
            {isDM ? 'Tambah karakter atau NPC untuk memulai' : 'Tunggu DM memulai combat'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {combatants.map((c, idx) => {
            const isCurrentTurn = isActive && idx === currentTurnIndex
            const hpPct = Math.round((c.currentHp / c.maxHp) * 100)
            const isExpanded = expandedId === c.id

            return (
              <Card
                key={c.id}
                className={cn(
                  'transition-all',
                  isCurrentTurn
                    ? 'border-gold shadow-[0_0_0_2px_theme(colors.gold)]'
                    : c.currentHp === 0 && 'opacity-60'
                )}
              >
                <CardContent className="p-3">
                  {/* Row 1: Name + Initiative */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isCurrentTurn && <span className="text-gold text-sm">▶</span>}
                      <div className="flex flex-col min-w-0">
                        <span className={cn('font-cinzel text-sm font-bold truncate', c.isNpc ? 'text-crimson' : 'text-forest-deep dark:text-parchment')}>
                          {c.name}
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[10px] text-forest-light/60 dark:text-parchment/30">
                            AC {c.armorClass}
                          </span>
                          {c.statusEffects.map((e) => (
                            <Badge key={e} variant="status" className="text-[8px] px-1 py-0 h-auto">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="text-right">
                        <p className="font-mono text-xs text-forest-light/60 dark:text-parchment/30">Init</p>
                        {isDM ? (
                          <input
                            type="number"
                            value={c.initiative}
                            onChange={(e) => updateInitiative(c.id, parseInt(e.target.value) || 0)}
                            className="w-10 text-center font-mono font-bold text-sm bg-transparent border-b border-forest-deep/20 text-forest-deep dark:text-parchment focus:outline-none"
                          />
                        ) : (
                          <p className="font-mono font-bold text-sm text-forest-deep dark:text-parchment">{c.initiative}</p>
                        )}
                      </div>
                      {isDM && (
                        <>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : c.id)}
                            className="text-forest-light/60 hover:text-forest-deep dark:hover:text-parchment p-1"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => removeCombatant(c.id)}
                            className="text-crimson/40 hover:text-crimson p-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* HP Bar */}
                  <div className="mb-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-forest-light dark:text-parchment/40">HP</span>
                      <span className={`font-mono text-xs font-bold ${hpColorText(c.currentHp, c.maxHp)}`}>
                        {c.currentHp}/{c.maxHp}
                        {c.tempHp > 0 && <span className="text-blue-400 ml-1">+{c.tempHp}</span>}
                      </span>
                    </div>
                    <Progress value={hpPct} indicatorClassName={hpColor(c.currentHp, c.maxHp)} className="h-2" />
                  </div>

                  {/* Expanded DM Controls */}
                  {isExpanded && isDM && (
                    <div className="mt-3 pt-3 border-t border-forest-deep/10 dark:border-forest-mid/15 space-y-3">
                      {/* HP Controls */}
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min={0}
                          placeholder="HP amount"
                          value={hpInputs[c.id] ?? ''}
                          onChange={(e) => setHpInputs((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          className="flex-1 h-8 text-xs"
                        />
                        <Button size="sm" variant="destructive" className="h-8 text-xs px-2" onClick={() => handleHpAction(c.id, 'damage')}>
                          Damage
                        </Button>
                        <Button size="sm" variant="gold" className="h-8 text-xs px-2" onClick={() => handleHpAction(c.id, 'heal')}>
                          Heal
                        </Button>
                      </div>

                      {/* Status Effects */}
                      <div>
                        <p className="text-[10px] text-forest-light dark:text-parchment/40 uppercase tracking-wider mb-1.5">Status Effects</p>
                        <div className="flex flex-wrap gap-1">
                          {STATUS_EFFECTS.map((effect) => {
                            const active = c.statusEffects.includes(effect)
                            return (
                              <button
                                key={effect}
                                onClick={() => active ? removeStatusEffect(c.id, effect) : addStatusEffect(c.id, effect)}
                                className={cn(
                                  'text-[9px] px-1.5 py-0.5 rounded border transition-colors',
                                  active
                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-700 dark:text-amber-300'
                                    : 'border-forest-deep/15 text-forest-light dark:text-parchment/40 hover:border-forest-mid/40'
                                )}
                              >
                                {active ? '✓ ' : ''}{effect}
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
