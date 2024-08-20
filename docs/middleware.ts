import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  return NextResponse.redirect(
    new URL(
      `/en${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`,
      request.url
    )
  )
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|en|jp).+)",
}
