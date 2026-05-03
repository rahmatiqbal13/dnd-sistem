import { Plus, Trash2, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCharacterStore } from '@/store/characterStore'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { hpColor, hpColorText } from '@/lib/utils'

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
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">Karakterku</h1>
        <Button size="sm" onClick={() => navigate('/characters/new')}>
          <Plus className="h-4 w-4" />
          Buat Baru
        </Button>
      </div>

      {myChars.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🧙</div>
          <p className="font-cinzel text-lg text-forest-deep dark:text-parchment/70 mb-2">Belum ada karakter</p>
          <p className="text-sm text-forest-light dark:text-parchment/40 mb-5">
            Buat karakter pertamamu untuk memulai petualangan.
          </p>
          <Button onClick={() => navigate('/characters/new')}>
            <Plus className="h-4 w-4" />
            Buat Karakter
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {myChars.map((char) => {
            const hpPct = Math.round((char.currentHp / char.maxHp) * 100)
            return (
              <Card
                key={char.id}
                className="hover:border-forest-mid/40 transition-colors cursor-pointer"
                onClick={() => navigate(`/characters/${char.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-cinzel font-bold text-forest-deep dark:text-parchment">
                          {char.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          Lv {char.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-forest-light dark:text-parchment/50 mt-0.5">
                        {char.race} {char.class} · {char.alignment}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-crimson/60 hover:text-crimson hover:bg-crimson/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(char.id, char.name)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-forest-light/50" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-forest-light dark:text-parchment/50">HP</span>
                    <span className={`font-mono text-xs font-bold ${hpColorText(char.currentHp, char.maxHp)}`}>
                      {char.currentHp}/{char.maxHp}
                    </span>
                    <span className="text-[10px] text-forest-light/50 dark:text-parchment/30 ml-auto">
                      AC {char.armorClass} · Spd {char.speed}ft
                    </span>
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
  )
}
