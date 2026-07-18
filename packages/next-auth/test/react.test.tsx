// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import * as React from "react"
import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import {
  SessionProvider,
  signIn,
  signOut,
  useSession,
  __NEXTAUTH,
} from "../src/react"
import type { Session } from "@auth/core/types"

const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString()
const sessionA: Session = { user: { name: "a" }, expires }
const sessionB: Session = { user: { name: "b" }, expires }

interface Deferred {
  promise: Promise<Session | null>
  resolve: (value: Session | null) => void
}

function deferred(): Deferred {
  let resolve!: Deferred["resolve"]
  const promise = new Promise<Session | null>((r) => (resolve = r))
  return { promise, resolve }
}

interface RecordedCall {
  url: string
  method: string
  signal?: AbortSignal
}

let calls: RecordedCall[]
/** One deferred per `GET /api/auth/session`, in request order. */
let sessionRequests: Deferred[]
/** `signal.aborted` of each session request at the moment `POST /signout` was received. */
let sessionSignalsAbortedAtSignOut: (boolean | undefined)[] | undefined

function sessionCalls() {
  return calls.filter((c) => c.url.includes("/session"))
}

function jsonResponse(body: any) {
  return { ok: true, status: 200, json: async () => body }
}

function Probe() {
  const { data, status } = useSession()
  return React.createElement(
    "span",
    { "data-testid": "state" },
    `${status}:${data?.user?.name ?? "none"}`
  )
}

function renderProvider() {
  return render(
    React.createElement(SessionProvider, null, React.createElement(Probe))
  )
}

function state() {
  return screen.getByTestId("state").textContent
}

/** Waits until the nth (1-indexed) session request has been issued. */
async function nthSessionRequest(n: number) {
  await waitFor(() => expect(sessionRequests.length).toBeGreaterThanOrEqual(n))
  return sessionRequests[n - 1]
}

async function flush() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 10))
  })
}

beforeEach(() => {
  calls = []
  sessionRequests = []
  sessionSignalsAbortedAtSignOut = undefined

  // `BroadcastChannel` would deliver `getSession` messages back to the
  // provider and trigger extra, nondeterministic session fetches.
  vi.stubGlobal("BroadcastChannel", undefined)

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: any, init: RequestInit = {}) => {
      const url = typeof input === "string" ? input : input.url
      const method = (init.method ?? "get").toString().toLowerCase()
      calls.push({ url, method, signal: init.signal ?? undefined })

      if (url.includes("/session")) {
        const request = deferred()
        sessionRequests.push(request)
        return request.promise.then(jsonResponse)
      }
      if (url.includes("/csrf")) return jsonResponse({ csrfToken: "csrf" })
      if (url.includes("/signout")) {
        sessionSignalsAbortedAtSignOut = sessionCalls().map(
          (c) => c.signal?.aborted
        )
        return jsonResponse({ url: "http://localhost:3000/" })
      }
      if (url.includes("/callback/credentials")) {
        return jsonResponse({ url: "http://localhost:3000/" })
      }
      if (url.includes("/providers")) {
        return jsonResponse({
          credentials: {
            id: "credentials",
            name: "Credentials",
            type: "credentials",
            signinUrl: "http://localhost:3000/api/auth/signin/credentials",
            callbackUrl: "http://localhost:3000/",
            redirectTo: "http://localhost:3000/",
          },
        })
      }
      throw new Error(`Unexpected fetch: ${method} ${url}`)
    })
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("in-flight session fetch vs. auth state changes", () => {
  it("signOut discards a stale in-flight session response", async () => {
    renderProvider()

    // Mount fetch resolves with a session.
    const first = await nthSessionRequest(1)
    await act(async () => first.resolve(sessionA))
    await waitFor(() => expect(state()).toBe("authenticated:a"))

    // A refetch (window regains focus) starts and stays in flight.
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"))
    })
    const stale = await nthSessionRequest(2)

    // Sign out while the refetch is still pending.
    let signOutDone: Promise<unknown>
    await act(async () => {
      signOutDone = signOut({ redirect: false })
      // signOut refetches the (now empty) session before resolving.
      const final = await nthSessionRequest(3)
      final.resolve(null)
      await signOutDone
    })
    expect(state()).toBe("unauthenticated:none")

    // The stale response must be aborted before the signout request is even
    // sent, so its rolling session cookie cannot outlive the sign-out.
    expect(sessionCalls()[1].signal?.aborted).toBe(true)
    expect(sessionSignalsAbortedAtSignOut?.[1]).toBe(true)

    // The stale response arrives last; it must not resurrect the session.
    await act(async () => stale.resolve(sessionA))
    await flush()
    expect(state()).toBe("unauthenticated:none")
    expect(__NEXTAUTH._session).toBeNull()
  })

  it("signIn discards a stale in-flight session response", async () => {
    renderProvider()

    const first = await nthSessionRequest(1)
    await act(async () => first.resolve(sessionA))
    await waitFor(() => expect(state()).toBe("authenticated:a"))

    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"))
    })
    const stale = await nthSessionRequest(2)

    // Switch accounts while the refetch is still pending.
    await act(async () => {
      const signInDone = signIn("credentials", { redirect: false })
      const final = await nthSessionRequest(3)
      final.resolve(sessionB)
      await signInDone
    })
    await waitFor(() => expect(state()).toBe("authenticated:b"))

    expect(sessionCalls()[1].signal?.aborted).toBe(true)

    // The stale response must not overwrite the new account's session.
    await act(async () => stale.resolve(sessionA))
    await flush()
    expect(state()).toBe("authenticated:b")
    expect(__NEXTAUTH._session).toEqual(sessionB)
  })
})
