import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"
import {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"

function isDate(date: any) {
  return (
    new Date(date).toString() !== "Invalid Date" && !isNaN(Date.parse(date))
  )
}

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

export const SupabaseAdapter = ({
  url,
  secret,
}: {
  url: string
  secret: string
}): Adapter => {
  const supabase = createClient<Database, "next_auth">(url, secret, {
    db: { schema: "next_auth" },
    global: {
      headers: { "X-Client-Info": "@next-auth/supabase-adapter@0.1.0" },
    },
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
          user as Database["next_auth"]["Tables"]["users"]["Row"]
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

      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
  }
}
