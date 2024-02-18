import { createMiddleware } from "@solidjs/start/middleware"
import { auth } from "../auth.js"

export default createMiddleware({
  onRequest: [
    async (event) => {
      // TODO: Doesn't work on first load, errors out with:
      // Cannot call server function between requests
      // Comment this out, reload, uncomment and reload and then it works though :shrug:
      // i.e. basically have to load the page once wiht this commented out, afterward it works..
      //
      // No idea how to get this session data available on the FE though :shrug2:
      const data = await auth(event)
      console.log("MIDDLEWARE.SESSION", data)
      event.locals.auth = data
    },
  ],
})
