import { Users2, Heart, Shield, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function PartyPage() {
  const navigate = useNavigate()
  const { nickname } = useAppStore()
  const { campaigns, activeCampaignId } = useCampaignStore()
  const { characters } = useCharacterStore()

  const campaign = campaigns.find((c) => c.id === activeCampaignId)
  const partyCharacters = campaign
    ? characters.filter(
        (ch) =>
          ch.campaignId === campaign.id ||
          campaign.members.some((m) => m.characterId === ch.id)
      )
    : characters.filter((ch) => ch.ownerId === (nickname ?? ''))

  const hpPercent = (current: number, max: number) =>
    max > 0 ? Math.round((current / max) * 100) : 0

  const hpColor = (pct: number) => {
    if (pct > 50) return 'bg-forest-mid'
    if (pct > 25) return 'bg-gold'
    return 'bg-crimson'
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <Users2 className="h-6 w-6 text-forest-mid" />
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
          Party
        </h1>
        {campaign && (
          <Badge variant="outline" className="ml-auto text-xs border-forest-mid/40 text-forest-mid dark:text-parchment/60">
            {campaign.name}
          </Badge>
        )}
      </div>

      {partyCharacters.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <Users2 className="h-12 w-12 text-forest-deep/20 dark:text-parchment/20 mx-auto" />
          <p className="text-forest-light dark:text-parchment/40 text-sm">
            Belum ada karakter dalam party
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {partyCharacters.map((ch) => {
            const pct = hpPercent(ch.currentHp, ch.maxHp)
            return (
              <Card
                key={ch.id}
                className="cursor-pointer hover:border-forest-mid/50 transition-colors"
                onClick={() => navigate(`/characters/${ch.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-cinzel font-bold text-forest-deep dark:text-parchment">
                        {ch.name}
                      </p>
                      <p className="text-xs text-forest-light dark:text-parchment/50">
                        {ch.race} {ch.class} · Lvl {ch.level}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm shrink-0">
                      <span className="flex items-center gap-1 text-crimson font-semibold">
                        <Heart className="h-4 w-4" />
                        {ch.currentHp}/{ch.maxHp}
                      </span>
                      <span className="flex items-center gap-1 text-forest-mid dark:text-parchment/60">
                        <Shield className="h-4 w-4" />
                        {ch.armorClass}
                      </span>
                      <span className="flex items-center gap-1 text-gold">
                        <Zap className="h-4 w-4" />
                        {ch.initiative >= 0 ? '+' : ''}{ch.initiative}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-forest-deep/10 dark:bg-parchment/10 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', hpColor(pct))}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-forest-light dark:text-parchment/30 mt-1">
                    HP {pct}%
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
