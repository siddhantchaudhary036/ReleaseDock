import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const createChangelog = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    content: v.any(),
    labelIds: v.array(v.id("labels")),
    categoryIds: v.optional(v.array(v.id("categories"))),
    coverImageId: v.optional(v.id("_storage")),
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
      categoryIds: args.categoryIds || [],
      coverImageId: args.coverImageId,
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
    categoryIds: v.optional(v.array(v.id("categories"))),
    coverImageId: v.optional(v.id("_storage")),
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
      categoryIds: args.categoryIds || [],
      coverImageId: args.coverImageId,
      updatedAt: Date.now(),
    });

    return args.changelogId;
  },
});

export const publishChangelog = mutation({
  args: {
    changelogId: v.id("changelogs"),
    scheduledPublishTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) {
      throw new Error("Changelog not found");
    }

    const project = await ctx.db.get(changelog.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Cancel any existing scheduled publish
    if (changelog.scheduledFunctionId) {
      try {
        await ctx.scheduler.cancel(changelog.scheduledFunctionId);
      } catch {
        // Already executed or canceled — safe to ignore
      }
    }

    // Scheduled publish: future date/time
    if (args.scheduledPublishTime && args.scheduledPublishTime > Date.now()) {
      const scheduledFunctionId = await ctx.scheduler.runAt(
        args.scheduledPublishTime,
        internal.changelogs.executeScheduledPublish,
        { changelogId: args.changelogId }
      );

      await ctx.db.patch(args.changelogId, {
        status: "scheduled",
        scheduledPublishTime: args.scheduledPublishTime,
        scheduledFunctionId,
        updatedAt: Date.now(),
      });

      return args.changelogId;
    }

    // Immediate publish
    await ctx.db.patch(args.changelogId, {
      status: "published",
      publishDate: changelog.publishDate ?? Date.now(),
      scheduledPublishTime: undefined,
      scheduledFunctionId: undefined,
      updatedAt: Date.now(),
    });

    return args.changelogId;
  },
});

// Internal mutation executed by the scheduler — no auth needed
export const executeScheduledPublish = internalMutation({
  args: {
    changelogId: v.id("changelogs"),
  },
  handler: async (ctx, args) => {
    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) return;

    // Only publish if still in scheduled state (guards against cancel races)
    if (changelog.status !== "scheduled") return;

    await ctx.db.patch(args.changelogId, {
      status: "published",
      publishDate: changelog.scheduledPublishTime ?? Date.now(),
      scheduledPublishTime: undefined,
      scheduledFunctionId: undefined,
      updatedAt: Date.now(),
    });
  },
});

export const cancelScheduledPublish = mutation({
  args: {
    changelogId: v.id("changelogs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) {
      throw new Error("Changelog not found");
    }

    if (changelog.status !== "scheduled") {
      throw new Error("Changelog is not scheduled");
    }

    const project = await ctx.db.get(changelog.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Cancel the scheduled function
    if (changelog.scheduledFunctionId) {
      try {
        await ctx.scheduler.cancel(changelog.scheduledFunctionId);
      } catch {
        // Already executed or canceled
      }
    }

    // Revert to draft
    await ctx.db.patch(args.changelogId, {
      status: "draft",
      scheduledPublishTime: undefined,
      scheduledFunctionId: undefined,
      updatedAt: Date.now(),
    });

    return args.changelogId;
  },
});
export const unpublishChangelog = mutation({
  args: {
    changelogId: v.id("changelogs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) {
      throw new Error("Changelog not found");
    }

    if (changelog.status !== "published") {
      throw new Error("Changelog is not published");
    }

    const project = await ctx.db.get(changelog.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Revert to draft — keeps publishDate so re-publishing preserves the original date
    await ctx.db.patch(args.changelogId, {
      status: "draft",
      updatedAt: Date.now(),
    });

    return args.changelogId;
  },
});

export const getChangelogsByProject = query({
  args: {
    projectId: v.id("projects"),
    status: v.optional(v.union(v.literal("draft"), v.literal("scheduled"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return [];
    }

    // Get the workspace to verify ownership
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      return [];
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      return [];
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
      return null;
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    // Get the changelog
    const changelog = await ctx.db.get(args.changelogId);
    if (!changelog) {
      return null;
    }

    // Get the project
    const project = await ctx.db.get(changelog.projectId);
    if (!project) {
      return null;
    }

    // Get the workspace to verify ownership
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      return null;
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      return null;
    }

    return changelog;
  },
});
