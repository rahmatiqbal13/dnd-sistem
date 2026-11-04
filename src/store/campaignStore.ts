import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, CampaignNpc, CampaignSession, Role } from '@/types'
import {
  deleteCampaignRemote,
  deleteNpcRemote,
  deleteSessionRemote,
  generateInviteCode,
  insertCampaignOnRemote,
  joinCampaignOnRemote,
  leaveCampaignRemote,
  normalizeInviteCode,
  removeMemberRemote,
  updateCampaignRemote,
  upsertNpcRemote,
  upsertSessionRemote,
} from '@/lib/campaignRemote'
import { currentUserId, isSupabaseConfigured } from '@/lib/supabase'
import { syncInBackground } from '@/lib/sync'

interface CampaignStore {
  campaigns: Campaign[]
  activeCampaignId: string | null
  createCampaign: (name: string, description: string, dmNickname: string) => Promise<Campaign>
  joinCampaign: (inviteCode: string, nickname: string, role: Role) => Promise<Campaign | null>
  leaveCampaign: (id: string, nickname: string) => void
  deleteCampaign: (id: string) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  setActiveCampaign: (id: string | null) => void
  kickMember: (campaignId: string, nickname: string) => void
  updateSessionNotes: (id: string, notes: string) => void
  addNpc: (campaignId: string, npc: CampaignNpc) => void
  removeNpc: (campaignId: string, npcId: string) => void
  updateNpc: (campaignId: string, npcId: string, updates: Partial<CampaignNpc>) => void
  addSession: (campaignId: string, session: CampaignSession) => void
  removeSession: (campaignId: string, sessionId: string) => void
  updateSession: (campaignId: string, sessionId: string, updates: Partial<CampaignSession>) => void
  getById: (id: string) => Campaign | undefined
}

function upsertCampaign(list: Campaign[], c: Campaign): Campaign[] {
  const has = list.some((x) => x.id === c.id)
  if (!has) return [...list, c]
  return list.map((x) => (x.id === c.id ? c : x))
}

/** Campaigns created on the server carry the DM's user id; local-only ones don't sync. */
function remoteCampaign(list: Campaign[], id: string): Campaign | undefined {
  const c = list.find((x) => x.id === id)
  return c?.dmId ? c : undefined
}

const notesTimers = new Map<string, ReturnType<typeof setTimeout>>()

