import { useState, useMemo, useDeferredValue, useEffect } from 'react'
import { Search, X, ChevronRight, Sword, Sparkles, Activity, GraduationCap, Shield } from 'lucide-react'
import { COMPENDIUM_DATA } from '@/data/compendium'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CompendiumCategory, CompendiumEntry } from '@/types'

const LIST_BATCH = 50

function parseSpellLevel(subtitle: string): number {
  if (/cantrip/i.test(subtitle)) return 0
  const m = subtitle.match(/Level\s+(\d+)/i)
  return m ? parseInt(m[1]) : -1
}

// Derived once at module level from compendium data
const SPELL_CLASSES = [...new Set(
  COMPENDIUM_DATA.filter(e => e.category === 'spell').flatMap(e => e.tags)
)].sort()

const MONSTER_TYPES = [...new Set(
  COMPENDIUM_DATA.filter(e => e.category === 'monster')
    .flatMap(e => e.tags.filter(t => !t.startsWith('CR')))
)].sort()

const EQUIP_CATEGORIES = [...new Set(
  COMPENDIUM_DATA.filter(e => e.category === 'equipment').map(e => e.subtitle)
)].sort()

const SPELL_LEVEL_LABELS: Record<string, string> = {
  '0': 'Cantrip', '1': 'Lv 1', '2': 'Lv 2', '3': 'Lv 3', '4': 'Lv 4',
  '5': 'Lv 5', '6': 'Lv 6', '7': 'Lv 7', '8': 'Lv 8', '9': 'Lv 9',
}

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

