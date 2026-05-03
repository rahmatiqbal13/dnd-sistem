import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, CampaignMember, CampaignNpc, CampaignSession, Role } from '@/types'
import {
  fetchCampaignByInviteCode,
  generateInviteCode,
  hydrateCampaignById,
  insertCampaignOnRemote,
  insertMemberOnRemote,
  normalizeInviteCode,
} from '@/lib/campaignRemote'

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
        let campaign: Campaign | null =
          get().campaigns.find((c) => c.inviteCode === code && c.isActive) ?? null
        const fromRemote = !campaign
        if (!campaign) {
          campaign = await fetchCampaignByInviteCode(code)
        }
        if (!campaign) return null

        const alreadyIn = campaign.members.some((m) => m.nickname === nickname)
        if (alreadyIn) {
          const fresh = await hydrateCampaignById(campaign.id)
          const merged = fresh ?? campaign
          set((s) => ({
            campaigns: upsertCampaign(s.campaigns, merged),
            activeCampaignId: merged.id,
          }))
          return merged
        }

        const ins = await insertMemberOnRemote(campaign.id, nickname, role)
        if (ins.status === 'fatal' && fromRemote) return null

        if (ins.status === 'already_member') {
          const fresh = await hydrateCampaignById(campaign.id)
          const merged = fresh ?? campaign
          set((s) => ({
            campaigns: upsertCampaign(s.campaigns, merged),
            activeCampaignId: merged.id,
          }))
          return merged
        }

        const member: CampaignMember = {
          nickname,
          role,
          characterId: null,
          joinedAt: Date.now(),
        }
        const next: Campaign = {
          ...campaign,
          members: [...campaign.members, member],
        }
        set((s) => ({
          campaigns: upsertCampaign(s.campaigns, next),
          activeCampaignId: next.id,
        }))
        return next
      },

      leaveCampaign: (id, nickname) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, members: c.members.filter((m) => m.nickname !== nickname) } : c
          ),
          activeCampaignId: s.activeCampaignId === id ? null : s.activeCampaignId,
        })),

      deleteCampaign: (id) =>
        set((s) => ({
          campaigns: s.campaigns.filter((c) => c.id !== id),
          activeCampaignId: s.activeCampaignId === id ? null : s.activeCampaignId,
        })),

      updateCampaign: (id, updates) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      setActiveCampaign: (id) => set({ activeCampaignId: id }),

      kickMember: (campaignId, nickname) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId
              ? { ...c, members: c.members.filter((m) => m.nickname !== nickname) }
              : c
          ),
        })),

      updateSessionNotes: (id, notes) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, sessionNotes: notes } : c)),
        })),

      addNpc: (campaignId, npc) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId ? { ...c, npcs: [...(c.npcs ?? []), npc] } : c
          ),
        })),

      removeNpc: (campaignId, npcId) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId ? { ...c, npcs: (c.npcs ?? []).filter((n) => n.id !== npcId) } : c
          ),
        })),

      updateNpc: (campaignId, npcId, updates) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId
              ? { ...c, npcs: (c.npcs ?? []).map((n) => (n.id === npcId ? { ...n, ...updates } : n)) }
              : c
          ),
        })),

      addSession: (campaignId, session) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId ? { ...c, sessions: [...(c.sessions ?? []), session] } : c
          ),
        })),

      removeSession: (campaignId, sessionId) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaignId
              ? { ...c, sessions: (c.sessions ?? []).filter((ses) => ses.id !== sessionId) }
              : c
          ),
        })),

      updateSession: (campaignId, sessionId, updates) =>
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
        })),

      getById: (id) => get().campaigns.find((c) => c.id === id),
    }),
    { name: 'dnd-campaigns' }
  )
)
