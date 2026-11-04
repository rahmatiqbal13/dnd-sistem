import { useState } from 'react'
import { Minus, Plus, Skull, Brain, Flag } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { getClassResources, RECHARGE_LABEL } from '@/lib/classResources'
import { levelForXp, XP_THRESHOLDS } from '@/lib/abilityGeneration'
import { cn } from '@/lib/utils'
import type { Character, StatusEffect } from '@/types'

const CONDITIONS: StatusEffect[] = [
  'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible',
  'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
]

const NO_CAMPAIGN = '__none__'
const NO_SPELL = '__none__'

function Pips({ count, filled, onToggle, tone }: {
  count: number; filled: number; onToggle: (i: number) => void; tone: 'good' | 'bad' | 'accent'
}) {
  const on = { good: 'bg-green-600 border-green-700', bad: 'bg-crimson border-crimson', accent: 'bg-forest-mid border-forest-mid' }[tone]
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1} dari ${count}`}
          aria-pressed={i < filled}
          onClick={() => onToggle(i)}
          className={cn(
            'h-7 w-7 rounded-full border-2 transition-colors',
            i < filled ? on : 'border-forest-deep/30 dark:border-parchment/30'
          )}
        />
      ))}
    </div>
  )
}

/** At-table tracking: temp HP, death saves, exhaustion, conditions, concentration, class resources, XP. */
export function TableTracker({ character }: { character: Character }) {
  const updateCharacter = useCharacterStore((s) => s.updateCharacter)
  const campaigns = useCampaignStore((s) => s.campaigns)
  const [tempInput, setTempInput] = useState('')
  const [xpInput, setXpInput] = useState('')

  const update = (u: Partial<Character>) => updateCharacter(character.id, u)
  const conditions = character.conditions ?? []
  const death = character.deathSaves ?? { successes: 0, failures: 0 }
  const exhaustion = character.exhaustionLevel ?? 0
  const resources = getClassResources(character.class, character.level, character.abilityScores)
  const used = character.resourcesUsed ?? {}
  const concentrationSpells = character.spells.filter((s) => /concentration/i.test(s.duration))
  const xp = character.xp ?? 0
  const xpLevel = levelForXp(xp)
  const nextXp = XP_THRESHOLDS[character.level]

  const toggleCondition = (c: StatusEffect) =>
    update({ conditions: conditions.includes(c) ? conditions.filter((x) => x !== c) : [...conditions, c] })

  const setResource = (id: string, value: number, max: number) =>
    update({ resourcesUsed: { ...used, [id]: Math.min(max, Math.max(0, value)) } })

  const setTemp = () => {
    const v = parseInt(tempInput)
    if (Number.isNaN(v) || v < 0) return
    // Temporary HP doesn't stack: keep the higher value
    update({ tempHp: Math.max(character.tempHp, v) })
    setTempInput('')
  }

  const addXp = () => {
    const v = parseInt(xpInput)
    if (!v) return
    update({ xp: Math.max(0, xp + v) })
    setXpInput('')
    toast.success(`${v > 0 ? '+' : ''}${v} XP`)
  }

  return (
    <div className="space-y-3 mb-3">
      {character.currentHp === 0 && (
        <Card className="border-crimson/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Skull className="h-4 w-4 text-crimson" /> Death Saves</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span>Berhasil</span>
              <Pips count={3} filled={death.successes} tone="good"
                onToggle={(i) => update({ deathSaves: { ...death, successes: death.successes === i + 1 ? i : i + 1 } })} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Gagal</span>
              <Pips count={3} filled={death.failures} tone="bad"
                onToggle={(i) => update({ deathSaves: { ...death, failures: death.failures === i + 1 ? i : i + 1 } })} />
            </div>
            {death.successes >= 3 && <p className="text-green-700 dark:text-green-400">Stabil.</p>}
            {death.failures >= 3 && <p className="text-crimson font-semibold">Karakter tewas.</p>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Kondisi & Konsentrasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-1.5">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                lang="en"
                aria-pressed={conditions.includes(c)}
                onClick={() => toggleCondition(c)}
                className={cn(
                  'min-h-9 px-3 rounded-full border text-xs font-medium transition-colors',
                  conditions.includes(c)
                    ? 'bg-crimson text-white border-crimson'
                    : 'border-forest-deep/25 text-forest-deep dark:text-parchment dark:border-parchment/25'
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Exhaustion</span>
            <div className="flex items-center gap-2">
              <Button size="icon-sm" variant="outline" aria-label="Kurangi exhaustion"
                onClick={() => update({ exhaustionLevel: Math.max(0, exhaustion - 1) as Character['exhaustionLevel'] })}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-mono font-bold w-6 text-center tabular-nums">{exhaustion}</span>
              <Button size="icon-sm" variant="outline" aria-label="Tambah exhaustion"
                onClick={() => update({ exhaustionLevel: Math.min(6, exhaustion + 1) as Character['exhaustionLevel'] })}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {exhaustion > 0 && (
            <p className="text-xs text-forest-deep/80 dark:text-parchment/70">
              −{exhaustion * 2} ke semua d20 Test, Speed −{exhaustion * 5} ft{exhaustion >= 6 ? ' · Level 6: tewas' : ''}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5"><Brain className="h-4 w-4" /> Konsentrasi</span>
            <Select
              value={character.concentration ?? NO_SPELL}
              onValueChange={(v) => update({ concentration: v === NO_SPELL ? null : v })}
            >
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_SPELL}>Tidak ada</SelectItem>
                {concentrationSpells.map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {character.concentration && (
            <p className="text-xs text-forest-deep/80 dark:text-parchment/70">
              Saat terkena damage: Constitution save DC max(10, setengah damage), maks DC 30.
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <span>Temp HP <span className="font-mono">({character.tempHp})</span></span>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                placeholder="0"
                aria-label="Temp HP"
                className="w-20 h-9 text-center font-mono rounded-md border border-forest-deep/30 bg-transparent"
              />
              <Button size="sm" variant="outline" onClick={setTemp}>Set</Button>
              {character.tempHp > 0 && (
                <Button size="sm" variant="ghost" onClick={() => update({ tempHp: 0 })}>Hapus</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {resources.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fitur Kelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {resources.map((r) => {
              const u = used[r.id] ?? 0
              const left = r.max - u
              return (
                <div key={r.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span lang="en" className="font-medium">{r.name}</span>
                    {r.max > 6 ? (
                      <div className="flex items-center gap-2">
                        <Button size="icon-sm" variant="outline" aria-label={`Pakai ${r.name}`}
                          onClick={() => setResource(r.id, u + 1, r.max)} disabled={left <= 0}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-mono font-bold tabular-nums w-14 text-center">{left}/{r.max}</span>
                        <Button size="icon-sm" variant="outline" aria-label={`Kembalikan ${r.name}`}
                          onClick={() => setResource(r.id, u - 1, r.max)} disabled={u <= 0}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Pips count={r.max} filled={left} tone="accent"
                        onToggle={(i) => setResource(r.id, i < left ? r.max - i : r.max - i - 1, r.max)} />
                    )}
                  </div>
                  <p className="text-xs text-forest-deep/70 dark:text-parchment/60">Pulih: {RECHARGE_LABEL[r.recharge]}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Flag className="h-4 w-4" /> Kampanye & XP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span>Kampanye</span>
            <Select
              value={character.campaignId ?? NO_CAMPAIGN}
              onValueChange={(v) => update({ campaignId: v === NO_CAMPAIGN ? null : v })}
            >
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CAMPAIGN}>Tidak ada</SelectItem>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>
              XP <span className="font-mono tabular-nums">{xp.toLocaleString()}</span>
              {nextXp !== undefined && <span className="text-forest-deep/70 dark:text-parchment/60"> / {nextXp.toLocaleString()}</span>}
            </span>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={xpInput}
                onChange={(e) => setXpInput(e.target.value)}
                placeholder="+XP"
                aria-label="Tambah XP"
                className="w-24 h-9 text-center font-mono rounded-md border border-forest-deep/30 bg-transparent"
              />
              <Button size="sm" variant="outline" onClick={addXp}>Tambah</Button>
            </div>
          </div>
          {xpLevel > character.level && (
            <p className="text-xs font-semibold text-forest-deep dark:text-gold-light">
              XP cukup untuk level {xpLevel}. Gunakan tombol Level Up.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
