import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

/** False when `.env.local` is missing or empty — app still runs (local-only campaigns). */
export const isSupabaseConfigured = Boolean(url && key)

let _client: SupabaseClient<Database> | null = null

export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null
  if (!_client) {
    _client = createClient<Database>(url!, key!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return _client
}

function client(): SupabaseClient<Database> {
  const c = getSupabase()
  if (!c) {
    throw new Error(
      'Supabase belum dikonfigurasi. Salin .env.example → .env.local dan isi VITE_SUPABASE_URL serta VITE_SUPABASE_ANON_KEY.'
    )
  }
  return c
}

/**
 * Make sure this browser has a Supabase session. Uses an anonymous sign-in, so
 * players still only enter a nickname, but RLS gets a real auth.uid().
 * Requires "Allow anonymous sign-ins" in the Supabase dashboard.
 */
let _session: Promise<void> | null = null

export function ensureSession(): Promise<void> {
  if (!_session) {
    _session = (async () => {
      const auth = client().auth
      const { data } = await auth.getSession()
      if (data.session) return
      const { error } = await auth.signInAnonymously()
      if (error) throw new Error(`Gagal masuk ke server: ${error.message}`)
    })().catch((e) => {
      _session = null
      throw e
    })
  }
  return _session
}

/** The signed-in Supabase user id (after ensureSession), or null. */
export async function currentUserId(): Promise<string | null> {
  const { data } = await client().auth.getSession()
  return data.session?.user.id ?? null
}

// ── Typed table helpers (throw only if called without Supabase env) ───────────

export const db = {
  profiles: () => client().from('profiles'),
  campaigns: () => client().from('campaigns'),
  characters: () => client().from('characters'),
  campaignMembers: () => client().from('campaign_members'),
  campaignNpcs: () => client().from('campaign_npcs'),
  campaignSessions: () => client().from('campaign_sessions'),
  personalNotes: () => client().from('personal_notes'),
  diceRolls: () => client().from('dice_rolls'),
  joinCampaign: (inviteCode: string, nickname: string) =>
    client().rpc('join_campaign', { p_invite_code: inviteCode, p_nickname: nickname }),
}
