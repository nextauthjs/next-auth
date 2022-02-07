// If your deployment environment supports Gatsby Functions, you won't need the root `api` folder, only this.

import NextAuth from "next-auth/next"
import { authConfig } from "../../nextauth.config"

export default async function handler(req, res) {
  req.query.nextauth = req.params.nextauth.split("/")
  return await NextAuth(req, res, authConfig)
}
