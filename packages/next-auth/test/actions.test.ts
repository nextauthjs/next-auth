import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import NextAuth, { NextAuthConfig } from "../src"
// TODO: Move the MemoryAdapter to utils package
import { MemoryAdapter } from "../../core/test/memory-adapter"
import Nodemailer from "@auth/core/providers/nodemailer"

let mockedHeaders = vi.hoisted(() => {
  return new globalThis.Headers()
})

const mockRedirect = vi.hoisted(() => vi.fn())

vi.mock("next/navigation", async (importOriginal) => {
  const originalModule = await importOriginal()
  return {
    // @ts-expect-error - not typed
    ...originalModule,
    redirect: mockRedirect,
  }
})

vi.mock("next/headers", async (importOriginal) => {
  const originalModule = await importOriginal()
  return {
    // @ts-expect-error - not typed
    ...originalModule,
    headers: () => mockedHeaders,
    cookies: () => {
      const cookies: { [key: string]: unknown } = {}
      return {
        get: (name: string) => {
          return cookies[name]
        },
        set: (name: string, value: string) => {
          cookies[name] = value
        },
      }
    },
  }
})

const options = {
  email: "jane@example.com",
} satisfies Parameters<ReturnType<typeof NextAuth>["signIn"]>[1]

let nextAuth: ReturnType<typeof NextAuth> | null = null

let config: NextAuthConfig = {
  adapter: MemoryAdapter(),
  providers: [
    Nodemailer({
      sendVerificationRequest() {
        // ignore
      },
      server: {
        host: "smtp.example.com",
        port: 465,
        secure: true,
      },
    }),
  ],
}

describe("signIn action", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = "secret"
    process.env.AUTH_URL = "http://localhost"
    nextAuth = NextAuth(config)
  })
  afterEach(() => {
    process.env.AUTH_SECRET = ""
    process.env.AUTH_URL = ""
    nextAuth = null
    vi.resetAllMocks()
  })
  describe("with Nodemailer provider", () => {
    it("redirects to /verify-request", async () => {
      await nextAuth?.signIn("nodemailer", options)
      expect(mockRedirect).toHaveBeenCalledWith(
        "http://localhost/api/auth/verify-request?provider=nodemailer&type=email"
      )
    })

    it("redirects to /error page when sendVerificationRequest throws", async () => {
      nextAuth = NextAuth({
        ...config,
        providers: [
          Nodemailer({
            sendVerificationRequest() {
              throw new Error()
            },
            server: {
              host: "smtp.example.com",
              port: 465,
              secure: true,
            },
          }),
        ],
      })
      const redirectTo = await nextAuth.signIn("nodemailer", {
        ...options,
        redirect: false,
      })
      expect(redirectTo).toEqual(
        "http://localhost/api/auth/error?error=Configuration"
      )
    })
  })
})
