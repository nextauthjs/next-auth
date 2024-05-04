import { type Session } from "@auth/express"

declare module "express" {
  interface Response {
    locals: {
      session?: Session
    }
  }
}
