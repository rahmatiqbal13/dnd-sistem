import { useState, useMemo } from 'react'
import { Search, X, ChevronRight, Sword, Sparkles, Activity, GraduationCap, Shield } from 'lucide-react'
import { COMPENDIUM_DATA } from '@/data/compendium'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CompendiumCategory, CompendiumEntry } from '@/types'

const CATEGORIES: { value: CompendiumCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'Semua', icon: null },
  { value: 'spell', label: 'Spell', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { value: 'monster', label: 'Monster', icon: <Sword className="h-3.5 w-3.5" /> },
  { value: 'condition', label: 'Kondisi', icon: <Activity className="h-3.5 w-3.5" /> },
  { value: 'class', label: 'Kelas', icon: <GraduationCap className="h-3.5 w-3.5" /> },
  { value: 'equipment', label: 'Equipment', icon: <Shield className="h-3.5 w-3.5" /> },
]

const CATEGORY_COLORS: Record<CompendiumCategory, string> = {
  spell: 'text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-900/20',
  monster: 'text-crimson bg-red-50 dark:text-red-300 dark:bg-red-900/20',
  condition: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/20',
  class: 'text-forest-mid bg-forest-deep/5 dark:text-gold-light dark:bg-forest-mid/20',
  equipment: 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/20',
}

export function CompendiumPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CompendiumCategory | 'all'>('all')
  const [selected, setSelected] = useState<CompendiumEntry | null>(null)

  const filtered = useMemo(() => {
    return COMPENDIUM_DATA.filter((entry) => {
      const matchCat = category === 'all' || entry.category === category
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.subtitle.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [search, category])

  if (selected) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-sm text-forest-light dark:text-parchment/50 hover:text-forest-deep dark:hover:text-parchment mb-4 transition-colors"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Kembali
        </button>

        <div className="mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light">
                {selected.name}
              </h1>
              <p className="text-forest-light dark:text-parchment/50 text-sm mt-0.5">{selected.subtitle}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selected.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                ))}
              </div>
            </div>
            <span className={cn('text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider shrink-0', CATEGORY_COLORS[selected.category])}>
              {selected.category}
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            {Object.entries(selected.content).map(([key, value]) => (
              <div key={key}>
                <p className="text-[10px] font-bold text-forest-light dark:text-parchment/40 uppercase tracking-wider mb-0.5">
                  {key}
                </p>
                <p className="text-sm text-forest-deep dark:text-parchment/80 font-crimson leading-relaxed">
                  {value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light mb-4">
        Kompendium
      </h1>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-light/60" />
        <Input
          placeholder="Cari spell, monster, kondisi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-light/60 hover:text-forest-deep"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={cn(
              'flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
              category === value
                ? 'bg-forest-deep text-parchment border-forest-deep'
                : 'border-forest-deep/15 dark:border-forest-mid/20 text-forest-deep dark:text-parchment/70 hover:border-forest-mid/40'
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="text-xs text-forest-light dark:text-parchment/40 mb-2">
        {filtered.length} hasil
      </p>
      <div className="space-y-2">
        {filtered.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelected(entry)}
            className="w-full text-left"
          >
            <Card className="hover:border-forest-mid/40 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-cinzel text-sm font-semibold text-forest-deep dark:text-parchment truncate">
                        {entry.name}
                      </p>
                      <span className={cn('text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase shrink-0', CATEGORY_COLORS[entry.category])}>
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-xs text-forest-light dark:text-parchment/50 mt-0.5">{entry.subtitle}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] text-forest-light/70 dark:text-parchment/30">{tag}</span>
                      ))}
                      {entry.tags.length > 3 && (
                        <span className="text-[9px] text-forest-light/40">+{entry.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-forest-light/40 dark:text-parchment/30 shrink-0 mt-0.5" />
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-forest-light dark:text-parchment/50">Tidak ada hasil untuk "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
