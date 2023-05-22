import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Twitter from "next-auth/providers/twitter"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub, Auth0, Facebook, Google, Twitter],
  callbacks: {
    // Read more about callbacks: https://nextjs.authjs.dev
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
