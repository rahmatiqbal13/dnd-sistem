import { FlaskConical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function HomebrewPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-6 w-6 text-forest-mid" />
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
          Homebrew Builder
        </h1>
        <Badge variant="outline" className="ml-auto border-gold/40 text-gold text-xs">
          v2
        </Badge>
      </div>

      <Card>
        <CardContent className="py-16 text-center space-y-3">
          <FlaskConical className="h-14 w-14 text-forest-deep/20 dark:text-parchment/20 mx-auto" />
          <p className="font-cinzel font-semibold text-forest-deep dark:text-parchment">
            Segera Hadir
          </p>
          <p className="text-sm text-forest-light dark:text-parchment/50 max-w-xs mx-auto">
            Homebrew Builder akan memungkinkan kamu membuat spell, monster, item, dan kelas
            kustom yang tersimpan di kompendium pribadimu.
          </p>
          <p className="text-xs text-forest-light/60 dark:text-parchment/30">
            Direncanakan untuk v2.0
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
