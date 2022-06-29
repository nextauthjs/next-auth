export { default } from "next-auth/middleware"

export const config = { matcher: ["/middleware-protected"] }

// Other ways to use this middleware



// import { NextResponse } from 'next/server';
// import { withAuth } from "next-auth/middleware"
// import { JWT } from 'next-auth/jwt';


// //Just done here fore quick example of middleware changes. In practice would recommend extending JWT type in types/next-auth.d.ts
// interface TokenMiddle extends Partial<JWT>{ 
//   home: URL | null
// }

// export default withAuth(
//   function middleware(req, ev) { //function here can run custom logic and return next response.
//     console.log(req, ev)
//     return undefined // NOTE: `NextMiddleware` should allow returning `void`
//   },
//   {
//     pages: {
//       signIn: "/unauthorized"
//     },
//     callbacks: {
//       authorized: ({ token }) => !!token && false, //User isAuthorized should different then logged in.
//       unAuthorized: ({ req, token }) => NextResponse.redirect(new URL((token as TokenMiddle).home ?? "/unauthorized", req.nextUrl.origin)), 
//     }
//   }
// )


// import withAuth from "next-auth/middleware"
// import { withAuth } from "next-auth/middleware"

// export function middleware(req, ev) {
//   return withAuth(req)
// }

// export function middleware(req, ev) {
//   return withAuth(req, ev)
// }

// export function middleware(req, ev) {
//   return withAuth(req, {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   })
// }

// export default withAuth(function middleware(req, ev) {
//   console.log(req.nextauth.token)
// })

// export default withAuth(
//   function middleware(req, ev) {
//     console.log(req, ev)
//     return undefined // NOTE: `NextMiddleware` should allow returning `void`
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token.name === "Balázs Orbán",
//     }
//   }
// )

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => !!token,
//   },
// })
