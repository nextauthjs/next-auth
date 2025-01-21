/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://supabase.com/docs">Supabase</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://supabase.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/supabase.svg" width="50"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @supabase/supabase-js @auth/supabase-adapter
 * ```
 *
 * @module @auth/supabase-adapter
 */
import { createClient } from "@supabase/supabase-js"
import {
  type Adapter,
  type AdapterSession,
  type AdapterUser,
  type VerificationToken,
  isDate,
} from "@auth/core/adapters"

export function format<T>(obj: Record<string, any>): T {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      delete obj[key]
    }

    if (isDate(value)) {
      obj[key] = new Date(value)
    }
  }

  return obj as T
}

/**
 * This is the interface of the Supabase adapter options.
 **/
export interface SupabaseAdapterOptions {
  /**
   * The URL of your Supabase database
   **/
  url: string
  /**
   * The secret to grant access to the database
   **/
  secret: string
}

export function SupabaseAdapter(options: SupabaseAdapterOptions): Adapter {
  const { url, secret } = options
  const supabase = createClient<Database, "next_auth">(url, secret, {
    db: { schema: "next_auth" },
    global: { headers: { "X-Client-Info": "@auth/supabase-adapter" } },
    auth: { persistSession: false },
  })
  return {
    async createUser(user) {
      const { data, error } = await supabase
        .from("users")
        .insert({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return format<AdapterUser>(data)
    },
    async getUser(id) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterUser>(data)
    },
    async getUserByEmail(email) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterUser>(data)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabase
        .from("accounts")
        .select("users (*)")
        .match({ provider, providerAccountId })
        .maybeSingle()

      if (error) throw error
      if (!data || !data.users) return null

      return format<AdapterUser>(data.users)
    },
    async updateUser(user) {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (error) throw error

      return format<AdapterUser>(data)
    },
    async deleteUser(userId) {
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) throw error
    },
    async linkAccount(account) {
      const { error } = await supabase.from("accounts").insert(account)

      if (error) throw error
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .match({ provider, providerAccountId })

      if (error) throw error
    },
    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabase
        .from("sessions")
        .insert({ sessionToken, userId, expires: expires.toISOString() })
        .select()
        .single()

      if (error) throw error

      return format<AdapterSession>(data)
    },
    async getSessionAndUser(sessionToken) {
      const { data, error } = await supabase
        .from("sessions")
        .select("*, users(*)")
        .eq("sessionToken", sessionToken)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const { users: user, ...session } = data

      return {
        user: format<AdapterUser>(
          user as Database["next_auth"]["Tables"]["users"]["Row"][]
        ),
        session: format<AdapterSession>(session),
      }
    },
    async updateSession(session) {
      const { data, error } = await supabase
        .from("sessions")
        .update({
          ...session,
          expires: session.expires?.toISOString(),
        })
        .eq("sessionToken", session.sessionToken)
        .select()
        .single()

      if (error) throw error

      return format<AdapterSession>(data)
    },
    async deleteSession(sessionToken) {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("sessionToken", sessionToken)

      if (error) throw error
    },
    async createVerificationToken(token) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .insert({
          ...token,
          expires: token.expires.toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .delete()
        .match({ identifier, token })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
  }
}

interface Database {
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
