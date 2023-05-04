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
      // if (request.method === "POST") {
      // const [, token] = request.headers.get("Authorization")?.split(" ")
      // const valid = validateToken(token)
      // // If the request has a valid auth token, it is authorized
      // if (valid) return true
      // return NextResponse.json("Invalid auth token", { status: 401 })
      // }

      // Logged in users are authorized, otherwise, will redirect to login
      // You could also return a custom redirect instead of the sign-in page
      return !!auth
    },
  },
})
