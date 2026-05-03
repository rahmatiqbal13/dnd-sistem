import type { CompendiumCategory, CompendiumEntry } from '@/types'
import compendiumGenerated from './generated/compendium.json'
import { COMPENDIUM_BUILTIN } from './compendiumBuiltin'

const CATEGORIES: CompendiumCategory[] = ['spell', 'monster', 'condition', 'class', 'equipment']

function normalizeEntry(raw: unknown): CompendiumEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const e = raw as Record<string, unknown>
  const id = typeof e.id === 'string' ? e.id : null
  const name = typeof e.name === 'string' ? e.name : null
  const cat = typeof e.category === 'string' && (CATEGORIES as string[]).includes(e.category) ? e.category : null
  if (!id || !name || !cat) return null

  const subtitle = typeof e.subtitle === 'string' ? e.subtitle : ''
  const tags = Array.isArray(e.tags) ? e.tags.filter((t): t is string => typeof t === 'string') : []
  const content: Record<string, string> = {}
  if (e.content && typeof e.content === 'object' && !Array.isArray(e.content)) {
    for (const [k, v] of Object.entries(e.content as Record<string, unknown>)) {
      content[k] = typeof v === 'string' ? v : v == null ? '' : JSON.stringify(v)
    }
  }

  return { id, name, category: cat as CompendiumCategory, subtitle, tags, content }
}

const byId = new Map<string, CompendiumEntry>()

for (const raw of compendiumGenerated as unknown[]) {
  const e = normalizeEntry(raw)
  if (e) byId.set(e.id, e)
}
for (const e of COMPENDIUM_BUILTIN) {
  const n = normalizeEntry(e)
  if (n) byId.set(n.id, n)
}

export const COMPENDIUM_DATA: CompendiumEntry[] = [...byId.values()]
