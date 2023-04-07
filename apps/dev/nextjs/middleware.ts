// export { withAuth as default } from "app/auth"
import { withAuth } from "app/auth"

// export default withAuth((req) => {
//   const auth = req.auth?.id
// })

export async function middleware(req) {
  const auth = await withAuth(req)
}

export const config = { matcher: ["/middleware-protected"] }
