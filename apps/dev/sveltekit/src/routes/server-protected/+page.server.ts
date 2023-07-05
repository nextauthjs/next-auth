import { signIn } from "@auth/sveltekit/server"
import { redirect } from "@sveltejs/kit"

export const load = async (event) => {
  const session = await event.locals.getSession()
  if (!session) {
    const { location } = await signIn(event.fetch, "github", {
      callbackUrl: "/server-protected",
    })
    if (location !== undefined) {
      throw redirect(303, location)
    }
  }

  return {
    session,
  }
}
