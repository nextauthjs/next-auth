import express, { Request, Response } from "express"
import logger from "morgan"
import * as path from "path"

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

// Create Express server
export const app = express()

// Express configuration
app.set("port", process.env.PORT || 3000)
app.set("views", path.join(__dirname, "../views"))
app.set("view engine", "pug")

// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable("trust proxy")

app.use(logger("dev"))

app.use(express.static(path.join(__dirname, "../public")))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(currentSession)

app.use("/api/auth/*", ExpressAuth(authConfig))

app.get("/protected", async (req: Request, res: Response) => {
  res.render("protected", { session: res.locals.session })
})

app.get(
  "/api/protected",
  authenticatedUser,
  async (req: Request, res: Response) => {
    res.json(res.locals.session)
  },
)

app.get("/", async (req: Request, res: Response) => {
  res.render("index", {
    title: "Express Auth Example",
    user: res.locals.session?.user,
  })
})

app.use(errorNotFoundHandler)
app.use(errorHandler)
