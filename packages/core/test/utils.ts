import { vi } from "vitest"
import { Auth, createActionURL } from "../src"

import type { Adapter } from "../src/adapters"
import type { AuthAction, AuthConfig, LoggerInstance } from "../src/types"
import { defaultCallbacks } from "../src/lib/init.ts"

export const AUTH_SECRET = "secret"
export const SESSION_COOKIE_NAME = "__Secure-authjs.session-token"
export const CSRF_COOKIE_NAME = "__Host-authjs.csrf-token"

export function TestAdapter(): Adapter {
  return {
    createUser: vi.fn(),
    getUser: vi.fn(),
    getUserByEmail: vi.fn(),
    getUserByAccount: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    linkAccount: vi.fn(),
    unlinkAccount: vi.fn(),
    createSession: vi.fn(),
    getSessionAndUser: vi.fn(),
    updateSession: vi.fn(),
    deleteSession: vi.fn(),
    createVerificationToken: vi.fn(),
    useVerificationToken: vi.fn(),
  }
}

export const logger: LoggerInstance = {
  debug: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

export const events = {
  signIn: vi.fn(),
  signOut: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  linkAccount: vi.fn(),
  session: vi.fn(),
} satisfies AuthConfig["events"]

export const callbacks = defaultCallbacks

export const getExpires = (maxAge = 30 * 24 * 60 * 60 * 1000) => {
  const now = Date.now()
  vi.setSystemTime(now)
  return new Date(now + maxAge)
}

export function testConfig(overrides?: Partial<AuthConfig>): AuthConfig {
  return {
    secret: "secret",
    trustHost: true,
    logger,
    events,
    callbacks,
    basePath: "/auth",
    providers: [],
    ...overrides,
  }
}

export async function makeAuthRequest(params: {
  action: AuthAction
  cookies?: Record<string, string>
  host?: string
  path?: string
  query?: Record<string, string>
  body?: any
  config?: Partial<AuthConfig>
}) {
  const { action, body, cookies = {}, host = "authjs.test" } = params
  const config = testConfig(params.config)
  const headers = new Headers({ host: host })
  for (const [name, value] of Object.entries(cookies))
    headers.append("cookie", `${name}=${value}`)

  let url: string | URL = createActionURL(action, "https", headers, {}, config)
  if (params.path) url = `${url}${params.path}`
  if (params.query) url = `${url}?${new URLSearchParams(params.query)}`
  const request = new Request(url, {
    method: body ? "POST" : "GET",
    headers,
    body,
  })
  const response = (await Auth(request, config)) as Response
  return {
    response,
    logger: config.logger,
  }
}
