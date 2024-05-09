import express, { type Request, type Response } from "express"
import logger from "morgan"
import { join } from "node:path"

import {
  errorHandler,
  errorNotFoundHandler,
} from "./middleware/error.middleware.js"

import {
  authenticatedUser,
  currentSession,
} from "./middleware/auth.middleware.js"
import { ExpressAuth } from "@auth/express"
import { authConfig } from "./config/auth.config.js"
import * as pug from "pug"

export const app = express()

app.set("port", process.env.PORT || 3004)

// @ts-expect-error (https://stackoverflow.com/questions/45342307/error-cannot-find-module-pug)
app.engine("pug", pug.__express)
app.set("views", join(import.meta.dirname, "..", "views"))
app.set("view engine", "pug")

// Trust Proxy for Proxies (Heroku, Render.com, Docker behind Nginx, etc)
// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.set("trust proxy", true)

app.use(logger("dev"))

// Serve static files
// NB: Uncomment this out if you want Express to serve static files for you vs. using a
// hosting provider which does so for you (for example through a CDN).
// app.use(express.static(join(import.meta.dirname, "..", "public")))

// Parse incoming requests data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set session in res.locals
app.use(currentSession)

// Set up ExpressAuth to handle authentication
// IMPORTANT: It is highly encouraged set up rate limiting on this route
app.use("/api/auth/*", ExpressAuth(authConfig))

// Routes
app.get("/protected", async (_req: Request, res: Response) => {
  res.render("protected", { session: res.locals.session })
})

app.get(
  "/api/protected",
  authenticatedUser,
  async (_req: Request, res: Response) => {
    res.json(res.locals.session)
  }
)

app.get("/", async (_req: Request, res: Response) => {
  res.render("index", {
    title: "Express Auth Example",
    user: res.locals.session?.user,
  })
})

// Error handlers
app.use(errorNotFoundHandler)
app.use(errorHandler)
