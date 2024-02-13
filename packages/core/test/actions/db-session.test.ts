import { beforeEach, describe, expect, it, vi } from "vitest"

import { SESSION_COOKIE_NAME } from "../constants.js"
import { parse } from "cookie"
import { callbacks, events, getExpires, makeAuthRequest } from "../utils.js"
import { MemoryAdapter, initMemory } from "../memory-adapter.js"
import { randomString } from "../../src/lib/utils/web.js"
import { AdapterUser } from "../../adapters.js"

describe("GET", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should return a valid database session in the response, and update the session in the database", async () => {
    vi.spyOn(callbacks, "jwt")
    vi.spyOn(callbacks, "session")
    const updatedExpires = getExpires()
    const currentExpires = getExpires(24 * 60 * 60 * 1000) // 1 day from now

    const expectedSessionToken = randomString(32)
    const expectedUserId = randomString(32)
    const expectedUser = {
      id: expectedUserId,
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
      emailVerified: null,
    } satisfies AdapterUser

    // const expectedUserId = randomString(32)
    const memory = initMemory()
    memory.users.set(expectedUserId, expectedUser)
    memory.sessions.set(expectedSessionToken, {
      sessionToken: expectedSessionToken,
      userId: expectedUserId,
      expires: currentExpires,
    })

    const adapter = MemoryAdapter(memory)

    const { response } = await makeAuthRequest({
      action: "session",
      cookies: {
        [SESSION_COOKIE_NAME]: expectedSessionToken,
      },
      config: {
        adapter,
      },
    })

    const actualBodySession = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const actualSessionToken = cookies[SESSION_COOKIE_NAME]

    expect(memory.users.get(expectedUserId)).toEqual(expectedUser)
    expect(memory.sessions.get(expectedSessionToken)).toEqual({
      sessionToken: expectedSessionToken,
      userId: expectedUserId,
      expires: updatedExpires,
    })

    expect(callbacks.session).toHaveBeenCalledWith({
      newSession: undefined,
      session: {
        user: expectedUser,
        expires: currentExpires,
        sessionToken: expectedSessionToken,
        userId: expectedUserId,
      },
      user: expectedUser,
    })
    expect(callbacks.jwt).not.toHaveBeenCalled()

    expect(actualSessionToken).toEqual(expectedSessionToken)
    expect(actualBodySession.user).toEqual({
      image: expectedUser.image,
      name: expectedUser.name,
      email: expectedUser.email,
    })
    expect(actualBodySession.expires).toEqual(currentExpires.toISOString())
  })

  it("should return null in the response, and delete the session", async () => {
    vi.spyOn(callbacks, "jwt")
    vi.spyOn(callbacks, "session")
    const currentExpires = getExpires(-24 * 60 * 60 * 1000) // 1 day before

    const expectedSessionToken = randomString(32)
    const expectedUserId = randomString(32)
    const expectedUser = {
      id: expectedUserId,
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
      emailVerified: null,
    } satisfies AdapterUser

    const memory = initMemory()
    memory.users.set(expectedUserId, expectedUser)
    memory.sessions.set(expectedSessionToken, {
      sessionToken: expectedSessionToken,
      userId: expectedUserId,
      expires: currentExpires,
    })

    const adapter = MemoryAdapter(memory)

    const { response } = await makeAuthRequest({
      action: "session",
      cookies: {
        [SESSION_COOKIE_NAME]: expectedSessionToken,
      },
      config: {
        adapter,
      },
    })

    const actualBodySession = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const actualSessionToken = cookies[SESSION_COOKIE_NAME]

    expect(memory.users.get(expectedUserId)).toEqual(expectedUser)
    expect(memory.sessions.get(expectedSessionToken)).toEqual(undefined)
    expect(callbacks.session).not.toHaveBeenCalled()
    expect(events.session).not.toHaveBeenCalled()
    expect(callbacks.jwt).not.toHaveBeenCalled()

    expect(actualSessionToken).toEqual("")
    expect(actualBodySession).toEqual(null)
  })
})
