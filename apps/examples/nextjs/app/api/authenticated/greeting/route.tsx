import { auth } from "@/auth"
import { NextRequest } from "next/server"

async function stripContentEncoding(result: Response) {
  const data = await result.arrayBuffer()

  const responseHeaders = new Headers(result.headers)
  responseHeaders.delete("content-encoding") // Response is already decoded at this point

  return new Response(data, {
    status: result.status,
    statusText: result.statusText,
    headers: responseHeaders,
  })
}

export async function handler(request: NextRequest) {
  const session = await auth()
  if (session) {
    const headers = new Headers(request.headers)
    headers.set("Authorization", `Bearer ${session.accessToken}`)

    let backendUrl =
      process.env.THIRD_PARTY_API_EXAMPLE_BACKEND ??
      "https://authjs-third-party-backend.authjs.dev/"

    let url = request.nextUrl.href.replace(request.nextUrl.origin, backendUrl)
    let result = await fetch(new Request(url, { headers, body: request.body }))
    return await stripContentEncoding(result)
  }

  return request
}

export const dynamic = "force-dynamic"

export { handler as GET, handler as POST }
