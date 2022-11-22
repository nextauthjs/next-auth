export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  next_auth: {
    Tables: {
      accounts: {
        Row: {
          id: string
          type: string | null
          provider: string | null
          providerAccountId: string | null
          refresh_token: string | null
          access_token: string | null
          expires_at: number | null
          token_type: string | null
          scope: string | null
          id_token: string | null
          session_state: string | null
          oauth_token_secret: string | null
          oauth_token: string | null
          userId: string | null
        }
        Insert: {
          id?: string
          type?: string | null
          provider?: string | null
          providerAccountId?: string | null
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
          userId?: string | null
        }
        Update: {
          id?: string
          type?: string | null
          provider?: string | null
          providerAccountId?: string | null
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
          userId?: string | null
        }
      }
      sessions: {
        Row: {
          expires: string | null
          sessionToken: string | null
          userId: string | null
          id: string
        }
        Insert: {
          expires?: string | null
          sessionToken?: string | null
          userId?: string | null
          id?: string
        }
        Update: {
          expires?: string | null
          sessionToken?: string | null
          userId?: string | null
          id?: string
        }
      }
      users: {
        Row: {
          name: string | null
          email: string | null
          emailVerified: string | null
          image: string | null
          id: string
        }
        Insert: {
          name?: string | null
          email?: string | null
          emailVerified?: string | null
          image?: string | null
          id?: string
        }
        Update: {
          name?: string | null
          email?: string | null
          emailVerified?: string | null
          image?: string | null
          id?: string
        }
      }
      verification_tokens: {
        Row: {
          id: number
          identifier: string | null
          token: string | null
          expires: string | null
        }
        Insert: {
          id?: number
          identifier?: string | null
          token?: string | null
          expires?: string | null
        }
        Update: {
          id?: number
          identifier?: string | null
          token?: string | null
          expires?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

