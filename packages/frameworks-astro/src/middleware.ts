import { defineMiddleware } from "astro/middleware"
import { getSession } from "./server.js"

export const onRequest = defineMiddleware(async (ctx, next) => {
  ctx.locals.session = await getSession(ctx)
  return next()
})
