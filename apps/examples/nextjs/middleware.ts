// export { auth as default } from "auth"
import { auth } from "auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (req.auth) return NextResponse.json(req.auth)
  return NextResponse.json("Not authorized", { status: 401 })
})

export const config = { matcher: ["/middleware-protected"] }
