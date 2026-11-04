import { Flame, Sword, Brain, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCharacterStore } from '@/store/characterStore'
import { useSharedCombat, type HealthLabel } from '@/lib/combatShare'
import { cn } from '@/lib/utils'
import type { Campaign } from '@/types'

const HEALTH_STYLE: Record<HealthLabel, string> = {
  Sehat: 'bg-forest-mid text-parchment',
  Terluka: 'bg-gold text-on-gold',
  Kritis: 'bg-crimson text-white',
  Tumbang: 'bg-midnight text-parchment',
}

/** Read-only live view of the DM's combat tracker for players. */
export function PlayerCombatView({ campaign }: { campaign: Campaign }) {
  const combat = useSharedCombat(campaign.id)
  const myIds = new Set(useCharacterStore((s) => s.characters).map((c) => c.id))
  const active = combat?.isActive && combat.combatants.length > 0
  const current = active ? combat.combatants[combat.currentTurnIndex] : undefined

  return (
    <div className="container-responsive py-6 space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-crimson via-red-900 to-red-950 p-6 text-white shadow-xl">
        <h1 className="font-cinzel text-2xl md:text-3xl font-black flex items-center gap-3">
          <Sword className="h-8 w-8 text-orange-400" /> Combat
        </h1>
        <p className="text-sm text-white/80 mt-1">{campaign.name} · tampilan pemain (live)</p>
        {active && (
          <div className="flex items-center gap-3 mt-3 flex-wrap" aria-live="polite">
            <Badge className="bg-orange-500/30 text-orange-100 border-orange-400/50 text-sm px-3 py-1">
              <Flame className="h-4 w-4 mr-1 inline" /> Round {combat.round}
            </Badge>
            {current && (
              <span className="text-sm">
                Giliran: <strong>{current.name}</strong>
                {current.characterId && myIds.has(current.characterId) && ' — giliranmu!'}
              </span>
            )}
          </div>
        )}
      </div>

      {!active ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center space-y-2">
            <Sword className="h-10 w-10 mx-auto text-forest-deep/30 dark:text-parchment/30" />
            <p className="font-cinzel text-lg">Belum ada combat</p>
            <p className="text-sm text-forest-deep/70 dark:text-parchment/60">
              Halaman ini akan otomatis berubah saat DM memulai combat.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ol className="space-y-3">
          {combat.combatants.map((c, idx) => {
            const isTurn = idx === combat.currentTurnIndex
            const isMine = !!c.characterId && myIds.has(c.characterId)
            const pct = c.hp && c.hp.max > 0 ? Math.round((c.hp.current / c.hp.max) * 100) : 0
            return (
              <li key={c.id}>
                <Card className={cn('border-2', isTurn ? 'border-orange-500 shadow-lg' : 'border-transparent')}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm tabular-nums w-8 text-center rounded bg-forest-deep/10 dark:bg-parchment/10 py-0.5">
                          {c.initiative}
                        </span>
                        <span className="font-cinzel font-bold">{c.name}</span>
                        {isMine && <Badge className="text-xs">Kamu</Badge>}
                        {isTurn && <Badge className="text-xs bg-orange-600 text-white border-0">Giliran sekarang</Badge>}
                      </div>
                      {c.hp ? (
                        <span className="flex items-center gap-1 font-mono text-sm tabular-nums">
                          <Heart className="h-4 w-4 text-crimson" />
                          {c.hp.current}/{c.hp.max}
                          {c.hp.temp > 0 && <span className="text-xs"> +{c.hp.temp}</span>}
                        </span>
                      ) : (
                        <Badge className={cn('text-xs border-0', HEALTH_STYLE[c.health])}>{c.health}</Badge>
                      )}
                    </div>
                    {c.hp && (
                      <div className="h-2 rounded-full bg-forest-deep/10 dark:bg-parchment/10 overflow-hidden">
                        <div className="h-full rounded-full bg-forest-mid" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    {(c.statusEffects.length > 0 || c.concentrating) && (
                      <div className="flex flex-wrap gap-1">
                        {c.concentrating && (
                          <Badge className="text-xs bg-forest-deep text-parchment border-0">
                            <Brain className="h-3 w-3 mr-1" /> Konsentrasi
                          </Badge>
                        )}
                        {c.statusEffects.map((e) => (
                          <Badge key={e} lang="en" className="text-xs bg-crimson text-white border-0">{e}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
