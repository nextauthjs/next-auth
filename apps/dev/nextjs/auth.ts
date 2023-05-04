import NextAuth from "@auth/nextjs"
import Auth0 from "@auth/core/providers/auth0"
import Facebook from "@auth/core/providers/facebook"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import Twitter from "@auth/core/providers/twitter"

export const { handlers, auth } = NextAuth({
  debug: true,
  providers: [GitHub, Auth0, Facebook, Google, Twitter],
  callbacks: {
    async authorized({ request, auth }) {
      if (request.nextUrl.pathname === "/dashboard") {
        return !!auth.token
      }
      return true
    },
  },
})
