import { mutation } from "./_generated/server";

/**
 * Generate an upload URL for file storage
 * 
 * This mutation creates a temporary upload URL that clients can use
 * to upload files directly to Convex file storage.
 * 
 * @returns {Promise<string>} A temporary upload URL
 */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
