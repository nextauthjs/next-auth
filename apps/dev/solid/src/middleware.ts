import { createMiddleware } from "@solidjs/start/middleware"
import { auth } from "../auth.js"

export default createMiddleware({
  onRequest: [
    async (event) => {
      const data = await auth(event)
      event.locals.auth = data
    },
  ],
})
