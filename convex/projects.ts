import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateApiKey } from "../lib/validation";

export const createProject = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Verify workspace exists and user has access
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Generate unique API key
    const apiKey = generateApiKey();

    // Create project with default widget settings
    const projectId = await ctx.db.insert("projects", {
      workspaceId: args.workspaceId,
      name: args.name,
      apiKey,
      widgetSettings: {
        primaryColor: "#3b82f6", // Default blue
        position: "bottom-right",
        showBranding: true,
      },
      createdAt: Date.now(),
    });

    return projectId;
  },
});

export const getProjectsByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const getProjectById = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    // Verify user has access to this project
    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    return project;
  },
});

export const regenerateApiKey = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
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

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Generate new API key
    const newApiKey = generateApiKey();

    // Update project with new API key
    await ctx.db.patch(args.projectId, {
      apiKey: newApiKey,
    });

    return newApiKey;
  },
});

export const updateWidgetSettings = mutation({
  args: {
    projectId: v.id("projects"),
    widgetSettings: v.object({
      primaryColor: v.string(),
      position: v.union(v.literal("bottom-right"), v.literal("bottom-left")),
      showBranding: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
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

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify user owns the workspace
    if (workspace.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    // Update widget settings
    await ctx.db.patch(args.projectId, {
      widgetSettings: args.widgetSettings,
    });

    return args.projectId;
  },
});



export const getProjectByApiKey = query({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    // Public query - no auth required (used by HTTP actions)
    return await ctx.db
      .query("projects")
      .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
      .unique();
  },
});
