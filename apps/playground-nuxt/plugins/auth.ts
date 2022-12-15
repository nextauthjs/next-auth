import { Session } from '@auth/core'

export default defineNuxtPlugin(async () => {
  const session = useSession()

  addRouteMiddleware('auth', () => {
    if (!session.value) return navigateTo('/')
  })

  if (process.server) {
    const data = await $fetch<Session>('/api/auth/session', {
      headers: useRequestHeaders() as any
    })
  
    const hasSession = data && Object.keys(data).length

    session.value = hasSession ? data : null
  }
})
