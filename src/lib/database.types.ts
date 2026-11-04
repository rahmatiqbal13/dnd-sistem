// Auto-generated types for the D&D Sistem Supabase schema.
// Regenerate after schema changes: npx supabase gen types typescript --linked > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string
          role: 'dm' | 'player'
          dark_mode: boolean
          dice_animations: boolean
          sidebar_collapsed: boolean
          theme_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nickname: string
          role?: 'dm' | 'player'
          dark_mode?: boolean
          dice_animations?: boolean
          sidebar_collapsed?: boolean
          theme_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          role?: 'dm' | 'player'
          dark_mode?: boolean
          dice_animations?: boolean
          sidebar_collapsed?: boolean
          theme_id?: string
          updated_at?: string
        }
        Relationships: []
      }

      campaigns: {
        Row: {
          dm_id: string | null
          id: string
          name: string
          description: string
          dm_nickname: string
          invite_code: string
          is_active: boolean
          session_notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          dm_id?: string | null
          id?: string
          name: string
          description?: string
          dm_nickname: string
          invite_code: string
          is_active?: boolean
          session_notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          dm_id?: string | null
          id?: string
          name?: string
          description?: string
          dm_nickname?: string
          invite_code?: string
          is_active?: boolean
          session_notes?: string
          updated_at?: string
        }
        Relationships: []
      }

      characters: {
        Row: {
          data: Json
          user_id: string | null
          id: string
          owner_id: string
          campaign_id: string | null
          name: string
          class: string
          race: string
          level: number
          alignment: string
          background: string
          ability_scores: Json
          max_hp: number
          current_hp: number
          temp_hp: number
          armor_class: number
          speed: number
          initiative: number
          proficiency_bonus: number
          saving_throws: Json
          skills: Json
          spells: Json
          equipment: Json
          gold: number
          notes: string
          traits: string
          ideals: string
          bonds: string
          flaws: string
          created_at: string
          updated_at: string
        }
        Insert: {
          data?: Json
          user_id?: string | null
          id?: string
          owner_id?: string
          campaign_id?: string | null
          name: string
          class: string
          race: string
          level?: number
          alignment?: string
          background?: string
          ability_scores?: Json
          max_hp?: number
          current_hp?: number
          temp_hp?: number
          armor_class?: number
          speed?: number
          initiative?: number
          proficiency_bonus?: number
          saving_throws?: Json
          skills?: Json
          spells?: Json
          equipment?: Json
          gold?: number
          notes?: string
          traits?: string
          ideals?: string
          bonds?: string
          flaws?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          data?: Json
          user_id?: string | null
          id?: string
          owner_id?: string
          campaign_id?: string | null
          name?: string
          class?: string
          race?: string
          level?: number
          alignment?: string
          background?: string
          ability_scores?: Json
          max_hp?: number
          current_hp?: number
          temp_hp?: number
          armor_class?: number
          speed?: number
          initiative?: number
          proficiency_bonus?: number
          saving_throws?: Json
          skills?: Json
          spells?: Json
          equipment?: Json
          gold?: number
          notes?: string
          traits?: string
          ideals?: string
          bonds?: string
          flaws?: string
          updated_at?: string
        }
        Relationships: []
      }

      campaign_members: {
        Row: {
          user_id: string | null
          id: string
          campaign_id: string
          nickname: string
          role: 'dm' | 'player'
          character_id: string | null
          joined_at: string
        }
        Insert: {
          user_id?: string | null
          id?: string
          campaign_id: string
          nickname: string
          role?: 'dm' | 'player'
          character_id?: string | null
          joined_at?: string
        }
        Update: {
          user_id?: string | null
          id?: string
          campaign_id?: string
          nickname?: string
          role?: 'dm' | 'player'
          character_id?: string | null
          joined_at?: string
        }
        Relationships: []
      }

      campaign_npcs: {
        Row: {
          id: string
          campaign_id: string
          name: string
          role: string
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          name: string
          role?: string
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          name?: string
          role?: string
          notes?: string
        }
        Relationships: []
      }

      campaign_sessions: {
        Row: {
          id: string
          campaign_id: string
          title: string
          date: string
          summary: string
          xp_awarded: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          title: string
          date?: string
          summary?: string
          xp_awarded?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          title?: string
          date?: string
          summary?: string
          xp_awarded?: number
          updated_at?: string
        }
        Relationships: []
      }

      personal_notes: {
        Row: {
          user_id: string | null
          id: string
          nickname: string
          campaign_id: string
          note: string
          updated_at: string
        }
        Insert: {
          user_id?: string | null
          id?: string
          nickname: string
          campaign_id: string
          note?: string
          updated_at?: string
        }
        Update: {
          user_id?: string | null
          id?: string
          nickname?: string
          campaign_id?: string
          note?: string
          updated_at?: string
        }
        Relationships: []
      }

      dice_rolls: {
        Row: {
          user_id: string | null
          id: string
          rolled_by: string
          dice: number
          count: number
          modifier: number
          rolls: Json
          total: number
          advantage: boolean
          disadvantage: boolean
          rolled_at: string
        }
        Insert: {
          user_id?: string | null
          id?: string
          rolled_by?: string
          dice: number
          count?: number
          modifier?: number
          rolls?: Json
          total: number
          advantage?: boolean
          disadvantage?: boolean
          rolled_at?: string
        }
        Update: {
          user_id?: string | null
          id?: string
          rolled_by?: string
          dice?: number
          count?: number
          modifier?: number
          rolls?: Json
          total?: number
          advantage?: boolean
          disadvantage?: boolean
          rolled_at?: string
        }
        Relationships: []
      }
    }

    Views: Record<string, never>
    Functions: {
      join_campaign: {
        Args: { p_invite_code: string; p_nickname: string }
        Returns: string | null
      }
    }
    Enums: Record<string, never>
  }
}

// Convenience row types
export type ProfileRow        = Database['public']['Tables']['profiles']['Row']
export type CampaignRow       = Database['public']['Tables']['campaigns']['Row']
export type CharacterRow      = Database['public']['Tables']['characters']['Row']
export type CampaignMemberRow = Database['public']['Tables']['campaign_members']['Row']
export type CampaignNpcRow    = Database['public']['Tables']['campaign_npcs']['Row']
export type CampaignSessionRow = Database['public']['Tables']['campaign_sessions']['Row']
export type PersonalNoteRow   = Database['public']['Tables']['personal_notes']['Row']
export type DiceRollRow       = Database['public']['Tables']['dice_rolls']['Row']
