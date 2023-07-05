import { redirect } from "@sveltejs/kit"
import { signOut } from "@auth/sveltekit/server"

export const GET = async (event) => {
  // Protect any routes under /authenticated

  const session = await event.locals.getSession()
  if (session) {
    const location = await signOut(event.fetch, { callbackUrl: "/" })
    throw redirect(303, location)
  } else {
    throw redirect(303, "/")
  }
}
