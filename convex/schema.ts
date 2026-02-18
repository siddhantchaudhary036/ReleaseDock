import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
  }).index("by_clerk_id", ["clerkId"]),

  workspaces: defineTable({
    name: v.string(),
    slug: v.string(),
    websiteUrl: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  projects: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    apiKey: v.string(),
    widgetSettings: v.object({
      primaryColor: v.string(),
      position: v.union(v.literal("bottom-right"), v.literal("bottom-left")),
      showBranding: v.boolean(),
    }),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_api_key", ["apiKey"]),

  changelogs: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    content: v.any(),
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("published")),
    publishDate: v.optional(v.number()),
    scheduledPublishTime: v.optional(v.number()),
    scheduledFunctionId: v.optional(v.id("_scheduled_functions")),
    labelIds: v.array(v.id("labels")),
    coverImageId: v.optional(v.id("_storage")),
    authorId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_project_status", ["projectId", "status"]),

  labels: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    color: v.string(),
  }).index("by_project", ["projectId"]),
});
