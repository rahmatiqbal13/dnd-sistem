import { useNavigate } from 'react-router-dom'
import { Plus, Swords, BookOpen, Dice6, Users, Map, ChevronRight, Flame } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useCombatStore } from '@/store/combatStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { hpColor, hpColorText } from '@/lib/utils'

export function DashboardPage() {
  const { nickname, role } = useAppStore()
  const characters = useCharacterStore((s) => s.characters)
  const { campaigns, activeCampaignId } = useCampaignStore()
  const { isActive: combatActive, round, combatants, currentTurnIndex } = useCombatStore()
  const navigate = useNavigate()

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId)
  const myCharacters = characters.filter(
    (c) => c.ownerId === nickname || c.campaignId === activeCampaignId
  )
  const currentCombatant = combatants[currentTurnIndex]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Siang' : 'Selamat Malam'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
            {greeting}, {nickname}!
          </h1>
          <p className="text-forest-light dark:text-parchment/60 text-sm mt-0.5 font-crimson italic">
            {role === 'dm' ? '⚔️ Dungeon Master' : '🛡️ Adventurer'}
          </p>
        </div>
        <Badge variant={role === 'dm' ? 'dm' : 'player'} className="mt-1">
          {role === 'dm' ? 'DM' : 'Player'}
        </Badge>
      </div>

      {/* Active Combat Alert */}
      {combatActive && (
        <Card className="border-crimson/40 bg-crimson/5 dark:bg-crimson/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-crimson animate-pulse" />
                <div>
                  <p className="font-cinzel text-sm font-bold text-crimson">
                    Combat Aktif — Ronde {round}
                  </p>
                  {currentCombatant && (
                    <p className="text-xs text-forest-deep dark:text-parchment/70 mt-0.5">
                      Giliran: <strong>{currentCombatant.name}</strong>
                    </p>
                  )}
                </div>
              </div>
              <Button size="sm" variant="destructive" onClick={() => navigate('/combat')}>
                Lanjut <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Campaign */}
      {activeCampaign ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Map className="h-4 w-4 text-gold" />
                {activeCampaign.name}
              </CardTitle>
              <Badge variant="default" className="text-[10px]">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-forest-light dark:text-parchment/60">
              {activeCampaign.members.length} anggota • DM: {activeCampaign.dmNickname}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/campaign')} className="flex-1">
                Lihat Kampanye
              </Button>
              {role === 'dm' && (
                <Button size="sm" variant="default" onClick={() => navigate('/combat')} className="flex-1">
                  <Swords className="h-3 w-3" />
                  Combat
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-forest-deep/20">
          <CardContent className="p-4 text-center">
            <Map className="h-8 w-8 text-forest-light/50 mx-auto mb-2" />
            <p className="text-sm text-forest-light dark:text-parchment/50 mb-3">
              {role === 'dm' ? 'Belum ada kampanye aktif' : 'Belum bergabung ke kampanye'}
            </p>
            <Button size="sm" variant="outline" onClick={() => navigate('/campaign')}>
              {role === 'dm' ? (
                <><Plus className="h-3 w-3" /> Buat Kampanye</>
              ) : (
                'Bergabung Kampanye'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Characters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment uppercase tracking-wider">
            Karakterku
          </h2>
          <Button size="sm" variant="ghost" onClick={() => navigate('/characters')}>
            Lihat Semua <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        {myCharacters.length === 0 ? (
          <Card className="border-dashed border-forest-deep/20">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-forest-light/50 mx-auto mb-2" />
              <p className="text-sm text-forest-light dark:text-parchment/50 mb-3">
                Belum ada karakter
              </p>
              <Button size="sm" onClick={() => navigate('/characters/new')}>
                <Plus className="h-3 w-3" /> Buat Karakter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {myCharacters.slice(0, 3).map((char) => {
              const hpPct = Math.round((char.currentHp / char.maxHp) * 100)
              return (
                <Card
                  key={char.id}
                  className="cursor-pointer hover:border-forest-mid/40 transition-colors"
                  onClick={() => navigate(`/characters/${char.id}`)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment">
                          {char.name}
                        </p>
                        <p className="text-[11px] text-forest-light dark:text-parchment/50">
                          Lv {char.level} {char.race} {char.class}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-sm font-bold ${hpColorText(char.currentHp, char.maxHp)}`}>
                          {char.currentHp}/{char.maxHp}
                        </p>
                        <p className="text-[10px] text-forest-light dark:text-parchment/40">HP</p>
                      </div>
                    </div>
                    <Progress
                      value={hpPct}
                      indicatorClassName={hpColor(char.currentHp, char.maxHp)}
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment uppercase tracking-wider mb-3">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickActionCard
            icon={<Dice6 className="h-6 w-6 text-gold" />}
            label="Dice Roller"
            desc="Roll dadu"
            onClick={() => navigate('/dice')}
          />
          <QuickActionCard
            icon={<Swords className="h-6 w-6 text-crimson" />}
            label="Combat"
            desc="Initiative tracker"
            onClick={() => navigate('/combat')}
          />
          <QuickActionCard
            icon={<BookOpen className="h-6 w-6 text-forest-mid dark:text-gold-light" />}
            label="Kompendium"
            desc="Spell, monster, class"
            onClick={() => navigate('/compendium')}
          />
          <QuickActionCard
            icon={<Plus className="h-6 w-6 text-forest-deep dark:text-parchment/70" />}
            label="Buat Karakter"
            desc="Character builder"
            onClick={() => navigate('/characters/new')}
          />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  icon, label, desc, onClick,
}: { icon: React.ReactNode; label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-1 p-4 rounded-lg border border-forest-deep/15 dark:border-forest-mid/20 bg-white dark:bg-midnight/60 hover:border-forest-mid/40 hover:bg-forest-deep/5 dark:hover:bg-forest-mid/20 transition-all text-left active:scale-95 min-h-[80px]"
    >
      {icon}
      <p className="font-cinzel text-xs font-semibold text-forest-deep dark:text-parchment mt-1">{label}</p>
      <p className="text-[10px] text-forest-light dark:text-parchment/40">{desc}</p>
    </button>
  )
}
