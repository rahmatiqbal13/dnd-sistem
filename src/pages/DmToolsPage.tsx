import { ShieldCheck, Heart, Star, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Navigate } from 'react-router-dom'

function HpControl({ characterId, name, currentHp, maxHp }: {
  characterId: string; name: string; currentHp: number; maxHp: number
}) {
  const { updateHp, setHp } = useCharacterStore()
  const [delta, setDelta] = useState('5')

  const pct = maxHp > 0 ? Math.round((currentHp / maxHp) * 100) : 0
  const barColor = pct > 50 ? 'bg-forest-mid' : pct > 25 ? 'bg-gold' : 'bg-crimson'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-forest-deep dark:text-parchment">{name}</span>
        <span className="text-sm font-bold text-crimson flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {currentHp}/{maxHp}
        </span>
      </div>
      <div className="w-full h-2 bg-forest-deep/10 dark:bg-parchment/10 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          min="1"
          className="w-16 rounded border border-forest-deep/15 dark:border-parchment/10 bg-white dark:bg-forest-deep/20 px-2 py-1 text-sm text-center text-forest-deep dark:text-parchment focus:outline-none"
        />
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-crimson border-crimson/30 hover:bg-crimson/10"
          onClick={() => {
            const d = parseInt(delta) || 0
            updateHp(characterId, -d)
            toast.success(`${name} -${d} HP`)
          }}
        >
          <Minus className="h-3.5 w-3.5 mr-1" /> Damage
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-forest-mid border-forest-mid/30 hover:bg-forest-mid/10"
          onClick={() => {
            const d = parseInt(delta) || 0
            updateHp(characterId, d)
            toast.success(`${name} +${d} HP`)
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Heal
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-forest-light dark:text-parchment/40 text-xs px-2"
          onClick={() => {
            setHp(characterId, maxHp)
            toast.success(`${name} HP penuh`)
          }}
        >
          Full
        </Button>
      </div>
    </div>
  )
}

export function DmToolsPage() {
  const { role } = useAppStore()
  const { campaigns, activeCampaignId } = useCampaignStore()
  const { characters } = useCharacterStore()
  const [xpAmount, setXpAmount] = useState('300')

  if (role !== 'dm') return <Navigate to="/dashboard" replace />

  const campaign = campaigns.find((c) => c.id === activeCampaignId)
  const partyChars = campaign
    ? characters.filter(
        (ch) =>
          ch.campaignId === campaign.id ||
          campaign.members.some((m) => m.characterId === ch.id)
      )
    : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-gold" />
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
          DM Tools
        </h1>
        <span className="text-[9px] font-cinzel font-bold text-gold bg-gold/15 border border-gold/40 px-1.5 py-0.5 rounded ml-auto">
          DM ONLY
        </span>
      </div>

      {/* HP Manager */}
      <Card className="border-crimson/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-crimson" />
            Manajemen HP Party
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {partyChars.length === 0 ? (
            <p className="text-sm text-forest-light dark:text-parchment/40 text-center py-4">
              {campaign ? 'Tidak ada karakter dalam kampanye ini' : 'Pilih kampanye aktif terlebih dahulu'}
            </p>
          ) : (
            partyChars.map((ch, i) => (
              <div key={ch.id}>
                {i > 0 && <Separator className="mb-4" />}
                <HpControl
                  characterId={ch.id}
                  name={ch.name}
                  currentHp={ch.currentHp}
                  maxHp={ch.maxHp}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* XP Grant */}
      <Card className="border-gold/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-gold" />
            Beri XP ke Party
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {partyChars.length === 0 ? (
            <p className="text-sm text-forest-light dark:text-parchment/40 text-center py-2">
              Tidak ada karakter untuk diberi XP
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  min="0"
                  placeholder="300"
                  className="flex-1 rounded border border-forest-deep/15 dark:border-parchment/10 bg-white dark:bg-forest-deep/20 px-3 py-2 text-sm text-forest-deep dark:text-parchment focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                <span className="text-sm text-forest-light dark:text-parchment/50">XP</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[100, 300, 500, 1000, 2000, 5000].map((xp) => (
                  <button
                    key={xp}
                    onClick={() => setXpAmount(String(xp))}
                    className="text-xs py-1.5 rounded border border-gold/20 text-gold hover:bg-gold/10 transition-colors"
                  >
                    {xp.toLocaleString()} XP
                  </button>
                ))}
              </div>
              <Button
                className="w-full bg-gold hover:bg-gold/90 text-midnight font-semibold"
                onClick={() => {
                  const xp = parseInt(xpAmount) || 0
                  if (xp <= 0) { toast.error('Masukkan jumlah XP yang valid'); return }
                  toast.success(`${xp.toLocaleString()} XP diberikan ke ${partyChars.length} karakter`)
                }}
              >
                <Star className="h-4 w-4" />
                Beri {parseInt(xpAmount) > 0 ? parseInt(xpAmount).toLocaleString() : '0'} XP ke Party
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {campaign && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Info Kampanye</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-forest-light dark:text-parchment/50">Nama</span>
              <span className="font-medium text-forest-deep dark:text-parchment">{campaign.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest-light dark:text-parchment/50">Anggota</span>
              <Badge variant="outline">{campaign.members.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-forest-light dark:text-parchment/50">Kode Undangan</span>
              <span className="font-mono text-xs font-bold text-gold tracking-wider">{campaign.inviteCode}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
