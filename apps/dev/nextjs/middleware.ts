import NextAuth from "next-auth"
import authConfig from "auth.config"

export const middleware = NextAuth(authConfig).auth

// export const middleware = NextAuth((req) => {
//   console.log("middleware", req)
//   return authConfig
// }).auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
