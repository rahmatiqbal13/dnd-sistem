import { db, isSupabaseConfigured } from '@/lib/supabase'
import type { Campaign, CampaignMember, CampaignNpc, CampaignSession, Role } from '@/types'

/** 6 chars, avoids ambiguous 0/O and 1/I */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
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

export async function fetchCampaignByInviteCode(code: string): Promise<Campaign | null> {
  if (!isSupabaseConfigured) return null
  const normalized = normalizeInviteCode(code)
  const { data: row, error } = await db
    .campaigns()
    .select('*')
    .eq('invite_code', normalized)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !row) return null
  return hydrateCampaignById(row.id)
}

export async function insertCampaignOnRemote(c: Campaign): Promise<void> {
  if (!isSupabaseConfigured) return
  const { error: cErr } = await db.campaigns().insert({
    id: c.id,
    name: c.name,
    description: c.description,
    dm_nickname: c.dmNickname,
    invite_code: c.inviteCode,
    is_active: c.isActive,
    session_notes: c.sessionNotes,
  })
  if (cErr) throw cErr

  const dm = c.members.find((m) => m.role === 'dm')
  const dmNick = dm?.nickname ?? c.dmNickname
  const { error: mErr } = await db.campaignMembers().insert({
    campaign_id: c.id,
    nickname: dmNick,
    role: 'dm',
  })
  if (mErr) throw mErr
}

export type InsertMemberResult =
  | { status: 'inserted' }
  | { status: 'already_member' }
  | { status: 'no_remote_campaign' }
  | { status: 'fatal'; message: string }

export async function insertMemberOnRemote(
  campaignId: string,
  nickname: string,
  role: Role
): Promise<InsertMemberResult> {
  if (!isSupabaseConfigured) return { status: 'no_remote_campaign' }
  const { error } = await db.campaignMembers().insert({
    campaign_id: campaignId,
    nickname,
    role,
  })
  if (!error) return { status: 'inserted' }
  if (error.code === '23505') return { status: 'already_member' }
  if (error.code === '23503') return { status: 'no_remote_campaign' }
  return { status: 'fatal', message: error.message }
}
