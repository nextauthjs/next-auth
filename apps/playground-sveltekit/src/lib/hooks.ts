import type { Handle, GetSession } from "@sveltejs/kit"
import { getToken, type JWT } from "next-auth/jwt"
import cookie from "cookie"
import type { NextAuthMiddlewareOptions } from "next-auth/middleware"
import type { NextAuthOptions } from "next-auth"

const handle: (
  options: NextAuthMiddlewareOptions & NextAuthOptions
) => Handle = (options) => async (input) => {
  const { event, resolve } = input
  const { request } = event
  const token = await getToken({
    req: {
      cookies: cookie.parse(request.headers.get("cookie") ?? ""),
      // @ts-expect-error: Entries property type missing
      headers: Object.fromEntries(request.headers.entries()),
    },
    secret: import.meta.env.VITE_NEXTAUTH_SECRET,
  })

  const authorized =
    options.callbacks?.authorized?.({
      token,
      req: event.request,
    }) ?? !!token

  if (
    event.request.url.startsWith(options.pages?.signIn ?? "/api/auth/signin")
  ) {
    return new Response(null, {
      status: 302,
      headers: {
        location: options.pages?.signIn ?? "/api/auth/signin",
      },
    })
  }

  if (!authorized) {
    return resolve(event)
  } else {
    // TODO: callbacks.authorized
    // @ts-expect-error: REVIEW: Should be set in app.d.ts already
    event.locals.token = token ?? {}
  }

  return resolve(event)
}

const getSession: (options?: NextAuthOptions) => GetSession =
  (options) => async (event) => {
    // @ts-expect-error: REVIEW: Should be set in app.d.ts already
    const token = event.locals.token as JWT
    if (token) {
      const defaultSession = {
        user: {
          name: token?.name,
          email: token?.email,
          image: token?.picture,
        },
        expires: new Date(
          Date.now() + options.session.maxAge * 1000
        ).toISOString(),
      }
      return (
        // @ts-expect-error
        options.callbacks?.session?.({ session: defaultSession, token }) ??
        defaultSession
      )
    }
    return {}
  }

export const hooks = (
  options?: NextAuthMiddlewareOptions & NextAuthOptions
) => {
  return {
    getSession: getSession(options),
    handle: handle(options),
  }
}

export default hooks
