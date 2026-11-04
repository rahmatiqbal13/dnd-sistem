import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Campaign, Character } from '@/types'
import { currentUserId, ensureSession, getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { hydrateCampaignById } from '@/lib/campaignRemote'
import { fetchCampaignCharacters, reportSyncError } from '@/lib/sync'
import { useCampaignStore } from '@/store/campaignStore'
import { useCharacterStore } from '@/store/characterStore'

const REFETCH_DELAY_MS = 400

/** Subscribe to changes on campaign tables; each event only triggers a refetch (payloads aren't trusted). */
function subscribe(channelName: string, tables: { table: string; filter: string }[], onChange: () => void) {
  const client = getSupabase()
  if (!client) return () => {}
  let timer: ReturnType<typeof setTimeout> | null = null
  const debounced = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(onChange, REFETCH_DELAY_MS)
  }
  let channel = client.channel(channelName)
  for (const { table, filter } of tables) {
    channel = channel.on('postgres_changes', { event: '*', schema: 'public', table, filter }, debounced)
  }
  // Refetch after (re)connecting, so changes missed while offline show up
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') debounced()
  })
  return () => {
    if (timer) clearTimeout(timer)
    void client.removeChannel(channel)
  }
}

/**
 * Keep the active server-backed campaign fresh: members, NPCs, sessions and notes.
 * If this user is no longer a member (kicked, or the campaign was deleted) it is removed locally.
 */
export function useCampaignLive(campaignId: string | null) {
  const campaign = useCampaignStore((s) => s.campaigns.find((c) => c.id === campaignId))
  const isRemote = !!campaign?.dmId

  useEffect(() => {
    if (!isSupabaseConfigured || !campaignId || !isRemote) return
    let cancelled = false

    const refresh = async () => {
      try {
        await ensureSession()
        const [fresh, uid] = await Promise.all([hydrateCampaignById(campaignId), currentUserId()])
        if (cancelled) return
        if (!fresh) {
          useCampaignStore.setState((s) => ({
            campaigns: s.campaigns.filter((c) => c.id !== campaignId),
            activeCampaignId: s.activeCampaignId === campaignId ? null : s.activeCampaignId,
          }))
          toast.error('Kamu tidak lagi menjadi anggota kampanye ini.')
          return
        }
        useCampaignStore.setState((s) => ({
          campaigns: s.campaigns.map((c) => {
            if (c.id !== campaignId) return c
            // The DM is the one typing session notes; don't overwrite their in-progress text with an echo
            const keepNotes = fresh.dmId === uid
            return { ...fresh, sessionNotes: keepNotes ? c.sessionNotes : fresh.sessionNotes }
          }),
        }))
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
 * updated live. Own local copies win over the server echo.
 */
export function usePartyCharacters(campaign: Campaign | undefined): { characters: Character[]; remoteIds: Set<string> } {
  const local = useCharacterStore((s) => s.characters)
  const [remote, setRemote] = useState<Character[]>([])
  const campaignId = campaign?.id
  const isRemote = !!campaign?.dmId

  useEffect(() => {
    if (!isSupabaseConfigured || !campaignId || !isRemote) return
    let cancelled = false
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

  if (!campaign) return { characters: [], remoteIds: new Set() }
  const mine = local.filter(
    (ch) => ch.campaignId === campaign.id || campaign.members.some((m) => m.characterId === ch.id)
  )
  const mineIds = new Set(mine.map((c) => c.id))
  const others = isRemote ? remote.filter((c) => !mineIds.has(c.id)) : []
  return { characters: [...mine, ...others], remoteIds: new Set(others.map((c) => c.id)) }
}
