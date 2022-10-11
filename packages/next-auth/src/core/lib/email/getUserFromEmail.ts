import type { InternalOptions } from "../../types"

export default async function getUserFromEmail({
  email,
  adapter,
}: {
  email: string
  adapter: InternalOptions<"email">["adapter"]
}) {
  const { getUserByEmail } = adapter
  const adapterUser = email ? await getUserByEmail(email) : null
  // If is an existing user return a user object (otherwise use placeholder)
  return adapterUser ?? { id: email, email }
}
