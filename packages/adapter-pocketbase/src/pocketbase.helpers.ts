import Pocketbase, { type Record as PBRecord } from "pocketbase"

const PB_RECORD_KEYS = [
  "created",
  "updated",
  "clone",
  "code",
  "collectionId",
  "collectionName",
  "expand",
  "export",
  "isNew",
  "load",
]

// ty supabase
function isDate(date: any) {
  return (
    new Date(date).toString() !== "Invalid Date" && !isNaN(Date.parse(date))
  )
}

export function format<TAdapterType>(obj: Record<string, any>): TAdapterType {
  for (const [key, value] of Object.entries(obj)) {
    if (isDate(value)) {
      obj[key] = new Date(value)
    }

    if (PB_RECORD_KEYS.includes(key)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete obj[key]
    }
  }

  return obj as TAdapterType
}

export async function adminLogin(
  pb: Pocketbase,
  options: { username: string; password: string }
) {
  return await pb.admins.authWithPassword(options.username, options.password)
}

export type PocketBaseUser = PBRecord & {
  name: string
  image: string
  email: string
  emailVerified: string
  code?: number
}

export type PocketBaseSession = PBRecord & {
  expires: string
  sessionToken: string
  userId: string
  code?: number
}

export type PocketBaseAccount = PBRecord & {
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string
  access_token: string
  expires_at: string
  token_type: string
  scope: string
  id_token: string
  session_state: string
  oauth_token_secret: string
  oauth_token: string
  code?: number
}

export type PocketBaseVerificationToken = PBRecord & {
  identifier: string
  token: string
  expires: string
  code?: number
}
