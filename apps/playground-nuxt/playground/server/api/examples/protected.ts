import { getServerSession } from 'next-auth-nuxt/handler'
import { authOptions } from '../auth/[...]'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions)

  if (session) {
    return {
      content: 'This is protected content. You can access this content because you are signed in.'
    }
  }

  return {
    error: 'You must be signed in to view the protected content on this page.'
  }
})
