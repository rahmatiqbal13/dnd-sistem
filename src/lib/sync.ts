import { toast } from 'sonner'
import type { Character } from '@/types'
import type { CharacterRow, Json } from '@/lib/database.types'
import { currentUserId, db, ensureSession, isSupabaseConfigured } from '@/lib/supabase'

// ── Row mapping ───────────────────────────────────────────────────────────────

/** Flat columns for listings and the DM view; `data` carries the whole sheet. */
export function characterToRow(c: Character) {
  return {
    id: c.id,
    campaign_id: c.campaignId,
    name: c.name,
    class: c.class,
    race: c.race,
    level: Math.min(20, Math.max(1, c.level)),
    max_hp: Math.max(0, c.maxHp),
    current_hp: Math.max(0, c.currentHp),
    temp_hp: Math.max(0, c.tempHp),
    armor_class: c.armorClass,
    data: c as unknown as Json,
  }
}

export function characterFromRow(r: Pick<CharacterRow, 'id' | 'campaign_id' | 'data'>): Character {
  return { ...(r.data as unknown as Character), id: r.id, campaignId: r.campaign_id }
}

// ── Error reporting: one toast per session, details in the console ──────────

let warned = false
export function reportSyncError(what: string, e: unknown) {
  console.warn(`[sync] ${what}`, e)
  if (!warned) {
    warned = true
    const detail =
      e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : String(e)
    toast.error('Sinkronisasi ke server gagal. Perubahan tetap tersimpan di perangkat ini.', {
      description: `${what}: ${detail}`,
    })
  }
}

/** Run a remote write without blocking the UI; no-op when Supabase isn't configured. */
export function syncInBackground(what: string, write: () => Promise<void>) {
  if (!isSupabaseConfigured) return
  write().catch((e) => reportSyncError(what, e))
}

// ── Character sync engine ────────────────────────────────────────────────────

const UPSERT_DELAY_MS = 1500

interface CharacterSource {
  getState: () => { characters: Character[] }
  setState: (fn: (s: { characters: Character[] }) => Partial<{ characters: Character[] }>) => void
  subscribe: (fn: (s: { characters: Character[] }, prev: { characters: Character[] }) => void) => () => void
}

/**
 * Keep this user's characters mirrored on the server.
 * - On start: characters on the server but missing locally (new device, cleared browser) are restored.
 * - On change: changed characters are upserted after a short debounce; deleted ones are deleted.
 * - Failed writes stay dirty and are retried when the browser comes back online.
 * The local copy is the source of truth for the owner's own sheets.
 */
export function startCharacterSync(store: CharacterSource): () => void {
  if (!isSupabaseConfigured) return () => {}

  const dirty = new Set<string>()
  const deleted = new Set<string>()
  // Characters just restored from the server: their arrival isn't a local edit
  const restoring = new Set<string>()
  let timer: ReturnType<typeof setTimeout> | null = null

  const flush = async () => {
    timer = null
    const ids = [...dirty]
    const gone = [...deleted]
    dirty.clear()
    deleted.clear()
    try {
      await ensureSession()
      const chars = store.getState().characters.filter((c) => ids.includes(c.id))
      if (chars.length) {
        const { error } = await db.characters().upsert(chars.map(characterToRow))
        // A campaign that never reached the server (local-only) breaks the foreign key: sync without the link
        if (error?.code === '23503') {
          const retry = await db.characters().upsert(chars.map((c) => ({ ...characterToRow(c), campaign_id: null })))
          if (retry.error) throw retry.error
        } else if (error) throw error
      }
      if (gone.length) {
        const { error } = await db.characters().delete().in('id', gone)
        if (error) throw error
      }
    } catch (e) {
      ids.forEach((id) => dirty.add(id))
      gone.forEach((id) => deleted.add(id))
      reportSyncError('characters', e)
    }
  }

  const schedule = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => void flush(), UPSERT_DELAY_MS)
  }

  const unsubscribe = store.subscribe((state, prev) => {
    if (state.characters === prev.characters) return
    const before = new Map(prev.characters.map((c) => [c.id, c]))
    for (const c of state.characters) {
      if (restoring.delete(c.id)) {
        before.delete(c.id)
        continue
      }
      if (before.get(c.id) !== c) {
        dirty.add(c.id)
        deleted.delete(c.id)
      }
      before.delete(c.id)
    }
    for (const id of before.keys()) {
      deleted.add(id)
      dirty.delete(id)
    }
    if (dirty.size || deleted.size) schedule()
  })

  const onOnline = () => {
    if (dirty.size || deleted.size) void flush()
  }
  window.addEventListener('online', onOnline)

  // Restore server copies missing locally, then push any local characters the server lacks
  void (async () => {
    try {
      await ensureSession()
      const uid = await currentUserId()
      if (!uid) return
      const { data, error } = await db.characters().select('id, campaign_id, data').eq('user_id', uid)
      if (error) throw error
      const local = new Set(store.getState().characters.map((c) => c.id))
      const remoteIds = new Set((data ?? []).map((r) => r.id))
      const missing = (data ?? []).filter((r) => !local.has(r.id) && r.data && Object.keys(r.data).length > 0)
      if (missing.length) {
        missing.forEach((r) => restoring.add(r.id))
        store.setState((s) => ({ characters: [...s.characters, ...missing.map(characterFromRow)] }))
        toast.success(`${missing.length} karakter dipulihkan dari server`)
      }
      for (const c of store.getState().characters) if (!remoteIds.has(c.id)) dirty.add(c.id)
      if (dirty.size) schedule()
    } catch (e) {
      reportSyncError('initial pull', e)
    }
  })()

  return () => {
    unsubscribe()
    window.removeEventListener('online', onOnline)
    if (timer) clearTimeout(timer)
  }
}

// ── Party (other members' characters, read-only) ─────────────────────────────

/** A synced character plus the Supabase user who owns it (to match it to a campaign member). */
export type PartyCharacter = Character & { ownerUserId?: string | null }

export async function fetchCampaignCharacters(campaignId: string): Promise<PartyCharacter[]> {
  await ensureSession()
  const { data, error } = await db.characters().select('id, campaign_id, data, user_id').eq('campaign_id', campaignId)
  if (error) throw error
  return (data ?? [])
    .filter((r) => r.data && Object.keys(r.data).length > 0)
    .map((r) => ({ ...characterFromRow(r), ownerUserId: r.user_id }))
}
