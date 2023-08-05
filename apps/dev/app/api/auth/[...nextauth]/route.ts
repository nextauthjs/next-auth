import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
// import { NextRequest } from "next/server"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
}

/**
 * Advanced Initialization - route handler
 */
// const handler = async (
//   req: NextRequest,
//   routeContext: { params: { nextauth: string[] } }
// ): Promise<any> => {
//   return NextAuth(req, routeContext, authOptions)
// }

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
