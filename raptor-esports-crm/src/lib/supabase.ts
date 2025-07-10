import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'admin' | 'manager' | 'coach' | 'player' | 'analyst'
          team_id: string | null
          contact_number: string | null
          in_game_role: string | null
          device_info: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'admin' | 'manager' | 'coach' | 'player' | 'analyst'
          team_id?: string | null
          contact_number?: string | null
          in_game_role?: string | null
          device_info?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'admin' | 'manager' | 'coach' | 'player' | 'analyst'
          team_id?: string | null
          contact_number?: string | null
          in_game_role?: string | null
          device_info?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      performances: {
        Row: {
          id: string
          team_id: string
          player_id: string
          match_number: number
          slot: number
          map: string
          placement: number | null
          kills: number
          assists: number
          damage: number
          survival_time: number
          added_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          player_id: string
          match_number: number
          slot: number
          map: string
          placement?: number | null
          kills?: number
          assists?: number
          damage?: number
          survival_time?: number
          added_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          player_id?: string
          match_number?: number
          slot?: number
          map?: string
          placement?: number | null
          kills?: number
          assists?: number
          damage?: number
          survival_time?: number
          added_by?: string | null
          created_at?: string
        }
      }
    }
  }
}