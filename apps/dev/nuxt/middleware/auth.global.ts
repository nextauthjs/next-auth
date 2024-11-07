export default defineNuxtRouteMiddleware((to, from) => {
  // root and guest pages are always accessible
  if (["/", "/guest"].includes(to.path)) {
    return
  }

  // All other pages require authentication
  const { auth } = useAuth()

  if (!auth.value.loggedIn) {
    if (import.meta.server) {
      return createError({
        statusCode: 401,
        message: "You must be logged in to access this page",
      })
    }
    return abortNavigation()
  }
})
