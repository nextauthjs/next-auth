import type { LoggerInstance, NextAuthOptions } from "../src"
import { NextAuthHandler } from "../src/core"

export async function handler(
  options: NextAuthOptions,
  {
    prod,
    path,
    params,
  }: {
    prod?: boolean
    path?: string
    params?: URLSearchParams | Record<string, string>
  }
) {
  // @ts-ignore
  if (prod) process.env.NODE_ENV = "production"

  const mockLogger: LoggerInstance = {
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }
  const url = new URL(
    `http://localhost/api/auth/${path ?? "signin"}?${new URLSearchParams(
      params ?? {}
    )}`
  )
  const req = new Request(url, {
    headers: {
      host: "",
    },
  })
  const response = await NextAuthHandler({
    req,
    options: { secret: "secret", ...options, logger: mockLogger },
  })
  // @ts-ignore
  if (prod) process.env.NODE_ENV = "test"

  return {
    res: {
      ...response,
      html:
        response.headers?.[0].value === "text/html" ? response.body : undefined,
    },
    log: mockLogger,
  }
}
