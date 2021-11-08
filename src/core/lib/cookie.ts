import { serialize } from "cookie"

import type { IncomingHttpHeaders } from "http"
import type { CookiesOptions } from "../.."
import type { CookieOption, LoggerInstance, SessionStrategy } from "../types"

// REVIEW: Is there any way to defer two types of strings?

/** Stringified form of `JWT`. Extract the content with `jwt.decode` */
export type JWTString = string

export type SetCookieOptions = Partial<CookieOption["options"]> & {
  expires?: Date | string
  encode?: (val: unknown) => string
}

/**
 * If `options.session.strategy` is set to `jwt`, this is a stringified `JWT`.
 * In case of `strategy: "database"`, this is the `sessionToken` of the session in the database.
 */
export type SessionToken<T extends SessionStrategy = "jwt"> = T extends "jwt"
  ? JWTString
  : string

/**
 * Use secure cookies if the site uses HTTPS
 * This being conditional allows cookies to work non-HTTPS development URLs
 * Honour secure cookie option, which sets 'secure' and also adds '__Secure-'
 * prefix, but enable them by default if the site URL is HTTPS; but not for
 * non-HTTPS URLs like http://localhost which are used in development).
 * For more on prefixes see https://googlechrome.github.io/samples/cookie-prefixes/
 *
 * @TODO Review cookie settings (names, options)
 */
export function defaultCookies(useSecureCookies: boolean): CookiesOptions {
  const cookiePrefix = useSecureCookies ? "__Secure-" : ""
  return {
    // default cookie options
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  }
}

export interface Cookie extends CookieOption {
  value: string
}

export class SessionStore {
  #chunks?: string[]
  #option: CookieOption
  #logger: LoggerInstance
  #ALLOWED_COOKIE_SIZE = 4096
  #CHUNK_SIZE: number

  type: "cookie" | "bearer" = "cookie"

  constructor(
    option: CookieOption,
    req: {
      cookies?: Record<string, string>
      headers?: Record<string, string> | IncomingHttpHeaders
    },
    logger: LoggerInstance
  ) {
    this.#logger = logger
    this.#option = option

    this.#CHUNK_SIZE =
      this.#ALLOWED_COOKIE_SIZE -
      serialize(`${option.name}.0`, "", option.options).length

    if (!req) return

    const chunks: string[] = []
    for (const name in req.cookies) {
      if (name.startsWith(option.name)) {
        chunks.push(req.cookies[name])
      }
    }

    if (chunks.length) this.#chunks = chunks

    const bearer = (req.headers?.Authorization as string | undefined)?.replace(
      "Bearer ",
      ""
    )
    if (bearer) {
      logger.debug("Found session token in request headers.", {})
      this.type = "bearer"
      this.#chunks = [bearer]
    }
  }

  get value() {
    return this.#chunks?.join("")
  }

  /** Given a cookie, return a list of cookies, chunked to fit the allowed cookie size. */
  #chunk(cookie: Cookie): Cookie[] {
    const chunkCount = Math.ceil(cookie.value.length / this.#CHUNK_SIZE)
    if (chunkCount === 1) return [cookie]

    this.#logger.debug(
      `Cookie value is bigger than ${
        this.#ALLOWED_COOKIE_SIZE
      } bytes, needs chunking...`,
      {
        cookieSize: cookie.value.length,
        chunkCount,
      }
    )

    const cookies: Cookie[] = []
    for (let i = 0; i < chunkCount; i++) {
      const chunk = cookie.value.substr(i * this.#CHUNK_SIZE, this.#CHUNK_SIZE)
      cookies.push({ ...cookie, name: `${cookie.name}.${i}`, value: chunk })
    }

    return cookies
  }

  /**
   * Given a cookie value, return new cookies, chunked, to fit the allowed cookie size.
   * If the cookie has changed from chunked to unchunked or vice versa,
   * it deletes the old cookies as well.
   */
  chunk(value: string, cookieOptions: Cookie["options"]): Cookie[] {
    const cookies: Record<string, Cookie> = {}

    // 1. assume all cookies should be cleaned
    const cleaned = this.clean()
    if (cleaned.length === 1) {
      cookies.unchunked = cleaned[0]
    } else {
      cleaned.forEach((cookie, i) => {
        cookies[i] = cookie
      })
    }

    // 2. calculate new chunks
    const chunkedCookies = this.#chunk({
      name: this.#option.name,
      value,
      options: cookieOptions,
    })
    this.#chunks = chunkedCookies.map((c) => c.value)

    // 3.a If only one new chunk, use it, but don't touch the chunks to be cleaned
    if (chunkedCookies.length === 1) {
      cookies.unchunked = chunkedCookies[0]
    } else {
      // 3.b If multiple new chunks, override the chunks that was marked for clean-up
      chunkedCookies.forEach((chunk, i) => {
        cookies[i] = chunk
      })
    }

    return Object.values(cookies)
  }

  /** Returns a list of cookies that should be cleaned. */
  clean(): Cookie[] {
    if (!this.#chunks) return []
    const clean = {
      name: this.#option.name,
      value: "",
      options: { ...this.#option.options, maxAge: 0 },
    }

    if (this.#chunks.length === 1) return [clean]

    return this.#chunks?.map((_, i) => ({
      ...clean,
      name: `${this.#option.name}.${i}`,
    }))
  }
}
