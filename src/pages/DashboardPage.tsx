import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Swords, 
  BookOpen, 
  Dice6, 
  Users, 
  Map, 
  ChevronRight, 
  Flame, 
  Activity, 
  ChevronUp, 
  Sparkles, 
  Dices,
  Shield,
  Scroll,
  Crown
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useCombatStore } from '@/store/combatStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { hpColor, hpColorText } from '@/lib/utils'
import { canLevelUp } from '@/lib/levelUp'
import { cn } from '@/lib/utils'

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
    <div className="container-responsive py-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl gradient-forest p-6 text-parchment shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-cinzel text-2xl md:text-3xl font-black text-gold-light">
                {greeting}, {nickname}!
              </h1>
              <p className="text-parchment/80 text-sm mt-2 font-crimson italic">
                {role === 'dm' ? '⚔️ Dungeon Master' : '🛡️ Adventurer'}
              </p>
            </div>
            <Badge 
              variant={role === 'dm' ? 'dm' : 'player'} 
              className="mt-1 bg-parchment/20 text-parchment border-parchment/30"
            >
              {role === 'dm' ? 'DM' : 'Player'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Active Combat Alert */}
      {combatActive && (
        <Card className="border-crimson bg-gradient-to-r from-crimson/10 to-crimson/5 shadow-lg animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-crimson" />
                </div>
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
              <Button size="sm" variant="destructive" onClick={() => navigate('/combat')} className="shadow-md">
                Lanjut <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Campaign */}
      {activeCampaign ? (
        <Card className="card-hover shadow-md border-forest-deep/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                  <Map className="h-4 w-4 text-gold" />
                </div>
                {activeCampaign.name}
              </CardTitle>
              <Badge variant="default" className="bg-forest-deep text-parchment">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-forest-light dark:text-parchment/60">
              <Users className="h-4 w-4 inline mr-1" />
              {activeCampaign.members.length} anggota • DM: {activeCampaign.dmNickname}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/campaign')} className="flex-1">
                Lihat Kampanye
              </Button>
              {role === 'dm' && (
                <Button size="sm" className="flex-1 bg-forest-deep hover:bg-forest-mid" onClick={() => navigate('/combat')}>
                  <Swords className="h-3 w-3 mr-1" />
                  Combat
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-forest-deep/20 bg-forest-deep/5">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-forest-deep/10 flex items-center justify-center mx-auto mb-3">
              <Map className="h-8 w-8 text-forest-light" />
            </div>
            <p className="text-forest-light dark:text-parchment/50 mb-4">
              {role === 'dm' ? 'Belum ada kampanye aktif' : 'Belum bergabung ke kampanye'}
            </p>
            <Button onClick={() => navigate('/campaign')} className="btn-shine">
              {role === 'dm' ? (
                <><Plus className="h-4 w-4 mr-1" /> Buat Kampanye</>
              ) : (
                'Bergabung Kampanye'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Characters Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cinzel text-lg font-bold text-forest-deep dark:text-parchment flex items-center gap-2">
            <Crown className="h-5 w-5 text-gold" />
            Karakterku
          </h2>
          <Button size="sm" variant="ghost" onClick={() => navigate('/characters')} className="text-gold hover:text-gold-light">
            Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {myCharacters.length === 0 ? (
          <Card className="border-dashed border-2 border-forest-deep/20 bg-forest-deep/5">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-forest-deep/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-forest-light" />
              </div>
              <p className="text-forest-light dark:text-parchment/50 mb-4">
                Belum ada karakter
              </p>
              <Button onClick={() => navigate('/characters/new')} className="btn-shine bg-gold text-midnight hover:bg-gold-light">
                <Plus className="h-4 w-4 mr-1" /> Buat Karakter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {myCharacters.slice(0, 3).map((char) => {
              const hpPct = Math.round((char.currentHp / char.maxHp) * 100)
              const canLevel = canLevelUp(char)
              
              return (
                <Card
                  key={char.id}
                  className={cn(
                    "card-hover cursor-pointer transition-all border-forest-deep/10",
                    canLevel && "border-gold/50 shadow-md shadow-gold/10"
                  )}
                  onClick={() => navigate(`/characters/${char.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-deep to-forest-mid flex items-center justify-center text-parchment font-cinzel font-bold text-lg shadow-md">
                        {char.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-cinzel font-semibold text-forest-deep dark:text-parchment truncate">
                            {char.name}
                          </p>
                          {canLevel && (
                            <Badge className="bg-gold text-midnight text-[9px] animate-pulse">
                              <ChevronUp className="h-3 w-3 mr-0.5" />
                              Level Up!
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-forest-light dark:text-parchment/60">
                          Level {char.level} {char.race} {char.class}
                        </p>
                        
                        {/* Badges */}
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {char.selectedSubclass && (
                            <Badge variant="outline" className="text-[9px] bg-forest-deep/10 border-forest-deep/20">
                              {char.selectedSubclass.name}
                            </Badge>
                          )}
                          {char.feats && char.feats.length > 0 && (
                            <Badge variant="outline" className="text-[9px] bg-gold/20 text-gold border-gold/50">
                              <Sparkles className="h-3 w-3 mr-0.5" />
                              {char.feats.length} Feats
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* HP */}
                      <div className="text-right min-w-[80px]">
                        <p className={`font-mono font-bold ${hpColorText(char.currentHp, char.maxHp)}`}>
                          {char.currentHp}/{char.maxHp}
                        </p>
                        <Progress
                          value={hpPct}
                          indicatorClassName={hpColor(char.currentHp, char.maxHp)}
                          className="h-1.5 w-20 mt-1"
                        />
                        {char.hitDice && (
                          <p className="text-[10px] text-forest-light dark:text-parchment/40 mt-1 flex items-center justify-end gap-1">
                            <Dices className="h-3 w-3" />
                            {char.hitDice.available} HD
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="font-cinzel text-lg font-bold text-forest-deep dark:text-parchment mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-gold" />
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <QuickActionCard
            icon={<Dice6 className="h-7 w-7" />}
            label="Dice Roller"
            desc="Roll dadu"
            color="gold"
            onClick={() => navigate('/dice')}
          />
          <QuickActionCard
            icon={<Swords className="h-7 w-7" />}
            label="Combat"
            desc="Initiative tracker"
            color="crimson"
            onClick={() => navigate('/combat')}
          />
          <QuickActionCard
            icon={<Scroll className="h-7 w-7" />}
            label="Kompendium"
            desc="Spell & monster"
            color="forest"
            onClick={() => navigate('/compendium')}
          />
          <QuickActionCard
            icon={<Users className="h-7 w-7" />}
            label="Karakter"
            desc="Kelola karakter"
            color="blue"
            onClick={() => navigate('/characters')}
          />
          <QuickActionCard
            icon={<Plus className="h-7 w-7" />}
            label="Baru"
            desc="Buat karakter"
            color="purple"
            onClick={() => navigate('/characters/new')}
          />
          <QuickActionCard
            icon={<Activity className="h-7 w-7" />}
            label="System"
            desc="Debug & status"
            color="teal"
            onClick={() => navigate('/system-check')}
          />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  icon, label, desc, color, onClick,
}: { 
  icon: React.ReactNode; 
  label: string; 
  desc: string; 
  color: 'gold' | 'crimson' | 'forest' | 'blue' | 'purple' | 'teal';
  onClick: () => void;
}) {
  const colorStyles = {
    gold: 'from-amber-500/20 to-yellow-500/10 text-amber-600 border-amber-200 hover:border-amber-400',
    crimson: 'from-red-500/20 to-rose-500/10 text-red-600 border-red-200 hover:border-red-400',
    forest: 'from-green-500/20 to-emerald-500/10 text-green-600 border-green-200 hover:border-green-400',
    blue: 'from-blue-500/20 to-cyan-500/10 text-blue-600 border-blue-200 hover:border-blue-400',
    purple: 'from-purple-500/20 to-violet-500/10 text-purple-600 border-purple-200 hover:border-purple-400',
    teal: 'from-teal-500/20 to-cyan-500/10 text-teal-600 border-teal-200 hover:border-teal-400',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-left transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5 active:scale-95",
        colorStyles[color]
      )}
    >
      <div className="relative z-10">
        <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <p className="font-cinzel font-semibold text-sm">{label}</p>
        <p className="text-xs opacity-70 mt-0.5">{desc}</p>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  )
}
