
import NextAuth from "next-auth"
import { auth } from 'auth' ;
import { auth as auth2 } from 'auth-2' ;
import { createMiddleware } from 'next-easy-middlewares';

const middleware = {
  auth,
  auth2
};
export default createMiddleware(middleware);

//import authConfig from "./auth.config"
//export const { auth: middleware } = NextAuth(authConfig)

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
