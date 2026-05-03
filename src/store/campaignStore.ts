import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, CampaignMember, CampaignNpc, CampaignSession, Role } from '@/types'

interface CampaignStore {
  campaigns: Campaign[]
  activeCampaignId: string | null
  createCampaign: (name: string, description: string, dmNickname: string) => Campaign
  joinCampaign: (inviteCode: string, nickname: string, role: Role) => Campaign | null
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

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      activeCampaignId: null,

      createCampaign: (name, description, dmNickname) => {
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
        set((s) => ({ campaigns: [...s.campaigns, c], activeCampaignId: c.id }))
        return c
      },

      joinCampaign: (inviteCode, nickname, role) => {
        const campaign = get().campaigns.find(
          (c) => c.inviteCode === inviteCode.toUpperCase() && c.isActive
        )
        if (!campaign) return null
        const alreadyIn = campaign.members.some((m) => m.nickname === nickname)
        if (alreadyIn) {
          set({ activeCampaignId: campaign.id })
          return campaign
        }
        const member: CampaignMember = { nickname, role, characterId: null, joinedAt: Date.now() }
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === campaign.id ? { ...c, members: [...c.members, member] } : c
          ),
          activeCampaignId: campaign.id,
        }))
        return campaign
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
