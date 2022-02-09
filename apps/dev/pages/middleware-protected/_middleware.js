export { default } from "next-auth/middleware"

// Other ways to use this middleware

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
