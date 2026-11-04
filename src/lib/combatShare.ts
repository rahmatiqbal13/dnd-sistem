import { useEffect, useState } from 'react'
import type { Combatant, StatusEffect } from '@/types'
import type { Json } from '@/lib/database.types'
import { db, ensureSession, getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { reportSyncError } from '@/lib/sync'

/** How hurt a monster looks, without revealing numbers. */
export type HealthLabel = 'Sehat' | 'Terluka' | 'Kritis' | 'Tumbang'

export interface PublicCombatant {
  id: string
  name: string
  initiative: number
  isPlayer: boolean
  statusEffects: StatusEffect[]
  concentrating: boolean
  health: HealthLabel
  /** Linked character sheet, so a player can spot their own row */
  characterId: string | null
  /** Exact HP only for player characters */
  hp: { current: number; max: number; temp: number } | null
}

export interface PublicCombat {
  isActive: boolean
  round: number
  currentTurnIndex: number
  combatants: PublicCombatant[]
}

export function healthLabel(current: number, max: number): HealthLabel {
  if (current <= 0) return 'Tumbang'
  const pct = max > 0 ? current / max : 1
  if (pct >= 1) return 'Sehat'
  return pct > 0.5 ? 'Terluka' : 'Kritis'
}

/** The player-facing view of the DM's tracker: monster HP and AC are never included. */
export function toPublicCombat(s: {
  isActive: boolean
  round: number
  currentTurnIndex: number
  combatants: Combatant[]
}): PublicCombat {
  return {
    isActive: s.isActive,
    round: s.round,
    currentTurnIndex: s.currentTurnIndex,
    combatants: s.combatants.map((c) => ({
      id: c.id,
      name: c.name,
      initiative: c.initiative,
      isPlayer: c.isPlayer,
      statusEffects: c.statusEffects,
      concentrating: !!c.concentrating,
      health: healthLabel(c.currentHp, c.maxHp),
      characterId: c.characterId ?? null,
      hp: c.isPlayer ? { current: c.currentHp, max: c.maxHp, temp: c.tempHp } : null,
    })),
  }
}

const PUSH_DELAY_MS = 300

interface CombatSource {
  getState: () => { isActive: boolean; round: number; currentTurnIndex: number; combatants: Combatant[] }
  subscribe: (fn: () => void) => () => void
}

/**
 * DM side: mirror the tracker to the active campaign's shared combat row.
 * `target()` returns the campaign id to publish to, or null (not DM, local-only campaign).
 */
export function startCombatBroadcast(store: CombatSource, target: () => string | null): () => void {
  if (!isSupabaseConfigured) return () => {}
  let timer: ReturnType<typeof setTimeout> | null = null
  let last = ''

  const push = async () => {
    timer = null
    const campaignId = target()
    if (!campaignId) return
    const state = toPublicCombat(store.getState())
    const key = campaignId + JSON.stringify(state)
    if (key === last) return
    try {
      await ensureSession()
      const { error } = await db
        .campaignCombats()
        .upsert({ campaign_id: campaignId, state: state as unknown as Json })
      if (error) throw error
      last = key
    } catch (e) {
      reportSyncError('combat', e)
    }
  }

  const schedule = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => void push(), PUSH_DELAY_MS)
  }

  const unsubscribe = store.subscribe(schedule)
  schedule()
  return () => {
    unsubscribe()
    if (timer) clearTimeout(timer)
  }
}

/** Player side: the live, read-only combat for a campaign (null until loaded or if none). */
export function useSharedCombat(campaignId: string | null | undefined): PublicCombat | null {
  const [combat, setCombat] = useState<PublicCombat | null>(null)

  useEffect(() => {
    const client = getSupabase()
    if (!client || !campaignId) return
    let cancelled = false
    let channel: ReturnType<typeof client.channel> | null = null

    const load = async () => {
      try {
        await ensureSession()
        const { data, error } = await db.campaignCombats().select('state').eq('campaign_id', campaignId).maybeSingle()
        if (error) throw error
        if (!cancelled) setCombat((data?.state as unknown as PublicCombat) ?? null)
      } catch (e) {
        reportSyncError('combat view', e)
      }
    }

    void ensureSession().then(() => {
      if (cancelled) return
      channel = client
        .channel(`combat:${campaignId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'campaign_combats', filter: `campaign_id=eq.${campaignId}` },
          () => void load()
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') void load()
        })
    })
    // Fallback if a realtime event is missed
    const poll = setInterval(() => {
      if (document.visibilityState === 'visible') void load()
    }, 10_000)

    return () => {
      cancelled = true
      clearInterval(poll)
      if (channel) void client.removeChannel(channel)
    }
  }, [campaignId])

  return combat
}
