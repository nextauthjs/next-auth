import { describe, it, expect } from "vitest"
import { useTestDatabase } from "./db/testUtils"
import { OrchidAdapter } from "../src"
import { db } from "./db/db"
import { testFactory } from "./db/testFactory"
import { NotFoundError } from "orchid-orm"

const someUUID = "c8236428-7cc8-4105-a460-efd3564342d2"

const timeToIso = <C extends string>(
  record: { [K in C]: string | null },
  column: C
) => ({
  ...record,
  [column]: record[column] && new Date(record[column] as string).toISOString(),
})

const timeToDate = <C extends string>(
  record: { [K in C]: string | null },
  column: C
) => ({
  ...record,
  [column]: record[column] && new Date(record[column] as string),
})

const mapToIso = <C extends string>(
  arr: { [K in C]: string | null }[],
  column: C
) => arr.map((x) => timeToIso(x, column))

const mapToDate = <C extends string>(
  arr: { [K in C]: string | null }[],
  column: C
) => arr.map((x) => timeToDate(x, column))

describe("OrchidAdapter", () => {
  useTestDatabase()

  const adapter = OrchidAdapter(db)

  describe("createUser", () => {
    it("should create a user", async () => {
      const data = testFactory.user.build()

      const result = await adapter.createUser(data)

      expect(result).toEqual({
        ...data,
        id: expect.any(String),
        emailVerified: data.emailVerified && new Date(data.emailVerified),
      })

      const saved = await db.user
      expect(mapToDate(saved, "emailVerified")).toEqual([result])
    })
  })

  describe("getUser", () => {
    it("should get user by id", async () => {
      const user = await testFactory.user.create()

      const result = await adapter.getUser(user.id)

      expect(result).toEqual(timeToDate(user, "emailVerified"))
    })

    it("should return null if no user", async () => {
      const result = await adapter.getUser(someUUID)

      expect(result).toBe(null)
    })
  })

  describe("getUserByEmail", () => {
    it("should get user by email", async () => {
      const user = await testFactory.user.create()

      const result = await adapter.getUserByEmail(user.email)

      expect(result).toEqual(timeToDate(user, "emailVerified"))
    })

    it("should return null if no user", async () => {
      const result = await adapter.getUserByEmail("some@email.com")

      expect(result).toBe(null)
    })
  })

  describe("getUserByAccount", () => {
    it("should get user by account", async () => {
      const user = await testFactory.user.create()
      const account = await testFactory.account.create({ userId: user.id })

      const result = await adapter.getUserByAccount?.(account)

      expect(result).toEqual(timeToDate(user, "emailVerified"))
    })

    it("should return null if no user", async () => {
      const result = await adapter.getUserByAccount?.({
        provider: "github",
        providerAccountId: "123",
      })

      expect(result).toBe(null)
    })
  })

  describe("updateUser", () => {
    it("should update user", async () => {
      const user = await testFactory.user.create()
      const data = {
        name: "updated",
        email: "updated@email.com",
        image: "updated",
        emailVerified: new Date(),
      }

      const result = await adapter.updateUser({
        id: user.id,
        ...data,
      })

      expect(result).toEqual({
        id: user.id,
        ...data,
      })

      const saved = await db.user
      expect(mapToDate(saved, "emailVerified")).toEqual([result])
    })

    it("should throw when no user", async () => {
      await expect(() => adapter.updateUser({ id: someUUID })).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("deleteUser", () => {
    it("should delete session, account, user", async () => {
      const user = await testFactory.user.create()
      await testFactory.session.create({ userId: user.id })
      await testFactory.account.create({ userId: user.id })

      await adapter.deleteUser(user.id)

      const counts = await Promise.all([
        db.user.count(),
        db.session.count(),
        db.account.count(),
      ])
      expect(counts).toEqual([0, 0, 0])
    })

    it("should not throw when no user", async () => {
      await expect(adapter.deleteUser(someUUID)).resolves.not.toThrow()
    })
  })

  describe("linkAccount", () => {
    it("should create account", async () => {
      const user = await testFactory.user.create()
      const data = testFactory.account.build({ userId: user.id })

      await adapter.linkAccount?.(data)

      const saved = await db.account
      expect(saved).toEqual([data])
    })
  })

  describe("unlinkAccount", () => {
    it("should delete account", async () => {
      const user = await testFactory.user.create()
      const account = await testFactory.account.create({ userId: user.id })

      await adapter.unlinkAccount?.(account)

      const counts = await Promise.all([db.user.count(), db.account.count()])
      expect(counts).toEqual([1, 0])
    })

    it("should not throw when no account", async () => {
      const user = await testFactory.user.create()
      const data = testFactory.account.build({ userId: user.id })

      await expect(adapter.unlinkAccount?.(data)).resolves.not.toThrow()
    })
  })

  describe("createSession", () => {
    it("should create session", async () => {
      const user = await testFactory.user.create()
      const session = testFactory.session.build({ userId: user.id })

      const result = await adapter.createSession?.(session)

      expect(result).toEqual({
        ...session,
        expires: new Date(session.expires),
      })
    })
  })

  describe("getSessionAndUser", () => {
    it("should get session and user", async () => {
      const user = await testFactory.user.create()
      const session = await testFactory.session.create({ userId: user.id })

      const result = await adapter.getSessionAndUser?.(session.sessionToken)

      expect(result).toEqual({
        session: { ...session, expires: new Date(session.expires) },
        user: {
          ...user,
          emailVerified: user.emailVerified && new Date(user.emailVerified),
        },
      })
    })

    it("should return null if no session", async () => {
      const result = await adapter.getSessionAndUser?.("token")

      expect(result).toBe(null)
    })
  })

  describe("updateSession", () => {
    it("should update session", async () => {
      const user = await testFactory.user.create()
      const otherUser = await testFactory.user.create()
      const session = await testFactory.session.create({ userId: user.id })
      const data = testFactory.session.build({
        sessionToken: session.sessionToken,
        userId: otherUser.id,
      })

      await adapter.updateSession?.(data)

      const saved = await db.session
      expect(mapToIso(saved, "expires")).toEqual([data])
    })

    it("should not throw when not found", async () => {
      await expect(
        adapter.updateSession?.({ sessionToken: "token" })
      ).resolves.not.toThrow()
    })
  })

  describe("deleteSession", () => {
    it("should delete session", async () => {
      const user = await testFactory.user.create()
      const session = await testFactory.session.create({ userId: user.id })

      await adapter.deleteSession?.(session.sessionToken)

      const saved = await db.session
      expect(saved).toEqual([])
    })

    it("should not throw when not found", async () => {
      await expect(adapter.deleteSession?.("token")).resolves.not.toThrow()
    })
  })

  describe("createVerificationToken", () => {
    it("should create verification token", async () => {
      const data = testFactory.verificationToken.build()

      await adapter.createVerificationToken?.(data)

      const saved = await db.verificationToken
      expect(mapToIso(saved, "expires")).toEqual([data])
    })
  })

  describe("useVerificationToken", () => {
    it("should get and delete verification token", async () => {
      const token = await testFactory.verificationToken.create()

      const result = await adapter.useVerificationToken?.(token)

      expect(result).toEqual({ ...token, expires: new Date(token.expires) })

      const saved = await db.verificationToken
      expect(saved).toEqual([])
    })

    it("should return null when not found", async () => {
      const result = await adapter.useVerificationToken?.({
        identifier: "123",
        token: "123",
      })

      expect(result).toBe(null)
    })
  })
})