function isPgUniqueViolation(e: unknown): boolean {
  return typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === '23505'
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      activeCampaignId: null,

      createCampaign: async (name, description, dmNickname) => {
        for (let attempt = 0; attempt < 10; attempt++) {
          const c: Campaign = {
            id: crypto.randomUUID(),
            name,
            description,
            dmNickname,
            inviteCode: generateInviteCode(),
            members: [{ nickname: dmNickname, role: 'dm', characterId: null, joinedAt: Date.now() }],
            npcs: [],
            sessions: [],
            isActive: true,
            sessionNotes: '',
            createdAt: Date.now(),
          }
          try {
            await insertCampaignOnRemote(c)
            if (isSupabaseConfigured) {
              const uid = await currentUserId()
              c.dmId = uid
              c.members = c.members.map((m) => ({ ...m, userId: uid }))
            }
            set((s) => ({ campaigns: [...s.campaigns, c], activeCampaignId: c.id }))
            return c
          } catch (e) {
            if (isPgUniqueViolation(e)) continue
            throw e
          }
        }
        throw new Error('Could not allocate a unique invite code')
      },

      joinCampaign: async (inviteCode, nickname, role) => {
        const code = normalizeInviteCode(inviteCode)

        if (isSupabaseConfigured) {
          const remote = await joinCampaignOnRemote(code, nickname)
          if (!remote) return null
          set((s) => ({
            campaigns: upsertCampaign(s.campaigns, remote),
            activeCampaignId: remote.id,
          }))
          return remote
        }

        // Local-only mode (no Supabase env): campaigns exist only in this browser
        const campaign = get().campaigns.find((c) => c.inviteCode === code && c.isActive)
        if (!campaign) return null
        const next: Campaign = campaign.members.some((m) => m.nickname === nickname)
          ? campaign
          : {
              ...campaign,
              members: [...campaign.members, { nickname, role, characterId: null, joinedAt: Date.now() }],
            }
        set((s) => ({
          campaigns: upsertCampaign(s.campaigns, next),
          activeCampaignId: next.id,
        }))
        return next
      },

      leaveCampaign: (id, nickname) => {
        if (remoteCampaign(get().campaigns, id)) syncInBackground('leave', () => leaveCampaignRemote(id))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, members: c.members.filter((m) => m.nickname !== nickname) } : c
          ),
          activeCampaignId: s.activeCampaignId === id ? null : s.activeCampaignId,
        }))
      },

      deleteCampaign: (id) => {
        if (remoteCampaign(get().campaigns, id)) syncInBackground('delete campaign', () => deleteCampaignRemote(id))
        set((s) => ({
          campaigns: s.campaigns.filter((c) => c.id !== id),
          activeCampaignId: s.activeCampaignId === id ? null : s.activeCampaignId,
        }))
      },

      updateCampaign: (id, updates) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      setActiveCampaign: (id) => set({ activeCampaignId: id }),

      kickMember: (campaignId, nickname) => {
        const userId = remoteCampaign(get().campaigns, campaignId)?.members.find((m) => m.nickname === nickname)?.userId
        if (userId) syncInBackground('kick', () => removeMemberRemote(campaignId, userId))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId
              ? { ...c, members: c.members.filter((m) => m.nickname !== nickname) }
              : c
          ),
        }))
      },

      updateSessionNotes: (id, notes) => {
        if (remoteCampaign(get().campaigns, id)) {
          // Debounce: notes are typed character by character
          clearTimeout(notesTimers.get(id))
          notesTimers.set(
            id,
            setTimeout(() => syncInBackground('session notes', () => updateCampaignRemote(id, { session_notes: notes })), 1000)
          )
        }
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, sessionNotes: notes } : c)),
        }))
      },

      addNpc: (campaignId, npc) => {
        if (remoteCampaign(get().campaigns, campaignId)) syncInBackground('npc', () => upsertNpcRemote(campaignId, npc))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId ? { ...c, npcs: [...(c.npcs ?? []), npc] } : c
          ),
        }))
      },

      removeNpc: (campaignId, npcId) => {
        if (remoteCampaign(get().campaigns, campaignId)) syncInBackground('npc', () => deleteNpcRemote(npcId))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId ? { ...c, npcs: (c.npcs ?? []).filter((n) => n.id !== npcId) } : c
          ),
        }))
      },

      updateNpc: (campaignId, npcId, updates) => {
        const camp = remoteCampaign(get().campaigns, campaignId)
        const npc = camp?.npcs.find((n) => n.id === npcId)
        if (npc) syncInBackground('npc', () => upsertNpcRemote(campaignId, { ...npc, ...updates }))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId
              ? { ...c, npcs: (c.npcs ?? []).map((n) => (n.id === npcId ? { ...n, ...updates } : n)) }
              : c
          ),
        }))
      },

      addSession: (campaignId, session) => {
        if (remoteCampaign(get().campaigns, campaignId)) syncInBackground('session', () => upsertSessionRemote(campaignId, session))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId ? { ...c, sessions: [...(c.sessions ?? []), session] } : c
          ),
        }))
      },

      removeSession: (campaignId, sessionId) => {
        if (remoteCampaign(get().campaigns, campaignId)) syncInBackground('session', () => deleteSessionRemote(sessionId))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId
              ? { ...c, sessions: (c.sessions ?? []).filter((ses) => ses.id !== sessionId) }
              : c
          ),
        }))
      },

      updateSession: (campaignId, sessionId, updates) => {
        const session = remoteCampaign(get().campaigns, campaignId)?.sessions.find((x) => x.id === sessionId)
        if (session) syncInBackground('session', () => upsertSessionRemote(campaignId, { ...session, ...updates }))
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId
              ? {
                  ...c,
                  sessions: (c.sessions ?? []).map((ses) =>
                    ses.id === sessionId ? { ...ses, ...updates } : ses
                  ),
                }
              : c
          ),
        }))
      },

      getById: (id) => get().campaigns.find((c) => c.id === id),
    }),
    { name: 'dnd-campaigns' }
  )
)
