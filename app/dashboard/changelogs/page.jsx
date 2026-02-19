"use client";

import { useState, useEffect } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatusFilter from "../../../components/StatusFilter";
import Link from "next/link";
import theme from "../../../constants/theme";

function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy changelog page link"}
      className="copy-link-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
      style={{
        backgroundColor: copied ? theme.status.successLight : theme.neutral.white,
        color: copied ? theme.status.success : theme.text.muted,
        border: `1px solid ${copied ? theme.status.success : theme.neutral.border}`,
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.798" />
        </svg>
      )}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

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

  const labelMap =
    labels?.reduce((acc, label) => {
      acc[label._id] = label;
      return acc;
    }, {}) || {};

  const sortedChangelogs = changelogs
    ? [...changelogs].sort((a, b) => b.updatedAt - a.updatedAt)
    : [];

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
          {hostedPageUrl && (
            <>
              <CopyLinkButton url={hostedPageUrl} />
              <a
                href={hostedPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: theme.neutral.white,
                  color: theme.text.muted,
                  border: `1px solid ${theme.neutral.border}`,
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Preview
              </a>
            </>
          )}
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
              gridTemplateColumns: "1fr 140px 100px 80px",
              backgroundColor: theme.neutral.bg,
              color: theme.text.tertiary,
              borderBottom: `1px solid ${theme.neutral.border}`,
            }}
          >
            <span>Title</span>
            <span>Labels</span>
            <span>Date</span>
            <span className="text-right">Status</span>
          </div>

          {/* Rows */}
          {sortedChangelogs.map((changelog, idx) => (
            <Link
              key={changelog._id}
              href={`/dashboard/changelogs/${changelog._id}`}
              className="changelog-row grid items-center px-4 py-3 transition-colors"
              style={{
                gridTemplateColumns: "1fr 140px 100px 80px",
                backgroundColor: theme.neutral.white,
                borderBottom: idx < sortedChangelogs.length - 1 ? `1px solid ${theme.neutral.border}` : "none",
                textDecoration: "none",
              }}
            >
              {/* Title */}
              <div className="min-w-0 pr-4 flex items-center gap-2.5">
                {changelog.coverImageId && (
                  <CoverThumb storageId={changelog.coverImageId} />
                )}
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: theme.text.primary }}
                >
                  {changelog.title || "Untitled"}
                </p>
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
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .changelog-row:hover {
          background-color: ${theme.neutral.hover} !important;
        }
        .new-changelog-btn:hover {
          background-color: ${theme.brand.primaryHover} !important;
        }
        .copy-link-btn:hover {
          background-color: ${theme.neutral.hover} !important;
        }
        .preview-btn:hover {
          background-color: ${theme.neutral.hover} !important;
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
