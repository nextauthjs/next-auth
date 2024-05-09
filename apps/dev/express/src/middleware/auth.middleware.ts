import { getSession } from "@auth/express"
import { authConfig } from "../config/auth.config.js"
import type { NextFunction, Request, Response } from "express"

export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = res.locals.session ?? (await getSession(req, authConfig))

  res.locals.session = session

  if (session) {
    return next()
  }

  res.status(400).json({ message: "Not Authenticated" })
}

export async function currentSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await getSession(req, authConfig)
  res.locals.session = session
  return next()
}
