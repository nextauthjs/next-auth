import Pocketbase from "pocketbase"
import { nextAuthCollections } from "./pocketbase.schema"
import { loginOpts } from "./pocketbase.types"

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

const NEXTAUTH_TABLE_NAMES = [
  "next_auth_user",
  "next_auth_account",
  "next_auth_session",
  "next_auth_verificationToken",
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

export async function adminLogin(pb: Pocketbase, options: loginOpts) {
  return await pb.admins.authWithPassword(options.username, options.password)
}

export async function initCollections(pb: Pocketbase, options: loginOpts) {
  try {
    await adminLogin(pb, options)
    await pb.collections.import(nextAuthCollections, false)
  } catch (_) {
    throw new Error(
      "could not automatically create the default next_auth collections"
    )
  }
}

export async function checkCollections(pb: Pocketbase, options: loginOpts) {
  try {
    await adminLogin(pb, options)

    const collectionNames = (
      await pb.collections.getFullList(200, {
        sort: "-created",
      })
    ).map((collection) => collection.name)

    // if all of the table names are NOT present in pocketbase, create them.
    if (!NEXTAUTH_TABLE_NAMES.every((name) => collectionNames.includes(name))) {
      await initCollections(pb, options)
    }
  } catch (e) {
    throw new Error("error creating collections in pocketbase")
  }
}
