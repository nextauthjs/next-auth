import { runBasicTests } from "utils/adapter"
import { format, SupabaseAdapter } from "../src"
import { createClient } from "@supabase/supabase-js"
import type {
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import type { Account } from "@auth/core/types"

const url = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321"
const secret =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.vI9obAHOGyVVKa3pD--kJlyxp-Z2zV9UUMAhKpNLAcU"

const supabase = createClient(url, secret, {
  auth: { debug: true },
  db: { schema: "next_auth" },
})

runBasicTests({
  adapter: SupabaseAdapter({ url, secret }),
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