function SubFilterBar({
  options,
  value,
  onChange,
  allLabel = 'Semua',
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  allLabel?: string
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange('all')}
        className={cn(
          'whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all shrink-0',
          value === 'all'
            ? 'bg-forest-deep text-parchment border-forest-deep'
            : 'border-forest-deep/20 dark:border-forest-mid/25 text-forest-deep dark:text-parchment/70 hover:border-forest-mid/40'
        )}
      >
        {allLabel}
      </button>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all shrink-0',
            value === opt
              ? 'bg-forest-deep text-parchment border-forest-deep'
              : 'border-forest-deep/20 dark:border-forest-mid/25 text-forest-deep dark:text-parchment/70 hover:border-forest-mid/40'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function CompendiumPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CompendiumCategory | 'all'>('all')
  const [selected, setSelected] = useState<CompendiumEntry | null>(null)
  const [visibleCount, setVisibleCount] = useState(LIST_BATCH)

  const [spellClass, setSpellClass] = useState('all')
  const [spellLevel, setSpellLevel] = useState('all')
  const [monsterType, setMonsterType] = useState('all')
  const [equipCat, setEquipCat] = useState('all')

  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    setSpellClass('all')
    setSpellLevel('all')
    setMonsterType('all')
    setEquipCat('all')
  }, [category])

  const filtered = useMemo(() => {
    return COMPENDIUM_DATA.filter((entry) => {
      const matchCat = category === 'all' || entry.category === category
      if (!matchCat) return false

      if (category === 'spell') {
        if (spellClass !== 'all' && !entry.tags.includes(spellClass)) return false
        if (spellLevel !== 'all' && String(parseSpellLevel(entry.subtitle)) !== spellLevel) return false
      }
      if (category === 'monster' && monsterType !== 'all') {
        const types = entry.tags.filter(t => !t.startsWith('CR'))
        if (!types.includes(monsterType)) return false
      }
      if (category === 'equipment' && equipCat !== 'all' && entry.subtitle !== equipCat) return false

      const q = deferredSearch.toLowerCase().trim()
      if (!q) return true
      const name = String(entry.name ?? '').toLowerCase()
      const subtitle = String(entry.subtitle ?? '').toLowerCase()
      const tags = entry.tags ?? []
      return (
        name.includes(q) ||
        subtitle.includes(q) ||
        tags.some((t) => String(t).toLowerCase().includes(q))
      )
    })
  }, [deferredSearch, category, spellClass, spellLevel, monsterType, equipCat])

  useEffect(() => {
    setVisibleCount(LIST_BATCH)
  }, [deferredSearch, category, spellClass, spellLevel, monsterType, equipCat])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = filtered.length > visible.length

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
              <p className="text-forest-light dark:text-parchment/50 text-sm mt-0.5">{selected.subtitle ?? ''}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {(selected.tags ?? []).map((tag) => (
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
            {Object.entries(selected.content ?? {}).map(([key, value]) => (
              <div key={key}>
                <p className="text-[10px] font-bold text-forest-light dark:text-parchment/40 uppercase tracking-wider mb-0.5">
                  {key}
                </p>
                <p className="text-sm text-forest-deep dark:text-parchment/80 font-crimson leading-relaxed whitespace-pre-wrap">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (COMPENDIUM_DATA.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="font-cinzel text-2xl font-black text-forest-deep dark:text-gold-light mb-4">
          Kompendium
        </h1>
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-forest-light dark:text-parchment/60 text-sm">
              Data kompendium belum diisi. Di folder proyek, jalankan:
            </p>
            <code className="block text-xs bg-forest-deep/10 dark:bg-parchment/5 p-2 rounded font-mono">
              npm run fetch:compendium
            </code>
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

      {/* Main Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-hide">
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

      {/* Sub-filters for Spell */}
      {category === 'spell' && (
        <div className="space-y-1.5 mb-3 p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/40 dark:border-purple-800/20">
          <p className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Filter Kelas</p>
          <SubFilterBar options={SPELL_CLASSES} value={spellClass} onChange={setSpellClass} />
          <p className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider mt-1.5">Filter Level</p>
          <SubFilterBar
            options={Object.keys(SPELL_LEVEL_LABELS)}
            value={spellLevel}
            onChange={setSpellLevel}
            allLabel="Semua Level"
          />
        </div>
      )}

      {/* Sub-filters for Monster */}
      {category === 'monster' && (
        <div className="space-y-1.5 mb-3 p-2.5 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-200/40 dark:border-red-800/20">
          <p className="text-[10px] font-semibold text-crimson dark:text-red-300 uppercase tracking-wider">Tipe Monster</p>
          <SubFilterBar options={MONSTER_TYPES} value={monsterType} onChange={setMonsterType} />
        </div>
      )}

      {/* Sub-filters for Equipment */}
      {category === 'equipment' && (
        <div className="space-y-1.5 mb-3 p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/40 dark:border-blue-800/20">
          <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Jenis Equipment</p>
          <SubFilterBar options={EQUIP_CATEGORIES} value={equipCat} onChange={setEquipCat} />
        </div>
      )}

      {/* Results Count */}
      <p className="text-xs text-forest-light dark:text-parchment/40 mb-2">
        {filtered.length} hasil
        {hasMore ? ` · menampilkan ${visible.length}` : ''}
      </p>

      {/* List */}
      <div className="space-y-2">
        {visible.map((entry) => (
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
                    <p className="text-xs text-forest-light dark:text-parchment/50 mt-0.5">{entry.subtitle ?? ''}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(entry.tags ?? []).slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] text-forest-light/70 dark:text-parchment/30">{tag}</span>
                      ))}
                      {(entry.tags ?? []).length > 3 && (
                        <span className="text-[9px] text-forest-light/40">+{(entry.tags ?? []).length - 3}</span>
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
            <p className="text-forest-light dark:text-parchment/50">
              {search.trim() ? `Tidak ada hasil untuk "${search}"` : 'Tidak ada entri untuk filter ini'}
            </p>
          </div>
        )}

        {hasMore && (
          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={() => setVisibleCount((c) => c + LIST_BATCH)}
          >
            Muat lebih banyak ({filtered.length - visible.length} sisanya)
          </Button>
        )}
      </div>
    </div>
  )
}
