import type { EndpointOutput, RequestEvent } from "@sveltejs/kit"
import type { NextAuthOptions, Session } from "next-auth"
import type { NextAuthAction } from "next-auth/lib/types"
import type { OutgoingResponse } from "next-auth/core"
import { NextAuthHandler } from "next-auth/core"
import cookie from "cookie"

function getHeaders(opts: OutgoingResponse): Record<string, any> {
  return {
    ...opts.headers?.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {}),
    ["set-cookie"]: opts.cookies?.map((item) => {
      return cookie.serialize(item.name, item.value, item.options)
    }),
  }
}

async function SvelteKitNextAuthHandler(
  reqEvent: RequestEvent,
  options: NextAuthOptions
): Promise<EndpointOutput> {
  const { request, url, params } = reqEvent

  const nextauth = params.nextauth?.split("/") ?? []

  const body = Object.fromEntries(
    // @ts-expect-error: Entries property type missing
    (await request.formData().catch(() => [])).entries()
  )

  options.secret = import.meta.env.VITE_NEXTAUTH_SECRET

  const res = await NextAuthHandler({
    req: {
      host: url.origin,
      body,
      query: Object.fromEntries(url.searchParams),
      headers: request.headers,
      method: request.method,
      cookies: cookie.parse(request.headers.get("cookie") ?? ""),
      action: nextauth[0] as NextAuthAction,
      providerId: nextauth[1],
      error: nextauth[1],
    },
    options: options,
  })

  const response = {
    body: res.body,
    status: res.status ?? 200,
    headers: getHeaders(res),
  }

  if (res.redirect) {
    if (body?.json === "true") {
      response["body"] = { url: res.redirect }
    } else {
      response.status = 302
      response.headers["Location"] = res.redirect
    }
  }

  return response
}

export default (
  options: NextAuthOptions
): Record<"get" | "post", (req: RequestEvent) => Promise<EndpointOutput>> => {
  const handler = (req) => SvelteKitNextAuthHandler(req, options)
  return { get: handler, post: handler }
}

export async function getServerSession(
  request: Request,
  options: NextAuthOptions
): Promise<Session | null> {
  options.secret = import.meta.env.VITE_NEXTAUTH_SECRET

  const { body } = await NextAuthHandler<Session>({
    req: {
      host: new URL(request.url).origin,
      action: "session",
      method: "GET",
      cookies: cookie.parse(request.headers.get("cookie")),
      headers: request.headers,
    },
    options,
  })

  if (!body || !Object.keys(body).length) return null

  return body
}
