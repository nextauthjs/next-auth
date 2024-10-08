import { defineMiddleware } from "astro/middleware"
import { auth } from "./server.js"

export const onRequest = defineMiddleware(async (ctx, next) => {
  ctx.locals.session = await auth(ctx)
  return next()
})
