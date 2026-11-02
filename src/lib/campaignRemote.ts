import { db, ensureSession, isSupabaseConfigured } from '@/lib/supabase'
import type { Campaign, CampaignMember, CampaignNpc, CampaignSession } from '@/types'

/** 6 chars, avoids ambiguous 0/O and 1/I. 32 chars divide 256 evenly, so no modulo bias. */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase()
}

function memberFromRow(r: {
  nickname: string
  role: 'dm' | 'player'
  character_id: string | null
  joined_at: string
}): CampaignMember {
  return {
    nickname: r.nickname,
    role: r.role,
    characterId: r.character_id,
    joinedAt: new Date(r.joined_at).getTime(),
  }
}

function npcFromRow(r: { id: string; name: string; role: string; notes: string }): CampaignNpc {
  return { id: r.id, name: r.name, role: r.role, notes: r.notes }
}

function sessionFromRow(r: {
  id: string
  title: string
  date: string
  summary: string
  xp_awarded: number
  created_at: string
}): CampaignSession {
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    summary: r.summary,
    xpAwarded: r.xp_awarded,
    createdAt: new Date(r.created_at).getTime(),
  }
}

function campaignFromRow(
  row: {
    id: string
    name: string
    description: string
    dm_nickname: string
    invite_code: string
    is_active: boolean
    session_notes: string
    created_at: string
  },
  members: CampaignMember[],
  npcs: CampaignNpc[],
  sessions: CampaignSession[]
): Campaign {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    dmNickname: row.dm_nickname,
    inviteCode: row.invite_code,
    members,
    npcs,
    sessions,
    isActive: row.is_active,
    sessionNotes: row.session_notes,
    createdAt: new Date(row.created_at).getTime(),
  }
}

export async function hydrateCampaignById(campaignId: string): Promise<Campaign | null> {
  if (!isSupabaseConfigured) return null
  await ensureSession()
  const { data: row, error: rowErr } = await db.campaigns().select('*').eq('id', campaignId).maybeSingle()
  if (rowErr || !row) return null

  const [membersRes, npcsRes, sessionsRes] = await Promise.all([
    db.campaignMembers().select('*').eq('campaign_id', campaignId),
    db.campaignNpcs().select('*').eq('campaign_id', campaignId),
    db.campaignSessions().select('*').eq('campaign_id', campaignId),
  ])

  const members = (membersRes.data ?? []).map(memberFromRow)
  const npcs = (npcsRes.data ?? []).map(npcFromRow)
  const sessions = (sessionsRes.data ?? []).map(sessionFromRow)

  return campaignFromRow(row, members, npcs, sessions)
}

/**
 * Join through the `join_campaign` RPC (the only way to become a member under RLS).
 * Returns null for an unknown or inactive code.
 */
export async function joinCampaignOnRemote(code: string, nickname: string): Promise<Campaign | null> {
  await ensureSession()
  const { data: campaignId, error } = await db.joinCampaign(normalizeInviteCode(code), nickname)
  if (error) throw error
  if (!campaignId) return null
  return hydrateCampaignById(campaignId)
}

/** Insert the campaign; the database adds the DM as a member and sets dm_id from the session. */
export async function insertCampaignOnRemote(c: Campaign): Promise<void> {
  if (!isSupabaseConfigured) return
  await ensureSession()
  const { error } = await db.campaigns().insert({
    id: c.id,
    name: c.name,
    description: c.description,
    dm_nickname: c.dmNickname,
    invite_code: c.inviteCode,
    is_active: c.isActive,
    session_notes: c.sessionNotes,
  })
  if (error) throw error
}
