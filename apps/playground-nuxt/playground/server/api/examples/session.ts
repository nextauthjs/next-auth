import { getServerSession } from 'next-auth-nuxt/handler'
import { authOptions } from '../auth/[...]'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions)
  return session
})
