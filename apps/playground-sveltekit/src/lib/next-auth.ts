import type { ServerLoadEvent } from "@sveltejs/kit"
import type { RequestInternal } from "next-auth"
import type { NextAuthAction, NextAuthOptions } from "next-auth/core/types"
import type { OutgoingResponse as NextAuthResponse } from "next-auth/core"
import { NextAuthHandler } from "next-auth/core"
import GithubProvider from "next-auth/providers/github"
import cookie from "cookie"
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} from "$env/static/private"
import { PUBLIC_NEXTAUTH_URL } from "$env/static/public"

// @ts-expect-error import is exported on .default during SSR
const github = GithubProvider?.default || GithubProvider

export const options: NextAuthOptions = {
  providers: [
    github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],
}

const toSvelteKitResponse = async <
  T extends string | any[] | Record<string, any>
>(
  request: Request,
  nextAuthResponse: NextAuthResponse<T>
): Promise<Response> => {
  const { cookies, redirect } = nextAuthResponse

  const headers = new Headers()
  for (const header of nextAuthResponse?.headers || []) {
    // pass headers along from next-auth
    headers.set(header.key, header.value)
  }

  // set-cookie header
  if (cookies?.length) {
    headers.set(
      "set-cookie",
      cookies
        ?.map((item) => cookie.serialize(item.name, item.value, item.options))
        .join(",") as string
    )
  }

  let body = undefined
  let status = nextAuthResponse.status || 200

  if (redirect) {
    let formData: FormData | null = null
    try {
      formData = await request.formData()
    } catch {
      // no formData passed
    }
    const { json } = Object.fromEntries(formData ?? [])
    if (json !== "true") {
      status = 302
      headers.set("Location", redirect)
    } else {
      body = { url: redirect }
    }
  } else {
    body = nextAuthResponse.body
  }

  // @ts-expect-error - body is a known HTML document or JSON object
  return new Response(body, {
    status,
    headers,
  })
}

const SKNextAuthHandler = async (
  { request, url, params }: ServerLoadEvent,
  options: NextAuthOptions
): Promise<Response> => {
  const [action, provider] = params.nextauth!.split("/")
  let body: FormData | undefined
  try {
    body = await request.formData()
  } catch {
    // no formData passed
  }
  options.secret = NEXTAUTH_SECRET
  const req: RequestInternal = {
    host: PUBLIC_NEXTAUTH_URL,
    body: Object.fromEntries(body ?? []),
    query: Object.fromEntries(url.searchParams),
    headers: request.headers,
    method: request.method,
    cookies: cookie.parse(request.headers.get("cookie") || ""),
    action: action as NextAuthAction,
    providerId: provider,
    error: provider,
  }

  const response = await NextAuthHandler({
    req,
    options,
  })

  return toSvelteKitResponse(request, response)
}

export const getServerSession = async (
  request: Request,
  options: NextAuthOptions
): Promise<App.Session | null> => {
  options.secret = NEXTAUTH_SECRET

  const session = await NextAuthHandler<App.Session>({
    req: {
      host: PUBLIC_NEXTAUTH_URL,
      action: "session",
      method: "GET",
      cookies: cookie.parse(request.headers.get("cookie") || ""),
      headers: request.headers,
    },
    options,
  })

  const { body } = session

  if (body && Object.keys(body).length) {
    return body as App.Session
  }
  return null
}

export const NextAuth = (
  options: NextAuthOptions
): {
  GET: (event: ServerLoadEvent) => Promise<unknown>
  POST: (event: ServerLoadEvent) => Promise<unknown>
} => ({
  GET: (event) => SKNextAuthHandler(event, options),
  POST: (event) => SKNextAuthHandler(event, options),
})
