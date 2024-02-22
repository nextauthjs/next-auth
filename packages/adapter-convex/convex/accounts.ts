import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { accountsSchemaObject } from "./schema"

export const getUserByAccount = query({
  args: {
    providerAccountId: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("accounts")
      .withIndex("by_provider_account_id", (q) =>
        q.eq("providerAccountId", args.providerAccountId),
      )
      .unique();

    if (!user) return null;

    return await ctx.db.get(user.userId);
  },
});

export const create = mutation({
  args: accountsSchemaObject,
  async handler(ctx, args) {
    return await ctx.db.insert("accounts", {
      userId: args.userId,
      type: args.type,
      provider: args.provider,
      providerAccountId: args.providerAccountId,
      refreshToken: args.refreshToken,
      accessToken: args.accessToken,
      expires_at: args.expires_at,
      token_type: args.token_type,
      scope: args.scope,
      id_token: args.id_token,
      session_state: args.session_state,
    });
  },
});

export const deleteAccount = mutation({
  args: {
    providerAccountId: v.string(),
  },
  async handler(ctx, args) {
    const acc = await ctx.db
      .query("accounts")
      .withIndex("by_provider_account_id", (q) =>
        q.eq("providerAccountId", args.providerAccountId),
      )
      .unique();
    if (!acc) return null;
    return await ctx.db.delete(acc._id);
  },
});