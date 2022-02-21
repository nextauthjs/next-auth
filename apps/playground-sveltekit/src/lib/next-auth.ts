import type { RequestEvent } from "@sveltejs/kit"
import type { IncomingRequest, NextAuthOptions, Session } from "next-auth"
import type { NextAuthAction } from "next-auth/lib/types"
import type { OutgoingResponse } from "next-auth/core"
import { NextAuthHandler } from "next-auth/core"
import cookie from "cookie"
import getFormBody from "./utils/get-form-body"

async function toSvelteKitResponse(
  request: Request,
  nextAuthResponse: OutgoingResponse<unknown>
) {
  const { headers, cookies, body, redirect, status = 200 } = nextAuthResponse

  const response = {
    status,
    headers: {},
  }

  headers?.forEach((header) => {
    response.headers[header.key] = header.value
  })

  response.headers["set-cookie"] = cookies?.map((item) => {
    return cookie.serialize(item.name, item.value, item.options)
  })

  if (redirect) {
    let formData = null
    try {
      formData = await request.formData()
      formData = getFormBody(formData)
    } catch {
      // no formData passed
    }
    if (formData?.json !== "true") {
      response.status = 302
      response.headers["Location"] = redirect
    } else {
      response["body"] = { url: redirect }
    }
  } else {
    response["body"] = body
  }

  return response
}

async function SKNextAuthHandler(
  { request, url, params }: RequestEvent,
  options: NextAuthOptions
) {
  const nextauth = params.nextauth.split("/")
  let body = null
  try {
    body = await request.formData()
    body = getFormBody(body)
  } catch {
    // no formData passed
  }
  options.secret = import.meta.env.VITE_NEXTAUTH_SECRET
  const req: IncomingRequest = {
    host: import.meta.env.VITE_NEXTAUTH_URL,
    body,
    query: Object.fromEntries(url.searchParams),
    headers: request.headers,
    method: request.method,
    cookies: cookie.parse(request.headers.get("cookie")),
    action: nextauth[0] as NextAuthAction,
    providerId: nextauth[1],
    error: nextauth[1],
  }

  const response = await NextAuthHandler({
    req,
    options,
  })

  return toSvelteKitResponse(request, response)
}

export async function getServerSession(
  request: Request,
  options: NextAuthOptions
): Promise<Session | null> {
  
  options.secret = import.meta.env.VITE_NEXTAUTH_SECRET
  
  const session = await NextAuthHandler<Session>({
    req: {
      host: import.meta.env.VITE_NEXTAUTH_URL,
      action: "session",
      method: "GET",
      cookies: cookie.parse(request.headers.get("cookie")),
      headers: request.headers,
    },
    options,
  })

  const { body } = session

  if (body && Object.keys(body).length) return body as Session
  return null
}

export default (
  options: NextAuthOptions
): {
  get: (req: RequestEvent) => Promise<unknown>
  post: (req: RequestEvent) => Promise<unknown>
} => ({
  get: (req) => SKNextAuthHandler(req, options),
  post: (req) => SKNextAuthHandler(req, options),
})
