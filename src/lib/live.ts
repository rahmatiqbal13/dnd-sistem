import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Campaign, CampaignMember } from '@/types'
import { currentUserId, ensureSession, getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { hydrateCampaignById } from '@/lib/campaignRemote'
import { fetchCampaignCharacters, reportSyncError, type PartyCharacter } from '@/lib/sync'
import { useCampaignStore } from '@/store/campaignStore'
import { useCharacterStore } from '@/store/characterStore'

const REFETCH_DELAY_MS = 400
// Fallback in case a realtime event is missed (flaky mobile data, sleeping tab)
const POLL_MS = 20_000

/**
 * Subscribe to changes on campaign tables; each event only triggers a refetch (payloads aren't trusted).
 * Also refetches on (re)connect, when the tab becomes visible again, and on a slow poll while visible.
 */
function subscribe(channelName: string, tables: { table: string; filter: string }[], onChange: () => void) {
  const client = getSupabase()
  if (!client) return () => {}
  let timer: ReturnType<typeof setTimeout> | null = null
  let stopped = false
  const debounced = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(onChange, REFETCH_DELAY_MS)
  }

  let channel: ReturnType<typeof client.channel> | null = null
  // Sign in first: a channel joined without a session is filtered by RLS and receives no events
  void ensureSession()
    .then(() => {
      if (stopped) return
      channel = client.channel(channelName)
      for (const { table, filter } of tables) {
        channel = channel.on('postgres_changes', { event: '*', schema: 'public', table, filter }, debounced)
      }
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') debounced()
      })
    })
    .catch((e) => reportSyncError('realtime', e))

  const onVisible = () => {
    if (document.visibilityState === 'visible') debounced()
  }
  document.addEventListener('visibilitychange', onVisible)
  const poll = setInterval(() => {
    if (document.visibilityState === 'visible') debounced()
  }, POLL_MS)

  return () => {
    stopped = true
    if (timer) clearTimeout(timer)
    clearInterval(poll)
    document.removeEventListener('visibilitychange', onVisible)
    if (channel) void client.removeChannel(channel)
  }
}

/**
 * Keep the active server-backed campaign fresh: members, NPCs, sessions and notes.
 * If this user is no longer a member (kicked, or the campaign was deleted) it is removed locally.
 */
/** Refetch one server-backed campaign into the store. Returns false if this user is no longer a member. */
export async function refreshCampaign(campaignId: string, isCancelled: () => boolean = () => false): Promise<boolean> {
  await ensureSession()
  const [fresh, uid] = await Promise.all([hydrateCampaignById(campaignId), currentUserId()])
  if (isCancelled()) return true
  if (!fresh) {
    useCampaignStore.setState((s) => ({
      campaigns: s.campaigns.filter((c) => c.id !== campaignId),
      activeCampaignId: s.activeCampaignId === campaignId ? null : s.activeCampaignId,
    }))
    toast.error('Kamu tidak lagi menjadi anggota kampanye ini.')
    return false
  }
  useCampaignStore.setState((s) => ({
    campaigns: s.campaigns.map((c) => {
      if (c.id !== campaignId) return c
      // The DM is the one typing session notes; don't overwrite their in-progress text with an echo
      const keepNotes = fresh.dmId === uid
      return { ...fresh, sessionNotes: keepNotes ? c.sessionNotes : fresh.sessionNotes }
    }),
  }))
  return true
}

export function useCampaignLive(campaignId: string | null) {
  const campaign = useCampaignStore((s) => s.campaigns.find((c) => c.id === campaignId))
  const isRemote = !!campaign?.dmId

  useEffect(() => {
    if (!isSupabaseConfigured || !campaignId || !isRemote) return
    let cancelled = false

    const refresh = async () => {
      try {
        await refreshCampaign(campaignId, () => cancelled)
      } catch (e) {
        reportSyncError('campaign refresh', e)
      }
    }
    const filter = `campaign_id=eq.${campaignId}`
    const unsubscribe = subscribe(`campaign:${campaignId}`, [
      { table: 'campaigns', filter: `id=eq.${campaignId}` },
      { table: 'campaign_members', filter },
      { table: 'campaign_npcs', filter },
      { table: 'campaign_sessions', filter },
    ], () => void refresh())

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [campaignId, isRemote])
}

/**
 * Characters in a campaign: this device's own sheets plus other members' synced sheets (read-only),
 * updated live. Own local copies win over the server echo. `unlinkedPlayers` are players who haven't
 * chosen a character for this campaign yet.
 */
export function usePartyCharacters(campaign: Campaign | undefined): {
  characters: PartyCharacter[]
  remoteIds: Set<string>
  unlinkedPlayers: CampaignMember[]
} {
  const local = useCharacterStore((s) => s.characters)
  const [remote, setRemote] = useState<PartyCharacter[]>([])
  const [uid, setUid] = useState<string | null>(null)
  const campaignId = campaign?.id
  const isRemote = !!campaign?.dmId

  useEffect(() => {
    if (!isSupabaseConfigured || !campaignId || !isRemote) return
    let cancelled = false
    void currentUserId().then((id) => {
      if (!cancelled) setUid(id)
    })
    const load = () =>
      fetchCampaignCharacters(campaignId)
        .then((list) => {
          if (!cancelled) setRemote(list)
        })
        .catch((e) => reportSyncError('party', e))
    const unsubscribe = subscribe(`party:${campaignId}`, [{ table: 'characters', filter: `campaign_id=eq.${campaignId}` }], () => void load())
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [campaignId, isRemote])

  if (!campaign) return { characters: [], remoteIds: new Set(), unlinkedPlayers: [] }
  const mine = local.filter(
    (ch) => ch.campaignId === campaign.id || campaign.members.some((m) => m.characterId === ch.id)
  )
  const mineIds = new Set(mine.map((c) => c.id))
  const others = isRemote ? remote.filter((c) => !mineIds.has(c.id)) : []
  const owners = new Set(others.map((c) => c.ownerUserId))
  if (mine.length > 0 && uid) owners.add(uid)
  const unlinkedPlayers = isRemote
    ? campaign.members.filter((m) => m.role === 'player' && m.userId && !owners.has(m.userId))
    : []
  return { characters: [...mine, ...others], remoteIds: new Set(others.map((c) => c.id)), unlinkedPlayers }
}
