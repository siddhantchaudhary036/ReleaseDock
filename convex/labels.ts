import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLabel = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
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

    // Check for duplicate label name within the same project
    const existingLabel = await ctx.db
      .query("labels")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existingLabel) {
      throw new Error("A label with this name already exists in this project.");
    }

    // Create the label
    const labelId = await ctx.db.insert("labels", {
      projectId: args.projectId,
      name: args.name,
      color: args.color,
    });

    return labelId;
  },
});

export const getLabelsByProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labels")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const deleteLabel = mutation({
  args: {
    labelId: v.id("labels"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the label
    const label = await ctx.db.get(args.labelId);
    if (!label) {
      throw new Error("Label not found");
    }

    // Get the project
    const project = await ctx.db.get(label.projectId);
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

    // Cascade: Remove this label from all changelogs that reference it
    const changelogs = await ctx.db
      .query("changelogs")
      .withIndex("by_project", (q) => q.eq("projectId", label.projectId))
      .collect();

    for (const changelog of changelogs) {
      if (changelog.labelIds.includes(args.labelId)) {
        const updatedLabelIds = changelog.labelIds.filter(
          (id) => id !== args.labelId
        );
        await ctx.db.patch(changelog._id, {
          labelIds: updatedLabelIds,
        });
      }
    }

    // Delete the label
    await ctx.db.delete(args.labelId);

    return { success: true };
  },
});
