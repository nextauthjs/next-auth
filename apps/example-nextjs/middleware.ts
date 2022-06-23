import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      // /admin requires admin role, but /me only requires the user to be logged in.
      req.nextUrl.pathname !== "/admin" || token?.userRole === "admin",
  },
})

export const config = { matcher: ["/admin", "/me"] }
