import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCategory = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");
    if (workspace.ownerId !== user._id) throw new Error("Forbidden");

    const existing = await ctx.db
      .query("categories")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    if (existing) throw new Error("A category with this name already exists in this project.");

    return await ctx.db.insert("categories", {
      projectId: args.projectId,
      name: args.name,
      color: args.color,
    });
  },
});

export const getCategoriesByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const category = await ctx.db.get(args.categoryId);
    if (!category) throw new Error("Category not found");

    const project = await ctx.db.get(category.projectId);
    if (!project) throw new Error("Project not found");

    const workspace = await ctx.db.get(project.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");
    if (workspace.ownerId !== user._id) throw new Error("Forbidden");

    // Cascade: remove this category from all changelogs that reference it
    const changelogs = await ctx.db
      .query("changelogs")
      .withIndex("by_project", (q) => q.eq("projectId", category.projectId))
      .collect();

    for (const changelog of changelogs) {
      const catIds = changelog.categoryIds || [];
      if (catIds.includes(args.categoryId)) {
        await ctx.db.patch(changelog._id, {
          categoryIds: catIds.filter((id) => id !== args.categoryId),
        });
      }
    }

    await ctx.db.delete(args.categoryId);
    return { success: true };
  },
});
