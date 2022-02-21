import NextAuth from "$lib"
import GithubProvider from "next-auth/providers/github"

export const { get, post } = NextAuth({
  providers: [
    GithubProvider({
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    }),
  ],
})
