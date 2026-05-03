import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n' +
    'Copy .env.example → .env.local and fill in your Supabase project values.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// ── Typed table helpers ────────────────────────────────────────────────────────

export const db = {
  profiles:         () => supabase.from('profiles'),
  campaigns:        () => supabase.from('campaigns'),
  characters:       () => supabase.from('characters'),
  campaignMembers:  () => supabase.from('campaign_members'),
  campaignNpcs:     () => supabase.from('campaign_npcs'),
  campaignSessions: () => supabase.from('campaign_sessions'),
  personalNotes:    () => supabase.from('personal_notes'),
  diceRolls:        () => supabase.from('dice_rolls'),
}
