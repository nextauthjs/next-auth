import { vi } from "vitest"
import { Auth, createActionURL } from "../src"

import type { Adapter } from "../src/adapters"
import type { AuthAction, AuthConfig, LoggerInstance } from "../src/types"

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

export function testConfig(overrides?: Partial<AuthConfig>): AuthConfig {
  return {
    secret: "secret",
    trustHost: true,
    logger,
    basePath: "/auth",
    providers: [],
    ...overrides,
  }
}

export async function makeAuthRequest(params: {
  action: AuthAction
  cookies?: Record<string, string>
  query?: Record<string, string>
  body?: any
  config?: Partial<AuthConfig>
}) {
  const { action, body, cookies = {} } = params
  const config = testConfig(params.config)
  const headers = new Headers({ host: "authjs.test" })
  for (const [name, value] of Object.entries(cookies))
    headers.append("cookie", `${name}=${value}`)

  let url: string | URL = createActionURL(
    action,
    "http",
    headers,
    {},
    config.basePath
  )
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
