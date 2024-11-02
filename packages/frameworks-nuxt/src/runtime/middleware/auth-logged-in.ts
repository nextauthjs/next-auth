import {
  abortNavigation,
  createError,
  defineNuxtRouteMiddleware,
} from "#imports"
import { useAuth } from "../composables/useAuth"
import type { RouteLocationNormalized } from "vue-router"

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const { auth } = useAuth()

  if (!auth.value.loggedIn) {
    if (import.meta.server) {
      return createError({
        statusCode: 401,
        message: "You must be logged in to access this page",
      })
    }

    // Redirect if needed
    const route =
      to?.meta?.auth?.unauthenticatedRedirectTo ??
      useRuntimeConfig()?.public?.authJs?.globalUnauthenticatedRedirectTo

    // To prevent infinite loops, check if the route is already the same
    if (route !== to.path) {
      return navigateTo(route)
    } else {
      return abortNavigation("Unathorized access")
    }
  }
})
