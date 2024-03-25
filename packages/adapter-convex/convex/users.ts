import { v } from "convex/values";
import { QueryCtx, mutation, query } from "./_generated/server";
import { userSchemaObject } from "./schema"

export const create = mutation({
  args: userSchemaObject,
  async handler(ctx, args) {
    return await ctx.db
      .insert("users", {
        email: args.email,
        name: args.name,
        emailVerified: args.emailVerified,
        image: args.image,
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  },
});

export const get = query({
  args: {
    id: v.id("users"),
  },
  async handler(ctx, args) {
    return await ctx.db.get(args.id);
  },
});

export const getByEmail = query({
  args: {
    email: v.string(),
  },
  async handler(ctx, args) {
    return await getUserWithEmail(ctx, args.email);
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    ...userSchemaObject,
  },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.id);
    if (!user) return null;

    await ctx.db.patch(user._id, {
      email: args.email,
      name: args.name,
      emailVerified: args.emailVerified,
      image: args.image,
    });

    return await ctx.db.get(user._id);
  },
});

export const deleteUser = mutation({
  args: {
    id: v.id("users"),
  },
  async handler(ctx, args) {
    return await ctx.db.delete(args.id);
  },
});

/**
 * Gets a user by there email
 * @param ctx The Convex Query Context
 * @param email The email to search for
 * @returns
 */
export async function getUserWithEmail(ctx: QueryCtx, email: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_user_email", (q) => q.eq("email", email))
    .unique()
    .catch((err) => {
      console.error(err);
      return null;
    });
}