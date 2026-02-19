import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ALLOWED_EMOJIS = ["👍", "🎉", "❤️"];

export const toggleReaction = mutation({
  args: {
    changelogId: v.id("changelogs"),
    emoji: v.string(),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    if (!ALLOWED_EMOJIS.includes(args.emoji)) {
      throw new Error("Invalid emoji");
    }

    // Check if this fingerprint already reacted with this emoji
    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_changelog_fingerprint", (q) =>
        q.eq("changelogId", args.changelogId).eq("fingerprint", args.fingerprint)
      )
      .collect();

    const existingReaction = existing.find((r) => r.emoji === args.emoji);

    if (existingReaction) {
      // Remove the reaction (toggle off)
      await ctx.db.delete(existingReaction._id);
      return { action: "removed" };
    } else {
      // Add the reaction
      await ctx.db.insert("reactions", {
        changelogId: args.changelogId,
        emoji: args.emoji,
        fingerprint: args.fingerprint,
        createdAt: Date.now(),
      });
      return { action: "added" };
    }
  },
});

export const getReactionCounts = query({
  args: {
    changelogId: v.id("changelogs"),
  },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_changelog", (q) => q.eq("changelogId", args.changelogId))
      .collect();

    const counts: Record<string, number> = {};
    for (const emoji of ALLOWED_EMOJIS) {
      counts[emoji] = reactions.filter((r) => r.emoji === emoji).length;
    }
    return counts;
  },
});

export const getReactionCountsBatch = query({
  args: {
    changelogIds: v.array(v.id("changelogs")),
  },
  handler: async (ctx, args) => {
    const result: Record<string, Record<string, number>> = {};

    for (const changelogId of args.changelogIds) {
      const reactions = await ctx.db
        .query("reactions")
        .withIndex("by_changelog", (q) => q.eq("changelogId", changelogId))
        .collect();

      const counts: Record<string, number> = {};
      for (const emoji of ALLOWED_EMOJIS) {
        counts[emoji] = reactions.filter((r) => r.emoji === emoji).length;
      }
      result[changelogId] = counts;
    }

    return result;
  },
});

export const getUserReactions = query({
  args: {
    changelogId: v.id("changelogs"),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_changelog_fingerprint", (q) =>
        q.eq("changelogId", args.changelogId).eq("fingerprint", args.fingerprint)
      )
      .collect();

    return reactions.map((r) => r.emoji);
  },
});
