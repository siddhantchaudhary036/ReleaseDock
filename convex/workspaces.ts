import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateSlug } from "../lib/validation";

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    websiteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Validate slug format
    const validation = validateSlug(args.slug);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Check slug uniqueness
    const existingWorkspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existingWorkspace) {
      throw new Error("This URL is already taken. Please choose a different one.");
    }

    // Create workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      slug: args.slug,
      websiteUrl: args.websiteUrl,
      ownerId: user._id,
      createdAt: Date.now(),
    });

    return workspaceId;
  },
});

export const getWorkspaceBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getWorkspaceByOwner = query({
  args: {
    ownerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify the caller is requesting their own workspaces
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user._id !== args.ownerId) {
      return [];
    }

    return await ctx.db
      .query("workspaces")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});


export const getWorkspaceById = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      return null;
    }

    // Verify the caller owns this workspace
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || workspace.ownerId !== user._id) {
      return null;
    }

    return workspace;
  },
});

