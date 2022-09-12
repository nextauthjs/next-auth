import type { InternalOptions } from "../../types"

export default async function getUserFromEmail({
  email,
  adapter,
  withId = false,
}: {
  email: string
  adapter: InternalOptions<"email">["adapter"]
  withId: boolean
}) {
  const { getUserByEmail } = adapter
  // If is an existing user return a user object (otherwise use placeholder)
  return (email ? await getUserByEmail(email) : null) ?? withId
    ? { id: email, email }
    : {
        email,
      }
}
