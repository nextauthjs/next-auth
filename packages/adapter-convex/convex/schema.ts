import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userSchemaObject = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.string()),
  image: v.optional(v.string()),
}

export const accountsSchemaObject = {
  userId: v.id("users"),
  type: v.string(),
  provider: v.string(),
  providerAccountId: v.string(),
  refreshToken: v.optional(v.string()),
  accessToken: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string()),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
}

/**
 * Convex schema
 *
 * The [user, account, session, verificationToken] tables are modeled from https://authjs.dev/getting-started/adapters#models
 */
export default defineSchema({
  /**
   * * User table
   * @see https://authjs.dev/getting-started/adapters#user
   */
  users: defineTable(userSchemaObject).index("by_user_email", ["email"]),
  /**
   * * Session table
   *
   * @see https://authjs.dev/getting-started/adapters#session
   */
  sessions: defineTable({
    userId: v.id("users"),
    expires: v.optional(v.string()),
    sessionToken: v.string(),
  }).index("by_session_token", ["sessionToken"]),
  /**
   * * Account table
   *
   * @see https://authjs.dev/getting-started/adapters#account
   */
  accounts: defineTable(accountsSchemaObject).index("by_provider_account_id", ["providerAccountId"]),
});