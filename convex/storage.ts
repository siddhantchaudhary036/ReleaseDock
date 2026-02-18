import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Centralized storage utilities for file uploads.
 * All file storage operations go through here so they're
 * easy to swap out or extend later (e.g. S3, R2, etc.)
 */

/**
 * Generate a temporary upload URL for direct client uploads.
 * The client POSTs the file to this URL and receives a storageId.
 */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Get a serving URL for a storage ID.
 * Returns null if the storageId is invalid or the file doesn't exist.
 */
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * Delete a file from storage by its ID.
 * Silently succeeds if the file doesn't exist.
 */
export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});

/**
 * Resolve a storage ID to a public URL inside a Convex handler.
 * Use this in mutations/queries/actions — not from the client.
 */
export async function resolveStorageUrl(
  ctx: { storage: { getUrl: (id: string) => Promise<string | null> } },
  storageId: string
): Promise<string | null> {
  return await ctx.storage.getUrl(storageId);
}
