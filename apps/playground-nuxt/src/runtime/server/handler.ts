import type { NextAuthAction, NextAuthOptions, Session } from 'next-auth'
import type { RequestInternal } from 'next-auth/core'
import { NextAuthHandler } from 'next-auth/core'
import {
  appendHeader,
  defineEventHandler,
  isMethod,
  sendRedirect,
  setCookie,
  readBody,
  parseCookies,
  getQuery
} from 'h3'
import type { H3Event } from 'h3'

export function NextAuthNuxtHandler (options: NextAuthOptions) {
  return defineEventHandler(async (event) => {
    // Catch-all route params in Nuxt goes to the underscore property
    const nextauth = event.context.params._.split('/')

    const req: RequestInternal | Request = {
      host: process.env.NEXTAUTH_URL,
      body: undefined,
      query: getQuery(event),
      headers: event.req.headers,
      method: event.req.method,
      cookies: parseCookies(event),
      action: nextauth[0] as NextAuthAction,
      providerId: nextauth[1],
      error: nextauth[1]
    }

    if (isMethod(event, 'POST')) {
      req.body = await readBody(event)
    }

    const response = await NextAuthHandler({
      req,
      options
    })

    const { headers, cookies, body, redirect, status = 200 } = response
    event.res.statusCode = status

    headers?.forEach((header) => {
      appendHeader(event, header.key, header.value)
    })

    cookies?.forEach((cookie) => {
      setCookie(event, cookie.name, cookie.value, cookie.options)
    })

    if (redirect) {
      if (isMethod(event, 'POST')) {
        const body = await readBody(event)
        if (body?.json !== 'true') { await sendRedirect(event, redirect, 302) }

        return {
          url: redirect
        }
      } else {
        await sendRedirect(event, redirect, 302)
      }
    }

    return body
  })
}

export async function getServerSession (
  event: H3Event,
  options: NextAuthOptions
): Promise<Session | null> {
  options.secret = process.env.NEXTAUTH_SECRET

  const session = await NextAuthHandler<Session>({
    req: {
      host: process.env.NEXTAUTH_URL,
      action: 'session',
      method: 'GET',
      cookies: parseCookies(event),
      headers: event.req.headers
    },
    options
  })

  const { body } = session

  if (body && Object.keys(body).length) {
    return body
  }
  return null
}
