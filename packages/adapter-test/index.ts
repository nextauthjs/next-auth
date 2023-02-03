import type { Adapter } from "next-auth/adapters"
import { createHash, randomUUID } from "crypto"

export interface TestOptions {
  adapter: Adapter
  db: {
    /** Generates UUID v4 by default. Use it to override how the test suite should generate IDs, like user id. */
    id?: () => string
    /**
     * Manually disconnect database after all tests have been run,
     * if your adapter doesn't do it automatically
     */
    disconnect?: () => Promise<any>
    /**
     * Manually establishes a db connection before all tests,
     * if your db doesn't do this automatically
     */
    connect?: () => Promise<any>
    /** A simple query function that returns a session directly from the db. */
    session: (sessionToken: string) => any
    /** A simple query function that returns a user directly from the db. */
    user: (id: string) => any
    /** A simple query function that returns an account directly from the db. */
    account: (providerAccountId: {
      provider: string
      providerAccountId: string
    }) => any
    /**
     * A simple query function that returns an verification token directly from the db,
     * based on the user identifier and the verification token (hashed).
     */
    verificationToken: (params: { identifier: string; token: string }) => any
  }
}

/**
 * A wrapper to run the most basic tests.
 * Run this at the top of your test file.
 * You can add additional tests below, if you wish.
 */
