// Gatsby Functions are not yet supported on Vercel, so you'll need to use the root `api` folder.
import NextAuth from "next-auth/next"
import { authConfig } from "../../nextauth.config"

export default async function handler(req, res) {
  const { nextauth, provider, ...rest } = req.query
  req.query = { nextauth: [nextauth, provider], ...rest }
  return await NextAuth(req, res, authConfig)
}
