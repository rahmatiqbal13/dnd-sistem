import { Plus, Trash2, ChevronRight, Users, Crown, Shield, Zap, Heart, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCharacterStore } from '@/store/characterStore'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { hpColor, hpColorText, cn } from '@/lib/utils'
import { canLevelUp } from '@/lib/levelUp'

export function CharacterListPage() {
  const characters = useCharacterStore((s) => s.characters)
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter)
  const { nickname } = useAppStore()
  const navigate = useNavigate()

  const myChars = characters.filter((c) => c.ownerId === nickname)

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus karakter "${name}"?`)) return
    deleteCharacter(id)
    toast.success(`${name} dihapus`)
  }

  return (
    <div className="container-responsive py-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl gradient-forest p-6 text-parchment shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Crown className="h-7 w-7 text-gold-light" />
              </div>
              <div>
                <h1 className="font-cinzel text-2xl md:text-3xl font-black text-gold-light">
                  Karakterku
                </h1>
                <p className="text-parchment/70 text-sm mt-1">
                  {myChars.length} {myChars.length === 1 ? 'karakter' : 'karakter'} tersimpan
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/characters/new')}
              className="bg-gold hover:bg-gold-light text-midnight font-semibold shadow-lg"
            >
              <Plus className="h-4 w-4 mr-1" />
              Baru
            </Button>
          </div>
        </div>
      </div>

      {myChars.length === 0 ? (
        <Card className="border-dashed border-2 border-forest-deep/20 bg-forest-deep/5">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-forest-deep/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-forest-light" />
            </div>
            <p className="font-cinzel text-xl text-forest-deep dark:text-parchment mb-2">Belum ada karakter</p>
            <p className="text-forest-light mb-6 max-w-sm mx-auto">
              Buat karakter pertamamu untuk memulai petualangan D&D 5e
            </p>
            <Button 
              onClick={() => navigate('/characters/new')}
              className="bg-gold hover:bg-gold-light text-midnight"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Karakter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myChars.map((char) => {
            const hpPct = Math.round((char.currentHp / char.maxHp) * 100)
            const canLevel = canLevelUp(char)

            return (
              <Card
                key={char.id}
                className={cn(
                  "card-hover cursor-pointer border-2 transition-all",
                  canLevel ? "border-gold/50 shadow-md shadow-gold/10" : "border-transparent hover:border-forest-mid/30"
                )}
                onClick={() => navigate(`/characters/${char.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-deep to-forest-mid flex items-center justify-center text-parchment font-cinzel font-bold text-2xl shadow-lg">
                      {char.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-cinzel font-bold text-lg text-forest-deep dark:text-parchment">
                          {char.name}
                        </h3>
                        <Badge className="bg-forest-deep text-parchment text-xs">
                          Lv {char.level}
                        </Badge>
                        {canLevel && (
                          <Badge className="bg-gold text-midnight text-xs animate-pulse">
                            Level Up!
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-forest-light dark:text-parchment/60 mt-1">
                        {char.race} {char.class}
                        {char.selectedSubclass && (
                          <span className="text-forest-mid"> · {char.selectedSubclass.name}</span>
                        )}
                      </p>

                      {/* Badges */}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">
                          {char.alignment}
                        </Badge>
                        {char.feats && char.feats.length > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-gold/20 text-gold border-gold/50">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {char.feats.length} Feats
                          </Badge>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-forest-light">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" /> AC {char.armorClass}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5" /> Spd {char.speed}ft
                        </span>
                        <span className="flex items-center gap-1">
                          {char.hitDice && (
                            <>
                              <Heart className="h-3.5 w-3.5" /> 
                              {char.hitDice.available} HD
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* HP & Actions */}
                    <div className="text-right min-w-[100px]">
                      <p className={cn('font-mono font-bold text-lg', hpColorText(char.currentHp, char.maxHp))}>
                        {char.currentHp}/{char.maxHp}
                      </p>
                      <Progress
                        value={hpPct}
                        indicatorClassName={hpColor(char.currentHp, char.maxHp)}
                        className="h-1.5 w-20 mt-1 ml-auto"
                      />
                      <p className="text-[10px] text-forest-light mt-1">HP</p>
                    </div>

                    {/* Delete Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-crimson/40 hover:text-crimson hover:bg-crimson/10 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(char.id, char.name)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <ChevronRight className="h-5 w-5 text-forest-light/30 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
