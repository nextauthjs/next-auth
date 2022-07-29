import { runBasicTests } from "@next-auth/adapter-test"
import { format, SupabaseAdapter } from "../src"
import { createClient } from "@supabase/supabase-js"
import type {
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import type { Account } from "next-auth"

const supabase = createClient(
  "http://localhost:54321",
  process.env.SUPABASE_KEY as string
)

runBasicTests({
  adapter: SupabaseAdapter(supabase),
  db: {
    async session(sessionToken) {
      const { data, error } = await supabase
        .from("sessions")
        .select()
        .eq("sessionToken", sessionToken)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterSession>(data)
    },
    async user(id) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterUser>(data)
    },
    async account({ provider, providerAccountId }) {
      const { data, error } = await supabase
        .from("accounts")
        .select()
        .match({ provider, providerAccountId })
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<Account>(data)
    },
    async verificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .select()
        .match({ identifier, token })
        .single()

      if (error) throw error

      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
  },
})
