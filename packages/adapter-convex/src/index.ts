import {  ConvexHttpClient } from "convex/browser"
import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
} from "@auth/core/src/adapters"
import { Awaitable } from "vitest"
import { api } from "../convex/_generated/api"
import { Id } from "../convex/_generated/dataModel"

export function ConvexAdapter(client: ConvexHttpClient): Adapter {
  return {
    createUser(user: AdapterUser): Awaitable<AdapterUser> {
      return client.mutation(api.users.create, {
        email: user.email,
        emailVerified: user.emailVerified ? user.emailVerified.toISOString() : undefined,
        image: user.image ?? undefined,
        name: user.name ?? undefined,
      }).then((_id) => {
        if(!_id) throw new Error("Failed to create new user!")
        let temp = user
        temp.id = _id as string
        return temp
      })
    },
    getUser(id: string): Awaitable<AdapterUser | null> {
      return client.query(api.users.get, { id: id as Id<"users"> }).then((user) => {
        if(!user) return null
        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified ? new Date(user?.emailVerified) : undefined,
          image: user?.image,
        } as AdapterUser
      })
    }
  }
}