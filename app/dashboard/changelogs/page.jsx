"use client";

import { useState, useEffect } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatusFilter from "../../../components/StatusFilter";
import PreviewDropdown from "../../../components/PreviewDropdown";
import LivePreview from "../../../components/LivePreview";
import Link from "next/link";
import theme from "../../../constants/theme";

const REACTION_EMOJIS = ["👍", "🎉", "❤️"];

function CoverThumb({ storageId }) {
  const url = useQuery(api.storage.getStorageUrl, { storageId });
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      className="flex-shrink-0 rounded"
      style={{ width: 32, height: 32, objectFit: "cover" }}
    />
  );
}

export default function ChangelogsPage() {
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewChangelog, setPreviewChangelog] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) setCurrentProjectId(savedProjectId);
  }, []);

  const changelogs = useQuery(
    api.changelogs.getChangelogsByProject,
    isAuthenticated && currentProjectId
      ? { projectId: currentProjectId, status: statusFilter === "all" ? undefined : statusFilter }
      : "skip"
  );

  const currentProject = useQuery(
    api.projects.getProjectById,
    isAuthenticated && currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  const workspace = useQuery(
    api.workspaces.getWorkspaceById,
    currentProject?.workspaceId ? { workspaceId: currentProject.workspaceId } : "skip"
  );

  const hostedPageUrl = workspace?.slug
    ? typeof window !== "undefined"
      ? `${window.location.origin}/changelog/${workspace.slug}`
      : `/changelog/${workspace.slug}`
    : null;

  const labels = useQuery(
    api.labels.getLabelsByProject,
    isAuthenticated && currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  const categories = useQuery(
    api.categories.getCategoriesByProject,
    isAuthenticated && currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  const labelMap =
    labels?.reduce((acc, label) => {
      acc[label._id] = label;
      return acc;
    }, {}) || {};

  const categoryMap =
    categories?.reduce((acc, cat) => {
      acc[cat._id] = cat;
      return acc;
    }, {}) || {};

  const sortedChangelogs = changelogs
    ? [...changelogs].sort((a, b) => b.updatedAt - a.updatedAt)
    : [];

  // Fetch reaction counts for all changelogs
  const changelogIds = changelogs?.map((c) => c._id) || [];
  const reactionCounts = useQuery(
    api.reactions.getReactionCountsBatch,
    changelogIds.length > 0 ? { changelogIds } : "skip"
  );

  // Counts for filter badges
  const allChangelogs = useQuery(
    api.changelogs.getChangelogsByProject,
    isAuthenticated && currentProjectId ? { projectId: currentProjectId } : "skip"
  );
  const counts = {
    all: allChangelogs?.length || 0,
    draft: allChangelogs?.filter((c) => c.status === "draft").length || 0,
    scheduled: allChangelogs?.filter((c) => c.status === "scheduled").length || 0,
    published: allChangelogs?.filter((c) => c.status === "published").length || 0,
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
            Changelogs
          </h1>
          <p className="text-xs mt-0.5" style={{ color: theme.text.tertiary }}>
            Manage and publish your product updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/changelogs/new"
            className="new-changelog-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: theme.brand.primary,
              color: theme.text.inverse,
              textDecoration: "none",
              fontSize: 13,
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New changelog
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="flex items-center justify-between mb-4 pb-3"
        style={{ borderBottom: `1px solid ${theme.neutral.border}` }}
      >
        <StatusFilter currentStatus={statusFilter} onStatusChange={setStatusFilter} counts={counts} />
      </div>

      {/* Content */}
      {!currentProjectId ? (
        <EmptyState message="Select a project to view changelogs" />
      ) : changelogs === undefined ? (
        <LoadingState />
      ) : sortedChangelogs.length === 0 ? (
        <EmptyState
          message={`No ${statusFilter !== "all" ? statusFilter : ""} changelogs yet`}
          action={
            <Link
              href="/dashboard/changelogs/new"
              className="inline-flex items-center gap-1.5 mt-3 text-sm"
              style={{ color: theme.brand.primary, textDecoration: "none" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create your first changelog
            </Link>
          }
        />
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${theme.neutral.border}` }}>
          {/* Table header */}
          <div
            className="grid items-center px-4 py-2 text-xs font-medium"
            style={{
              gridTemplateColumns: "1fr 120px 120px 100px 100px 80px 90px",
              backgroundColor: theme.neutral.bg,
              color: theme.text.tertiary,
              borderBottom: `1px solid ${theme.neutral.border}`,
            }}
          >
            <span>Title</span>
            <span>Category</span>
            <span>Labels</span>
            <span>Date</span>
            <span>Reactions</span>
            <span className="text-right">Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows */}
          {sortedChangelogs.map((changelog, idx) => {


            // Attach resolved labels for preview
            const changelogWithLabels = {
              ...changelog,
              _labels: changelog.labelIds
                ?.map((id) => labelMap[id])
                .filter(Boolean) || [],
            };

            return (
              <div
                key={changelog._id}
                className="changelog-row grid items-center px-4 py-3"
                style={{
                  gridTemplateColumns: "1fr 120px 120px 100px 100px 80px 90px",
                  backgroundColor: theme.neutral.white,
                  borderBottom: idx < sortedChangelogs.length - 1 ? `1px solid ${theme.neutral.border}` : "none",
                }}
              >
                {/* Title */}
                <Link
                  href={`/dashboard/changelogs/${changelog._id}`}
                  className="min-w-0 pr-4 flex items-center gap-2.5"
                  style={{ textDecoration: "none" }}
                >
                  {changelog.coverImageId && (
                    <CoverThumb storageId={changelog.coverImageId} />
                  )}
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: theme.text.primary }}
                  >
                    {changelog.title || "Untitled"}
                  </p>
                </Link>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 min-w-0">
                  {(changelog.categoryIds || []).slice(0, 2).map((catId) => {
                    const cat = categoryMap[catId];
                    if (!cat) return null;
                    return (
                      <span
                        key={catId}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium truncate max-w-[55px]"
                        style={{ backgroundColor: `${cat.color}12`, color: cat.color, border: `1px solid ${cat.color}25` }}
                      >
                        {cat.name}
                      </span>
                    );
                  })}
                  {(changelog.categoryIds || []).length > 2 && (
                    <span className="text-[10px]" style={{ color: theme.text.tertiary }}>
                      +{changelog.categoryIds.length - 2}
                    </span>
                  )}
                </div>

                {/* Labels */}
                <div className="flex flex-wrap gap-1 min-w-0">
                  {changelog.labelIds?.slice(0, 2).map((labelId) => {
                    const label = labelMap[labelId];
                    if (!label) return null;
                    return (
                      <span
                        key={labelId}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium truncate max-w-[60px]"
                        style={{ backgroundColor: `${label.color}15`, color: label.color }}
                      >
                        {label.name}
                      </span>
                    );
                  })}
                  {changelog.labelIds?.length > 2 && (
                    <span className="text-[10px]" style={{ color: theme.text.tertiary }}>
                      +{changelog.labelIds.length - 2}
                    </span>
                  )}
                </div>

                {/* Date */}
                <span className="text-xs tabular-nums" style={{ color: theme.text.tertiary }}>
                  {changelog.status === "published" && changelog.publishDate
                    ? formatDate(changelog.publishDate)
                    : changelog.status === "scheduled" && changelog.scheduledPublishTime
                    ? formatDate(changelog.scheduledPublishTime)
                    : formatDate(changelog.updatedAt)}
                </span>

                {/* Reactions */}
                <div className="flex items-center gap-1.5">
                  {REACTION_EMOJIS.map((emoji) => {
                    const count = reactionCounts?.[changelog._id]?.[emoji] || 0;
                    if (count === 0) return null;
                    return (
                      <span
                        key={emoji}
                        className="inline-flex items-center gap-0.5 text-[11px]"
                        style={{ color: theme.text.tertiary }}
                      >
                        <span>{emoji}</span>
                        <span>{count}</span>
                      </span>
                    );
                  })}
                  {(!reactionCounts?.[changelog._id] ||
                    REACTION_EMOJIS.every((e) => !reactionCounts[changelog._id][e])) && (
                    <span className="text-[11px]" style={{ color: theme.text.tertiary }}>—</span>
                  )}
                </div>

                {/* Status */}
                <div className="flex justify-end">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{
                      backgroundColor:
                        changelog.status === "published"
                          ? theme.status.successLight
                          : changelog.status === "scheduled"
                          ? theme.status.infoLight
                          : theme.status.warningLight,
                      color:
                        changelog.status === "published"
                          ? theme.status.success
                          : changelog.status === "scheduled"
                          ? theme.status.info
                          : theme.status.warning,
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor:
                          changelog.status === "published"
                            ? theme.status.success
                            : changelog.status === "scheduled"
                            ? theme.status.info
                            : theme.status.warning,
                      }}
                    />
                    {changelog.status === "published" ? "Live" : changelog.status === "scheduled" ? "Scheduled" : "Draft"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">

                  <PreviewDropdown
                    hostedPageUrl={hostedPageUrl}
                    onSelect={(type) => {
                      setPreviewChangelog(changelogWithLabels);
                      setPreviewType(type);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewType && previewChangelog && (
        <LivePreview
          type={previewType}
          changelog={previewChangelog}
          widgetSettings={currentProject?.widgetSettings}
          onClose={() => { setPreviewChangelog(null); setPreviewType(null); }}
        />
      )}

      <style>{`
        .changelog-row:hover {
          background-color: ${theme.neutral.hover} !important;
        }
        .new-changelog-btn:hover {
          background-color: ${theme.brand.primaryHover} !important;
        }
        .row-action-btn:hover {
          background-color: ${theme.neutral.hover} !important;
          color: ${theme.text.secondary} !important;
        }
      `}</style>
    </div>
  );
}

function EmptyState({ message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg
        className="w-10 h-10 mb-3"
        style={{ color: theme.text.tertiary, opacity: 0.4 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      <p className="text-sm" style={{ color: theme.text.tertiary }}>
        {message}
      </p>
      {action}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg px-4 py-4 animate-pulse"
          style={{ backgroundColor: theme.neutral.hover }}
        >
          <div className="flex items-center gap-4">
            <div className="h-3 rounded w-1/3" style={{ backgroundColor: theme.neutral.border }} />
            <div className="h-3 rounded w-16 ml-auto" style={{ backgroundColor: theme.neutral.border }} />
          </div>
        </div>
      ))}
    </div>
  );
}
