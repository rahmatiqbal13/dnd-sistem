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
}
