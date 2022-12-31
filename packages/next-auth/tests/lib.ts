import { createHash } from "crypto"
import { AuthHandler } from "../src/core"
import type { LoggerInstance, AuthOptions } from "../src"
import type { Adapter } from "../src/adapters"

export const mockLogger: () => LoggerInstance = () => ({
  error: jest.fn(() => {}),
  warn: jest.fn(() => {}),
  debug: jest.fn(() => {}),
})

interface HandlerOptions {
  prod?: boolean
  path?: string
  params?: URLSearchParams | Record<string, string>
  requestInit?: RequestInit
}

export async function handler(
  options: AuthOptions,
  { prod, path, params, requestInit }: HandlerOptions
) {
  // @ts-expect-error
  if (prod) process.env.NODE_ENV = "production"

  const url = new URL(
    `http://localhost/api/auth/${path ?? "signin"}?${new URLSearchParams(
      params ?? {}
    )}`
  )
  const req = new Request(url, { headers: { host: "" }, ...requestInit })
  const logger = mockLogger()
  const response = await AuthHandler({
    req,
    options: { secret: "secret", ...options, logger },
  })
  // @ts-expect-error
  if (prod) process.env.NODE_ENV = "test"

  return {
    res: {
      ...response,
      html:
        response.headers?.[0].value === "text/html" ? response.body : undefined,
    },
    log: logger,
  }
}

export function createCSRF() {
  const secret = "secret"
  const value = "csrf"
  const token = createHash("sha256").update(`${value}${secret}`).digest("hex")

  return {
    secret,
    csrf: { value, token, cookie: `next-auth.csrf-token=${value}|${token}` },
  }
}

export function mockAdapter(): Adapter {
  const adapter: Adapter = {
    createVerificationToken: jest.fn(() => {}),
    useVerificationToken: jest.fn(() => {}),
    getUserByEmail: jest.fn(() => {}),
  } as unknown as Adapter
  return adapter
}
