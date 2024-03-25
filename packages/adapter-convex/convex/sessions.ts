import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

export const getSessionAndUser = query({
  args: {
    sessionToken: v.string(),
  },
  async handler(ctx, args) {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken),
      )
      .unique();

    if (!session) return null;

    const user = await ctx.db.get(session.userId);

    return {
      session,
      user,
    };
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    sessionToken: v.string(),
    expires: v.string(),
  },
  async handler(ctx, args) {
    const id = await ctx.db.insert("sessions", {
      userId: args.userId,
      sessionToken: args.sessionToken,
      expires: args.expires,
    });

    // Schedule a task to destroy the session when it expires
    const time = new Date(Date.parse(args.expires)).getTime() - Date.now();

    await ctx.scheduler.runAfter(
      time,
      internal.sessions.destroyExpiredSessions,
      {
        sessionId: id,
      },
    );
  },
});

export const updateSession = mutation({
  args: {
    sessionToken: v.string(),
    expires: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const ses = await ctx.db
      .query("sessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken),
      )
      .unique();
    if (!ses) return null;
    return await ctx.db.patch(ses._id, {
      sessionToken: args.sessionToken,
      expires: args.expires,
    });
  },
});

export const deleteSession = mutation({
  args: {
    sessionToken: v.string(),
  },
  async handler(ctx, args) {
    const ses = await ctx.db
      .query("sessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken),
      )
      .unique();
    if (!ses) return null;
    return await ctx.db.delete(ses._id);
  },
});

export const destroyExpiredSessions = internalMutation({
  args: {
    sessionId: v.id("sessions"),
  },
  async handler(ctx, args) {
    await ctx.db.delete(args.sessionId);
  },
});