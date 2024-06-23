import {
  abortNavigation,
  createError,
  defineNuxtRouteMiddleware,
} from "#imports"
import { useAuth } from "../composables/useAuth"

export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  if (status.value === "authenticated") {
    if (import.meta.server) {
      return createError({
        statusCode: 401,
        message: "You must be logged out to access this page",
      })
    }

    // Redirect if needed
    const route = to?.meta?.auth?.authenticatedRedirectTo ?? ""

    // To prevent infinite loops, check if the route is already the same
    if (route !== to.path) {
      return navigateTo(route)
    } else {
      return abortNavigation("Unathorized access")
    }
  }
})
