import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChangelog = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    content: v.any(),
    labelIds: v.array(v.id("labels")),
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

    // Verify project exists
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Get the workspace to verify ownership
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Create changelog with initial status as draft
    const now = Date.now();
    const changelogId = await ctx.db.insert("changelogs", {
      projectId: args.projectId,
      title: args.title,
      content: args.content,
      status: "draft",
      labelIds: args.labelIds,
      authorId: user._id,
      createdAt: now,
      updatedAt: now,
    });

    return changelogId;
  },
});

export const updateChangelog = mutation({
  args: {
    changelogId: v.id("changelogs"),
    title: v.string(),
    content: v.any(),
    labelIds: v.array(v.id("labels")),
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

    // Get the changelog
    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) {
      throw new Error("Changelog not found");
    }

    // Get the project
    const project = await ctx.db.get(changelog.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Get the workspace to verify ownership
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Update changelog (preserves status and publishDate)
    await ctx.db.patch(args.changelogId, {
      title: args.title,
      content: args.content,
      labelIds: args.labelIds,
      updatedAt: Date.now(),
    });

    return args.changelogId;
  },
});

export const publishChangelog = mutation({
  args: {
    changelogId: v.id("changelogs"),
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

    // Get the changelog
    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) {
      throw new Error("Changelog not found");
    }

    // Get the project
    const project = await ctx.db.get(changelog.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Get the workspace to verify ownership
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Publish changelog - set status and publishDate
    const updates: {
      status: "published";
      publishDate: number;
      updatedAt: number;
    } = {
      status: "published",
      publishDate: changelog.publishDate ?? Date.now(),
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.changelogId, updates);

    return args.changelogId;
  },
});

export const getChangelogsByProject = query({
  args: {
    projectId: v.id("projects"),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
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

    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Get the workspace to verify ownership
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Query changelogs with optional status filter
    if (args.status) {
      return await ctx.db
        .query("changelogs")
        .withIndex("by_project_status", (q) =>
          q.eq("projectId", args.projectId).eq("status", args.status)
        )
        .collect();
    } else {
      return await ctx.db
        .query("changelogs")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect();
    }
  },
});

export const getPublishedChangelogsByProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // This query is public (no auth required) for widget/public page use
    const changelogs = await ctx.db
      .query("changelogs")
      .withIndex("by_project_status", (q) =>
        q.eq("projectId", args.projectId).eq("status", "published")
      )
      .collect();

    // Sort by publishDate descending
    return changelogs.sort((a, b) => {
      const dateA = a.publishDate ?? 0;
      const dateB = b.publishDate ?? 0;
      return dateB - dateA;
    });
  },
});

export const getChangelogById = query({
  args: {
    changelogId: v.id("changelogs"),
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

    // Get the changelog
    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) {
      throw new Error("Changelog not found");
    }

    // Get the project
    const project = await ctx.db.get(changelog.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Get the workspace to verify ownership
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    return changelog;
  },
});
