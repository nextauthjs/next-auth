import NextAuth from "next-auth"
import GitHub from "@auth/core/providers/github"

export const { handlers, auth } = NextAuth({
  providers: [GitHub],
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
