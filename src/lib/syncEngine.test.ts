import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { create } from 'zustand'
import type { Character } from '@/types'

// Fake Supabase table: records upserts/deletes and serves a fixed select result
const fake = vi.hoisted(() => ({
  upserts: [] as unknown[][],
  deletes: [] as string[][],
  serverRows: [] as { id: string; campaign_id: string | null; data: unknown }[],
  upsertErrors: [] as ({ code: string } | null)[],
}))

vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  ensureSession: async () => {},
  currentUserId: async () => 'me',
  db: {
    characters: () => ({
      upsert: async (rows: unknown[]) => {
        fake.upserts.push(rows)
        return { error: fake.upsertErrors.shift() ?? null }
      },
      delete: () => ({
        in: async (_col: string, ids: string[]) => {
          fake.deletes.push(ids)
          return { error: null }
        },
      }),
      select: () => ({ eq: async () => ({ data: fake.serverRows, error: null }) }),
    }),
  },
}))
vi.mock('sonner', () => ({ toast: Object.assign(() => {}, { success: () => {}, error: () => {} }) }))

// Node has no window; the engine only needs it for the 'online' event
if (!('window' in globalThis)) Object.assign(globalThis, { window: new EventTarget() })

const { startCharacterSync } = await import('@/lib/sync')

const char = (id: string, name = id) =>
  ({ id, name, class: 'Rogue', race: 'Human', level: 1, maxHp: 8, currentHp: 8, tempHp: 0, armorClass: 12, campaignId: 'camp' }) as unknown as Character

const makeStore = (characters: Character[]) => create<{ characters: Character[] }>()(() => ({ characters }))

beforeEach(() => {
  vi.useFakeTimers()
  fake.upserts = []
  fake.deletes = []
  fake.serverRows = []
  fake.upsertErrors = []
})
afterEach(() => vi.useRealTimers())

const settle = async () => {
  await vi.runAllTimersAsync()
}

describe('startCharacterSync', () => {
  it('restores server characters missing locally and pushes local ones the server lacks', async () => {
    fake.serverRows = [{ id: 'remote', campaign_id: null, data: char('remote', 'From server') }]
    const store = makeStore([char('local')])
    const stop = startCharacterSync(store)
    await settle()

    expect(store.getState().characters.map((c) => c.name)).toEqual(['local', 'From server'])
    // Only "local" is new to the server; the restored one isn't pushed back
    expect(fake.upserts.flat().map((r) => (r as { id: string }).id)).toEqual(['local'])
    stop()
  })

  it('debounces edits into one upsert and deletes removed characters', async () => {
    fake.serverRows = [{ id: 'a', campaign_id: 'camp', data: char('a') }]
    const store = makeStore([char('a')])
    const stop = startCharacterSync(store)
    await settle()
    fake.upserts = []

    store.setState({ characters: [{ ...char('a'), currentHp: 5 }] })
    store.setState({ characters: [{ ...char('a'), currentHp: 3 }] })
    await settle()
    expect(fake.upserts).toHaveLength(1)
    expect((fake.upserts[0][0] as { current_hp: number }).current_hp).toBe(3)

    store.setState({ characters: [] })
    await settle()
    expect(fake.deletes).toEqual([['a']])
    stop()
  })

  it('retries without the campaign link when the campaign is local-only (FK violation)', async () => {
    fake.serverRows = [{ id: 'a', campaign_id: null, data: char('a') }]
    const store = makeStore([char('a')])
    const stop = startCharacterSync(store)
    await settle()
    fake.upserts = []

    fake.upsertErrors = [{ code: '23503' }]
    store.setState({ characters: [{ ...char('a'), currentHp: 1 }] })
    await settle()
    expect(fake.upserts.map((rows) => (rows[0] as { campaign_id: string | null }).campaign_id)).toEqual(['camp', null])
    stop()
  })

  it('keeps failed writes dirty and retries them when the browser comes back online', async () => {
    fake.serverRows = [{ id: 'a', campaign_id: 'camp', data: char('a') }]
    const store = makeStore([char('a')])
    const stop = startCharacterSync(store)
    await settle()
    fake.upserts = []

    fake.upsertErrors = [{ code: '08006' }]
    store.setState({ characters: [{ ...char('a'), currentHp: 2 }] })
    await settle()
    expect(fake.upserts).toHaveLength(1)

    window.dispatchEvent(new Event('online'))
    await settle()
    expect(fake.upserts).toHaveLength(2)
    expect((fake.upserts[1][0] as { current_hp: number }).current_hp).toBe(2)
    stop()
  })
})
