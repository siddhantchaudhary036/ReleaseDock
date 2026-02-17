import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// GET /api/changelogs - Public API for widget
http.route({
  path: "/api/changelogs",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // Extract API key from query parameter
    const url = new URL(request.url);
    const apiKey = url.searchParams.get("key");

    // Validate API key presence
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key required" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Find project by API key
    const project = await ctx.runQuery(api.projects.getProjectByApiKey, {
      apiKey,
    });

    if (!project) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Fetch published changelogs for the project
    const changelogs = await ctx.runQuery(
      api.changelogs.getPublishedChangelogsByProject,
      {
        projectId: project._id,
      }
    );

    // Fetch labels for the project
    const labels = await ctx.runQuery(api.labels.getLabelsByProject, {
      projectId: project._id,
    });

    // Create a label lookup map
    const labelMap = new Map(labels.map((label) => [label._id, label]));

    // Format response with title, content, publishDate, and labels
    const entries = changelogs.map((changelog) => ({
      title: changelog.title,
      content: changelog.content,
      publishDate: changelog.publishDate ?? 0,
      labels: changelog.labelIds
        .map((labelId) => labelMap.get(labelId))
        .filter((label) => label !== undefined)
        .map((label) => ({
          name: label!.name,
          color: label!.color,
        })),
    }));

    // Return response with CORS headers
    return new Response(
      JSON.stringify({
        entries,
        widgetSettings: project.widgetSettings,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }),
});

// GET /api/changelog-page/:slug - Public changelog page data
http.route({
  path: "/api/changelog-page/:slug",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // Extract slug from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const slug = pathParts[pathParts.length - 1];

    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Slug required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Find workspace by slug
    const workspace = await ctx.runQuery(api.workspaces.getWorkspaceBySlug, {
      slug,
    });

    if (!workspace) {
      return new Response(
        JSON.stringify({ error: "Workspace not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get all projects for the workspace
    const projects = await ctx.runQuery(api.projects.getProjectsByWorkspace, {
      workspaceId: workspace._id,
    });

    // Fetch all published changelogs from all projects in the workspace
    const allChangelogs = [];
    for (const project of projects) {
      const changelogs = await ctx.runQuery(
        api.changelogs.getPublishedChangelogsByProject,
        {
          projectId: project._id,
        }
      );
      allChangelogs.push(...changelogs);
    }

    // Sort all changelogs by publishDate descending
    allChangelogs.sort((a, b) => {
      const dateA = a.publishDate ?? 0;
      const dateB = b.publishDate ?? 0;
      return dateB - dateA;
    });

    // Fetch all labels for all projects
    const allLabels = [];
    for (const project of projects) {
      const labels = await ctx.runQuery(api.labels.getLabelsByProject, {
        projectId: project._id,
      });
      allLabels.push(...labels);
    }

    // Create a label lookup map
    const labelMap = new Map(allLabels.map((label) => [label._id, label]));

    // Format response with title, content, publishDate, and labels
    const entries = allChangelogs.map((changelog) => ({
      title: changelog.title,
      content: changelog.content,
      publishDate: changelog.publishDate ?? 0,
      labels: changelog.labelIds
        .map((labelId) => labelMap.get(labelId))
        .filter((label) => label !== undefined)
        .map((label) => ({
          name: label!.name,
          color: label!.color,
        })),
    }));

    // Return response
    return new Response(
      JSON.stringify({
        workspace: {
          name: workspace.name,
          slug: workspace.slug,
          websiteUrl: workspace.websiteUrl,
        },
        entries,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),
});

export default http;
