import NextAuth from "@auth/nextjs"
import Auth0 from "@auth/core/providers/auth0"
import Facebook from "@auth/core/providers/facebook"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import Twitter from "@auth/core/providers/twitter"
import Credentials from "@auth/core/providers/credentials"

export const { handlers, auth, getServerSession } = NextAuth({
  debug: true,
  providers: [
    GitHub,
    Auth0,
    Facebook,
    Google,
    Twitter,
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "password") return null
        return { id: "test", name: "Test User", email: "test@example.com" }
      },
    }),
  ],
  callbacks: {
    async authorized({ request: { nextUrl }, auth }) {
      if (nextUrl.pathname === "/dashboard") return !!auth.user
      return true
    },
  },
})
