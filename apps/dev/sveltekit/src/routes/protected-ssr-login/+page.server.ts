import type { LayoutServerLoad } from "../../$types"

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth()

  if (!session) {
    await event.locals.signIn()
  }

  return {
    session,
  }
}
