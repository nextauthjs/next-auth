import { createMiddleware } from "@solidjs/start/middleware"
import { auth } from "../auth.js"

export default createMiddleware({
  onRequest: [
    (event) => {
      event.locals.auth = auth(event)
      console.log("GLOBAL", event)
    },
  ],
})
