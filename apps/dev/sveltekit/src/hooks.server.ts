import type { Session } from "@auth/sveltekit"
import { error, redirect, type Handle } from "@sveltejs/kit"
import { sequence } from "@sveltejs/kit/hooks"
import { handle as authenticationHandle } from "./auth"
import { isAdminRoute, isProtectedRoute } from "./helpers.js"

// Handle this properly. This is just a placeholder.
const isAdmin = (session: Session | null) =>
  session && session.user?.email === "admin@example.com"

const authorizationHandle: Handle = async ({ event, resolve }) => {
  const session = await event.locals.auth()

  if (isProtectedRoute(event) && !session) {
    // Redirect to the signin page
    console.error("Unauthorized access to secure route")
    throw redirect(303, "/auth/signin")
  }

  if (isAdminRoute(event) && !isAdmin(session)) {
    // Redirect to the home page
    console.error("Unauthorized access to admin route")
    throw error(403, "Forbidden")
  }

  // If the request is still here, just proceed as normally
  return resolve(event)
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
  authenticationHandle,
  authorizationHandle,
)
