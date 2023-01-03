import type { Profile } from "@auth/core/types"
import type { Provider } from "@auth/core/providers"
import { createRequestHandlerWithAuth } from "@auth/remix"
import Google from "@auth/core/providers/google"
import path from "path"
import express from "express"
import compression from "compression"
import morgan from "morgan"
import { createRequestHandler } from "@remix-run/express"

const BUILD_DIR = path.join(process.cwd(), "build")

const app = express()

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by")

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }))

app.use(morgan("tiny"))
const context = {
  data: {},
}
const requestHandler = createRequestHandler({
  build: require(BUILD_DIR),
  mode: process.env.NODE_ENV,
  getLoadContext: (res: any, req: any) => ({ env: process.env, ...context }),
})

app.all("*", (req: Request, res: any, next: any) => {
  console.log("request made", req.url)
  process.env.NODE_ENV === "development" && purgeRequireCache()
  createRequestHandlerWithAuth(
    req,
    process.env,
    context.data,
    {
      providers: [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }) as unknown as Provider<Profile>,
      ],
    },
    async () => {
      await requestHandler(req, res, next)
      return res
    }
  )
})
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}