export function runBasicTests(options: TestOptions) {
  const id = options.db.id ?? randomUUID
  // Init
  beforeAll(async () => {
    await options.db.connect?.()
  })

  const { adapter, db } = options

  afterAll(async () => {
    // @ts-expect-error This is only used for the TypeORM adapter
    await adapter.__disconnect?.()
    await options.db.disconnect?.()
  })

  let user: any = {
    email: "fill@murray.com",
    image: "https://www.fillmurray.com/460/300",
    name: "Fill Murray",
    emailVerified: new Date(),
  }

  if (process.env.CUSTOM_MODEL === "1") {
    user.role = "admin"
    user.phone = "00000000000"
  }

  const session: any = {
    sessionToken: randomUUID(),
    expires: ONE_WEEK_FROM_NOW,
  }

  const account: any = {
    provider: "github",
    providerAccountId: randomUUID(),
    type: "oauth",
    access_token: randomUUID(),
    expires_at: ONE_MONTH,
    id_token: randomUUID(),
    refresh_token: randomUUID(),
    token_type: "bearer",
    scope: "user",
    session_state: randomUUID(),
  }

  // All adapters must define these methods

  test("Required (User, Account, Session) methods exist", () => {
    const requiredMethods = [
      "createUser",
      "getUser",
      "getUserByEmail",
      "getUserByAccount",
      "updateUser",
      "linkAccount",
      "createSession",
      "getSessionAndUser",
      "updateSession",
      "deleteSession",
    ]
    requiredMethods.forEach((method) => {
      expect(adapter).toHaveProperty(method)
    })
  })

  test("createUser", async () => {
    const { id } = await adapter.createUser(user)
    const dbUser = await db.user(id)
    expect(dbUser).toEqual({ ...user, id })
    user = dbUser
    session.userId = dbUser.id
    account.userId = dbUser.id
  })

  test("getUser", async () => {
    expect(await adapter.getUser(id())).toBeNull()
    expect(await adapter.getUser(user.id)).toEqual(user)
  })

  test("getUserByEmail", async () => {
    expect(await adapter.getUserByEmail("non-existent-email")).toBeNull()
    expect(await adapter.getUserByEmail(user.email)).toEqual(user)
  })

  test("createSession", async () => {
    const { sessionToken } = await adapter.createSession(session)
    const dbSession = await db.session(sessionToken)

    expect(dbSession).toEqual({ ...session, id: dbSession.id })
    session.userId = dbSession.userId
    session.id = dbSession.id
  })

  test("getSessionAndUser", async () => {
    let sessionAndUser = await adapter.getSessionAndUser("invalid-token")
    expect(sessionAndUser).toBeNull()

    sessionAndUser = await adapter.getSessionAndUser(session.sessionToken)
    if (!sessionAndUser) {
      throw new Error("Session and User was not found, but they should exist")
    }
    expect(sessionAndUser).toEqual({
      user,
      session,
    })
  })

  test("updateUser", async () => {
    const newName = "Updated Name"
    const returnedUser = await adapter.updateUser({
      id: user.id,
      name: newName,
    })
    expect(returnedUser.name).toBe(newName)

    const dbUser = await db.user(user.id)
    expect(dbUser.name).toBe(newName)
    user.name = newName
  })

  test("updateSession", async () => {
    let dbSession = await db.session(session.sessionToken)

    expect(dbSession.expires.valueOf()).not.toBe(ONE_MONTH_FROM_NOW.valueOf())

    await adapter.updateSession({
      sessionToken: session.sessionToken,
      expires: ONE_MONTH_FROM_NOW,
    })

    dbSession = await db.session(session.sessionToken)
    expect(dbSession.expires.valueOf()).toBe(ONE_MONTH_FROM_NOW.valueOf())
  })

  test("linkAccount", async () => {
    await adapter.linkAccount(account)
    const dbAccount = await db.account({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    })
    expect(dbAccount).toEqual({ ...account, id: dbAccount.id })
  })

  test("getUserByAccount", async () => {
    let userByAccount = await adapter.getUserByAccount({
      provider: "invalid-provider",
      providerAccountId: "invalid-provider-account-id",
    })
    expect(userByAccount).toBeNull()

    userByAccount = await adapter.getUserByAccount({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    })
    expect(userByAccount).toEqual(user)
  })

  test("deleteSession", async () => {
    await adapter.deleteSession(session.sessionToken)
    const dbSession = await db.session(session.sessionToken)
    expect(dbSession).toBeNull()
  })

  // These are optional for custom adapters, but we require them for the official adapters

  test("Verification Token methods exist", () => {
    const requiredMethods = ["createVerificationToken", "useVerificationToken"]
    requiredMethods.forEach((method) => {
      expect(adapter).toHaveProperty(method)
    })
  })

  test("createVerificationToken", async () => {
    const identifier = "info@example.com"
    const token = randomUUID()
    const hashedToken = hashToken(token)

    const verificationToken = {
      token: hashedToken,
      identifier,
      expires: FIFTEEN_MINUTES_FROM_NOW,
    }
    await adapter.createVerificationToken?.(verificationToken)

    const dbVerificationToken = await db.verificationToken({
      token: hashedToken,
      identifier,
    })

    expect(dbVerificationToken).toEqual(verificationToken)
  })

  test("useVerificationToken", async () => {
    const identifier = "info@example.com"
    const token = randomUUID()
    const hashedToken = hashToken(token)
    const verificationToken = {
      token: hashedToken,
      identifier,
      expires: FIFTEEN_MINUTES_FROM_NOW,
    }
    await adapter.createVerificationToken?.(verificationToken)

    const dbVerificationToken1 = await adapter.useVerificationToken?.({
      identifier,
      token: hashedToken,
    })

    if (!dbVerificationToken1) {
      throw new Error("Verification Token was not found, but it should exist")
    }

    expect(dbVerificationToken1).toEqual(verificationToken)

    const dbVerificationToken2 = await adapter.useVerificationToken?.({
      identifier,
      token: hashedToken,
    })

    expect(dbVerificationToken2).toBeNull()
  })

  // Future methods
  // These methods are not yet invoked in the core, but built-in adapters must implement them
  test("Future methods exist", () => {
    const requiredMethods = ["unlinkAccount", "deleteUser"]
    requiredMethods.forEach((method) => {
      expect(adapter).toHaveProperty(method)
    })
  })

  test("unlinkAccount", async () => {
    let dbAccount = await db.account({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    })
    expect(dbAccount).toEqual({ ...account, id: dbAccount.id })

    await adapter.unlinkAccount?.({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    })
    dbAccount = await db.account({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    })
    expect(dbAccount).toBeNull()
  })

  test("deleteUser", async () => {
    let dbUser = await db.user(user.id)
    expect(dbUser).toEqual(user)

    // Re-populate db with session and account
    delete session.id
    await adapter.createSession(session)
    await adapter.linkAccount(account)

    await adapter.deleteUser?.(user.id)
    dbUser = await db.user(user.id)
    // User should not exist after it is deleted
    expect(dbUser).toBeNull()

    const dbSession = await db.session(session.sessionToken)
    // Session should not exist after user is deleted
    expect(dbSession).toBeNull()

    const dbAccount = await db.account({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    })
    // Account should not exist after user is deleted
    expect(dbAccount).toBeNull()
  })
}

// UTILS
export function hashToken(token: string) {
  return createHash("sha256").update(`${token}anything`).digest("hex")
}

export { randomUUID }

export const ONE_WEEK_FROM_NOW = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
export const FIFTEEN_MINUTES_FROM_NOW = new Date(Date.now() + 15 * 60 * 1000)
export const ONE_MONTH = 1000 * 60 * 60 * 24 * 30
export const ONE_MONTH_FROM_NOW = new Date(Date.now() + ONE_MONTH)
