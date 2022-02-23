import NextAuth from "$lib"
import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    maxAge: 60 * 60 * 24 * 7,
  },
}

export const { get, post } = NextAuth(authOptions)
