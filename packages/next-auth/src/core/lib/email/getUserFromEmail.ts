import type { AdapterUser } from "../../../adapters"
import type { InternalOptions } from "../../types"

/**
 * Query the database for a user by email address.
 * If is an existing user return a user object (otherwise use placeholder).
 */
export default async function getAdapterUserFromEmail({
  email,
  adapter,
}: {
  email: string
  adapter: InternalOptions<"email">["adapter"]
}): Promise<AdapterUser> {
  // @ts-expect-error -- adapter is checked to be defined in `init`
  const { getUserByEmail } = adapter
  const adapterUser = email ? await getUserByEmail(email) : null
  if (adapterUser) return adapterUser

  return { id: email, email, emailVerified: null }
}
