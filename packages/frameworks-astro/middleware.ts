import { defineMiddleware } from 'astro/middleware'
import { getSession } from './server'

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  locals.session = await getSession(request)
  return next()
})
