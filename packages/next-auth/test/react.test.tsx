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
import type { UpdateSession } from "../src/react"
import type { Session } from "@auth/core/types"

const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString()
const sessionA: Session = { user: { name: "a" }, expires }
const sessionB: Session = { user: { name: "b" }, expires }

interface SessionRequest {
  resolve: (value: Session | null) => void
  signal?: AbortSignal
}

/** One entry per `GET /api/auth/session`, in request order. */
let sessionRequests: SessionRequest[]
/** `signal.aborted` of the latest session request when `POST /signout` was received. */
let staleAbortedAtSignOut: boolean | undefined
/** When set, the credentials callback responds with a failed sign-in. */
let credentialsSignInFails: boolean

let updateSession: UpdateSession

function Probe() {
  const { data, status, update } = useSession()
  updateSession = update
  return (
    <span data-testid="state">{`${status}:${data?.user?.name ?? "none"}`}</span>
  )
}

function renderProvider(options?: { strictMode?: boolean }) {
  const tree = (
    <SessionProvider>
      <Probe />
    </SessionProvider>
  )
  return render(
    options?.strictMode ? <React.StrictMode>{tree}</React.StrictMode> : tree
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

/** Drains all pending promise chains and re-renders. */
async function flush() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0))
  })
}

beforeEach(() => {
  sessionRequests = []
  staleAbortedAtSignOut = undefined
  credentialsSignInFails = false

  // `BroadcastChannel` would deliver `getSession` messages back to the
  // provider and trigger extra, nondeterministic session fetches.
  vi.stubGlobal("BroadcastChannel", undefined)

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: any, init: RequestInit = {}) => {
      const url = typeof input === "string" ? input : input.url

      if (url.includes("/session")) {
        const { promise, resolve } = Promise.withResolvers<Session | null>()
        sessionRequests.push({ resolve, signal: init.signal ?? undefined })
        return promise.then((body) => Response.json(body))
      }
      if (url.includes("/csrf")) return Response.json({ csrfToken: "csrf" })
      if (url.includes("/signout")) {
        staleAbortedAtSignOut = sessionRequests.at(-1)?.signal?.aborted
        return Response.json({ url: "http://localhost:3000/" })
      }
      if (url.includes("/callback/credentials")) {
        return credentialsSignInFails
          ? Response.json(
              {
                url: "http://localhost:3000/api/auth/signin?error=CredentialsSignin",
              },
              { status: 401 }
            )
          : Response.json({ url: "http://localhost:3000/" })
      }
      if (url.includes("/providers")) {
        return Response.json({
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
      throw new Error(`Unexpected fetch: ${url}`)
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
    await act(async () => {
      const signOutDone = signOut({ redirect: false })
      // signOut refetches the (now empty) session before resolving.
      const final = await nthSessionRequest(3)
      final.resolve(null)
      await signOutDone
    })
    expect(state()).toBe("unauthenticated:none")

    // The stale request must be aborted before the signout request is even
    // sent, so its rolling session cookie cannot outlive the sign-out.
    expect(stale.signal?.aborted).toBe(true)
    expect(staleAbortedAtSignOut).toBe(true)

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

    expect(stale.signal?.aborted).toBe(true)

    // The stale response must not overwrite the new account's session.
    await act(async () => stale.resolve(sessionA))
    await flush()
    expect(state()).toBe("authenticated:b")
    expect(__NEXTAUTH._session).toEqual(sessionB)
  })

  it("signOut discards a stale in-flight update() response", async () => {
    renderProvider()

    const first = await nthSessionRequest(1)
    await act(async () => first.resolve(sessionA))
    await waitFor(() => expect(state()).toBe("authenticated:a"))

    // An update() starts and stays in flight.
    let updateDone!: Promise<Session | null>
    await act(async () => {
      updateDone = updateSession()
    })
    const stale = await nthSessionRequest(2)

    await act(async () => {
      const signOutDone = signOut({ redirect: false })
      const final = await nthSessionRequest(3)
      final.resolve(null)
      await signOutDone
    })
    expect(state()).toBe("unauthenticated:none")
    expect(stale.signal?.aborted).toBe(true)
    expect(staleAbortedAtSignOut).toBe(true)

    // The stale update response must not resurrect the session.
    await act(async () => stale.resolve(sessionA))
    await flush()
    expect(await updateDone).toBeNull()
    expect(state()).toBe("unauthenticated:none")
    expect(__NEXTAUTH._session).toBeNull()
  })

  it("a failed signIn replays the session fetch it aborted", async () => {
    credentialsSignInFails = true
    renderProvider()

    const first = await nthSessionRequest(1)
    await act(async () => first.resolve(sessionA))
    await waitFor(() => expect(state()).toBe("authenticated:a"))

    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"))
    })
    const stale = await nthSessionRequest(2)

    let result: any
    await act(async () => {
      const signInDone = signIn("credentials", { redirect: false })
      // The aborted refetch is replayed even though the sign-in failed.
      const replay = await nthSessionRequest(3)
      replay.resolve(sessionA)
      result = await signInDone
    })

    expect(result).toMatchObject({ ok: false, error: "CredentialsSignin" })
    expect(stale.signal?.aborted).toBe(true)
    expect(state()).toBe("authenticated:a")
    expect(__NEXTAUTH._session).toEqual(sessionA)
  })

  it("an aborted initial fetch does not flash an unauthenticated state", async () => {
    // StrictMode aborts the first mount's fetch via the effect cleanup and
    // starts a second one; while only the aborted fetch has settled, the
    // status must stay "loading" (not "unauthenticated", which would trigger
    // useSession({ required: true }) redirects for authenticated users).
    renderProvider({ strictMode: true })

    const aborted = await nthSessionRequest(1)
    const current = await nthSessionRequest(2)
    expect(aborted.signal?.aborted).toBe(true)

    await act(async () => aborted.resolve(null))
    await flush()
    expect(state()).toBe("loading:none")

    await act(async () => current.resolve(sessionA))
    await waitFor(() => expect(state()).toBe("authenticated:a"))
  })
})
